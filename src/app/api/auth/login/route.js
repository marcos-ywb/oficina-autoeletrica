import { NextResponse } from "next/server";
import { database } from "@/lib/database";
import bcrypt from "bcryptjs";
import { generateToken } from "@/utils/auth";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email e senha são obrigatórios!" },
                { status: 400 }
            );
        }

        const [rows] = await database.query(
            "SELECT * FROM funcionarios WHERE email = ?",
            [email]
        );

        const funcionario = rows?.[0];
        if (!funcionario) {
            return NextResponse.json(
                { error: "Credenciais inválidas!" },
                { status: 401 }
            );
        }

        if (!funcionario.ativo) {
            return NextResponse.json(
                { error: "Seu acesso foi desativado. Contate o administrador." },
                { status: 403 }
            );
        }

        const isMatch = await bcrypt.compare(password, funcionario.senha || "");
        if (!isMatch) {
            return NextResponse.json(
                { error: "Credenciais inválidas!" },
                { status: 401 }
            );
        }

        const token = generateToken({
            id: funcionario.funcionario_id,
            email: funcionario.email,
            name: funcionario.nome,
            primeiro_acesso: Boolean(Number(funcionario.primeiro_acesso)),
        });

        const response = NextResponse.json({
            message: "Login realizado com sucesso!",
            name: funcionario.nome,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return NextResponse.json(
            { error: "Erro interno no servidor!" },
            { status: 500 }
        );
    }
}