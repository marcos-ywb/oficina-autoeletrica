"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/Table";
import Form from "@/components/Form";
import ScrollStyle from "@/components/ScrollStyle";

import { toast } from "react-hot-toast";
import { formatCurrency, formatDate, formatPhone, formatCep, clearCurrency } from "@/utils/formatters";

import FlowbiteInit from "../FlowbiteInit";
import { IMaskInput } from "react-imask";

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

function ServiceDetailsModal({ row, onStatusUpdated, onCostUpdated }) {
    const [editingStatus, setEditingStatus] = React.useState(false);
    const [statusValue, setStatusValue] = React.useState(row.status);

    const [dataConclusao, setDataConclusao] = React.useState(row.data_conclusao);

    const [editingCost, setEditingCost] = React.useState(false);
    const [costValue, setCostValue] = React.useState(
        row.custo_final?.toString() || "0"
    );

    const statusColors = {
        "Pendente": "text-yellow-300 border-yellow-500/20 bg-yellow-500/5",
        "Em andamento": "text-blue-300 border-blue-500/20 bg-blue-500/5",
        "Aguardando peças": "text-purple-300 border-purple-500/20 bg-purple-500/5",
        "Concluido": "text-green-300 border-green-500/20 bg-green-500/5",
        "Cancelado": "text-red-300 border-red-500/20 bg-red-500/5",
    };

    return (
        <div className="space-y-10">

            {/* INFORMAÇÕES DO SERVIÇO */}
            <Section title="Informações do Serviço">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">

                    <InfoItem label="ID" value={row.servico_id} />
                    <InfoItem label="Descrição" value={row.descricao} />

                    <InfoItem label="Orçamento" value={formatCurrency(row.orcamento)} />
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400 font-medium">Custo Final</span>

                        <div className="mt-1 relative h-[38px] flex items-center">
                            {!editingCost ? (
                                // --- VISUALIZAÇÃO ---
                                <button
                                    onClick={() => setEditingCost(true)}
                                    className="
                                        inline-flex items-center gap-2 px-3 py-1.5 
                                        rounded-md border text-sm font-medium cursor-pointer 
                                        transition-all duration-150 hover:bg-white/5 
                                        text-blue-300 border-blue-500/20 bg-blue-500/5
                                    "
                                >
                                    {formatCurrency(Number(costValue.replace(",", ".")))}
                                    <ChevronsUpDown size={14} className="opacity-50" />
                                </button>
                            ) : (
                                // --- EDIÇÃO ---
                                <div className="flex items-center gap-3 absolute inset-0">

                                    {/* INPUT COM IMASK */}
                                    <IMaskInput
                                        mask={Number}
                                        radix=","
                                        thousandsSeparator="."
                                        scale={2}
                                        padFractionalZeros="true"
                                        normalizeZeros="true"
                                        mapToRadix={["."]}
                                        value={costValue}
                                        onAccept={(value) => setCostValue(value)}
                                        className="
                                            bg-[#141820] border border-white/10 
                                            text-gray-200 rounded-md px-3 py-1.5 text-sm
                                            focus:outline-none focus:ring-1 focus:ring-white/20 
                                            transition-all w-44
                                        "
                                    />


                                    {/* CONFIRMAR */}
                                    <button
                                        onClick={async () => {
                                            try {
                                                await fetch("/api/servicos/update-custo", {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        servico_id: row.servico_id,
                                                        custo_final: clearCurrency(costValue),
                                                    }),
                                                });

                                                toast.success("Custo atualizado!");
                                                onCostUpdated(costValue);
                                                setEditingCost(false);
                                            } catch {
                                                toast.error("Erro ao atualizar");
                                            }
                                        }}
                                        className="
                                            flex items-center justify-center w-8 h-8 rounded-md
                                            bg-white/10 hover:bg-green-500 transition cursor-pointer
                                        "
                                    >
                                        <Check size={18} className="text-white" />
                                    </button>

                                    {/* CANCELAR */}
                                    <button
                                        onClick={() => setEditingCost(false)}
                                        className="
                                            flex items-center justify-center w-8 h-8 rounded-md
                                            bg-white/5 hover:bg-red-500 transition cursor-pointer
                                        "
                                    >
                                        <X size={18} className="text-gray-300" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* STATUS PROFISSIONAL */}
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400 font-medium">Status</span>

                        <div className="mt-1 relative h-[38px] flex items-center">
                            {!editingStatus ? (
                                // --- VISUALIZAÇÃO ---
                                <button
                                    onClick={() => setEditingStatus(true)}
                                    className={`
                                        inline-flex items-center gap-2 px-3 py-1.5 
                                        rounded-md border text-sm font-medium cursor-pointer 
                                        transition-all duration-150 hover:bg-white/5 
                                        ${statusColors[statusValue]}
                                    `}
                                >
                                    {statusValue}
                                    <ChevronsUpDown size={14} className="opacity-50" />
                                </button>
                            ) : (
                                // --- EDIÇÃO ---
                                <div className="flex items-center gap-3 absolute inset-0">

                                    {/* SELECT MODERNO */}
                                    <select
                                        value={statusValue}
                                        onChange={(e) => {
                                            setStatusValue(e.target.value)
                                            setDataConclusao(row.data_conclusao);
                                        }}
                                        className="
                                            bg-[#141820] border border-white/10 
                                            text-gray-200 rounded-md px-3 py-1.5 text-sm
                                            focus:outline-none focus:ring-1 focus:ring-white/20 
                                            transition-all w-44 appearance-none
                                        "
                                    >
                                        <option value="Pendente">Pendente</option>
                                        <option value="Em andamento">Em andamento</option>
                                        <option value="Aguardando peças">Aguardando peças</option>
                                        <option value="Concluido">Concluido</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>

                                    {/* CONFIRMAR */}
                                    <button
                                        onClick={async () => {
                                            try {
                                                await fetch("/api/servicos/status", {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        servico_id: row.servico_id,
                                                        status: statusValue,
                                                    }),
                                                });

                                                toast.success("Status atualizado!");
                                                onStatusUpdated(statusValue);
                                                setEditingStatus(false);
                                            } catch {
                                                toast.error("Erro ao atualizar");
                                            }
                                        }}
                                        className="
                                            flex items-center justify-center w-8 h-8 rounded-md
                                            bg-white/10 hover:bg-green-500 transition cursor-pointer
                                        "
                                    >
                                        <Check size={18} className="text-white" />
                                    </button>

                                    {/* CANCELAR */}
                                    <button
                                        onClick={() => setEditingStatus(false)}
                                        className="
                                            flex items-center justify-center w-8 h-8 rounded-md
                                            bg-white/5 hover:bg-red-500 transition cursor-pointer
                                        "
                                    >
                                        <X size={18} className="text-gray-300" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <InfoItem label="Entrada" value={formatDate(row.data_entrada)} />
                    <InfoItem label="Conclusão" value={row.data_conclusao ? formatDate(row.data_conclusao) : "—"} />
                </div>
            </Section>

            {/* VEÍCULO */}
            <Section title="Veículo">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                    <InfoItem label="Marca" value={row.marca} />
                    <InfoItem label="Modelo" value={row.modelo} />
                    <InfoItem label="Ano" value={row.ano} />
                    <InfoItem label="Placa" value={row.placa} />
                </div>
            </Section>

            {/* CLIENTE */}
            <Section title="Cliente">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                    <InfoItem label="Nome" value={row.cliente_nome} />
                    <InfoItem label="Telefone" value={formatPhone(row.cliente_telefone)} />
                    <InfoItem label="CEP" value={formatCep(row.cep)} />
                    <InfoItem label="Logradouro" value={row.logradouro} />
                    <InfoItem label="Número" value={row.numero} />
                    <InfoItem label="Bairro" value={row.bairro} />
                    <InfoItem label="Cidade" value={row.cidade} />
                    <InfoItem label="Estado" value={row.estado} />
                </div>
            </Section>

            {/* FUNCIONÁRIO */}
            <Section title="Funcionário Responsável">
                <InfoItem label="Nome" value={row.funcionario_nome} />
            </Section>
        </div>
    );
}


export default function Servicos() {
    const modalControl = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.style.overflow = "auto";
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const [data, setData] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [selectedCliente, setSelectedCliente] = useState(null);
    const [veiculosCliente, setVeiculosCliente] = useState([]);
    const [loadingVeiculos, setLoadingVeiculos] = useState(false);

    const columns = [
        { key: "servico_id", label: "ID" },
        { key: "cliente_nome", label: "Cliente" },

        { key: "carro", label: "Carro" },

        //{ key: "funcionario_nome", label: "Funcionário" },

        { key: "orcamento", label: "Orçamento", format: (value) => formatCurrency(value) },

        { key: "status", label: "Status" },

        { key: "data_entrada", label: "Entrada", format: formatDate },
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
                modal.setModalOpen(true);
            },
        },
        {
            label: "Atualizar",
            onClick: (row, modal) => {
                modal.setModalContent({
                    title: "Atualizar status",
                    body: (
                        <div>
                            Atualizar
                        </div>
                    ),
                    size: "large"
                });
                modal.setModalOpen(true);
            },
        },
    ];

    const handleOpenViewModal = (row) => {
        if (!modalControl.current) return;

        modalControl.current.setModalContent({
            title: "Detalhes do serviço",
            size: "xlarge",
            body: (
                <ServiceDetailsModal
                    row={{ ...row }}
                    onStatusUpdated={(newStatus) => {
                        row.status = newStatus;
                    }}
                    onCostUpdated={(newCost) => {
                        row.custo_final = newCost;
                    }}
                />
            ),
        });

        modalControl.current.setModalOpen(true);
    };

    const handleModalControl = (control) => {
        modalControl.current = control;
    };

    const getFuncionario = async () => {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();

            return data;
        } catch (err) {
            console.error("Erro ao buscar funcionário na sessão atual!");
        }
    };

    const getServicos = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/servicos");
            const data = await res.json();

            const dataTratada = data.map(item => ({
                servico_id: item.servico_id,
                descricao: item.descricao,
                orcamento: item.orcamento,
                custo_final: item.custo_final,
                data_entrada: item.data_entrada,
                data_conclusao: item.data_conclusao,
                status: item.status,
                criado_em: item.criado_em,
                atualizado_em: item.atualizado_em,
                veiculo_ref: item.veiculo_id,
                marca: item.marca,
                modelo: item.modelo,
                placa: item.placa,
                ano: item.ano,
                carro: `${item.marca} ${item.modelo} (${item.placa})`,
                cliente_ref: item.cliente_id,
                cliente_nome: item.cliente_nome,
                cliente_telefone: item.cliente_telefone,
                cliente_ativo: item.cliente_ativo,
                endereco_ref: item.endereco_id,
                cep: item.cep,
                logradouro: item.logradouro,
                numero: item.numero,
                bairro: item.bairro,
                cidade: item.cidade,
                estado: item.estado,
                funcionario_ref: item.funcionario_id,
                funcionario_nome: item.funcionario_nome
            }));

            console.log("Servicos: ", dataTratada);

            setData(dataTratada);
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

    const getVeiculosCliente = async (cliente_id) => {
        if (!cliente_id) {
            setVeiculosCliente([]);
            return;
        }

        setLoadingVeiculos(true);
        try {
            const res = await fetch(`/api/veiculos?cliente_id=${cliente_id}`);
            const data = await res.json();
            setVeiculosCliente(
                data.map(v => ({
                    value: v.veiculo_id,
                    label: `${v.marca} ${v.modelo} (${v.placa})`
                }))
            );
        } catch (err) {
            console.error("Erro ao buscar veículos:", err);
            setVeiculosCliente([]);
        } finally {
            setLoadingVeiculos(false);
        }
    };

    useEffect(() => {
        if (!selectedCliente) {
            setVeiculosCliente([]);
            return;
        }
        getVeiculosCliente(selectedCliente);
    }, [selectedCliente]);

    useEffect(() => {
        getClientes();
        getServicos();
    }, []);

    const handleCreateServico = async (formData) => {
        try {
            const funcionario = await getFuncionario();

            if (!funcionario) {
                toast.error("Funcionário não identificado na sessão!");
                return;
            }

            const payload = {
                ...formData,
                funcionario_id: funcionario.id,
            }

            const res = await fetch("/api/servicos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error);
                return;
            }

            toast.success("Serviço criado com sucesso!");

            if (modalControl.current) {
                modalControl.current.setModalOpen(false);
            }

            if (typeof getServicos === "function") {
                getServicos();
            }

        } catch (err) {
            console.error("Erro ao criar serviço!", err);
            toast.error("Erro inesperado ao criar novo serviço!");
        }
    };

    const buildFields = useCallback(() => {
        return [
            {
                name: "cliente_id",
                label: "Cliente",
                type: "search-select",
                required: true,
                placeholder: "Buscar cliente...",
                options: clientes
                    .filter(c => c.ativo === 1)
                    .map(c => ({
                        value: c.cliente_id,
                        label: c.nome
                    })),
                onChange: (value) => {
                    setSelectedCliente(value);
                }
            },
            {
                name: "veiculo_id",
                label: "Veículo",
                type: "search-select",
                required: true,
                disabled: !selectedCliente,
                loading: loadingVeiculos,
                placeholder: selectedCliente
                    ? "Selecione o veículo..."
                    : "Escolha um cliente...",
                options: veiculosCliente
            },
            {
                name: "descricao",
                label: "Descrição",
                type: "textarea",
                required: true,
                placeholder: "Descreva o serviço..."
            },
            {
                name: "orcamento",
                label: "Orçamento",
                type: "mask",
                required: true,
                placeholder: "R$ 0,00",
                imask: {
                    mask: Number,
                    scale: 2,
                    thousandsSeparator: ".",
                    padFractionalZeros: true,
                    normalizeZeros: true,
                    radix: ",",
                    mapToRadix: ["."],
                    min: 0,
                    max: 999999999,
                    prefix: "R$ ",
                    lazy: false
                }
            },
            {
                name: "data_entrada",
                label: "Data de entrada",
                type: "date",
                required: true
            }

        ];
    }, [clientes, selectedCliente, veiculosCliente, loadingVeiculos]);

    const renderAddServicoContent = useCallback(() => {
        if (!modalControl.current) return;

        modalControl.current.setModalContent({
            title: "Adicionar serviço",
            body: (
                <Form
                    mode="add"
                    initialData={{ servicoId: "" }}
                    fields={buildFields()}
                    onSubmit={handleCreateServico}
                />
            )
        });
    }, [buildFields]);






    const handleAddServico = () => {
        if (!modalControl.current) return;

        renderAddServicoContent();
        modalControl.current.setModalOpen(true);
        setModalOpen(true);
    };

    useEffect(() => {
        if (!modalOpen) return;
        renderAddServicoContent();
    }, [modalOpen, selectedCliente, veiculosCliente, loadingVeiculos, clientes, renderAddServicoContent]);

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
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 mb-10">
                                <Table
                                    columns={columns}
                                    data={data}
                                    actions={actions}
                                    onModalControl={handleModalControl}
                                    onAddClick={handleAddServico}

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