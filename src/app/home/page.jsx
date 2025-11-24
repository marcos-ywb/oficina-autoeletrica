"use client";

import React, { useEffect, useState } from "react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import DataGrid from "@/components/DataGrid";
import Card from "@/components/Card";
import Modal from "@/components/Modal";

import FlowbiteInit from "../FlowbiteInit";

const agendamentos = [
    { id: 1, cliente: "Carlos Silva", servico: "Troca de bateria", data: "2025-10-22", horario: "10:00", status: "confirmado" },
    { id: 2, cliente: "Mariana Oliveira", servico: "Alinhamento elétrico", data: "2025-10-22", horario: "10:30", status: "confirmado" },
    { id: 3, cliente: "João Santos", servico: "Troca de farol", data: "2025-10-22", horario: "11:00", status: "pendente" },
    { id: 4, cliente: "Ana Oliveira", servico: "Reparo no alternador", data: "2025-10-22", horario: "11:30", status: "cancelado" },
    { id: 5, cliente: "Pedro Santos", servico: "Revisão elétrica completa", data: "2025-10-22", horario: "12:00", status: "confirmado" },
    { id: 6, cliente: "Maria Silva", servico: "Troca de fusível", data: "2025-10-22", horario: "12:30", status: "pendente" },
    { id: 7, cliente: "Lucas Oliveira", servico: "Instalação de sensor", data: "2025-10-22", horario: "13:00", status: "pendente" },
    { id: 8, cliente: "Fernanda Santos", servico: "Reparo de chicote elétrico", data: "2025-10-22", horario: "13:30", status: "pendente" },
    { id: 9, cliente: "Rafael Silva", servico: "Troca de luz interna", data: "2025-10-22", horario: "14:00", status: "pendente" },
    { id: 10, cliente: "Isabela Oliveira", servico: "Manutenção de painel", data: "2025-10-22", horario: "14:30", status: "cancelado" },
    { id: 11, cliente: "Luiz Santos", servico: "Troca de buzina", data: "2025-10-22", horario: "15:00", status: "pendente" },
    { id: 12, cliente: "Camila Oliveira", servico: "Reparo de central elétrica", data: "2025-10-22", horario: "15:30", status: "cancelado" },
    { id: 13, cliente: "Ricardo Silva", servico: "Teste de bateria", data: "2025-10-22", horario: "16:00", status: "cancelado" },
    { id: 14, cliente: "Larissa Oliveira", servico: "Instalação de faróis LED", data: "2025-10-22", horario: "16:30", status: "pendente" },
    { id: 15, cliente: "Gustavo Santos", servico: "Reparo de limpador de para-brisa", data: "2025-10-22", horario: "17:00", status: "pendente" },
    { id: 16, cliente: "Patricia Oliveira", servico: "Troca de bateria", data: "2025-10-22", horario: "17:30", status: "cancelado" },
    { id: 17, cliente: "Gustavo Santos", servico: "Alinhamento elétrico", data: "2025-10-22", horario: "18:00", status: "pendente" },
    { id: 18, cliente: "Patricia Oliveira", servico: "Reparo de farol", data: "2025-10-22", horario: "18:30", status: "confirmado" },
    { id: 19, cliente: "Gustavo Santos", servico: "Revisão elétrica completa", data: "2025-10-22", horario: "19:00", status: "pendente" },
    { id: 20, cliente: "Patricia Oliveira", servico: "Troca de fusível", data: "2025-10-22", horario: "19:30", status: "pendente" },
];

const resumo = [
    { title: "Agendamentos do dia", value: 8 },
    { title: "Finalizados", value: 5 },
    { title: "Cancelados", value: 2 },
];

export default function Home() {
    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.style.overflow = "auto";
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", body: null });

    const handleFinalizar = (item) => {
        setModalContent({
            title: (
                <span>
                    <span className="text-green-400">Finalizar agendamento!</span>
                </span>
            ),
            body: (
                <div className="text-center">
                    <svg
                        className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <circle
                            cx="10"
                            cy="10"
                            r="9"
                            stroke="currentColor"
                            strokeWidth={2}
                        />
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 10l3 3 5-5"
                        />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Tem certeza que deseja concluir o agendamento de {item.cliente}?</h3>
                    <button type="button" className="cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center">
                        Sim, concluir!
                    </button>
                </div>
            ),
            size: "normal",
        });
        setModalOpen(true);
    };

    const handleCancelar = (item) => {
        setModalContent({
            title: (
                <span>
                    <span className="text-red-500">Cancelar agendamento!</span>
                </span>
            ),
            body: (
                <div className="text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Tem certeza que deseja cancelar o agendamento de {item.cliente}?</h3>
                    <button type="button" className="cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center">
                        Sim, cancelar!
                    </button>
                </div>
            ),
            size: "normal",
        });
        setModalOpen(true);
    };

    const handleCardClick = (item) => {
        setModalContent({
            title: (
                <span>{item.title}</span>
            ),
            body: (
                <div>Teste</div>
            ),
            size: "xlarge",
        });
        setModalOpen(true);
    };

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


                                    <div className="p-3 rounded-xl bg-linear-to-br from-indigo-600 to-blue-500 text-white shadow-md">
                                        <svg
                                            className="shrink-0 w-5 h-5"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10.707 1.293a1 1 0 0 0-1.414 0l-8 8A1 1 0 0 0 2 11h1v7a1 1 0 0 0 1 1h5v-5h4v5h5a1 1 0 0 0 1-1v-7h1a1 1 0 0 0 .707-1.707l-8-8Z" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                            Home
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

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 cursor-pointer">
                                    {resumo.map((item, index) => (
                                        <Card
                                            key={index}
                                            data={item}
                                            onClick={handleCardClick}
                                        />
                                    ))}
                                </div>

                                <DataGrid
                                    title="Agendamentos do Dia"
                                    data={agendamentos}
                                    filters={{ search: true, status: true }}
                                    actions={[
                                        { label: "Finalizar", color: "green", onClick: handleFinalizar },
                                        { label: "Cancelar", color: "red", onClick: handleCancelar },
                                    ]}
                                /*onCardClick={handleCardClick}*/
                                />
                            </div>



                        </section>
                    </div>
                </div>
            </main>
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalContent.title}
                size={modalContent.size}
            >
                {modalContent.body}
            </Modal>
        </div>
    );
}