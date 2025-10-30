import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_PORT = process.env.SMTP_PORT!;
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD!;
const SMTP_FROM = process.env.SMTP_FROM!;
if (!SMTP_HOST || !SMTP_PORT || !SMTP_SECURE || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM)
	throw new Error("Please define the Nodemailer environment variables");

interface EmailOptions {
	to: string;
	subject: string;
	html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
	const transporter = nodemailer.createTransport({
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
}
