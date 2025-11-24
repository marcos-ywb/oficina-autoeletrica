"use client";
import React, { useEffect, useState, useRef } from "react";
import { IMaskInput } from "react-imask";

export default function Form({ mode, initialData = {}, fields, onSubmit }) {
    const [formData, setFormData] = useState(initialData);
    const [autoCep, setAutoCep] = useState(mode === "add");
    const [searchValue, setSearchValue] = useState("");
    const [openDropdown, setOpenDropdown] = useState(null);

    const dropdownRef = useRef(null);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMaskChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Auto preenchimento de CEP
    useEffect(() => {
        if (!autoCep) return;
        const cep = formData.cep?.replace(/\D/g, "");

        if (cep?.length > 0 && cep.length < 8) {
            setFormData((prev) => ({
                ...prev,
                logradouro: "",
                bairro: "",
                cidade: "",
                estado: ""
            }));
            return;
        }

        if (cep?.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.erro) {
                        setFormData((prev) => ({
                            ...prev,
                            logradouro: "",
                            bairro: "",
                            cidade: "",
                            estado: ""
                        }));
                        return;
                    }

                    setFormData((prev) => ({
                        ...prev,
                        logradouro: data.logradouro || "",
                        bairro: data.bairro || "",
                        cidade: data.localidade || "",
                        estado: data.uf || ""
                    }));
                })
                .catch(() => {
                    setFormData((prev) => ({
                        ...prev,
                        logradouro: "",
                        bairro: "",
                        cidade: "",
                        estado: ""
                    }));
                });
        }
    }, [formData.cep, autoCep]);

    return (
        <form onSubmit={handleSubmit}>
            {fields.map(field => (
                <div key={field.name} className="mb-5">
                    <label
                        htmlFor={field.name}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        {field.label}
                    </label>

                    {/* ------------------------------- */}
                    {/* SELECT COM BUSCA (search-select) */}
                    {/* ------------------------------- */}
                    {field.type === "search-select" ? (
                        <div className="relative" ref={dropdownRef}>
                            <input
                                type="text"
                                placeholder={field.placeholder || "Buscar..."}
                                value={searchValue || field.options.find(o => o.value === formData[field.name])?.label || ""}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    setOpenDropdown(field.name);
                                }}
                                onFocus={() => setOpenDropdown(field.name)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                                           dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                           dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer"
                            />

                            {/* DROPDOWN */}
                            {openDropdown === field.name && (
                                <ul
                                    className="absolute mt-1 z-50 w-full max-h-48 overflow-auto rounded-lg 
                                               bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                                >
                                    {field.options
                                        .filter(option =>
                                            option.label.toLowerCase().includes(searchValue.toLowerCase())
                                        )
                                        .map(option => (
                                            <li
                                                key={option.value}
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        [field.name]: option.value
                                                    }));
                                                    setSearchValue(option.label);
                                                    setOpenDropdown(null);
                                                }}
                                                className="px-3 py-2 text-sm text-gray-900 dark:text-gray-200 
                                                           hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                            >
                                                {option.label}
                                            </li>
                                        ))}

                                    {field.options.filter(option =>
                                        option.label.toLowerCase().includes(searchValue.toLowerCase())
                                    ).length === 0 && (
                                            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                Nenhum resultado encontrado
                                            </li>
                                        )}
                                </ul>
                            )}
                        </div>
                    ) : field.type === "select" ? (
                        // SELECT NORMAL
                        <select
                            name={field.name}
                            id={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="" disabled>
                                {field.placeholder || "Selecione uma opção..."}
                            </option>

                            {field.options?.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : field.type === "radioGroup" ? (
                        // RADIO GROUP
                        <div className="space-y-2">
                            {field.options.map(option => (
                                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={field.name}
                                        value={option.value}
                                        checked={formData[field.name] === option.value}
                                        onChange={handleChange}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-900 dark:text-gray-300">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    ) : field.mask ? (
                        // INPUT COM MÁSCARA
                        <IMaskInput
                            mask={field.mask}
                            name={field.name}
                            id={field.name}
                            defaultValue={formData[field.name] || ""}
                            onAccept={(value) => {
                                if (!autoCep && mode === "edit") setAutoCep(true);
                                handleMaskChange(field.name, value);
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder={field.placeholder}
                            autoComplete={field.autoComplete === false ? "off" : "on"}
                            {...(field.required ? { required: true } : {})}
                        />
                    ) : field.type === "textarea" ? (
                        // TEXTAREA
                        <textarea
                            name={field.name}
                            id={field.name}
                            rows={field.rows || 4}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            autoComplete={field.autoComplete === false ? "off" : "on"}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            {...(field.required ? { required: true } : {})}
                        ></textarea>
                    ) : (
                        // INPUT NORMAL
                        <input
                            type={field.type}
                            name={field.name}
                            id={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder={field.placeholder}
                            autoComplete={field.autoComplete === false ? "off" : "on"}
                            {...(field.required ? { required: true } : {})}
                        />
                    )}
                </div>
            ))}

            <button
                type="submit"
                className="cursor-pointer w-full px-5 py-2.5 rounded-lg text-white 
                           bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
                           focus:ring-blue-300 font-medium text-sm text-center 
                           dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                {mode === "add" ? "Adicionar" : "Salvar"}
            </button>
        </form>
    );
}
