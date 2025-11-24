"use client";

import React, { useEffect } from "react";

import Navbar from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import FlowbiteInit from "../FlowbiteInit";

export default function Servicos() {
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

                            </div>



                        </section>
                    </div>
                </div>
            </main>


        </div>
    );

}