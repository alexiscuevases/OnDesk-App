import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	return NextResponse.json({
		id: (await params).id,
		name: "Alexis Cuevas",
		email: "alexis.cuevase@outlook.com",
	});
}
