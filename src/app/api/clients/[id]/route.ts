import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	return NextResponse.json({
		id: params.id,
		name: "Alexis Cuevas",
		email: "alexis.cuevase@outlook.com",
	});
}
