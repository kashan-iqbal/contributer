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
    await resendEmail.emails.send({
      from: "you@example.com",
      to: email,
      subject: "verfication code",
      react: VerificationsEmailProps({ username, opt: verifyCode }),
    });

    return { seucces: true, message: "Messges send SuccessFully" };
  } catch (error) {
    console.log(`some thing went wrong in SendVerficationEmail`, error);

    return { seucces: false, message: "failed to send SendVerficationEmail" };
  }
}
