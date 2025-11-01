import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return NextResponse.json({
		id,
		name: "Alexis Cuevas",
		email: "alexis.cuevase@outlook.com",
	});
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		return NextResponse.json(
			{
				message: "User created successfully",
				user: {
					id: Math.floor(1000 + Math.random() * 9000),
					...body,
				},
			},
			{ status: 201 }
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();

		return NextResponse.json({
			message: `User ${id} updated successfully`,
			updated: body,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		return NextResponse.json({
			message: `User ${id} deleted successfully`,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
