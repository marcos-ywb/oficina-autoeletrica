"use client";

import React, { useEffect, useState, useRef, act } from "react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/Table";
import Form from "@/components/Form";
import ScrollStyle from "@/components/ScrollStyle";

import { toast } from "react-hot-toast";
import { formatCurrency, formatDate } from "@/utils/formatters";

import FlowbiteInit from "../FlowbiteInit";

export default function Servicos() {
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
        { key: "servico_id", label: "ID" },

        // Veículo
        { key: "marca", label: "Marca" },
        { key: "modelo", label: "Modelo" },
        { key: "placa", label: "Placa" },

        // Funcionário
        { key: "funcionario_nome", label: "Funcionário" },

        // Status e datas
        { key: "status", label: "Status" },
        { key: "data_entrada", label: "Entrada", format: (v) => formatDate(v) },
        {
            key: "data_conclusao",
            label: "Conclusão",
            format: (v) => v ? formatDate(v) : "—"
        }
    ];


    const actions = [
        {
            label: "Editar",
            onClick: (row, modal) => {
                modal.setModalContent({
                    title: "Editar veículo e cliente",
                    body: (
                        <Form
                            mode="edit"
                            initialData={row}
                            fields={[
                                "veiculo_id",
                                "funcionario_id",
                            ]}
                        />
                    ),
                });
            },
        },
    ];
    const filters = [];

    const handleModalControl = (control) => {
        modalControl.current = control;
    };

    const getServicos = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/servicos");
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
        getServicos();
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



                            <div className="lex flex-col sm:flex-row sm:items-center sm:justify-between px-8 pt-25 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h6" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                            Serviços
                                        </h1>
                                        {/* 
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                            Gerencie os serviços oferecidos, adicione novos ou edite os existentes.
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