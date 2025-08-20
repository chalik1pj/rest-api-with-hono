import { z, ZodType } from "zod";

export class userValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3),
    password: z.string().min(3),
    name: z.string().min(3),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(3),
    password: z.string().min(3),
  });

  static readonly UPDATE: ZodType = z.object({
    password: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
  });

  static readonly TOKEN: ZodType = z.string().min(1);
}
