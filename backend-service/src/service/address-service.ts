import { Address, User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, ListAddressRequest, RemoveAddressRequest, toAddressRespone, UpdateAddressRequest } from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { prisma } from "../application/database";
import { ContactService } from "./contact-service";
import { HTTPException } from "hono/http-exception";

export class AddressService {
  static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
    request = AddressValidation.CREATE.parse(request) as CreateAddressRequest;
    await ContactService.contactMustExits(user, request.contact_id);

    const address = await prisma.address.create({
      data: request
    })
 
    return toAddressRespone(address)
  }

  static async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    request = AddressValidation.GET.parse(request) as GetAddressRequest;
    await ContactService.contactMustExits(user, request.contact_id);
    const address = await this.addressMustExits(request.contact_id, request.id);

    return toAddressRespone(address);
  }

  static async addressMustExits(contactId: number, addressId: number): Promise<Address> {
    const result = await prisma.address.findFirst({
      where: {
        contact_id: contactId,
        id: addressId,
      }
    })

    if (!result) {
      throw new HTTPException(404, {
        message: 'Address is not found'
      }) 
    }

    return result;
  }

  static async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
    request = AddressValidation.UPDATE.parse(request) as UpdateAddressRequest;
    await ContactService.contactMustExits(user, request.contact_id);
    await this.addressMustExits(request.contact_id, request.id);

    const address = await prisma.address.update({
      where: {
        id: request.id,
        contact_id: request.contact_id
      },
      data: request
    })

    return toAddressRespone(address)
  }

  static async remove(user: User, request: RemoveAddressRequest): Promise<boolean> {
    request = AddressValidation.REMOVE.parse(request) as RemoveAddressRequest;
    await ContactService.contactMustExits(user, request.contact_id);
    await this.addressMustExits(request.contact_id, request.id);

    const address = await prisma.address.delete({
      where: {
        id: request.id,
        contact_id: request.contact_id
      }
    })

    return true;
  }

  static async list(user: User, request: ListAddressRequest): Promise<Array<AddressResponse>> {
    request = AddressValidation.LIST.parse(request) as ListAddressRequest;
    await ContactService.contactMustExits(user, request.contact_id);

    const addresses = await prisma.address.findMany({
      where: {
        contact_id: request.contact_id
      }
    })

    return addresses.map(address => toAddressRespone(address))
  }
}