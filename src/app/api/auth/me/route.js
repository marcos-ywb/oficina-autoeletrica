import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { database } from "@/lib/database";

export async function GET(req) {
    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json(
        { error: "Não autenticado!" },
        { status: 401 }
    );

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const funcionarioID = decoded.id;

        const [rows] = await database.query(
            "SELECT funcionario_id, nome, email FROM funcionarios WHERE funcionario_id = ?", [funcionarioID]
        );

        const funcionario = rows[0];
        if (!funcionario) {
            return NextResponse.json({ error: "Usuário não encontrado!" }, { status: 404 });
        }

        return NextResponse.json({
            id: funcionario.funcionario_id,
            email: funcionario.email,
            name: funcionario.nome
        });

    } catch {
        return NextResponse.json({ error: "Token inválido!" }, { status: 401 });
    }
}