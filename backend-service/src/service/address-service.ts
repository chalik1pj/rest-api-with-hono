import { User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, toAddressRespone } from "../model/address-model";
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

    const address = await prisma.address.findFirst({
      where: {
        contact_id: request.contact_id,
        id: request.id,
      }
    })

    if (!address) {
      throw new HTTPException(404, {
        message: 'Address is not found'
      }) 
    }

    return toAddressRespone(address);
  }
}