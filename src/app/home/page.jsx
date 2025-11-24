"use client";

import React, { useEffect } from "react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import FlowbiteInit from "../FlowbiteInit";

export default function Home() {
    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.style.overflow = "auto";
        }, 100);
        return () => clearTimeout(timer);
    }, []);

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



                            {/* CONTENT */}

                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}