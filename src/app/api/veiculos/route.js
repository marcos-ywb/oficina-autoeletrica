import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function GET() {
    try {
        const [rows] = await database.query(`
            SELECT 
                v.veiculo_id,
                v.cliente_id,
                c.nome AS cliente_nome,
                c.telefone AS cliente_telefone,
                c.ativo AS cliente_ativo,
                v.marca,
                v.modelo,
                v.ano,
                v.placa,
                v.criado_em
            FROM veiculos v
            JOIN clientes c ON v.cliente_id = c.cliente_id
            ORDER BY v.veiculo_id
        `);

        const data = rows.map((v) => ({
            veiculo_id: v.veiculo_id,
            cliente_id: v.cliente_id,
            marca: v.marca,
            modelo: v.modelo,
            ano: v.ano,
            placa: v.placa,
            criado_em: v.criado_em,
            cliente: {
                nome: v.cliente_nome,
                telefone: v.cliente_telefone,
                ativo: v.cliente_ativo
            }
        }));

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error("Erro ao buscar veículos:", err);
        return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        const body = await req.json();

        const {
            cliente_id,
            marca,
            modelo,
            ano,
            placa
        } = body;

        if (
            cliente_id == null ||
            !marca?.trim() ||
            !modelo?.trim() ||
            !ano ||
            !placa?.trim()
        ) {
            return NextResponse.json(
                { error: "Dados incompletos!" },
                { status: 400 }
            );
        }

        const [result] = await database.query(
            "INSERT INTO veiculos (cliente_id, marca, modelo, ano, placa) VALUES (?, ?, ?, ?, ?)",
            [cliente_id, marca, modelo, ano, placa]
        );

        return NextResponse.json(
            { success: true, id: result.insertId },
            { status: 201 }
        );

    } catch (err) {
        console.error("Erro ao criar veículo:", err);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}