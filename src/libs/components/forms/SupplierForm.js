window.SupplierForm = {
    render(container, data = {}) {
        fetch('src/layout/SupplierForm.html')
            .then(res => res.text())
            .then(template => {
                container.innerHTML = Mustache.render(template, data);
                this.initSave();
            });
    },

    initSave() {
        $(document).off('click', '#btnSalvarFornecedor').on('click', '#btnSalvarFornecedor', () => {
            const fornecedor = this.getData();
            localStorage.setItem('fornecedor', JSON.stringify(fornecedor));
            FLUIGC.toast({
                title: 'Sucesso',
                message: 'Fornecedor salvo!',
                type: 'success'
            });
        });
    },

    getData() {
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