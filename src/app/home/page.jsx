"use client";

import React, { useEffect, useState } from "react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import DataGrid from "@/components/DataGrid";
import Card from "@/components/Card";
import Modal from "@/components/Modal";

import FlowbiteInit from "../FlowbiteInit";

import { formatCurrency, formatDate, formatPhone, formatCep, formatDateTime } from "@/utils/formatters";
import { toast } from "react-hot-toast";

const Section = ({ title, children }) => (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 
        bg-white/70 dark:bg-gray-900/80 backdrop-blur-md shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            {title}
        </h3>
        {children}
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
);

const statusColors = {
    "Pendente": "text-yellow-300 border-none bg-yellow-500/5",
    "Em andamento": "text-blue-300 border-none bg-blue-500/5",
    "Aguardando peças": "text-purple-300 border-none bg-purple-500/5",
    "Concluido": "text-green-300 border-none bg-green-500/5",
    "Cancelado": "text-red-300 border-none bg-red-500/5",
};

function ServiceViewModal({ row }) {

    return (
        <div className="space-y-10">

            <Section title="Informações do Serviço">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">

                    <InfoItem label="ID" value={row.id} />
                    <InfoItem label="Descrição" value={row.servico} />
                    <InfoItem label="Orçamento" value={formatCurrency(row.orcamento)} />
                    <InfoItem label="Custo Final" value={formatCurrency(row.custoFinal)} />
                    <InfoItem
                        label="Status"
                        value={
                            <span className={`${statusColors[row.status]}`}>
                                {row.status}
                            </span>
                        }
                    />
                    <InfoItem label="Entrada" value={formatDate(row.dataEntrada)} />

                    <InfoItem
                        label="Conclusão"
                        value={
                            row.dataConclusao ? (
                                <span
                                    className={
                                        row.status === "Concluido"
                                            ? "text-green-300"
                                            : row.status === "Cancelado"
                                                ? "text-red-300"
                                                : "text-gray-300"
                                    }
                                >
                                    {formatDate(row.dataConclusao)}
                                </span>
                            ) : (
                                "—"
                            )
                        }
                    />
                    <InfoItem label="Última atualização" value={formatDateTime(row.atualizadoEm)} />
                </div>
            </Section>

            <Section title="Veículo">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                    <InfoItem label="Marca" value={row.marca} />
                    <InfoItem label="Modelo" value={row.modelo} />
                    <InfoItem label="Ano" value={row.ano} />
                    <InfoItem label="Placa" value={row.placa} />
                </div>
            </Section>

            <Section title="Cliente">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                    <InfoItem label="Nome" value={row.cliente} />
                    <InfoItem label="Telefone" value={formatPhone(row.telefone)} />
                    <InfoItem label="CEP" value={formatCep(row.cep)} />
                    <InfoItem label="Logradouro" value={row.logradouro} />
                    <InfoItem label="Número" value={row.numero} />
                    <InfoItem label="Bairro" value={row.bairro} />
                    <InfoItem label="Cidade" value={row.cidade} />
                    <InfoItem label="Estado" value={row.estado} />
                </div>
            </Section>

            <Section title="Funcionário Responsável">
                <InfoItem label="Nome" value={row.funcionario_nome} />
            </Section>
        </div>
    );
}

function ServicoAccordion({ lista }) {
    const [openIds, setOpenIds] = React.useState([]);

    const toggleOpen = (id) => {
        setOpenIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const statusColors = {
        "Pendente": "text-yellow-300 border-yellow-500/20 bg-yellow-500/5",
        "Em andamento": "text-blue-300 border-blue-500/20 bg-blue-500/5",
        "Aguardando peças": "text-purple-300 border-purple-500/20 bg-purple-500/5",
        "Concluido": "text-green-300 border-green-500/20 bg-green-500/5",
        "Cancelado": "text-red-300 border-red-500/20 bg-red-500/5",
    };

    return (
        <div className="space-y-4">
            {lista.length > 0 ? (
                lista.map((servico) => {
                    const open = openIds.includes(servico.id);

                    return (
                        <div
                            key={servico.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
                        >
                            <button
                                onClick={() => toggleOpen(servico.id)}
                                className="w-full px-6 py-4 flex justify-between items-center text-gray-800 dark:text-gray-100 font-medium focus:outline-none cursor-pointer"
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                                    <span className="text-lg">{servico.servico}</span>
                                    <span
                                        className={`px-2 py-1 text-sm rounded-full font-semibold ${statusColors[servico.status]}`}
                                    >
                                        {servico.status}
                                    </span>
                                </div>
                                <span className={`transform transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                                    ▼
                                </span>
                            </button>

                            <div
                                className={`px-6 pt-0 pb-4 text-gray-700 dark:text-gray-300 transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                    <div>
                                        <strong>Cliente:</strong> {servico.cliente}
                                    </div>
                                    <div>
                                        <strong>Telefone:</strong> {formatPhone(servico.telefone)}
                                    </div>
                                    <div>
                                        <strong>Veículo:</strong> {servico.veiculo} ({servico.placa})
                                    </div>
                                    <div>
                                        <strong>Orçamento:</strong> {formatCurrency(servico.orcamento)}
                                    </div>
                                    <div>
                                        <strong>Data Entrada:</strong>{" "}
                                        {formatDate(servico.dataEntrada)}
                                    </div>
                                    {servico.dataConclusao && (
                                        <div>
                                            <strong>Data Conclusão:</strong>{" "}
                                            {new Date(servico.dataConclusao).toLocaleDateString()}
                                        </div>
                                    )}
                                    <div>
                                        <strong>Funcionário:</strong> {servico.funcionario_nome}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-300 italic">Nenhum serviço encontrado!</div>
                </div>
            )}
        </div>
    );
}


export default function Home() {
    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.style.overflow = "auto";
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", body: null });

    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
        getServicos();
    }, []);
    async function getServicos() {
        const res = await fetch("/api/servicos");
        const data = await res.json();
        const normalizados = data.map(item => ({
            id: item.servico_id,
            cliente: item.cliente_nome,
            telefone: item.cliente_telefone,
            servico: item.descricao,
            status: item.status,
            dataEntrada: item.data_entrada,
            dataConclusao: item.data_conclusao,
            veiculo: `${item.marca} ${item.modelo}`,
            marca: item.marca,
            modelo: item.modelo,
            ano: item.ano,
            placa: item.placa,
            orcamento: item.orcamento,
            custoFinal: item.custo_final,
            atualizadoEm: item.atualizado_em,
            cep: item.cep,
            logradouro: item.logradouro,
            numero: item.numero,
            bairro: item.bairro,
            cidade: item.cidade,
            estado: item.estado,
            funcionario_nome: item.funcionario_nome
        }));

        setAgendamentos(normalizados);
    };

    function gerarResumo(servicos, statusColors) {
        const resumo = Object.keys(statusColors).reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {});

        servicos.forEach(servico => {
            if (resumo[servico.status] !== undefined) {
                resumo[servico.status]++;
            }
        });

        return Object.entries(resumo).map(([status, value]) => ({
            title: `Serviços ${status.toLowerCase()}`,
            value
        }));
    }

    const resumoDinamico = gerarResumo(agendamentos, statusColors);

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
                    <button
                        type="button"
                        className="cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center"
                        onClick={() => updateStatus(item.id, "Concluido")}
                    >
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
                    <button
                        type="button"
                        className="cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center"
                        onClick={() => updateStatus(item.id, "Cancelado")}
                    >
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
                <span>
                    <span className="text-blue-400">Visualizar agendamento!</span>
                </span>
            ),
            body: (
                <ServiceViewModal row={item} />
            ),
            size: "xlarge",
        });
        setModalOpen(true);
    };

    const statusMap = {
        "Serviços pendente": "Pendente",
        "Serviços em andamento": "Em andamento",
        "Serviços aguardando peças": "Aguardando peças",
        "Serviços concluido": "Concluido",
        "Serviços cancelado": "Cancelado",
    };

    const handleViewList = (item) => {
        const statusFiltrar = statusMap[item.title];
        const lista = agendamentos.filter(
            (agendamento) => agendamento.status === statusFiltrar
        );

        setModalContent({
            title: (
                <span>
                    <span className="text-blue-400">{item.title}!</span>
                </span>
            ),
            body: <ServicoAccordion lista={lista} />,
            size: "large",
        });

        setModalOpen(true);
    };

    const updateStatus = async (servico_id, novoStatus) => {
        try {
            const res = await fetch("/api/servicos/status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ servico_id, status: novoStatus }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erro ao atualizar status");
                return;
            }

            toast.success(data.message || "Status atualizado com sucesso!");

            setAgendamentos((prev) =>
                prev.map((agendamento) =>
                    agendamento.id === servico_id
                        ? { ...agendamento, status: novoStatus, dataConclusao: data.data_conclusao }
                        : agendamento
                )
            );

            setModalOpen(false);
        } catch (err) {
            console.error("Erro ao atualizar o status:", err);
            toast.error("Erro ao atualizar o status!");
        }
    }

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

                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6 cursor-pointer">
                                    {resumoDinamico.map((item, index) => (
                                        <Card
                                            key={index}
                                            data={item}
                                            onClick={handleViewList}
                                        />
                                    ))}
                                </div>

                                <DataGrid
                                    title="Registros de serviços"
                                    data={agendamentos}
                                    filters={{ search: true }}
                                    actions={(item) => {
                                        const buttons = [];
                                        if (item.status !== "Concluido") {
                                            buttons.push({ label: "Concluir", color: "green", onClick: () => handleFinalizar(item) });
                                        }
                                        if (item.status !== "Cancelado") {
                                            buttons.push({ label: "Cancelar", color: "red", onClick: () => handleCancelar(item) });
                                        }
                                        return buttons;
                                    }}
                                    onCardClick={handleCardClick}
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