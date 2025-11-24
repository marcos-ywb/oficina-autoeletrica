import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const normalizePath = (path) => path.replace(/\/+$/, "");

export function middleware(req) {
    const url = req.nextUrl.clone();

    const protectedRoutes = [
        "/home",
        "/clientes",
        "/veiculos",
        "/equipe",
        "/servicos",
        "/pagamentos",
    ];

    const currentPath = normalizePath(url.pathname);
    const isProtected = protectedRoutes.some(
        (path) => normalizePath(path) === currentPath
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;

    if (!token) {
        url.pathname = "/";
        url.searchParams.set("auth", "required");
        return NextResponse.redirect(url);
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET || "0qZpU21nCb4bWq8K8sV3rUO7jKZQh4sI");

        return NextResponse.next();
    } catch (err) {
        url.pathname = "/";
        url.searchParams.set("auth", "invalid");
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
    runtime: "nodejs",
};