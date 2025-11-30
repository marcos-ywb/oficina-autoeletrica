import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function PUT(req) {
    try {
        const { servico_id, status } = await req.json();

        if (
            !servico_id ||
            !status
        ) {
            return NextResponse.json(
                { error: "ID e status são obrigatórios!" },
                { status: 400 }
            );
        }

        const [result] = await database.query(
            `UPDATE servicos
            SET status = ?
            WHERE servico_id = ?`,
            [status, servico_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Serviço não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Status atualizado com sucesso!"
        });

    } catch (err) {
        console.error("Erro ao atualizar status de serviço!", err);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}