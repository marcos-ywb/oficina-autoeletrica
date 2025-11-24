"use client";
import { useState, useMemo, useEffect } from "react";
import Modal from "../Modal";

import { initFlowbite } from "flowbite";
import { Dropdown } from "flowbite";

export default function Table({
    columns = [],
    data = [],
    actions = [],
    filters = [],
    defaultFilters = {},
    onModalControl = () => { },
    onAddClick = () => { },
    openViewModal = () => { },
}) {
    const [filterValues, setFilterValues] = useState(() => {
        const initial = {};
        filters.forEach((f) => {
            initial[f.key] = [defaultFilters[f.key]];
        });
        return initial;
    });

    const handleOptionToggle = (filterKey, optionValue, onChange) => {
        let currentValues = filterValues[filterKey] || [];

        // Como só há uma opção por vez (Ativos ou Inativos), seleciona diretamente
        if (currentValues.includes(optionValue)) {
            // Evita deixar sem nada (sempre deve ter 1 selecionado)
            return;
        } else {
            currentValues = [optionValue];
        }

        setFilterValues({ ...filterValues, [filterKey]: currentValues });
        if (onChange) onChange(currentValues);
    };


    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", body: null });

    useEffect(() => {
        onModalControl({ setModalOpen, setModalContent });
    }, [onModalControl, setModalOpen, setModalContent]);

    const filteredData = useMemo(() => {
        let result = data;

        if (search?.trim()) {
            result = result.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(search.toLowerCase())
                )
            );
        }

        Object.entries(filterValues).forEach(([key, values]) => {
            if (values && values.length > 0) {
                result = result.filter((item) => {
                    const itemValue = item[key];

                    // Filtro específico: ativo/inativo
                    if (key === "status" || key === "active") {
                        if (values.includes("Ativos")) return itemValue === "Ativo";
                        if (values.includes("Inativos")) return itemValue === "Inativo";
                    }

                    return values.some((v) => String(v) === String(itemValue));
                });
            }
        });

        return result;
    }, [data, search, filterValues]);


    const [page, setPage] = useState(() => {
        if (typeof window !== "undefined") {
            return Number(localStorage.getItem("tablePage")) || 1;
        }
        return 1;
    });

    const [rowsPerPage, setRowsPerPage] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("tableRowsPerPage");
            return saved ? Number(saved) : Infinity;
        }
        return Infinity;
    });

    const totalPages = rowsPerPage === Infinity ? 1 : Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = rowsPerPage === Infinity ? 0 : (page - 1) * rowsPerPage;
    const paginatedData =
        rowsPerPage === Infinity ? filteredData : filteredData.slice(startIndex, startIndex + rowsPerPage);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const goToPage = (num) => setPage(num);
    const prevPage = () => setPage((p) => Math.max(p - 1, 1));
    const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));

    const getVisiblePages = () => {
        const pages = [];
        const maxButtons = 3;

        if (totalPages <= maxButtons + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= maxButtons) {
                pages.push(1, 2, 3, "...", totalPages);
            } else if (page >= totalPages - (maxButtons - 1)) {
                pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
            }
        }
        return pages;
    };

    const showingStart = filteredData.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(startIndex + rowsPerPage, filteredData.length);

    useEffect(() => {
        localStorage.setItem("tablePage", page);
    }, [page]);

    useEffect(() => {
        localStorage.setItem("tableRowsPerPage", rowsPerPage);
    }, [rowsPerPage]);

    useEffect(() => {
        initFlowbite();
    }, [data, filteredData, page]);


    const handleRowsPerPage = (value, dropdownID, buttonID) => {
        setRowsPerPage(value);
        localStorage.setItem("tableRowsPerPage", value);
        setPage(1);

        const dropdownEl = document.getElementById(dropdownID);
        const buttonEl = document.getElementById(buttonID);

        if (dropdownEl && buttonEl) {
            const dropdown = new Dropdown(dropdownEl, buttonEl);
            dropdown.hide();
        }
    };


    const handleActionsDropdown = (dropdownID, buttonID) => {
        const dropdownEl = document.getElementById(dropdownID);
        const buttonEl = document.getElementById(buttonID);

        if (dropdownEl && buttonEl) {
            const dropdown = new Dropdown(dropdownEl, buttonEl);
            dropdown.hide();
        }
    };

    const getRowId = (row) => {
        return (
            row.id ||
            row.cliente_id ||
            row.veiculo_id ||
            row.funcionario_id ||
            row.user_id ||
            row.product_id ||
            row.uuid || // caso algum use UUID
            `row-${Math.random().toString(36).substr(2, 9)}`
        );
    };

    return (
        /*
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                */



        <section className="">
            <div className="">
                <div
                    className={`bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden ${data.length > 0 ? "" : "flex flex-col-reverse items-center justify-center min-h-[74vh] p-8"
                        }`}
                >

                    {/* INICIO DO HEADER DA TABLE (SEARCH, ADD, ACTIONS E FILTERS) */}
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        {data.length > 0 && (
                            <div className="w-full md:w-1/2">
                                <form className="flex items-center w-full">
                                    <label htmlFor="simple-search" className="sr-only">
                                        Buscar...
                                    </label>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={handleSearchChange}
                                            id="simple-search"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2 transition-all duration-150 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400"
                                            placeholder="Buscar..."
                                            required
                                        />
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* FIELD ACTIONS */}
                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 shrink-0">
                            {/* ADICIONAR */}
                            <button
                                type="button"
                                onClick={onAddClick}
                                className="cursor-pointer flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none"
                            >
                                <svg
                                    className="h-3.5 w-3.5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    />
                                </svg>
                                Criar
                            </button>

                            {data.length > 0 && (
                                <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-3 items-stretch md:items-center">

                                    {/* FILTRO */}
                                    {filters.length > 0 && (
                                        <div className="relative w-full md:w-auto">
                                            <button
                                                id="filterDropdownButton"
                                                data-dropdown-toggle="filterDropdown"
                                                className="cursor-pointer w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                                type="button"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                    className="h-4 w-4 mr-2 text-gray-400"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Filtro
                                                <svg
                                                    className="-mr-1 ml-1.5 w-5 h-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        clipRule="evenodd"
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    />
                                                </svg>
                                            </button>

                                            <div
                                                id="filterDropdown"
                                                className="z-10 hidden w-full md:w-64 p-3 bg-white rounded-lg shadow dark:bg-gray-700 absolute md:absolute right-0 top-10 md:top-8"
                                            >
                                                {filters.map((filter) => (
                                                    <div key={filter.key} className="mb-4">
                                                        <h6 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                            {filter.label}
                                                        </h6>
                                                        <ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                                                            {filter.options.map((option, idx) => {
                                                                const checked = (filterValues[filter.key] || []).includes(option.value);
                                                                return (
                                                                    <li key={idx} className="flex items-center">
                                                                        <input
                                                                            id={`${filter.key}-${idx}`}
                                                                            type="checkbox"
                                                                            checked={checked}
                                                                            onChange={() => handleOptionToggle(filter.key, option.value, filter.onChange)}
                                                                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`${filter.key}-${idx}`}
                                                                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                                                        >
                                                                            {option.label}
                                                                        </label>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}


                                    {/* ITENS POR PÁGINA */}
                                    <div className="relative w-full md:w-auto">


                                        <button
                                            id="itensPerPageDropdownButton"
                                            data-dropdown-toggle="itensPerPageDropdown"
                                            className="cursor-pointer flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                                            type="button"
                                        >
                                            <svg
                                                className="-ml-1 mr-1.5 w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    clipRule="evenodd"
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                />
                                            </svg>
                                            {rowsPerPage === Infinity ? "Todos" : rowsPerPage}
                                        </button>


                                        <div
                                            id="itensPerPageDropdown"
                                            className="hidden absolute right-0 mt-2 z-10 w-44 bg-white rounded-lg shadow dark:bg-gray-700"
                                        >
                                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                                {["Todos", 15, 10, 5].map((num, idx) => (
                                                    <li key={idx}>
                                                        <a
                                                            onClick={() => {
                                                                const value = num === "Todos" ? Infinity : num;
                                                                handleRowsPerPage(value, "itensPerPageDropdown", "itensPerPageDropdownButton");
                                                            }}
                                                            className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer ${rowsPerPage === (num === "Todos" ? filteredData.length : num)
                                                                ? "bg-gray-100 dark:bg-gray-600 dark:text-white"
                                                                : ""
                                                                }`}
                                                        >
                                                            {num}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* FIM DO HEADER DA TABLE (SEARCH, ADD, ACTIONS E FILTERS) */}

                    {/* INICIO DA TABELA */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            {data.length > 0 && (
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        {columns.map((col) => (
                                            <th key={col.key} className="px-4 py-3">
                                                {col.label}
                                            </th>
                                        ))}
                                        {actions.length > 0 && <th className="px-4 py-3"></th>}
                                    </tr>
                                </thead>
                            )}
                            <tbody>


                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="py-10 px-4 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="currentColor"
                                                        className="bi bi-emoji-frown"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                        <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium">Nenhum cadastro encontrado</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    Os registros aparecerão aqui quando forem adicionados.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedData.length > 0 ? (
                                    paginatedData.map((row, i) => (
                                        <tr
                                            key={i}
                                            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                            onClick={() => {
                                                openViewModal(row)
                                            }}
                                        >
                                            {
                                                columns.map((col) => (
                                                    <td key={col.key} className="px-4 py-3">
                                                        {col.format ? col.format(row[col.key]) : row[col.key]}
                                                    </td>
                                                ))
                                            }
                                            <td
                                                className="px-4 py-3 flex items-center justify-end relative"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Botão do menu */}
                                                < button
                                                    id={`dropdown-button-${getRowId(row)}`}
                                                    data-dropdown-toggle={`dropdown-${getRowId(row)}`}
                                                    className="cursor-pointer inline-flex items-center p-1.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                                    type="button"
                                                >
                                                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </button>

                                                {/* Dropdown Flowbite */}
                                                <div
                                                    id={`dropdown-${getRowId(row)}`}
                                                    className="hidden z-10 w-44 bg-white rounded-lg divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 absolute right-0 top-8"
                                                >
                                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby={`dropdown-button-${getRowId(row)}`}>
                                                        {actions.map((action, idx) => (
                                                            <li key={idx}>
                                                                <button
                                                                    onClick={() => {
                                                                        action.onClick(row, { setModalOpen, setModalContent });
                                                                        handleActionsDropdown(`dropdown-${getRowId(row)}`, `dropdown-button-${getRowId(row)}`);
                                                                    }}
                                                                    className={`cursor-pointer w-full text-left block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${action.className}`}
                                                                >
                                                                    {action.label}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="text-center py-4 text-gray-500">
                                            Nenhum resultado encontrado!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* FIM DA TABLE */}

                    {/* MODAL */}
                    {modalOpen && <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalContent.title} children={modalContent.body} />}

                    {/* PAGINAÇÃO */}
                    {
                        filteredData.length > 0 && (
                            <nav className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg space-y-3 md:space-y-0" aria-label="Table navigation">
                                {/* Left: Mostrando X de Y */}
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                    <span>Mostrando</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{showingStart}-{showingEnd}</span>
                                    <span>de</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{filteredData.length}</span>
                                </div>

                                {/* Right: Botões de navegação */}
                                <ul className="inline-flex items-center justify-end space-x-1 overflow-x-auto">
                                    {/* Botão anterior */}
                                    <li>
                                        <button
                                            onClick={prevPage}
                                            disabled={page === 1}
                                            className={`flex items-center justify-center h-8 px-3 text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors ${page === 1 ? "cursor-default" : "cursor-pointer"
                                                }`}
                                        >
                                            <span className="sr-only">Anterior</span>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </li>

                                    {/* Números de página */}
                                    {getVisiblePages().map((num, idx) =>
                                        num === "..." ? (
                                            <li key={idx}>
                                                <span className="flex items-center justify-center h-8 px-3 text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                                    ...
                                                </span>
                                            </li>
                                        ) : (
                                            <li key={idx}>
                                                <button
                                                    onClick={() => goToPage(num)}
                                                    className={`cursor-pointer flex items-center justify-center h-8 px-3 border text-sm transition-colors ${page === num
                                                        ? "z-10 text-primary-600 bg-primary-50 border-primary-300 dark:bg-gray-700 dark:text-white"
                                                        : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            </li>
                                        )
                                    )}

                                    {/* Botão próximo */}
                                    <li>
                                        <button
                                            onClick={nextPage}
                                            disabled={page === totalPages}
                                            className={`flex items-center justify-center h-8 px-3 text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors ${page === totalPages ? "cursor-default" : "cursor-pointer"
                                                }`}
                                        >
                                            <span className="sr-only">Próximo</span>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )
                    }
                    {/* FIM DA PAGINAÇÃO */}
                </div >
                {/* FIM DO CONTAINER */}
            </div >
        </section >
    );
}