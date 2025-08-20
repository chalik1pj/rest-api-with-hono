import { Contact, User } from "@prisma/client";
import { ContactResponse, CreateContactRequest, SearchContactRequest, toContactResponse, UpdateContactRequest } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { prisma } from "../application/database";
import { HTTPException } from "hono/http-exception";
import { Pageable } from "../model/page-model";

export class ContactService {
  static async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {
    request = ContactValidation.CREATE.parse(request) as CreateContactRequest;

    const data = {
      ...request,
      ...{username: user.username}
    }

    const contact = await prisma.contact.create({
      data : data
    })

    return toContactResponse(contact);
  }

  static async get(user: User, contactId: number): Promise<ContactResponse> {
    contactId = ContactValidation.GET.parse(contactId) as number;
    const contact = await this.contactMustExits(user, contactId)

    return toContactResponse(contact);
  }

  static async contactMustExits(user: User, contactId: number): Promise<Contact> {
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        username: user.username
      }
    })

    if (!contact) {
      throw new HTTPException(404, {
        message: 'Contact is not found'
      })
    }

    return contact;
  }

  static async update(user: User, request: UpdateContactRequest): Promise<ContactResponse> {
    request = ContactValidation.UPDATE.parse(request) as UpdateContactRequest;
    await this.contactMustExits(user, request.id);

    const contact = await prisma.contact.update({
      where: {
        username: user.username,
        id: request.id
      }, 
      data: request
    });

    return toContactResponse(contact);
  }

  static async delete(user: User, contactId: number): Promise<boolean> {
    contactId = ContactValidation.DELETE.parse(contactId) as number;
    await this.contactMustExits(user, contactId);

    const contact = await prisma.contact.delete({
      where: {
        username: user.username,
        id: contactId
      }
    })

    return true;
  }

  static async search(user: User, request: SearchContactRequest): Promise<Pageable<ContactResponse>> {
    request = ContactValidation.SEARCH.parse(request) as SearchContactRequest;

    const filters = [];
    if(request.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: request.name
            },            
          },
          {
            last_name: {
              contains: request.name
            }
          }
        ]
      })
    }

    if (request.email) {
      filters.push({
        email: {
          contains: request.email
        }
      })
    }

    if (request.phone) {
      filters.push({
        phone: {
          contains: request.phone
        }
      })
    }

    const skip = (request.page - 1) * request.size;

    const contacts =  await prisma.contact.findMany({
      where: {
        username: user.username,
        AND: filters
      },
      take: request.size,
      skip: skip
    })

    const total = await prisma.contact.count({
      where: {
        username: user.username,
        AND: filters
      }
    })

    return {
      data: contacts.map(contact => toContactResponse(contact)),
      paging: {
        current_page: request.page,
        size: request.size,
        total_page: Math.ceil(total / request.size)
      }
    }
  }
}