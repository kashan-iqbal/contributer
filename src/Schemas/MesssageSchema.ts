import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().min(10,{message:`content must grater than 10 character`})
 .max(300,{message:`content must less than three Hundered character`})
});
