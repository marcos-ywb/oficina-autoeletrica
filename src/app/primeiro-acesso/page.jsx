"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import { sanitizePassword, validateFormPasswords } from "@/utils/auth";
import { stringToColor, getContrastTextColor, getInitials } from "@/utils/avatar";

export default function PrimeiroAcesso() {
    const router = useRouter();

    const [funcionarioId, setFuncionarioId] = useState(null);
    const [funcionario, setFuncionario] = useState({
        nome: "",
        email: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPasswords, setShowPasswords] = useState(false);

    const [errors, setErrors] = useState({});

    const getUser = async () => {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        console.log("User: ", data);
        if (!data.id) {
            router.push("/");
            return;
        }

        setFuncionarioId(data.id);

        setFuncionario({
            nome: data.name,
            email: data.email,
            cargo: data.cargo
        });
    };

    const checkPrimeiroAcesso = async () => {
        try {
            const res = await fetch("/api/auth/check-primeiro-acesso");
            const data = await res.json();
            console.log("Primeiro acesso: ", data);
            if (!data.primeiro_acesso) {
                router.push("/home");
            }
        } catch (err) {
            console.error(error);
            router.push("/");
        }
    };

    useEffect(() => {
        getUser();
        checkPrimeiroAcesso();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!funcionarioId) {
            toast.error("Carregando informações do usuário...");
            return;
        }

        const sanitized = {
            password: sanitizePassword(formData.password),
            confirmPassword: sanitizePassword(formData.confirmPassword),
        };

        const validationErrors = validateFormPasswords(sanitized);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSuccess(false);
            setTimeout(() => setErrors({}), 3000);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const res = await fetch("/api/auth/primeiro-acesso", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        nova_senha: formData.password,
                        funcionario_id: funcionarioId
                    }
                ),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erro ao redefinir senha!");
                setLoading(false);
                return;
            }

            toast.success("Senha redefinida com sucesso!");
            //setTimeout(() => toast.success("Bem-vindo(a), " + funcionario.nome + "!"), 500);
            setSuccess(true);

            router.push("/home");
        } catch (err) {
            console.error(err);
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

    const bgColor = stringToColor(funcionario.nome);
    const textColor = getContrastTextColor(bgColor);

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

                <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-6">

                        <div className="flex items-center gap-3 rounded-xl border border-yellow-300/40 bg-linear-to-br from-yellow-50 to-yellow-100/60 dark:from-yellow-900/20 dark:to-yellow-900/10 p-4 shadow-sm backdrop-blur-sm">
                            <div className="text-yellow-600 dark:text-yellow-400 text-xl leading-none">
                                ⚠️
                            </div>
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                Por segurança, você precisa definir uma nova senha antes de acessar o sistema!
                            </p>
                        </div>





                        {funcionario && (
                            <div
                                className="flex items-center gap-4 p-4 rounded-xl bg-white/40 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.06)] 
                                animate-slideIn"
                            >
                                {/* Avatar com inicial */}
                                <div
                                    className="w-12 h-12 flex items-center justify-center rounded-full font-semibold text-lg"
                                    style={{
                                        backgroundColor: bgColor,
                                        color: textColor,
                                    }}
                                >
                                    {getInitials(funcionario.nome)}
                                </div>

                                {/* Dados */}
                                <div className="flex flex-col">
                                    <span className="text-gray-900 dark:text-gray-50 font-medium text-base leading-none flex items-center gap-2 mb-1">
                                        {funcionario.nome}
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-600/15 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-500/20 font-semibold">
                                            {funcionario.cargo}
                                        </span>
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                                        {funcionario.email}
                                    </span>
                                </div>
                            </div>
                        )}





                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            {/* Nova senha */}
                            <div className="relative">
                                <label
                                    htmlFor="senha"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Nova senha
                                </label>

                                <input
                                    type={showPasswords ? "text" : "password"}
                                    name="password"
                                    id="senha"
                                    className={inputClass("password")}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                                {/* Botão de alternar visualização */}
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords((prev) => !prev)}
                                    className="absolute right-3 top-9.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                                >
                                    {showPasswords ? <EyeOff /> : <Eye />}
                                </button>

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


                            {/* Confirmar senha */}
                            <div className="relative">
                                <label
                                    htmlFor="confirmar"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Confirmar senha
                                </label>

                                <input
                                    type={showPasswords ? "text" : "password"}
                                    name="confirmPassword"
                                    id="confirmar"
                                    className={inputClass("password")}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPasswords((prev) => !prev)}
                                    className="absolute right-3 top-9.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                                >
                                    {showPasswords ? <EyeOff /> : <Eye />}
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${errors.confirmPassword || success ? "max-h-10 opacity-100 mt-1" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    {errors.confirmPassword ? (
                                        <p className="text-sm text-red-600 dark:text-red-500">
                                            <span className="font-medium">Oops!</span> {errors.confirmPassword}
                                        </p>
                                    ) : success ? (
                                        <p className="text-sm text-green-600 dark:text-green-500">
                                            <span className="font-medium">Tudo certo!</span> Senha válida!
                                        </p>
                                    ) : null}
                                </div>
                            </div>


                            {/* Botão */}
                            <button
                                type="submit"
                                disabled={loading || !funcionarioId}
                                className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition cursor-pointer ${loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                    }`}
                            >
                                {loading ? "Salvando..." : "Salvar nova senha"}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </section>
    );
}