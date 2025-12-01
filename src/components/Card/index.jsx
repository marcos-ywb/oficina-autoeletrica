import { formatCurrency } from "@/utils/formatters";

export default function Card({
    data,
    actions = [],
    onClick
}) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] h-full border-l-4 
                ${data.status === "Pendente"
                    ? "border-yellow-400"
                    : data.status === "Em andamento"
                        ? "border-blue-400"
                        : data.status === "Aguardando peças"
                            ? "border-purple-400"
                            : data.status === "Concluido"
                                ? "border-green-400"
                                : data.status === "Cancelado"
                                    ? "border-red-400"
                                    : "border-gray-400"}`}

            onClick={() => onClick && onClick(data)}
        >
            <div className="flex flex-col gap-1">

                {/* NOME, TITULO OU CLIENTE */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {data.cliente || data.nome || data.title || "Sem título"}
                </h3>

                {/* VALOR, SERVICO OU DESCRICAO */}
                {data.servico && (
                    <p className="text-sm text-gray-500 dark:text-gray 300">
                        {data.servico}
                    </p>
                )}

                {data.value !== undefined && data.value !== null && !data.servico && (
                    <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        {data.value}
                    </p>
                )}


                {data.preco && (
                    <p className="text-sm text-gray-500 dark:text-gray 300">
                        {formatCurrency(data.preco)}
                    </p>
                )}

                {data.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {data.description}
                    </p>
                )}

                {/* DATA E HORÁRIO */}
                {data.horario && (
                    <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                        {data.horario} - {data.data}
                    </p>
                )}
            </div>

            {actions.length > 0 && (
                <div className="flex gap-2 mt-4">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(data);
                            }}
                            className={`cursor-pointer flex-1 flex items-center justify-center gap-1 py-2 text-sm font-semibold rounded-xl text-white shadow-sm hover:shadow-md active:scale-95 transition-transform duration-150 ${action.color === "red"
                                ? "bg-red-500 hover:bg-red-600"
                                : action.color === "green"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : action.color === "blue"
                                        ? "bg-blue-500 hover:bg-blue-600"
                                        : "bg-gray-500 hover:bg-gray-600"
                                }`}
                        >
                            {action.icon && <span>{action.icon}</span>}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}