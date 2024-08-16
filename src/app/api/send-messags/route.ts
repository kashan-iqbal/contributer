import dbConnect from "@/lib/connetDb";
import { Messages, UserModel } from "@/model/user";





export async function GET(request: Request) {
    await dbConnect()

    try {
        const { username, content } = await request.json()

        const user = await UserModel.findOne(username)

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not found",
                },
                { status: 401 }
            );
        }

        if (!user.isAcceptMessage) {
            return Response.json(
                {
                    success: false,
                    message: "user not accepting the messages",
                },
                { status: 401 }
            );
        }

        const newMessages = { content, created: new Date() }
        user.message.push(newMessages as Messages)

        await user.save()

        return Response.json(
            {
                success: true,
                message: "message sent successFully",
            },
            { status: 200 }
        );
    } catch (error) {

        return Response.json(
            {
                success: false,
                message: "something went wrong in sending messages",
            },
            { status: 401 }
        );

    }
}
