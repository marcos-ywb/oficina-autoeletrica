import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { database } from "@/lib/database";

export async function GET() {
    const [rows] = await database.query(
        "SELECT funcionario_id, nome, telefone, email, cargo, criado_em, demissao_em, ativo FROM funcionarios ORDER BY funcionario_id DESC"
    );

    return NextResponse.json(rows);
}

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            nome,
            telefone,
            email,
            cargo,
        } = body;

        if (
            !nome ||
            !telefone ||
            !email ||
            !cargo
        ) {
            return NextResponse.json(
                { error: "Dados incompletos!" },
                { status: 400 }
            );
        }

        const telefoneLimpo = telefone.replace(/\D/g, "");
        const hash = await bcrypt.hashSync(
            process.env.DEFAULT_PASSWORD,
            bcrypt.genSaltSync(10)
        );

        const [result] = await database.query(
            `INSERT INTO funcionarios (nome, telefone, email, senha, cargo)
            VALUES (?, ?, ?, ?, ?)`,
            [nome, telefoneLimpo, email, hash, cargo]
        );

        const funcionarioId = result.insertId;

        return NextResponse.json(
            { success: true, funcionarioId },
            { status: 201 }

        );

    } catch (err) {
        console.error("Erro ao criar funcionário:", err);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}