import { z } from "zod";
import { profileSchema } from "./profile";

/**
 * SignUp
 */
export const signUpSchema = z
	.object({
		email: profileSchema.shape.email,
		full_name: profileSchema.shape.full_name,
		company_name: profileSchema.shape.company_name,
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirm_password: z.string(),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords don't match",
		path: ["confirm_password"],
	});

export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * SignIn
 */
export const signInSchema = z.object({
	email: signUpSchema.shape.email,
	password: signUpSchema.shape.password,
});

export type SignInInput = z.infer<typeof signInSchema>;

/**
 * RecoveryPassword
 */
export const recoveryPasswordSchema = z.object({
	email: signUpSchema.shape.email,
});

export type RecoveryPasswordInput = z.infer<typeof recoveryPasswordSchema>;

/**
 * UpdatePassword
 */
export const updatePasswordSchema = z
	.object({
		password: signUpSchema.shape.password,
		confirm_password: signUpSchema.shape.confirm_password,
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords don't match",
		path: ["confirm_password"],
	});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
