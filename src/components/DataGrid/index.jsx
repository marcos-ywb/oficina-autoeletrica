"use client";
import React, { useState } from "react";
import Card from "../Card";

import { Dropdown } from "flowbite";

export default function DataGrid({
    title = "",
    data = [],
    filters = { search: false, status: false },
    actions = [],
    onCardClick = null,
}) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Filtros
    const filteredData = data.filter((item) => {
        const matchesSearch = !filters.search || Object.values(item).some((value) => String(value).toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = !filters.status || statusFilter === "" || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Paginação
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentCards = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleStatusFilter = (status, dropdownID, buttonID) => {
        setStatusFilter(status);
        setCurrentPage(1);

        const dropdownEl = document.getElementById(dropdownID);
        const buttonEl = document.getElementById(buttonID);

        if (dropdownEl && buttonEl) {
            const dropdown = new Dropdown(dropdownEl, buttonEl);
            dropdown.hide();
        }
    };

    return (
        <section className="mb-8">
            {/* HEADER E FILTROS */}
            {data.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {title}
                        </h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                            ({data.length} {data.length === 1 ? "registro" : "registros"})
                        </span>
                    </div>

                    {/* FILTROS */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        {filters.search && (
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
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
                                    placeholder="Pesquisar..."
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2 transition-all duration-150 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        )}

                        {filters.status && (
                            <div className="relative">
                                <button
                                    id="statusFilterDropdownButton"
                                    data-dropdown-toggle="statusFilterDropdown"
                                    className="cursor-pointer flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                                    type="button"
                                >
                                    <svg
                                        className="-ml-1 mr-1.5 w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        />
                                    </svg>
                                    {
                                        statusFilter === "" ? "Todos"
                                            : statusFilter === "pendente" ? "Pendentes"
                                                : statusFilter === "confirmado" ? "Confirmados"
                                                    : statusFilter === "cancelado" ? "Cancelados"
                                                        : "Status"
                                    }
                                </button>

                                <div
                                    id="statusFilterDropdown"
                                    className="hidden absolute right-0 mt-2 z-10 w-44 bg-white rounded-lg shadow dark:bg-gray-700"
                                >
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                        {["", "pendente", "confirmado", "cancelado"].map(
                                            (status) => (
                                                <li key={status}>
                                                    <a
                                                        onClick={() => handleStatusFilter(status, "statusFilterDropdown", "statusFilterDropdownButton")}
                                                        className={`block py-2 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${statusFilter === status
                                                            ? "bg-gray-100 dark:bg-gray-600 dark:text-white"
                                                            : ""
                                                            }`}
                                                    >
                                                        {status === ""
                                                            ? "Todos"
                                                            : status.charAt(0).toUpperCase() +
                                                            status.slice(1)}
                                                    </a>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* GRID */}
            <div className="grid md:grid-cols-3 gap-6 min-h-[20vh]">



                {data.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-[50vh] text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-emoji-frown" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium">Nenhum agendamento encontrado</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Os registros aparecerão aqui quando forem adicionados.
                            </p>
                        </div>
                    </div>

                ) : currentCards.length > 0 ? (
                    currentCards.map((item, index) => (
                        <Card
                            key={index}
                            data={item}
                            actions={actions}
                            onClick={onCardClick}
                        />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center h-[20vh] text-center text-gray-500 dark:text-gray-400">
                        <p className="text-sm font-medium">Nenhum resultado encontrado!</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Tente alterar os filtros ou pesquisar outro cliente.
                        </p>
                    </div>
                )}




            </div>

            {totalPages > 1 && (
                <nav className="flex justify-center mt-6" aria-label="Page navigation">
                    <ul className="flex items-center -space-x-px h-10 text-base">
                        <li>
                            <button
                                className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <span className="sr-only">Previus</span>
                                <svg
                                    className="w-3 h-3 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 1 1 5l4 4" />
                                </svg>
                            </button>
                        </li>

                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setCurrentPage(index + 1)}
                                    aria-current={currentPage === index + 1 ? "page" : undefined}
                                    className={`flex items-center justify-center px-4 h-10 leading-tight border ${currentPage === index + 1
                                        ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                        : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}

                        <li>
                            <button
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <span className="sr-only">Next</span>
                                <svg
                                    className="w-3 h-3 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 9 4-4-4-4" />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}


        </section>
    );
}