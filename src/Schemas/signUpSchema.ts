import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, `minimum two character`)
  .max(8, `maximum eight character`);


  export const singUpSchema = z.object({
    username:userNameValidation,
    email:z.string().email({message:`in valid email`}),
    password:z.string().min(8,`minimum eight character`).max(12,`maximum 12 character`)
    
  })
