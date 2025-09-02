import  { z, ZodType } from "zod";

export class AddressValidation {
  static readonly CREATE: ZodType = z.object({
    contact_id: z.number().positive(),
    street: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    province: z.string().min(1).optional(),
    country: z.string().min(1),
    postal_code: z.string().min(1).max(10),
  })

  static readonly GET: ZodType = z.object({
    contact_id: z.number().positive(),
    id: z.number().positive()
  })

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    contact_id: z.number().positive(),
    street: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    province: z.string().min(1).optional(),
    country: z.string().min(1),
    postal_code: z.string().min(1).max(10),
  })

  static readonly REMOVE: ZodType = z.object({
    contact_id: z.number().positive(),
    id: z.number().positive()
  })

  static readonly LIST: ZodType = z.object({
    contact_id: z.number().positive(),
  })
}