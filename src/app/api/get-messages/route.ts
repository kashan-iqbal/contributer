import dbConnect from "@/lib/connetDb";
import { UserModel } from "@/model/user";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

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

  const Id = new mongoose.Types.ObjectId(userId);

  try {
    const result = await UserModel.aggregate([
      { $match: { _id: Id } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!result || result?.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User Not found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: result[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "error in sending api");
    return Response.json(
      {
        success: false,
        message: "some thing went wrong in getting messages",
      },
      { status: 500 }
    );
  }
}
