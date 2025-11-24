"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        {
            href: "/home", label: "Home", icon: (
                <svg
                    className="shrink-0 w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10.707 1.293a1 1 0 0 0-1.414 0l-8 8A1 1 0 0 0 2 11h1v7a1 1 0 0 0 1 1h5v-5h4v5h5a1 1 0 0 0 1-1v-7h1a1 1 0 0 0 .707-1.707l-8-8Z" />
                </svg>
            )
        },
        {
            href: "/clientes", label: "Clientes", icon: (
                <svg
                    className="shrink-0 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 18v-1c0-2.21 3.58-4 6-4s6 1.79 6 4v1H6z" />
                </svg>
            )
        },
        {
            href: "/veiculos", label: "Veículos", icon: (
                <svg
                    className="shrink-0 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M3 13l1.5-4.5A3 3 0 0 1 7.3 6h9.4a3 3 0 0 1 2.8 2.5L21 13v6a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-6zm3.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM6.2 12h11.6l-1.1-3.3a1 1 0 0 0-1-.7H8.3a1 1 0 0 0-1 .7L6.2 12z" />
                </svg>
            )
        },
        {
            href: "/equipe", label: "Equipe", icon: (
                <svg
                    className="shrink-0 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zM8 13c-2.673 0-8 1.337-8 4v3h16v-3c0-2.663-5.327-4-8-4zm8 0c-.29 0-.577.021-.861.062 1.372.916 2.861 2.23 2.861 3.938v3h6v-3c0-2.663-5.327-4-8-4z" />
                </svg>
            )
        },
        {
            href: "/servicos", label: "Serviços", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h6" />
                </svg>
            )
        },
        {
            href: "/pagamentos", label: "Pagamentos", icon: (
                <svg
                    className="shrink-0 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 18V8h16v10H4z" />
                    <path d="M4 6h16v2H4z" />
                </svg>
            )
        },
        /*
        {
            href: "/agendamentos", label: "Agendamentos", icon: (
                <svg
                    className="shrink-0 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.897 4 3 4.897 3 6v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V9h14l.002 11H5z" />
                    <path d="M7 11h5v5H7z" />
                </svg>
            )
        },
        {
            href: "/fidelidade", label: "Fidelidade", icon: (
                <svg
                    className="shrink-0 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 .587l3.668 7.431L24 9.753l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.6 0 9.753l8.332-1.735L12 .587z" />
                </svg>
            ),
            badge: "NEW"
        },
        {
            href: "/relatorios", label: "Relatórios", icon: (
                <svg
                    className="shrink-0 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M3 3h2v18H3V3zm6 6h2v12H9V9zm6-4h2v16h-2V5zm6 8h2v8h-2v-8z" />
                </svg>
            )
        },
        */
    ]

    return (
        <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    {links.map(({ href, label, icon, badge }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                className={`relative flex items-center p-2 rounded-lg group transition
                                        ${pathname === href
                                        ? "bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-white font-semibold"
                                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {icon}

                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    {label}
                                    {badge && (
                                        <span className="ml-2 px-3 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 backdrop-blur-sm shadow-sm hover:scale-105 transition-transform duration-200">
                                            {badge}
                                        </span>
                                    )}
                                </span>

                                {pathname === href && (
                                    <span
                                        className={`absolute right-0 top-0 h-full w-1.5 rounded-r ${pathname === "/home"
                                            ? "bg-linear-to-br from-indigo-600 to-blue-500"
                                            : pathname === "/veiculos"
                                                ? "bg-linear-to-br from-purple-600 to-indigo-500"
                                                : pathname === "/clientes"
                                                    ? "bg-linear-to-br from-blue-600 to-blue-400"
                                                    : pathname === "/servicos"
                                                        ? "bg-linear-to-br from-emerald-500 to-teal-500"
                                                        : pathname === "/pagamentos"
                                                            ? "bg-linear-to-br from-yellow-500 to-orange-500"
                                                            : pathname === "/equipe"
                                                                ? "bg-linear-to-br from-green-500 to-teal-500"
                                                                : pathname === "/relatorios"
                                                                    ? "bg-linear-to-br from-green-600 to-teal-500"
                                                                    : "bg-gray-600 dark:bg-gray-400"
                                            }`}
                                    />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}