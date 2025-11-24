"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast"

import { sanitizeEmail, sanitizePassword, validateForm } from "@/utils/auth";

export default function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const auth = params.get("auth");
        if (auth === "required") {
            toast.error("É necessário fazer login para acessar essa página!");
        } else if (auth === "invalid") {
            toast.error("Sessão expirada. Faça seu login novamente!");
        }
    }, [params])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sanitized = {
            email: sanitizeEmail(formData.email),
            password: sanitizePassword(formData.password),
        };

        const validationErrors = validateForm(sanitized);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSuccess(false);
            setTimeout(() => setErrors({}), 3000);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sanitized),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Erro ao fazer login!");
                setLoading(false);
                return;
            }

            toast.success(`Bem-vindo, ${data.name}!`);
            setSuccess(true);

            router.push("/home");

        } catch (err) {
            console.error("Erro no login:", err);
            toast.error("Erro inesperado. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) => {
        const base = "text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400";
        if (errors[field])
            return `${base} bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:border-red-500`;
        if (success)
            return `${base} bg-green-50 border border-green-500 text-green-900 placeholder-green-700 focus:ring-green-500 focus:border-green-500 dark:text-green-400 dark:border-green-500`;
        return `${base} bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:text-white`;
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">
                <a className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <Image
                        src="/icon.svg"
                        alt="Ícone"
                        width={40}
                        height={40}
                        className="dark:invert mr-3"
                    />
                    JFSilva
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Faça login na sua conta!
                        </h1>



                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 md:space-y-6"
                            action="#"
                        >
                            <div className="relative">
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>

                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    className={inputClass("email")}
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />

                                {/* Mensagem de feedback */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${errors.email || success ? "max-h-10 opacity-100 mt-1" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    {errors.email ? (
                                        <p className="text-sm text-red-600 dark:text-red-500">
                                            <span className="font-medium">Oops!</span> {errors.email}
                                        </p>
                                    ) : success ? (
                                        <p className="text-sm text-green-600 dark:text-green-500">
                                            <span className="font-medium">Perfeito!</span> Email válido!
                                        </p>
                                    ) : null}
                                </div>
                            </div>



                            <div className="relative">
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Senha
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className={inputClass("password")}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                                {/* Mensagem de feedback */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${errors.password || success ? "max-h-10 opacity-100 mt-1" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    {errors.password ? (
                                        <p className="text-sm text-red-600 dark:text-red-500">
                                            <span className="font-medium">Oops!</span> {errors.password}
                                        </p>
                                    ) : success ? (
                                        <p className="text-sm text-green-600 dark:text-green-500">
                                            <span className="font-medium">Tudo certo!</span> Senha válida!
                                        </p>
                                    ) : null}
                                </div>
                            </div>




                            <div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                                    Esqueceu sua senha?
                                </a>
                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition ${loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                    }`}
                            >
                                {loading ? "Entrando..." : "Entrar"}
                            </button>
                        </form>



                    </div>
                </div>
            </div>
        </section>
    );
}