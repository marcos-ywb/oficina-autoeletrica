"use client";

import React, { useEffect, useState } from "react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import FlowbiteInit from "../FlowbiteInit";

import { formatDate, formatCurrency } from "@/utils/formatters";

export default function Servicos() {
    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.style.overflow = "auto";
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const [filtros, setFiltros] = useState({
        periodo: "mensal",
        metodo: "",
        status: "",
    });

    const handleFiltroChange = (campo, valor) => {
        setFiltros({
            ...filtros,
            [campo]: valor
        });
    };

    const handleFiltrar = () => {
        alert(`Filtrando por período: ${filtros.periodo}, método: ${filtros.metodo}, status: ${filtros.status}`);
    };

    const pagamentos = [
        { id: 1, cliente: "Carlos Silva", valor: "50.55", metodo: "PIX", status: "pendente", data: "2025-10-22" },
        { id: 2, cliente: "Mariana Oliveira", valor: "50.55", metodo: "Cartão de crédito", status: "aprovado", data: "2025-10-22" },
        { id: 3, cliente: "João Santos", valor: "50.55", metodo: "PIX", status: "cancelado", data: "2025-10-22" },
        { id: 4, cliente: "Ana Oliveira", valor: "50.55", metodo: "PIX", status: "aprovado", data: "2025-10-22" },
        { id: 5, cliente: "Pedro Santos", valor: "50.55", metodo: "Dinheiro", status: "pendente", data: "2025-10-22" },
        { id: 6, cliente: "Maria Silva", valor: "50.55", metodo: "PIX", status: "aprovado", data: "2025-10-22" },
        { id: 7, cliente: "Lucas Oliveira", valor: "50.55", metodo: "PIX", status: "cancelado", data: "2025-10-22" },
        { id: 8, cliente: "Fernanda Santos", valor: "50.55", metodo: "PIX", status: "pendente", data: "2025-10-22" },
        { id: 9, cliente: "Rafael Silva", valor: "50.55", metodo: "PIX", status: "pendente", data: "2025-10-22" },
        { id: 10, cliente: "Isabela Oliveira", valor: "50.55", metodo: "PIX", status: "cancelado", data: "2025-10-22" },
    ];

    pagamentos.map((pagamento) => {
        pagamento.valor = formatCurrency(pagamento.valor);
        pagamento.data = formatDate(pagamento.data);
    });

    return (
        <div>
            <FlowbiteInit />
            <Navbar />
            <Sidebar />

            <main className="overflow-x-auto">
                <div className="sm:ml-64">
                    <div className="border-gray-200 rounded-lg dark:border-gray-700">
                        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">


                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-8 pt-25 mb-10">
                                <div className="flex items-center gap-3">


                                    <div className="p-3 rounded-xl bg-linear-to-br from-yellow-500 to-orange-500 text-white shadow-md">
                                        <svg
                                            className="shrink-0 w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 18V8h16v10H4z" />
                                            <path d="M4 6h16v2H4z" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                            Pagamentos
                                        </h1>
                                        {/*
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                            Visão geral do sistema: acompanhe métricas, agendamentos, clientes e relatórios em um único lugar.
                                        </p>
                                        */}
                                    </div>

                                </div>
                            </div>






                            <div className="px-8 mb-10">

                                {/* FILTROS */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8 border border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

                                        {/* INPUTS */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                                            {/* Período */}
                                            <div>
                                                <label className="text-sm text-gray-500 dark:text-gray-400">Período</label>
                                                <select
                                                    value={filtros.periodo}
                                                    onChange={(e) => handleFiltroChange("periodo", e.target.value)}
                                                    className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                                >
                                                    <option value="diario">Diário</option>
                                                    <option value="semanal">Semanal</option>
                                                    <option value="mensal">Mensal</option>
                                                    <option value="personalizado">Personalizado</option>
                                                </select>
                                            </div>

                                            {/* Método de Pagamento */}
                                            <div>
                                                <label className="text-sm text-gray-500 dark:text-gray-400">Método</label>
                                                <select
                                                    value={filtros.metodo}
                                                    onChange={(e) => handleFiltroChange("metodo", e.target.value)}
                                                    className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                                >
                                                    <option value="">Todos</option>
                                                    <option value="pix">Pix</option>
                                                    <option value="cartao">Cartão</option>
                                                    <option value="dinheiro">Dinheiro</option>
                                                </select>
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                                                <select
                                                    value={filtros.status}
                                                    onChange={(e) => handleFiltroChange("status", e.target.value)}
                                                    className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                                >
                                                    <option value="">Todos</option>
                                                    <option value="pago">Pago</option>
                                                    <option value="pendente">Pendente</option>
                                                    <option value="atrasado">Atrasado</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* BOTÃO */}
                                        <div className="flex justify-end md:justify-normal">
                                            <button
                                                onClick={handleFiltrar}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow transition w-full md:w-auto"
                                            >
                                                Aplicar Filtro
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* MÉTRICAS DE PAGAMENTO */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Recebido</p>
                                        <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                                            R$ 8.240,00
                                        </h2>
                                    </div>
                                    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
                                        <h2 className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mt-1">
                                            R$ 1.320,00
                                        </h2>
                                    </div>
                                    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Cancelados</p>
                                        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
                                            R$ 540,00
                                        </h2>
                                    </div>
                                </div>

                                {/* LISTAGEM DE PAGAMENTOS */}

                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-8 text-center">
                                        Lista de Pagamentos
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                                            {pagamentos.length > 0 && (
                                                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left">Cliente</th>
                                                        <th className="px-4 py-3 text-left">Valor</th>
                                                        <th className="px-4 py-3 text-left">Método</th>
                                                        <th className="px-4 py-3 text-left">Data</th>
                                                        <th className="px-4 py-3 text-left">Status</th>
                                                        <th className="px-4 py-3 text-right">Ações</th>
                                                    </tr>
                                                </thead>
                                            )}
                                            <tbody>
                                                {/* Exemplo de linha */}
                                                {pagamentos.length === 0 ? (
                                                    <div className="text-center italic text-gray-500">
                                                        Sem pagamentos registrados!
                                                    </div>
                                                ) : (
                                                    pagamentos.map((pagamento, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                                        >
                                                            <td className="px-4 py-3">{pagamento.cliente}</td>
                                                            <td className="px-4 py-3">{pagamento.valor}</td>
                                                            <td className="px-4 py-3">{pagamento.metodo}</td>
                                                            <td className="px-4 py-3">{pagamento.data}</td>
                                                            <td className="px-4 py-3">
                                                                {
                                                                    pagamento.status === "aprovado" ? (
                                                                        <span className="text-lime-400">Aprovado</span>
                                                                    ) : pagamento.status === "pendente" ? (
                                                                        <span className="text-amber-300">Pendente</span>
                                                                    ) : (
                                                                        <span className="text-red-400">Cancelado</span>
                                                                    )
                                                                }
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                                                                    Ver Detalhes
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))

                                                )}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>










                        </section>
                    </div>
                </div >
            </main >
        </div >
    );
}