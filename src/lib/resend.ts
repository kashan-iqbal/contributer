import { Resend } from "resend";
import { ApiResponce } from "@/Types/apiResponceType";
import VerificationsEmailProps from "../../emails/verificationEmail";

export const resendEmail = new Resend(process.env.RESEND_API_KEY);

export async function SendVerficationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponce> {
  try {
    const { data, error } = await resendEmail.emails.send({
      from: "email@email.kashan.dev",
      to: email,
      subject: "verfication code",
      react: VerificationsEmailProps({ username, opt: verifyCode }),
    });
    // console.log("data", data, "error", error)
    if (data) {
      return { success: true, message: "Messges send SuccessFully" };
    } else {
      return { success: false, message: "Error in sending Email" };
    }
  } catch (error) {
    console.log(`some thing went wrong in SendVerficationEmail`, error);

    return { success: false, message: "failed to send SendVerficationEmail" };
  }
} 
