"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Users,
    Car,
    Users2,
    List,
    CreditCard
} from "lucide-react";
import toast from "react-hot-toast";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        {
            href: "/home",
            label: "Home",
            icon: <Home className="w-5 h-5" />
        },
        {
            href: "/clientes",
            label: "Clientes",
            icon: <Users className="w-5 h-5" />
        },
        {
            href: "/veiculos",
            label: "Veículos",
            icon: <Car className="w-5 h-5" />
        },
        {
            href: "/equipe",
            label: "Equipe",
            icon: <Users2 className="w-5 h-5" />
        },
        {
            href: "/servicos",
            label: "Serviços",
            icon: <List className="w-5 h-5" />
        },
        {
            href: "/pagamentos",
            label: "Pagamentos",
            icon: <CreditCard className="w-5 h-5" />
        },
    ];

    const handleClick = (e, href) => {
        if (href === "/pagamentos") {
            e.preventDefault();
            toast("Ainda em desenvolvimento", {
                icon: "🚧",
            });
        }
    };

    return (
        <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    {links.map(({ href, label, icon, badge }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                onClick={(e) => handleClick(e, href)}
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