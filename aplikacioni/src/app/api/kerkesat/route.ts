
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSql } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Duhet te jeni te kycur." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON i pavlefshem." },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("udhetimId" in body) ||
    typeof body.udhetimId !== "string" ||
    !body.udhetimId.trim()
  ) {
    return NextResponse.json(
      { error: "ID e udhetimit eshte e pavlefshme." },
      { status: 400 }
    );
  }

  const udhetimId = body.udhetimId;
  const userId = session.user.id;

  try {
    const sql = getSql();

    const rows = await sql`
      INSERT INTO kerkesat (udhetim_id, udhetar_id)
      SELECT id, ${userId}
      FROM udhetimet
      WHERE id = ${udhetimId}
        AND vende > 0
        AND shofer_id IS DISTINCT FROM ${userId}
      ON CONFLICT (udhetar_id, udhetim_id) DO NOTHING
      RETURNING id, statusi
    `;

    if (rows.length > 0) {
      return NextResponse.json(
        { success: true, kerkesa: rows[0] },
        { status: 201 }
      );
    }

    const existing = await sql`
      SELECT id, statusi
      FROM kerkesat
      WHERE udhetim_id = ${udhetimId}
        AND udhetar_id = ${userId}
    `;

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        kerkesa: existing[0],
      });
    }

    return NextResponse.json(
      { error: "Udhetimi nuk ekziston, nuk ka vende ose jeni shoferi." },
      { status: 409 }
    );
  } catch {
    return NextResponse.json(
      { error: "Kerkesa nuk u ruajt." },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Duhet te jeni te kycur." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const udhetimId = searchParams.get("udhetimId");

  if (!udhetimId) {
    return NextResponse.json(
      { error: "Mungon ID e udhetimit." },
      { status: 400 }
    );
  }

  const userId = session.user.id;

  try {
    const sql = getSql();

    const udhetimet = await sql`
      SELECT id, shofer_id, vende
      FROM udhetimet
      WHERE id = ${udhetimId}
    `;

    if (udhetimet.length === 0) {
      return NextResponse.json(
        { error: "Udhetimi nuk ekziston." },
        { status: 404 }
      );
    }

    const udhetimi = udhetimet[0];
    const eshteShoferi = udhetimi.shofer_id === userId;

    const kerkesat = eshteShoferi
      ? await sql`
          SELECT id, udhetim_id, udhetar_id, statusi
          FROM kerkesat
          WHERE udhetim_id = ${udhetimId}
          ORDER BY id
        `
      : await sql`
          SELECT id, udhetim_id, statusi
          FROM kerkesat
          WHERE udhetim_id = ${udhetimId}
            AND udhetar_id = ${userId}
          ORDER BY id
        `;

    return NextResponse.json(
      {
        udhetimId: udhetimi.id,
        vende: udhetimi.vende,
        eshteShoferi,
        kerkesat,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Nuk u lexuan kerkesat." },
      { status: 500 }
    );
  }
}


export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Duhet te jeni te kycur." },
      { status: 401 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON i pavlefshem." },
      { status: 400 }
    );
  }

  const kerkesaId = body?.kerkesaId;

  if (
    typeof kerkesaId !== "string" ||
    !/^[1-9]\d{0,18}$/.test(kerkesaId) ||
    BigInt(kerkesaId) > BigInt("9223372036854775807")
  ) {
    return NextResponse.json(
      { error: "ID e kerkeses eshte e pavlefshme." },
      { status: 400 }
    );
  }

  try {
    const sql = getSql();

    const rows = await sql`
      SELECT prano_kerkesen(
        ${kerkesaId}::bigint,
        ${session.user.id}::text
      ) AS rezultati
    `;

    const rezultati = rows[0]?.rezultati;

    if (rezultati === "nuk_lejohet") {
      return NextResponse.json(
        { error: "Nuk keni leje ta pranoni kete kerkese." },
        { status: 403 }
      );
    }

    if (rezultati === "nuk_ka_vende") {
      return NextResponse.json(
        { error: "Nuk ka vende te lira." },
        { status: 409 }
      );
    }

    if (rezultati === "status_i_pavlefshem") {
      return NextResponse.json(
        { error: "Statusi i kerkeses nuk lejon pranimin." },
        { status: 409 }
      );
    }

    if (
      rezultati !== "pranuar" &&
      rezultati !== "tashme_pranuar"
    ) {
      throw new Error("Rezultat i papritur.");
    }

    return NextResponse.json({
      success: true,
      statusi: "pranuar",
    });
  } catch {
    return NextResponse.json(
      { error: "Kerkesa nuk u pranua." },
      { status: 500 }
    );
  }
}
