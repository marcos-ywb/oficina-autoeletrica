"use client";

import React, { useEffect, useState, useRef } from "react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/Table";
import Form from "@/components/Form";
import ScrollStyle from "@/components/ScrollStyle";

import { toast } from "react-hot-toast";
import { formatDate, formatPhone } from "@/utils/formatters";

import FlowbiteInit from "../FlowbiteInit";

export default function Veiculos() {
    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.style.overflow = "auto";
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const [loading, setLoading] = useState(false);
    const modalControl = useRef(null);
    const [data, setData] = useState([]);
    const [clientes, setClientes] = useState([]);
    const columns = [
        { key: "veiculo_id", label: "ID" },
        { key: "cliente", label: "Cliente", format: (c) => c.nome },
        { key: "marca", label: "Marca" },
        { key: "modelo", label: "Modelo" },
        { key: "ano", label: "Ano" },
        { key: "placa", label: "Placa" },
        { key: "criado_em", label: "Criação", format: (value) => formatDate(value) },
    ];
    const actions = [
        {
            label: "Editar",
            onClick: (row, modal) => {
                console.log("Clicou em:", row);
                modal.setModalContent({
                    title: "Editar veículo e cliente",
                    body: (
                        <Form
                            mode="edit"
                            initialData={{
                                ...row,
                                cliente_nome: row.cliente?.nome || "",
                                cliente_telefone: row.cliente?.telefone || "",
                                cliente_ativo: row.cliente?.ativo || true,
                            }}
                            fields={[
                                // Dados do veículo
                                {
                                    name: "marca",
                                    label: "Marca",
                                    type: "text",
                                    placeholder: "Fiat",
                                    autoComplete: false
                                },
                                {
                                    name: "modelo",
                                    label: "Modelo",
                                    type: "text",
                                    placeholder: "Palio",
                                    autoComplete: false
                                },
                                {
                                    name: "ano",
                                    label: "Ano",
                                    type: "text",
                                    placeholder: "2020",
                                    autoComplete: false
                                },
                                {
                                    name: "placa",
                                    label: "Placa",
                                    type: "text",
                                    placeholder: "ABC-1234",
                                    autoComplete: false
                                },
                                // Dados do cliente
                                {
                                    name: "cliente_nome",
                                    label: "Nome do Cliente",
                                    type: "text",
                                    placeholder: "Marcos Mello",
                                    autoComplete: false
                                },
                                {
                                    name: "cliente_telefone",
                                    label: "Telefone do Cliente",
                                    type: "text",
                                    placeholder: "(00) 00000-0000",
                                    mask: "(00) 00000-0000",
                                    autoComplete: false,
                                },
                            ]}
                        /*
                        onSubmit={async (formData) => {
                            try {
                                // Atualiza veículo
                                await fetch(`/api/veiculos/${row.veiculo_id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        marca: formData.marca,
                                        modelo: formData.modelo,
                                        ano: formData.ano,
                                        placa: formData.placa
                                    })
                                });

                                // Atualiza cliente
                                await fetch(`/api/clientes/${row.cliente_ref}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        nome: formData.cliente_nome,
                                        telefone: formData.cliente_telefone,
                                        ativo: formData.cliente_ativo
                                    })
                                });

                                toast.success("Veículo e cliente atualizados com sucesso!");
                                await getVeiculos();

                                if (modalControl.current) {
                                    modalControl.current.setModalOpen(false);
                                }

                            } catch (err) {
                                console.error(err);
                                toast.error("Erro ao atualizar veículo ou cliente.");
                            }
                        }}
                        */
                        />
                    ),
                });
                modal.setModalOpen(true);
            },
        }

    ];

    useEffect(() => {
        console.log(data);
    }, [data]);

    /*
    const filters = [];
    */

    const handleModalControl = (control) => {
        modalControl.current = control;
    };

    const handleCreateVeiculo = async (formData) => {
        try {
            const payload = {
                cliente_id: Number(formData.cliente_id),
                marca: formData.marca.trim(),
                modelo: formData.modelo.trim(),
                ano: formData.ano,
                placa: formData.placa.trim(),
            };

            const res = await fetch("/api/veiculos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erro ao criar veículo");
                return;
            }

            toast.success("Veículo criado com sucesso!");

            await getVeiculos();

            if (modalControl.current) {
                modalControl.current.setModalOpen(false);
            }

        } catch (err) {
            console.error("Erro ao enviar veículo:", err);
            toast.error("Erro ao conectar com o servidor.");
        }
    };

    const handleAddVeiculo = () => {
        if (modalControl.current) {
            modalControl.current.setModalContent({
                title: "Adicionar veículo",
                body: (
                    <Form
                        mode="add"
                        initialData={{ cliente_id: "", marca: "", modelo: "", ano: "", placa: "" }}
                        fields={[
                            {
                                name: "cliente_id",
                                label: "Cliente",
                                type: "search-select",
                                placeholder: "Buscar cliente...",
                                required: true,
                                options: clientes.map(c => ({
                                    value: c.cliente_id,
                                    label: c.nome
                                }))
                            },
                            { name: "marca", label: "Marca", type: "text", placeholder: "Fiat" },
                            { name: "modelo", label: "Modelo", type: "text", placeholder: "Palio" },
                            { name: "ano", label: "Ano", type: "text", placeholder: "2020" },
                            { name: "placa", label: "Placa", type: "text", placeholder: "ABC-1234" },
                        ]}
                        onSubmit={handleCreateVeiculo}
                    />
                )
            });
            modalControl.current.setModalOpen(true);
        }
    };

    const handleOpenViewVeiculo = (row) => {
        if (modalControl.current) {
            modalControl.current.setModalContent({
                title: "Detalhes do veículo",
                body: (
                    <div className="space-y-6">

                        {/* Card geral */}
                        <div
                            className="rounded-2xl border border-black/10 dark:border-white/10 
                        bg-white/70 dark:bg-gray-900/80 
                        backdrop-blur-md shadow-lg p-6"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Informações do Veículo
                            </h3>

                            <div className="space-y-3 text-gray-700 dark:text-gray-300">

                                <div className="flex justify-between">
                                    <span className="font-medium">Marca</span>
                                    <span>{row.marca}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">Modelo</span>
                                    <span>{row.modelo}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">Ano</span>
                                    <span>{row.ano}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">Placa</span>
                                    <span>{row.placa}</span>
                                </div>

                            </div>
                        </div>

                        {/* Dados do Cliente */}
                        {row.cliente && (
                            <div
                                className="rounded-2xl border border-black/10 dark:border-white/10 
                            bg-white/70 dark:bg-gray-900/80 
                            backdrop-blur-md shadow-lg p-6"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Cliente Responsável
                                </h3>

                                <div className="space-y-3 text-gray-700 dark:text-gray-300">

                                    <div className="flex justify-between">
                                        <span className="font-medium">Nome</span>
                                        <span>{row.cliente.nome}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="font-medium">Telefone</span>
                                        <span>{formatPhone(row.cliente.telefone)}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Status</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold 
                                        ${row.cliente.ativo
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                                }`}
                                        >
                                            {row.cliente.ativo ? "Ativo" : "Inativo"}
                                        </span>
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


    const getVeiculos = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/veiculos");
            const rawData = await res.json();

            const mappedData = rawData.map(v => ({
                veiculo_id: v.veiculo_id,
                cliente_ref: v.cliente_id,
                marca: v.marca,
                modelo: v.modelo,
                ano: v.ano,
                placa: v.placa,
                criado_em: v.criado_em,
                cliente: {
                    nome: v.cliente.nome,
                    telefone: v.cliente.telefone,
                    ativo: v.cliente.ativo,
                }
            }));

            setData(mappedData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getClientes = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/clientes");
            const data = await res.json();

            setClientes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVeiculos();
        getClientes();
    }, [])

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


                                    <div className="p-3 rounded-xl bg-linear-to-br from-purple-600 to-indigo-500 text-white shadow-md">
                                        <svg
                                            className="shrink-0 w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M3 13l1.5-4.5A3 3 0 0 1 7.3 6h9.4a3 3 0 0 1 2.8 2.5L21 13v6a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-6zm3.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM6.2 12h11.6l-1.1-3.3a1 1 0 0 0-1-.7H8.3a1 1 0 0 0-1 .7L6.2 12z" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                            Veículos
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
                                    onAddClick={handleAddVeiculo}
                                    openViewModal={handleOpenViewVeiculo}
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