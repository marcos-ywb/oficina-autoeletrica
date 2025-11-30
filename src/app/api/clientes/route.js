import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function GET() {
    const [rows] = await database.query(`
            SELECT
                c.cliente_id,
                c.nome,
                c.telefone,
                c.criado_em AS cliente_criado_em,
                c.ativo,

                e.endereco_id,
                e.cep,
                e.logradouro,
                e.numero,
                e.bairro,
                e.cidade,
                e.estado,
                e.criado_em AS endereco_criado_em
            
            FROM clientes c
            LEFT JOIN enderecos e ON e.cliente_id = c.cliente_id
            ORDER BY c.cliente_id DESC
        `);

    const result = rows.map((row) => ({
        cliente_id: row.cliente_id,
        nome: row.nome,
        telefone: row.telefone,
        criado_em: row.cliente_criado_em,
        ativo: row.ativo,

        endereco: row.endereco_id
            ? {
                endereco_id: row.endereco_id,
                cep: row.cep,
                logradouro: row.logradouro,
                numero: row.numero,
                bairro: row.bairro,
                cidade: row.cidade,
                estado: row.estado,
                criado_em: row.endereco_criado_em,
            }
            : null,
    }));

    return NextResponse.json(result);
}


export async function POST(req) {
    try {
        const body = await req.json();

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

        const [clienteResult] = await database.query(
            "INSERT INTO clientes (nome, telefone) VALUES (?, ?)",
            [nome, telefoneLimpo]
        );

        const clienteId = clienteResult.insertId;

        await database.query(
            `INSERT INTO enderecos 
            (cliente_id, cep, logradouro, numero, bairro, cidade, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                clienteId,
                cepLimpo,
                logradouro,
                numero,
                bairro,
                cidade,
                estado.toUpperCase()
            ]
        );

        return NextResponse.json(
            { success: true, clienteId },
            { status: 201 }
        );

    } catch (err) {
        console.error("Erro ao criar cliente:", err);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}