import dbConnect from "@/lib/connetDb";
import { z } from "zod";
import { UserModel } from "@/model/user";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json()
        const decodeUsername = decodeURIComponent(username);
        const result = await UserModel.findOne({ username: decodeUsername });

        if (!result) {
            return Response.json(
                {
                    success: false,
                    message: "user is not exist with this name",
                },
                {
                    status: 400,
                }
            );
        }

        const verifyCode = result?.verifyCode == code;
        const dateValidations = new Date(result?.verifyCodeExpiry) > new Date();
        if (verifyCode && dateValidations) {
            result.isVerified = true;
            await result.save();
            return Response.json(
                {
                    success: true,
                    message: "user Vrified",
                },
                {
                    status: 201,
                }
            );
        } else if (!dateValidations) {
            return Response.json(
                {
                    success: false,
                    message: "user code is expirec",
                },
                {
                    status: 400,
                }
            );
        } else (!verifyCode)
        {
            return Response.json(
                {
                    success: false,
                    message: "incorrect code",
                },
                {
                    status: 201,
                }
            );
        }
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "error in verify code",
            },
            {
                status: 500,
            }
        );
    }
}
