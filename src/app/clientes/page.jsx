"use client";

import React, { useEffect, useRef, useState } from "react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/Table";
import Form from "@/components/Form";
import ScrollStyle from "@/components/ScrollStyle";

import { toast } from "react-hot-toast";
import { formatPhone, formatCep } from "@/utils/formatters";

import FlowbiteInit from "../FlowbiteInit";

export default function Clientes() {
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
        { key: "cliente_id", label: "ID" },
        { key: "nome", label: "Nome" },
        { key: "telefone", label: "Telefone", format: (value) => formatPhone(value) },
        { key: "ativo", label: "Status", format: (value) => (value === 1 ? "Ativo" : "Inativo") },
    ];

    const handleEditCliente = async (formData) => {
        try {
            const cliente_id = formData.cliente_id;

            const res = await fetch(`/api/clientes/${cliente_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error || "Erro ao atualizar cliente!");
                return;
            }

            toast.success("Cliente atualizado com sucesso!");

            if (modalControl.current) {
                modalControl.current.setModalOpen(false);
            }

            if (typeof getClientes === "function") {
                getClientes();
            }

        } catch (err) {
            console.error(err);
            toast.error("Erro inesperado ao atualizar cliente!");
        }
    };

    const actions = [
        {
            label: "Editar",
            onClick: (row, modal) => {
                console.log("ROW RECEBIDO:", row);
                const initialData = {
                    ...row,
                    cep: row.endereco?.cep || "",
                    logradouro: row.endereco?.logradouro || "",
                    numero: row.endereco?.numero || "",
                    bairro: row.endereco?.bairro || "",
                    cidade: row.endereco?.cidade || "",
                    estado: row.endereco?.estado || "",
                };
                modal.setModalContent({
                    title: "Editar cliente",
                    body: (
                        <Form
                            mode="edit"
                            initialData={initialData}
                            fields={[
                                {
                                    name: "nome",
                                    label: "Nome",
                                    type: "text",
                                    placeholder: "Carlos Oliveira",
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
                                    name: "cep",
                                    label: "CEP",
                                    type: "text",
                                    placeholder: "00000-000",
                                    mask: "00000-000",
                                    autoComplete: false,
                                },
                                {
                                    name: "logradouro",
                                    label: "Logradouro",
                                    type: "text",
                                    placeholder: "Rua Exemplo",
                                    autoComplete: false,
                                },
                                {
                                    name: "numero",
                                    label: "Número",
                                    type: "text",
                                    placeholder: "123",
                                    autoComplete: false,
                                },
                                {
                                    name: "bairro",
                                    label: "Bairro",
                                    type: "text",
                                    placeholder: "Centro",
                                    autoComplete: false,
                                },
                                {
                                    name: "cidade",
                                    label: "Cidade",
                                    type: "text",
                                    placeholder: "Paracatu",
                                    autoComplete: false,
                                },
                                {
                                    name: "estado",
                                    label: "Estado",
                                    type: "text",
                                    placeholder: "MG",
                                    mask: /^[A-Za-z]{0,2}$/,
                                    autoComplete: false,
                                },

                            ]}
                            onSubmit={handleEditCliente}
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
                                Tem certeza que deseja {row.active === "Ativo" ? "desativar" : "ativar"} o cliente:{" "}
                                <span className="font-semibold">{row.nome}</span>?
                            </h3>
                            <button
                                type="button"
                                className="cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center"
                                onClick={() => {
                                    handleToggleStatus(row.cliente_id, row.active);
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

    const handleCreateCliente = async (formData) => {
        try {
            const res = await fetch("/api/clientes", {
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

            toast.success("Cliente cadastrado com sucesso!");

            if (modalControl.current) {
                modalControl.current.setModalOpen(false);
            }

            if (typeof getClientes === "function") {
                getClientes();
            }


        } catch (err) {
            console.error("Erro:", err);
            toast.error("Erro ao enviar dados!");
        }
    };

    const handleAddCliente = () => {
        if (modalControl.current) {
            modalControl.current.setModalContent({
                title: "Adicionar cliente",
                body: (
                    <Form
                        mode="add"
                        initialData={{ clientId: "" }}
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
                                name: "cep",
                                label: "CEP",
                                type: "text",
                                placeholder: "00000-000",
                                mask: "00000-000",
                                autoComplete: false,
                                required: true,
                            },
                            {
                                name: "logradouro",
                                label: "Logradouro",
                                type: "text",
                                placeholder: "Rua Exemplo",
                                autoComplete: false,
                                required: true,
                            },
                            {
                                name: "numero",
                                label: "Número",
                                type: "text",
                                placeholder: "123",
                                autoComplete: false,
                                required: true,
                            },
                            {
                                name: "bairro",
                                label: "Bairro",
                                type: "text",
                                placeholder: "Centro",
                                autoComplete: false,
                                required: true,
                            },
                            {
                                name: "cidade",
                                label: "Cidade",
                                type: "text",
                                placeholder: "Paracatu",
                                autoComplete: false,
                                required: true,
                            },
                            {
                                name: "estado",
                                label: "Estado",
                                type: "text",
                                placeholder: "MG",
                                mask: /^[A-Za-z]{0,2}$/,
                                autoComplete: false,
                                required: true,
                            },
                        ]}
                        onSubmit={handleCreateCliente}
                    />
                )
            });
            modalControl.current.setModalOpen(true);
        }
    };

    const handleOpenViewModal = (row) => {
        console.log(row);
        if (modalControl.current) {
            modalControl.current.setModalContent({
                title: "Detalhes do cliente",
                body: (
                    <div className="space-y-6">

                        {/* Card geral */}
                        <div
                            className="rounded-2xl border border-black/10 dark:border-white/10 
                        bg-white/70 dark:bg-gray-900/80 
                        backdrop-blur-md shadow-lg p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Informações Gerais
                            </h3>

                            <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                <div className="flex justify-between">
                                    <span className="font-medium">Nome</span>
                                    <span>{row.nome}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">Telefone</span>
                                    <span>{formatPhone(row.telefone)}</span>
                                </div>

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

                        {/* Endereço */}
                        {row.endereco && (
                            <div
                                className="rounded-2xl border border-black/10 dark:border-white/10 
                            bg-white/70 dark:bg-gray-900/80 
                            backdrop-blur-md shadow-lg p-6"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Endereço
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">

                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">CEP</span>
                                        <span className="font-medium">{formatCep(row.endereco.cep)}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Logradouro</span>
                                        <span className="font-medium">{row.endereco.logradouro}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Número</span>
                                        <span className="font-medium">{row.endereco.numero}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Bairro</span>
                                        <span className="font-medium">{row.endereco.bairro}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Cidade</span>
                                        <span className="font-medium">{row.endereco.cidade}</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Estado</span>
                                        <span className="font-medium">{row.endereco.estado}</span>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>
                )
            });

            modalControl.current.setModalOpen(true);
        }
    };



    async function handleToggleStatus(cliente_id, current_status) {
        const newStatus = current_status === "Ativo" ? 0 : 1;

        try {
            const res = await fetch(`/api/clientes/${cliente_id}/status`, {
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
            getClientes();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar status do cliente!");
        }
    }

    const getClientes = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/clientes");
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
        getClientes();
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


                                    <div className="p-3 rounded-xl bg-linear-to-br from-blue-600 to-blue-400 text-white shadow-md">
                                        <svg
                                            className="shrink-0 w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 18v-1c0-2.21 3.58-4 6-4s6 1.79 6 4v1H6z" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                            Clientes
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
                                    onAddClick={handleAddCliente}
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