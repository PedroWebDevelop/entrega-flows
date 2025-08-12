const Input = {
    validarObrigatorio: function(selector, mensagem) {
        const $input = $(selector);
        if (!$input.val()) {
            $input.closest('.form-group').addClass('has-error');
            FLUIGC.toast({ title: 'Campo obrigatório', message: mensagem, type: 'danger' });
            return false;
        } else {
            $input.closest('.form-group').removeClass('has-error');
            return true;
        }
    },
    validarEmail: function(selector, mensagem) {
        const $input = $(selector);
        const email = $input.val();
        const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!regex.test(email)) {
            $input.closest('.form-group').addClass('has-error');
            FLUIGC.toast({ title: 'E-mail inválido', message: mensagem, type: 'danger' });
            return false;
        } else {
            $input.closest('.form-group').removeClass('has-error');
            return true;
        }
    },
    limparErros: function(selector) {
        $(selector).closest('.form-group').removeClass('has-error');
    }
};

