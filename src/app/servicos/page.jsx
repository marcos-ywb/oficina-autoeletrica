"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/Table";
import Form from "@/components/Form";
import ScrollStyle from "@/components/ScrollStyle";

import { toast } from "react-hot-toast";
import { formatCurrency, formatDate, formatDateTime, formatPhone, formatCep } from "@/utils/formatters";

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
    const [localRow, setLocalRow] = useState(row);

    useEffect(() => {
        setLocalRow(row);
    }, [row]);

    const [editingStatus, setEditingStatus] = useState(false);
    const [statusValue, setStatusValue] = useState(row.status ?? "");
    useEffect(() => setStatusValue(row.status ?? ""), [row.status]);

    const numberToBrazil = (num) => {
        if (num === null || num === undefined || Number.isNaN(Number(num))) return "0,00";
        const parts = Number(num).toFixed(2).split(".");
        let int = parts[0];
        const dec = parts[1];
        int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `${int},${dec}`;
    };

    const brazilToNumber = (masked) => {
        if (!masked && masked !== "0,00") return 0;
        const cleaned = String(masked).replace(/\s|R\$|\./g, "").replace(",", ".");
        const n = Number(cleaned);
        return Number.isNaN(n) ? 0 : n;
    };

    const [editingCost, setEditingCost] = useState(false);
    const [costValue, setCostValue] = useState(
        row.custo_final !== undefined && row.custo_final !== null
            ? numberToBrazil(row.custo_final)
            : "0,00"
    );

    useEffect(() => {
        setCostValue(
            row.custo_final !== undefined && row.custo_final !== null
                ? numberToBrazil(row.custo_final)
                : "0,00"
        );
    }, [row.custo_final]);

    const statusColors = {
        "Pendente": "text-yellow-300 border-yellow-500/20 bg-yellow-500/5",
        "Em andamento": "text-blue-300 border-blue-500/20 bg-blue-500/5",
        "Aguardando peças": "text-purple-300 border-purple-500/20 bg-purple-500/5",
        "Concluido": "text-green-300 border-green-500/20 bg-green-500/5",
        "Cancelado": "text-red-300 border-red-500/20 bg-red-500/5",
    };

    return (
        <div className="space-y-10">

            <Section title="Informações do Serviço">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">

                    <InfoItem label="ID" value={localRow.servico_id} />
                    <InfoItem label="Descrição" value={localRow.descricao} />

                    <InfoItem label="Orçamento" value={formatCurrency(localRow.orcamento)} />
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400 font-medium">Custo Final</span>

                        <div className="mt-1 relative h-[38px] flex items-center">
                            {!editingCost ? (
                                <button
                                    onClick={() => setEditingCost(true)}
                                    className="
                                        inline-flex items-center gap-2 px-3 py-1.5 
                                        rounded-md border text-sm font-medium cursor-pointer 
                                        transition-all duration-150 hover:bg-white/5 
                                        text-blue-300 border-blue-500/20 bg-blue-500/5
                                    "
                                >
                                    {formatCurrency(
                                        localRow.custo_final ?? brazilToNumber(costValue)
                                    )}
                                    <ChevronsUpDown size={14} className="opacity-50" />
                                </button>
                            ) : (
                                <div className="flex items-center gap-3 absolute inset-0">
                                    <IMaskInput
                                        mask={Number}
                                        scale={2}
                                        radix=","
                                        thousandsSeparator="."
                                        mapToRadix={["."]}
                                        lazy={false}
                                        value={String(costValue)}
                                        onAccept={(val) => {
                                            const n = brazilToNumber(val.includes(",") || val.includes(".") ? val : val);
                                            setCostValue(numberToBrazil(n));
                                        }}
                                        className="
                                            bg-[#141820] border border-white/10 
                                            text-gray-200 rounded-md px-3 py-1.5 text-sm
                                            focus:outline-none focus:ring-1 focus:ring-white/20 
                                            transition-all w-44
                                        "
                                    />

                                    <button
                                        onClick={async () => {
                                            try {
                                                const valorLimpo = brazilToNumber(costValue);

                                                const res = await fetch("/api/servicos/custo", {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        servico_id: localRow.servico_id,
                                                        custo_final: valorLimpo,
                                                    }),
                                                });

                                                if (!res.ok) throw new Error("Erro na resposta da API");

                                                toast.success("Custo atualizado com sucesso!");

                                                onCostUpdated(valorLimpo);
                                                setLocalRow(prev => ({ ...prev, custo_final: valorLimpo }));
                                                setCostValue(numberToBrazil(valorLimpo));

                                                setEditingCost(false);
                                            } catch (err) {
                                                console.error(err);
                                                toast.error("Erro ao atualizar custo do serviço!");
                                            }
                                        }}
                                        className="
                                            flex items-center justify-center w-8 h-8 rounded-md
                                            bg-white/10 hover:bg-green-500 transition cursor-pointer
                                        "
                                    >
                                        <Check size={18} className="text-white" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            const restore = localRow.custo_final !== undefined && localRow.custo_final !== null
                                                ? numberToBrazil(localRow.custo_final)
                                                : "0,00";
                                            setCostValue(restore);
                                            setEditingCost(false);
                                        }}
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

                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400 font-medium">Status</span>

                        <div className="mt-1 relative h-[38px] flex items-center">
                            {!editingStatus ? (
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
                                <div className="flex items-center gap-3 absolute inset-0">

                                    <select
                                        value={statusValue}
                                        onChange={(e) => {
                                            setStatusValue(e.target.value)
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

                                    <button
                                        onClick={async () => {
                                            try {
                                                const res = await fetch("/api/servicos/status", {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        servico_id: localRow.servico_id,
                                                        status: statusValue,
                                                    }),
                                                });

                                                const data = await res.json();

                                                toast.success("Status atualizado com sucesso!");

                                                onStatusUpdated(statusValue, data.data_conclusao);

                                                setLocalRow(prev => ({
                                                    ...prev,
                                                    status: statusValue,
                                                    data_conclusao: data.data_conclusao
                                                }));

                                                setEditingStatus(false);
                                            } catch (err) {
                                                console.error(err);
                                                toast.error("Erro ao atualizar status!");
                                            }
                                        }}
                                        className="
                                            flex items-center justify-center w-8 h-8 rounded-md
                                            bg-white/10 hover:bg-green-500 transition cursor-pointer
                                        "
                                    >
                                        <Check size={18} className="text-white" />
                                    </button>

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

                    <InfoItem label="Entrada" value={formatDate(localRow.data_entrada)} />
                    <InfoItem
                        label="Conclusão"
                        value={
                            localRow.data_conclusao ? (
                                <span
                                    className={
                                        localRow.status === "Concluido"
                                            ? "text-green-300"
                                            : localRow.status === "Cancelado"
                                                ? "text-red-300"
                                                : "text-gray-300"
                                    }
                                >
                                    {formatDate(localRow.data_conclusao)}
                                </span>
                            ) : (
                                "—"
                            )
                        }
                    />
                    {/*<InfoItem label="Última atualização" value={formatDateTime(localRow.atualizado_em)} />*/}
                </div>
            </Section>

            <Section title="Veículo">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                    <InfoItem label="Marca" value={localRow.marca} />
                    <InfoItem label="Modelo" value={localRow.modelo} />
                    <InfoItem label="Ano" value={localRow.ano} />
                    <InfoItem label="Placa" value={localRow.placa} />
                </div>
            </Section>

            <Section title="Cliente">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                    <InfoItem label="Nome" value={localRow.cliente_nome} />
                    <InfoItem label="Telefone" value={formatPhone(localRow.cliente_telefone)} />
                    <InfoItem label="CEP" value={formatCep(localRow.cep)} />
                    <InfoItem label="Logradouro" value={localRow.logradouro} />
                    <InfoItem label="Número" value={localRow.numero} />
                    <InfoItem label="Bairro" value={localRow.bairro} />
                    <InfoItem label="Cidade" value={localRow.cidade} />
                    <InfoItem label="Estado" value={localRow.estado} />
                </div>
            </Section>

            <Section title="Funcionário Responsável">
                <InfoItem label="Nome" value={localRow.funcionario_nome} />
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
            onClick: async (row, modal) => {
                console.log("EDITANDO:", row);

                // 1. Seta o cliente ANTES de carregar os veículos
                setSelectedCliente(row.cliente_ref);

                // 2. Carrega os veículos do cliente
                setLoadingVeiculos(true);

                const veiculos = await fetch(`/api/veiculos?cliente_id=${row.cliente_ref}`)
                    .then(res => res.json());

                const listaVeiculos = veiculos.map(v => ({
                    value: v.veiculo_id,
                    label: `${v.marca} ${v.modelo} (${v.placa})`,
                }));

                setVeiculosCliente(listaVeiculos);
                setLoadingVeiculos(false);

                // 3. ABRE O MODAL SOMENTE DEPOIS DE TUDO ACIMA
                modal.setModalContent({
                    title: "Editar veículo e cliente",
                    body: (
                        <Form
                            mode="edit"
                            initialData={{
                                cliente_id: row.cliente_ref,
                                veiculo_id: row.veiculo_ref, // <--- ISSO AQUI
                                descricao: row.descricao,
                                orcamento: row.orcamento,
                                data_entrada: row.data_entrada?.split("T")[0],
                            }}

                            fields={[

                                {
                                    name: "cliente_id",
                                    label: "Cliente",
                                    type: "search-select",
                                    required: true,
                                    options: clientes
                                        .filter(c => c.ativo === 1)
                                        .map(c => ({
                                            value: c.cliente_id,
                                            label: c.nome
                                        })),
                                    onChange: async (value) => {
                                        setSelectedCliente(value);
                                        setLoadingVeiculos(true);

                                        const veic = await fetch(`/api/veiculos?cliente_id=${value}`)
                                            .then(res => res.json());

                                        setVeiculosCliente(
                                            veic.map(v => ({
                                                value: v.veiculo_id,
                                                label: `${v.marca} ${v.modelo} (${v.placa})`
                                            }))
                                        );
                                        setLoadingVeiculos(false);
                                    }
                                },

                                {
                                    name: "veiculo_id",
                                    label: "Veículo",
                                    type: "search-select",
                                    required: true,
                                    disabled: !selectedCliente,
                                    loading: loadingVeiculos,
                                    options: listaVeiculos, // <--- USAR A LISTA JÁ CARREGADA
                                },

                                { name: "descricao", label: "Descrição", type: "textarea", required: true },
                                {
                                    name: "orcamento",
                                    label: "Orçamento",
                                    type: "mask",
                                    required: true,
                                    imask: {
                                        mask: Number,
                                        scale: 2,
                                        thousandsSeparator: ".",
                                        padFractionalZeros: true,
                                        normalizeZeros: true,
                                        radix: ",",
                                        mapToRadix: ["."],
                                        min: 0,
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
                            ]}
                        />
                    ),
                });

                modal.setModalOpen(true);
            },
        }

    ];

    const handleUpdateCost = (id, cost) => {
        setData(prev =>
            prev.map(s =>
                s.servico_id === id
                    ? { ...s, custo_final: cost }
                    : s
            )
        );
    };

    const handleUpdateStatus = (id, newStatus, dataConclusao) => {
        setData(prev =>
            prev.map(s =>
                s.servico_id === id
                    ? { ...s, status: newStatus, data_conclusao: dataConclusao }
                    : s
            )
        );
    };

    const handleOpenViewModal = (row) => {
        if (!modalControl.current) return;

        modalControl.current.setModalContent({
            title: "Detalhes do serviço",
            size: "xlarge",
            body: (
                <ServiceDetailsModal
                    row={row}
                    onStatusUpdated={(newStatus, dataConclusao) => {
                        handleUpdateStatus(row.servico_id, newStatus, dataConclusao);
                    }}
                    onCostUpdated={(newCost) => {
                        handleUpdateCost(row.servico_id, newCost);
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

    const filters = [
        {
            key: "status",
            label: "Status",
            options: [
                { label: "Todos", value: "" },
                { label: "Pendente", value: "Pendente" },
                { label: "Em andamento", value: "Em andamento" },
                { label: "Aguardando peças", value: "Aguardando peças" },
                { label: "Concluido", value: "Concluido" },
                { label: "Cancelado", value: "Cancelado" },

            ]
        }
    ]

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
                                    /*
                                    filters={filters}
                                    defaultFilters={{
                                        status: "",
                                    }}
                                    */
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
