import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function POST(req) {
    try {
        const { servico_id } = await req.json();

        if (!servico_id) {
            return NextResponse.json(
                { error: "Dados incompletos!" },
                { status: 400 }
            );
        }

        const [servico] = await database.query(
            "SELECT custo_final FROM servicos WHERE servico_id = ?",
            [servico_id]
        );

        if (!servico.length) {
            return NextResponse.json(
                { error: "Serviço nao encontrado" },
                { status: 404 }
            );
        }

        const valor = servico[0].custo_final;

        const [existe] = await database.query(
            "SELECT pagamento_id FROM pagamentos WHERE servico_id = ?",
            [servico_id]
        );

        if (existe.length > 0) {
            return NextResponse.json({
                message: "Pagamento já cadastrado para este serviço."
            });
        }

        await database.query(
            `INSERT INTO pagamentos (servico_id, valor, forma_pagamento, data_pagamento, status_pagamento)
            VALUES (?, ?, 'Pix', CURDATE(), 'Pendente')`,
            [servico_id, valor]
        );

        return NextResponse.json({
            success: true,
            message: "Pagamento criado automaticamente!",
            servico_id,
            valor
        });

    } catch (err) {
        console.error("Erro ao criar pagamento:", err);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}