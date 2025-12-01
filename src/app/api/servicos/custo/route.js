import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function PUT(req) {
    try {
        const body = await req.json();
        const { servico_id, custo_final } = body;

        if (
            !servico_id ||
            !custo_final === undefined
        ) {
            return NextResponse.json(
                { error: "Dados incompletos!" },
                { status: 400 }
            );
        }

        const [result] = await database.query(
            `UPDATE servicos
            SET custo_final = ?
            WHERE servico_id = ?`,
            [custo_final, servico_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Serviço não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Custo final atualizado com sucesso!",
            updated: {
                servico_id,
                custo_final
            }
        });

    } catch (err) {
        console.error("Erro ao atualizar custo do serviço!", err);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}