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

        const isMath = await bcrypt.compare(password, funcionario.senha || "");
        if (!isMath) {
            return NextResponse.json(
                { error: "Credenciais inválidas!" },
                { status: 401 }
            );
        }

        const token = generateToken({
            id: funcionario.funcionario_id,
            email: funcionario.email,
            name: funcionario.nome,
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