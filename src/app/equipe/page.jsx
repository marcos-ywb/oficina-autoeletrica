"use client";

import React, { useEffect, useState, useRef } from "react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/Table";
import Form from "@/components/Form";
import ScrollStyle from "@/components/ScrollStyle";

import { toast } from "react-hot-toast";
import { formatPhone, formatDate } from "@/utils/formatters";

import FlowbiteInit from "../FlowbiteInit";

export default function Equipe() {
    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.style.overflow = "auto";
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const [loading, setLoading] = useState(false);
    const modalControl = useRef(null);
    const [data, setData] = useState([]);
    const columns = [
        { key: "funcionario_id", label: "ID" },
        { key: "nome", label: "Nome" },
        { key: "telefone", label: "Telefone", format: (value) => formatPhone(value) },
        { key: "email", label: "Email" },
        { key: "cargo", label: "Cargo" },
        { key: "criado_em", label: "Criação", format: (value) => formatDate(value) },
    ];
    const actions = [
        {
            label: "Editar",
            onClick: (row, modal) => {
                modal.setModalContent({
                    title: "Editar funcionário",
                    body: (
                        <Form
                            mode="edit"
                            initialData={row}
                            fields={[
                                {
                                    name: "nome",
                                    label: "Nome",
                                    type: "text",
                                    placeholder: "João da Silva",
                                    autoComplete: false,
                                },
                                {
                                    name: "telefone",
                                    label: "Telefone",
                                    type: "text",
                                    placeholder: "(00) 00000-0000",
                                    mask: "(00) 00000-0000",
                                    autoComplete: false,
                                },
                                {
                                    name: "email",
                                    label: "Email",
                                    type: "email",
                                    placeholder: "jwW2w@example.com",
                                    autoComplete: false,
                                },
                                {
                                    name: "cargo",
                                    label: "Cargo",
                                    type: "select",
                                    options: [
                                        { value: "Administrador", label: "Administrador" },
                                        { value: "Funcionario", label: "Funcionário" },

                                    ]
                                }
                            ]}
                        />
                    ),
                });
                modal.setModalOpen(true);
            },
        },
        {
            label: "Ativar/Desativar",
            onClick: (row, modal) => {
                modal.setModalContent({

                });
                modal.setModalOpen(true);
            },
        },
    ];
    const filters = [];
    const handleModalControl = (control) => {
        modalControl.current = control;
    };

    const getFuncionarios = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/funcionarios");
            const data = await res.json();
            console.log(data);
            setData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFuncionarios();
    }, []);

    return (
        <div>
            <FlowbiteInit />
            <Navbar />
            <Sidebar />
            <ScrollStyle />
            <main className="overflow-x-auto">
                <div className="sm:ml-64">
                    <div className="border-gray-200 rounded-lg dark:border-gray-700">
                        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">



                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-8 pt-25 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-linear-to-br from-green-500 to-teal-500 text-white shadow-md">
                                        <svg
                                            className="shrink-0 w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zM8 13c-2.673 0-8 1.337-8 4v3h16v-3c0-2.663-5.327-4-8-4zm8 0c-.29 0-.577.021-.861.062 1.372.916 2.861 2.23 2.861 3.938v3h6v-3c0-2.663-5.327-4-8-4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                            Equipe
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
                                <Table
                                    columns={columns}
                                    data={data}
                                    actions={actions}
                                    onModalControl={handleModalControl}
                                    filters={filters}
                                    loading={loading}
                                />
                            </div>



                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}