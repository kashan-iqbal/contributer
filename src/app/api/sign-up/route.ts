import dbConnect from "@/lib/connetDb";
import { nodeMailerFunction } from "@/lib/nodemailer";
import { SendVerficationEmail } from "@/lib/resend";
import { UserModel } from "@/model/user";
import { hash, compare } from "bcrypt-ts";

export async function POST(request: Request) {

  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "all thing is req",
        },
        { status: 400 }
      );
    }
    await dbConnect();
    console.log(`you hit Sign-in Route`)

    const existingUserVerifiedByUserName = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUserName) {
      return Response.json(
        {
          success: false,
          message: "username Already Taken",
        },
        {
          status: 400,
        }
      );
    }

    const userExistingByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (userExistingByEmail) {
      if (userExistingByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user Already exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashPassword = await hash(password, 10);
        userExistingByEmail.password = hashPassword;
        userExistingByEmail.verifyCode = verifyCode;
        userExistingByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await userExistingByEmail.save();
      }
    } else {
      const hashPassword = await hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const savedUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptMessage: true,
        message: [],
      });
      await savedUser.save();
    }
    const emailResponce = await nodeMailerFunction(
      email,
      username,
      verifyCode
    );
    console.log(emailResponce)

    if (!emailResponce.success) {
      return Response.json(
        {
          success: false,
          message: emailResponce.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: `user register success fully. please verify your email `,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error, `registering User Error`);
    return Response.json(
      {
        success: false,
        message: `Error in Registering User`,
      },
      {
        status: 500,
      }
    );
  }
}
