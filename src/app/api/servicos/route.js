import { NextResponse } from "next/server";
import { database } from "@/lib/database";
import { clearCurrency } from "@/utils/formatters";

export async function GET() {
    const [rows] = await database.query(`
        SELECT 
            s.servico_id,
            s.descricao,
            s.orcamento,
            s.custo_final,
            s.data_entrada,
            s.data_conclusao,
            s.status,
            s.criado_em,
            s.atualizado_em,

            v.veiculo_id,
            v.marca,
            v.modelo,
            v.placa,
            v.ano,

            c.cliente_id,
            c.nome AS cliente_nome,
            c.telefone AS cliente_telefone,
            c.ativo AS cliente_ativo,

            e.endereco_id,
            e.cep,
            e.logradouro,
            e.numero,
            e.bairro,
            e.cidade,
            e.estado,

            f.funcionario_id,
            f.nome AS funcionario_nome

        FROM servicos s
        JOIN veiculos v 
            ON s.veiculo_id = v.veiculo_id
        JOIN clientes c 
            ON v.cliente_id = c.cliente_id
        LEFT JOIN enderecos e 
            ON c.cliente_id = e.cliente_id
        JOIN funcionarios f 
            ON s.funcionario_id = f.funcionario_id

        ORDER BY s.servico_id DESC;
    `);

    return NextResponse.json(rows);
}

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            veiculo_id,
            funcionario_id,
            descricao,
            orcamento,
            data_entrada
        } = body;

        if (
            !veiculo_id ||
            !funcionario_id ||
            !descricao ||
            !orcamento ||
            !data_entrada
        ) {
            return NextResponse.json(
                { error: "Dados incompletos!" },
                { status: 400 }
            );
        }

        const orcamentoLimpo = clearCurrency(orcamento);

        await database.query(
            "INSERT INTO servicos (veiculo_id, funcionario_id, descricao, orcamento, data_entrada) VALUES (?, ?, ?, ?, ?)",
            [veiculo_id, funcionario_id, descricao, orcamentoLimpo, data_entrada]
        );

        return NextResponse.json(
            { message: "Servico criado com sucesso!" },
            { status: 201 }
        );

    } catch (err) {
        console.error("Erro ao criar servico:", err);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}
