const V = {
    required: v => !!(v && v.trim()),
    email: e => /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(e),
    cnpj: c => {
        c = c.replace(/\D/g, '');
        if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
        const calc = len => {
            let soma = 0, pos = len - 7;
            for (let i = len; i >= 1; i--) {
                soma += c[len - i] * pos--;
                if (pos < 2) pos = 9;
            }
            return soma % 11 < 2 ? 0 : 11 - (soma % 11);
        };
        return calc(12) == c[12] && calc(13) == c[13];
    },
    cpf: c => {
        c = c.replace(/\D/g, '');
        if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
        const calc = len => {
            let soma = 0;
            for (let i = 1; i <= len; i++) soma += c[i - 1] * (len + 1 - i);
            let resto = (soma * 10) % 11;
            return resto === 10 ? 0 : resto;
        };
        return calc(9) == c[9] && calc(10) == c[10];
    },
    telefone: t => (t = t.replace(/\D/g, '')).length >= 10 && t.length <= 11,
    cep: z => (z = z.replace(/\D/g, '')).length === 8,
    numeric: v => !isNaN(v) && isFinite(v)
};
