"use server";

import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("Please define all JWT environment variables");

const secret = new TextEncoder().encode(JWT_SECRET);

export async function generateWidgetToken({ connectionId, websiteUrl }: { connectionId: string; websiteUrl: string }) {
	const token = await new SignJWT({
		connection_id: connectionId,
		websiteUrl,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("2y") // 2 years
		.sign(secret);

	return token;
}

export async function verifyWidgetToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, secret);
		return payload as { connection_id: string; websiteUrl: string };
	} catch {
		throw new Error("Invalid widget token");
	}
}
