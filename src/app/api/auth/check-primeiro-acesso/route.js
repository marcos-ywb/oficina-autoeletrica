import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { primeiro_acesso: false }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return NextResponse.json({
            primeiro_acesso: Boolean(decoded.primeiro_acesso),
        });

    } catch {
        return NextResponse.json(
            { primeiro_acesso: false }
        );
    }
}