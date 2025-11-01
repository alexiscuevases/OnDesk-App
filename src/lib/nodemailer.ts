import nodemailerLib from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_PORT = process.env.SMTP_PORT!;
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD!;
const SMTP_FROM = process.env.SMTP_FROM!;
if (!SMTP_HOST || !SMTP_PORT || !SMTP_SECURE || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM)
	throw new Error("Please define all Nodemailer environment variables");

interface SendEmail {
	to: string;
	subject: string;
	html: string;
}

export class Nodemailer {
	async sendEmail({ to, subject, html }: SendEmail) {
		try {
			const transporter = nodemailerLib.createTransport({
				host: SMTP_HOST,
				port: Number.parseInt(SMTP_PORT),
				secure: false,
				auth: {
					user: SMTP_USER,
					pass: SMTP_PASSWORD,
				},
			});

			await transporter.sendMail({
				from: SMTP_FROM,
				to,
				subject,
				html,
			});

			return { success: true };
		} catch (err: unknown) {
			if (err instanceof Error) return { success: false, error: err.message };
			return { success: false, error: "Unexpected error occurred sending Email" };
		}
	}
}

export const nodemailer = new Node();
