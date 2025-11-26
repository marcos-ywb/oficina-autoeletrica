import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function GET() {
    const [rows] = await database.query(
        "SELECT funcionario_id, nome, telefone, email, cargo, criado_em, demissao_em, ativo FROM funcionarios ORDER BY funcionario_id DESC"
    );

    return NextResponse.json(rows);
}