import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function GET() {
    const [rows] = await database.query(
        "SELECT funcionario_id, nome, telefone, email, cargo, criado_em FROM funcionarios"
    );

    return NextResponse.json(rows);
}