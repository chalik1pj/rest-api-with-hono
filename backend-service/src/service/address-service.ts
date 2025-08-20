import { User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, toAddressRespone } from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { prisma } from "../application/database";
import { ContactService } from "./contact-service";
import { add } from "winston";

export class AddressService {
  static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
    request = AddressValidation.CREATE.parse(request) as CreateAddressRequest;
    await ContactService.contactMustExits(user, request.contact_id);

    const address = await prisma.address.create({
      data: request
    })
 
    return toAddressRespone(address)
  }
}