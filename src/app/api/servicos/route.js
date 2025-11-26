import { NextResponse } from "next/server";
import { database } from "@/lib/database";

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

            f.funcionario_id,
            f.nome AS funcionario_nome
        FROM servicos s
        JOIN veiculos v ON s.veiculo_id = v.veiculo_id
        JOIN funcionarios f ON s.funcionario_id = f.funcionario_id
    `);

    return NextResponse.json(rows);
}
