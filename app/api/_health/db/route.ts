export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  try {
    const tables = await db.$queryRawUnsafe<any[]>(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema='public'
      ORDER BY 1
    `);
    return NextResponse.json({ ok: true, tables: tables.map(t => t.table_name) });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}
