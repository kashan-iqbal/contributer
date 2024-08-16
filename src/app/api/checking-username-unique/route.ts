import dbConnect from "@/lib/connetDb";
import { z } from "zod";
import { UserModel } from "@/model/user";
import { userNameValidation } from "@/Schemas/signUpSchema";

const userQuerryNameSchema = z.object({
    username: userNameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");
        const result = userQuerryNameSchema.safeParse({ username });

        if (!result.success) {
            const userNameError = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        userNameError?.length > 0
                            ? userNameError.join(", ")
                            : "invalid querry parameter",
                },
                { status: 400 }
            );
        }

        const name = result.data?.username;

        const findUser = await UserModel.findOne({ username: name, isVerified: true });

        if (findUser) {
            return Response.json(
                {
                    success: false,
                    message: "user Name already taken",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "UseName is unique",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(`error checking user name validaion`, error);
        return Response.json(
            {
                success: false,
                message: "error checking user name",
            },
            {
                status: 500,
            }
        );
    }
}
