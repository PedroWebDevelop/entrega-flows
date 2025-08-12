const SupplierForm = {
    render: function(container, data = {}) {
        fetch('src/layout/SupplierForm.html')
            .then(res => res.text())
            .then(template => {
                container.innerHTML = Mustache.render(template, data);
                this.initializeMasks();
                this.initializeEvents();
            });
    },

    initializeMasks: function() {
        // Máscara para CNPJ
        $('#cnpj').on('input', function() {
            const value = $(this).val().replace(/\D/g, '');
            let formattedValue = '';

            if (value.length <= 2) {
                formattedValue = value;
            } else if (value.length <= 5) {
                formattedValue = value.substring(0, 2) + '.' + value.substring(2);
            } else if (value.length <= 8) {
                formattedValue = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5);
            } else if (value.length <= 12) {
                formattedValue = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8) + '/' + value.substring(8);
            } else {
                formattedValue = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8) + '/' + value.substring(8, 12) + '-' + value.substring(12, 14);
            }

            $(this).val(formattedValue);
        });

        // Máscara para telefone
        $('#telefone').on('input', function() {
            const value = $(this).val().replace(/\D/g, '');
            let formattedValue = '';

            if (value.length <= 2) {
                formattedValue = value.length > 0 ? '(' + value : '';
            } else if (value.length <= 6) {
                formattedValue = '(' + value.substring(0, 2) + ') ' + value.substring(2);
            } else if (value.length <= 10) {
                formattedValue = '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6);
            } else {
                formattedValue = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
            }

            $(this).val(formattedValue);
        });
    },

    /**
     * Inicializa eventos dos campos
     */
    initializeEvents: function() {
        // Validação de CNPJ ao perder o foco
        $('#cnpj').on('blur', function() {
            const cnpj = $(this).val();
            const errorElement = $('#cnpj-error');

            if (!Validators.required(cnpj)) {
                errorElement.text('CNPJ é obrigatório');
                return;
            }

            if (!Validators.cnpj(cnpj)) {
                errorElement.text('CNPJ inválido');
                return;
            }

            errorElement.text('');
        });

        // Validação de email ao perder o foco
        $('#email').on('blur', function() {
            const email = $(this).val();
            const errorElement = $('#email-error');

            if (!Validators.required(email)) {
                errorElement.text('E-mail é obrigatório');
                return;
            }

            if (!Validators.email(email)) {
                errorElement.text('E-mail inválido');
                return;
            }

            errorElement.text('');
        });

        // Validação de telefone ao perder o foco
        $('#telefone').on('blur', function() {
            const telefone = $(this).val();
            const errorElement = $('#telefone-error');

            if (!Validators.required(telefone)) {
                errorElement.text('Telefone é obrigatório');
                return;
            }

            if (!Validators.telefone(telefone)) {
                errorElement.text('Telefone inválido');
                return;
            }

            errorElement.text('');
        });

        // Validação de campos obrigatórios ao perder o foco
        $('#razaoSocial, #nomeFantasia, #nomeContato').on('blur', function() {
            const fieldId = $(this).attr('id');
            const value = $(this).val();
            const errorElement = $(`#${fieldId}-error`);

            if (!Validators.required(value)) {
                errorElement.text('Este campo é obrigatório');
                return;
            }

            errorElement.text('');
        });

        // Evento de salvar fornecedor
        $(document).off('click', '#btnSalvarFornecedor').on('click', '#btnSalvarFornecedor', () => {
            if (!this.validate()) {
                // Toast de erro
                FLUIGC.toast({
                    title: 'Erro',
                    message: 'Preencha todos os campos obrigatórios corretamente!',
                    type: 'danger'
                });
                return;
            }

            // Simula salvar fornecedor (poderia usar localStorage/sessionStorage)
            const fornecedor = this.getData();
            // Exemplo de salvar no localStorage
            localStorage.setItem('fornecedor', JSON.stringify(fornecedor));

            // Toast de sucesso
            FLUIGC.toast({
                title: 'Sucesso',
                message: 'Fornecedor salvo com sucesso!',
                type: 'success'
            });

            // Simula abrir um dialog (se quiser usar componente)
            if (window.Dialog && typeof window.Dialog.show === 'function') {
                window.Dialog.show('Fornecedor cadastrado!', 'Os dados foram salvos.');
            }
        });
    },

    /**
     * Valida todos os campos do formulário
     * @returns {boolean} - Verdadeiro se todos os campos estão válidos
     */
    validate: function() {
        let isValid = true;

        // Validar campos obrigatórios
        const requiredFields = ['razaoSocial', 'nomeFantasia', 'cnpj', 'nomeContato', 'telefone', 'email'];

        requiredFields.forEach(fieldId => {
            const value = $(`#${fieldId}`).val();
            const errorElement = $(`#${fieldId}-error`);

            if (!Validators.required(value)) {
                errorElement.text('Este campo é obrigatório');
                isValid = false;
            } else {
                errorElement.text('');
            }
        });

        // Validações específicas
        const cnpj = $('#cnpj').val();
        if (Validators.required(cnpj) && !Validators.cnpj(cnpj)) {
            $('#cnpj-error').text('CNPJ inválido');
            isValid = false;
        }

        const email = $('#email').val();
        if (Validators.required(email) && !Validators.email(email)) {
            $('#email-error').text('E-mail inválido');
            isValid = false;
        }

        const telefone = $('#telefone').val();
        if (Validators.required(telefone) && !Validators.telefone(telefone)) {
            $('#telefone-error').text('Telefone inválido');
            isValid = false;
        }

        return isValid;
    },

    /**
     * Obtém os dados do formulário
     * @returns {Object} - Dados do formulário
     */
    getData: function() {
        return {
            razaoSocial: $('#razaoSocial').val(),
            nomeFantasia: $('#nomeFantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricaoEstadual').val(),
            inscricaoMunicipal: $('#inscricaoMunicipal').val(),
            nomeContato: $('#nomeContato').val(),
            telefone: $('#telefone').val(),
            email: $('#email').val()
        };
    }
};
