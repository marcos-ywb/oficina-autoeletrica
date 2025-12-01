import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function PUT(req) {
    try {
        const { servico_id, status } = await req.json();

        if (!servico_id || !status) {
            return NextResponse.json(
                { error: "ID e status são obrigatórios!" },
                { status: 400 }
            );
        }

        const [result] = await database.query(
            `UPDATE servicos
             SET status = ?, data_conclusao = IF(? = 'Concluido', NOW(), NULL)
             WHERE servico_id = ?`,
            [status, status, servico_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Serviço não encontrado" },
                { status: 404 }
            );
        }

        const [updated] = await database.query(
            `SELECT custo_final, data_conclusao 
             FROM servicos 
             WHERE servico_id = ?`,
            [servico_id]
        );

        const { custo_final, data_conclusao } = updated[0];

        if (status === "Concluido") {

            const [existingPayment] = await database.query(
                `SELECT pagamento_id 
                 FROM pagamentos 
                 WHERE servico_id = ?`,
                [servico_id]
            );

            if (existingPayment.length === 0) {
                await database.query(
                    `INSERT INTO pagamentos 
                        (servico_id, valor, forma_pagamento, data_pagamento, status_pagamento)
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        servico_id,
                        custo_final || 0,
                        "Pix",
                        new Date(),
                        "Pendente"
                    ]
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: "Status atualizado com sucesso!",
            data_conclusao
        });

    } catch (err) {
        console.error("Erro ao atualizar status de serviço!", err);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}
