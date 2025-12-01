export const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("pt-BR");
};

export const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString("pt-BR");
}

export const formatPhone = (phone) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11)
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    if (cleaned.length === 10)
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    return phone;
};

export const formatCep = (cep) => {
    if (!cep) return "-";
    const cleaned = cep.replace(/\D/g, "");
    if (cleaned.length === 8)
        return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
    return cep;
};

export const formatCurrency = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "-";
    return num.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

export const clearCurrency = (value) => {
    if (!value) return 0;

    value = value.replace(/[R$\s]/g, "");
    value = value.replace(/\./g, "");
    value = value.replace(/,/g, ".");

    return Number(value);
};