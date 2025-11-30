import { NextResponse } from "next/server";
import { database } from "@/lib/database";
import bcrypt from "bcryptjs";
import { generateToken } from "@/utils/auth";

export async function POST(req) {
    try {
        const { nova_senha, funcionario_id } = await req.json();

        if (!nova_senha || !funcionario_id) {
            return NextResponse.json(
                { error: "Dados incompletos!" },
                { status: 400 }
            );
        }

        const hash = await bcrypt.hashSync(
            nova_senha, bcrypt.genSaltSync(10)
        );

        await database.query(
            "UPDATE funcionarios SET senha = ?, primeiro_acesso = 0 WHERE funcionario_id = ?",
            [hash, funcionario_id]
        );

        const [rows] = await database.query(
            "SELECT funcionario_id, email, nome, primeiro_acesso FROM funcionarios WHERE funcionario_id = ?",
            [funcionario_id]
        );
        const user = rows[0];

        const token = generateToken({
            id: user.funcionario_id,
            email: user.email,
            name: user.nome,
            primeiro_acesso: Boolean(Number(user.primeiro_acesso)),
        })

        const response = NextResponse.json({
            success: true,
            message: "Senha atualizada com sucesso!"
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (err) {
        console.error("Erro ao atualizar senha do funcionário:", err);
        return NextResponse.json(
            { error: "Erro ao atualizar senha do funcionário!" },
            { status: 500 }
        )
    }
}