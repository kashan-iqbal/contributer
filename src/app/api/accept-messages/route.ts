import dbConnect from "@/lib/connetDb";
import { UserModel } from "@/model/user";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOption);
        const user = session?.user as User;

        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Not Autherized",
                },
                { status: 401 }
            );
        }
        const userId = user._id;

        const acceptMessage = await request.json();
        const updatedUse = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptMessage: acceptMessage,
            },
            { new: true }
        );
        if (!updatedUse) {
            return Response.json(
                {
                    success: false,
                    message: "error in accepting messages",
                },
                { status: 401 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "messages Acceptence update successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "error in accepting messages",
            },
            { status: 500 }
        );
    }
}


export async function GET(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOption);
        const user = session?.user as User;

        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Not Autherized",
                },
                { status: 401 }
            );
        }
        const userId = user._id;

        const result = await UserModel.findById(userId)
        if (!result) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Found",
                },
                { status: 401 }
            );
        }
        return Response.json(
            {
                success: true,
                message: result.isAcceptMessage,
            },
            { status: 200 }
        );



    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "error in getting message status",
            },
            { status: 500 }
        );
    }


}
















