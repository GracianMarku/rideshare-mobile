
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSql } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getSql();

    const rows = await sql`
      SELECT udhetim_id
      FROM preferimet
      WHERE user_id = ${session.user.id}
    `;

    return NextResponse.json({
      udhetimet: rows.map((row) => row.udhetim_id),
    });
  } catch {
    return NextResponse.json(
      { error: "Gabim ne server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON i pavlefshem" }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("udhetimId" in body) ||
    typeof body.udhetimId !== "string" ||
    !body.udhetimId.trim()
  ) {
    return NextResponse.json({ error: "ID e pavlefshme" }, { status: 400 });
  }

  const udhetimId = body.udhetimId;

  try {
    const sql = getSql();

    // Testim i kontrolluar: refuzim para shkrimit.
    if (process.env.TEST_PREFERIM_ERROR === "true") {
      return NextResponse.json(
        { error: "Gabim testues" },
        { status: 500 }
      );
    }

    const rows = await sql`
      INSERT INTO preferimet (user_id, udhetim_id)
      SELECT ${session.user.id}, id
      FROM udhetimet
      WHERE id = ${udhetimId}
      ON CONFLICT (user_id, udhetim_id) DO NOTHING
      RETURNING udhetim_id
    `;

    if (rows.length === 0) {
      const existing = await sql`
        SELECT udhetim_id
        FROM preferimet
        WHERE user_id = ${session.user.id}
          AND udhetim_id = ${udhetimId}
      `;

      if (existing.length === 0) {
        return NextResponse.json(
          { error: "Udhetimi nuk ekziston" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Ruajtja deshtoi" },
      { status: 500 }
    );
  }
}
