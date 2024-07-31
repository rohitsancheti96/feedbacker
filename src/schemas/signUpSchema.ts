import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters long")
  .max(20, "Username must be atmost 20 characters long")
  .regex(/^[a-zA-Z0-9]+$/, "Username must not contain any special characters");
export const emailValidation = z
  .string()
  .email({ message: "Please provide a valid email" });
export const passwordValidation = z
  .string()
  .min(6, "Password must be atleast 6 characters long")
  .max(32, "Password must be atmost 32 characters long");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});
