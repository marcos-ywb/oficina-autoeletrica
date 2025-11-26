import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function PUT(request, { params }) {
    try {
        const funcionario_id = await params;
        const body = await request.json();

        const {
            nome,
            telefone,
            cargo
        } = body;

        if (
            !nome ||
            !telefone ||
            !cargo
        ) {
            return NextResponse.json(
                { error: "Dados incompletos!" },
                { status: 400 }
            );
        }

        const telefoneLimpo = telefone.replace(/\D/g, "");

        await database.query(
            `UPDATE funcionarios SET nome=?, telefone=?, cargo=?
            WHERE funcionario_id=?`,
            [nome, telefoneLimpo, cargo, funcionario_id]
        );

        return NextResponse.json(
            { success: true },
            { status: 200 },
            { message: "Funcionário atualizado com sucesso!" }

        );
    } catch (err) {
        console.error("Erro ao atualizar funcionário:", err);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}