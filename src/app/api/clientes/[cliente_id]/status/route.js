import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function PATCH(req, context) {
    const { cliente_id } = await context.params;

    try {
        const { status } = await req.json();

        if (typeof status !== "number" || ![0, 1].includes(status)) {
            return NextResponse.json(
                { error: "Status inválido!" },
                { status: 400 }
            );
        }

        await database.query(
            "UPDATE clientes SET ativo = ? WHERE cliente_id = ?",
            [status, cliente_id]
        );

        return NextResponse.json({
            success: true,
            message: "Status atualizado com sucesso!"
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erro ao atualizar status do cliente!" },
            { status: 500 }
        );
    }
}