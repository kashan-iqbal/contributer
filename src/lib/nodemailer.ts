import { ApiResponce } from "@/Types/apiResponceType";
import VerificationsEmailProps from "../../emails/verificationEmail";

const nodemailer = require("nodemailer")





export async function nodeMailerFunction(email: string, username: string, verifycode: string): Promise<ApiResponce> {
    console.log(username, email, verifycode)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "kashan.tech.io@gmail.com",
            pass: "fbkf wmqt uefq kfph",
        },
    });


    try {
        const info = await transporter.sendMail({
            from: 'form my self', // sender address
            to: email, // list of receivers
            subject: "Verify Your Accout", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>${verifycode}  <br>    ${username}</br>`
        })

        console.log(info, `info`)
        return { success: true, message: "Messges send SuccessFully" };

    } catch (error) {
        console.log(error, `error`)
        return { success: false, message: "email error" };
    }


}






