import jwt from "jsonwebtoken";

export function generateToken(payload) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET não está definido!");
    return jwt.sign(payload, secret, { expiresIn: "1d" });
}

export function sanitizeEmail(email) {
    return email.trim().toLowerCase();
}

export function sanitizePassword(password) {
    return password.trim();
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "O email é obrigatório!";
    if (!emailRegex.test(email)) return "Email inválido!";
    return null;
}

export function validatePassword(password) {
    if (!password) return "A senha é obrigatória!";
    if (password.length < 8)
        return "A senha deve conter pelo menos 8 caracteres!";
    if (!/[A-Z]/.test(password))
        return "A senha deve conter pelo menos uma letra maiúscula!";
    if (!/[0-9]/.test(password))
        return "A senha deve conter pelo menos um número!";
    return null;
}

export function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) return "Confirme a senha!";
    if (password !== confirmPassword) return "As senhas não coincidem!";
    return null;
}

export function validateForm({ email, password }) {
    const errors = {};

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    return errors;
}

export function validateFormPasswords({ password, confirmPassword }) {
    const errors = {};

    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

    if (passwordError) errors.password = passwordError;
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    return errors;
}