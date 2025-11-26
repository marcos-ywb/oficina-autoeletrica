import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function PUT(request, { params }) {
    try {
        const cliente_id = await params;
        const body = await request.json();

        const {
            nome,
            telefone,
            cep,
            logradouro,
            numero,
            bairro,
            cidade,
            estado
        } = body;

        if (
            !nome ||
            !telefone ||
            !cep ||
            !logradouro ||
            !numero ||
            !bairro ||
            !cidade ||
            !estado
        ) {
            return NextResponse.json(
                { error: "Dados incompletos!" },
                { status: 400 }
            );
        }

        const telefoneLimpo = telefone.replace(/\D/g, "");
        const cepLimpo = cep.replace(/\D/g, "");

        await database.query(
            `UPDATE clientes SET nome=?, telefone=? WHERE cliente_id=?`,
            [nome, telefoneLimpo, cliente_id]
        );

        await database.query(
            `UPDATE enderecos SET cep=?, logradouro=?, numero=?, bairro=?, cidade=?, estado=?
            WHERE cliente_id=?`,
            [cepLimpo, logradouro, numero, bairro, cidade, estado, cliente_id]
        );

        return NextResponse.json(
            { success: true },
            { status: 200 },
            { message: "Cliente atualizado com sucesso!" }

        );
    } catch (err) {
        console.error("Erro ao atualizar cliente:", err);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}
