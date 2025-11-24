import React, { useEffect, useRef } from "react";
import ScrollStyle from "../ScrollStyle";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    actions,
    size = "normal", // valores: "normal", "large", "xlarge"
}) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (!isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const sizeClasses = {
        small: "max-w-sm",
        normal: "max-w-md",
        large: "max-w-3xl",
        xlarge: "max-w-7xl",
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <ScrollStyle />
            <div
                ref={modalRef}
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full p-6 mx-4 overflow-y-auto max-h-[90vh] transition-all duration-200 ${sizeClasses[size]}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                    >
                        <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="mb-4">
                    {children}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2">
                    {actions?.map((action) => (
                        <button
                            key={action.label}
                            onClick={action.onClick}
                            className={`px-4 py-2 rounded ${action.className}`}
                        >
                            {action.label}
                        </button>
                    ))}
                    <button
                        onClick={onClose}
                        className="w-full px-5 py-2.5 rounded-lg bg-red-600 text-white dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 cursor-pointer font-medium text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}