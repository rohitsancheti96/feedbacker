import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };

    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log({ result }); //TODO: remove
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0 ? usernameErrors[0] : "Invalid username",
        },
        { status: 400 }
      );
    } else {
      const { username } = result.data;
      const existingVerifiedUser = await UserModel.findOne({
        username,
        isVerified: true,
      });
      if (existingVerifiedUser) {
        return Response.json(
          { success: false, message: "Username already exists" },
          { status: 400 }
        );
      }
      return Response.json({ success: true, message: "Username available" });
    }
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
