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

    const handleEditFuncionario = async (formData) => {
        try {
            const funcionario_id = formData.funcionario_id;

            const res = await fetch(`/api/funcionarios/${funcionario_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error || "Erro ao atualizar funcionário!");
                return;
            }

            toast.success("Funcionário atualizado com sucesso!");

            if (modalControl.current) {
                modalControl.current.setModalOpen(false);
            }

            if (typeof getFuncionarios === "function") {
                getFuncionarios();
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro inesperado ao atualizar funcionário!");
        }
    };

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
                                    disabled: true,
                                },
                                {
                                    name: "cargo",
                                    label: "Cargo",
                                    type: "select",
                                    options: [
                                        { value: "Administrador", label: "Administrador" },
                                        { value: "Funcionario", label: "Funcionário" },

                                    ]
                                },
                            ]}
                            onSubmit={handleEditFuncionario}
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
                    title: row.active === "Ativo"
                        ? "Confirmar desativação"
                        : "Confirmar ativação",
                    body: (
                        <div className="text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Tem certeza que deseja {row.active === "Ativo" ? "desativar" : "ativar"} o funcionário:{" "}
                                <span className="font-semibold">{row.nome}</span>?
                            </h3>
                            <button
                                type="button"
                                className="cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center"
                                onClick={() => {
                                    handleToggleStatus(row.funcionario_id, row.active);
                                    modal.setModalOpen(false);
                                }}
                            >
                                Sim, {row.active === "Ativo" ? "desativar" : "ativar"}!
                            </button>
                        </div>
                    ),
                });
                modal.setModalOpen(true);
            },
        },
    ];
    const filters = [
        {
            key: "active",
            label: "Status",
            options: [
                { label: "Ativos", value: "Ativos" },
                { label: "Inativos", value: "Inativos" }
            ]
        }
    ];
    const handleModalControl = (control) => {
        modalControl.current = control;
    };

    const handleCreateFuncionario = async (formData) => {
        try {
            const res = await fetch("/api/funcionarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error);
                return;
            }

            toast.success("Funcionário cadastrado com sucesso!");

            if (modalControl.current) {
                modalControl.current.setModalOpen(false);
            }

            if (typeof getFuncionarios === "function") {
                getFuncionarios();
            }
        } catch (err) {
            console.error("Erro:", err);
            toast.error("Erro ao enviar dados!");
        }
    };

    const handleAddFuncionario = () => {
        if (modalControl.current) {
            modalControl.current.setModalContent({
                title: "Adicionar funcionário",
                body: (
                    <div className="space-y-8">

                        {/* Formulário */}
                        <Form
                            mode="add"
                            initialData={{ funcionarioId: "" }}
                            fields={[
                                {
                                    name: "nome",
                                    label: "Nome",
                                    type: "text",
                                    placeholder: "Carlos Oliveira",
                                    autoComplete: false,
                                    required: true,
                                },
                                {
                                    name: "telefone",
                                    label: "Telefone",
                                    type: "text",
                                    placeholder: "(00) 00000-0000",
                                    mask: "(00) 00000-0000",
                                    autoComplete: false,
                                    required: true,
                                },
                                {
                                    name: "email",
                                    label: "Email",
                                    type: "email",
                                    placeholder: "email@email.com",
                                    autoComplete: false,
                                    required: true,
                                },
                                {
                                    name: "cargo",
                                    label: "Cargo",
                                    type: "select",
                                    required: true,
                                    options: [
                                        { value: "Administrador", label: "Administrador" },
                                        { value: "Funcionario", label: "Funcionário" },
                                    ]
                                }
                            ]}
                            onSubmit={handleCreateFuncionario}
                        />

                        <div className="flex items-start gap-3 rounded-xl border border-yellow-300/40 bg-linear-to-br from-yellow-50 to-yellow-100/60 dark:from-yellow-900/20 dark:to-yellow-900/10 p-4 shadow-sm backdrop-blur-sm">

                            <div className="text-yellow-600 dark:text-yellow-400 text-xl leading-none">
                                ⚠️
                            </div>

                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                O usuário será criado com uma <strong>senha padrão temporária</strong>.
                                No primeiro acesso, ele será <strong>obrigado a redefinir</strong> sua senha para uma nova de sua preferência.
                            </p>

                        </div>

                    </div>
                )
            });
            modalControl.current.setModalOpen(true);
        }
    };


    const getFuncionarios = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/funcionarios");
            const data = await res.json();

            const normalizedData = data.map((item) => ({
                ...item,
                active: item.ativo === 1 ? "Ativo" : "Inativo",
            }));

            setData(normalizedData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFuncionarios();
    }, []);

    const handleOpenViewModal = (row) => {
        console.log(row);
        if (modalControl.current) {
            modalControl.current.setModalContent({
                title: "Detalhes do funcionário",
                body: (
                    <div className="space-y-6">

                        {/* Card geral */}
                        <div
                            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md shadow-lg p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Informações Gerais
                            </h3>

                            <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                <div className="flex justify-between">
                                    <span className="font-medium">ID</span>
                                    <span>#{row.funcionario_id}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">Nome</span>
                                    <span>{row.nome}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">Cargo</span>
                                    <span>{formatPhone(row.cargo)}</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md shadow-lg p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Status Funcional
                            </h3>

                            <div className="space-y-3 text-gray-700 dark:text-gray-300">

                                <div className="flex justify-between">
                                    <span className="font-medium">Data de admissão</span>
                                    <span>{formatDate(row.criado_em)}</span>
                                </div>

                                {row.demissao_em && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Data de demissão</span>
                                        <span>{formatDate(row.demissao_em)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Status</span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold 
                                                    ${row.ativo
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                            }`}
                                    >
                                        {row.ativo ? "Ativo" : "Inativo"}
                                    </span>
                                </div>


                            </div>
                        </div>

                        <div
                            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md shadow-lg p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Contatos
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">

                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Telefone</span>
                                    <span className="font-medium">{formatPhone(row.telefone)}</span>
                                </div>


                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                                    <span className="font-medium">{row.email}</span>
                                </div>


                            </div>
                        </div>


                    </div>
                )
            });
            modalControl.current.setModalOpen(true);
        }
    };

    async function handleToggleStatus(funcionario_id, current_status) {
        const newStatus = current_status === "Ativo" ? 0 : 1;

        try {
            const res = await fetch(`/api/funcionarios/${funcionario_id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: newStatus,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return;
            }

            toast.success(data.message);
            getFuncionarios();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar status do funcionário!");
        }
    }

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
                                    onAddClick={handleAddFuncionario}
                                    filters={filters}
                                    defaultFilters={{
                                        active: "Ativos"
                                    }}
                                    openViewModal={handleOpenViewModal}
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