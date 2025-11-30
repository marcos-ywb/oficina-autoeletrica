"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";

import { stringToColor, getContrastTextColor, getInitials } from "@/utils/avatar";

export default function Navbar() {
    const router = useRouter();

    const [user, setUser] = useState({
        name: "Usuário padrão",
        email: "usuario@meusistema.com",
    });

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                toast.success("Logout realizado com sucesso!");
                router.push("/");
            } else {
                toast.error("Erro ao fazer logout!");
            }
        } catch (err) {
            console.error("Erro: ", err);
            toast.error("Erro inesperado no logout!");
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/me");
                const data = await response.json();

                if (!data.error) {
                    setUser({
                        name: data.name || "Usuário padrão",
                        email: data.email || "usuario@meusistema.com",
                    });
                }
            } catch (err) {
                console.error("Erro ao buscar usuário:", err);
            }
        };

        fetchUser();
    }, []);

    const bgColor = stringToColor(user.name);
    const textColor = getContrastTextColor(bgColor);

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    {/* Logo e botão mobile */}
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button
                            data-drawer-target="logo-sidebar"
                            data-drawer-toggle="logo-sidebar"
                            aria-controls="logo-sidebar"
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
                            </svg>
                        </button>

                        <a
                            href="/home"
                            className="flex items-center gap-3 ms-2 md:me-24 select-none"
                        >
                            {/* ÍCONE */}
                            <div className="w-10 h-10 flex items-center justify-center">
                                <Image
                                    src="/icon.svg"
                                    alt="Ícone"
                                    width={45}
                                    height={45}
                                    className="dark:invert"
                                />
                            </div>

                            {/* TEXTO */}
                            <span className="text-[1.4rem] sm:text-[1.6rem] font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                <span className="bg-linear-to-r from-blue-800 via-blue-600 to-indigo-700 dark:from-blue-500 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                                    JFSilva
                                </span>
                            </span>

                        </a>

                    </div>

                    {/* Avatar e dropdown */}
                    <div className="flex items-center">
                        <div className="flex items-center ms-3">
                            <div>
                                <button
                                    type="button"
                                    className="cursor-pointer flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                    aria-expanded="false"
                                    data-dropdown-toggle="dropdown-user"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div
                                        className="w-12 h-12 flex items-center justify-center rounded-full font-semibold text-lg"
                                        style={{
                                            backgroundColor: bgColor,
                                            color: textColor,
                                        }}
                                    >
                                        {getInitials(user.name)}
                                    </div>
                                </button>
                            </div>

                            {/* Dropdown */}
                            <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                                <div className="px-4 py-3" role="none">
                                    <p className="text-sm text-gray-900 dark:text-white" role="none">
                                        {user.name}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                        {user.email}
                                    </p>
                                </div>
                                <ul className="py-1" role="none">
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                                            Perfil
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                                            Configurações
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-600 hover:text-white 
                                            dark:text-gray-300 dark:hover:bg-red-700 dark:hover:text-white cursor-pointer transition"
                                            role="menuitem"
                                            onClick={handleLogout}
                                        >
                                            Sair
                                        </a>

                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
}