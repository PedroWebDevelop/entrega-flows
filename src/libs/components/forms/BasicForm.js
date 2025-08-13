import $ from 'jquery';
import FLUIGC from 'fluig-component-library';



const BasicForm = {
    init() {
        this.initCep();
        this.initSalvar();
    },
    initCep() {
        $('#cep').on('blur', function() {
            const cep = $(this).val();
            buscarEnderecoPorCep(cep)
                .then(data => {
                    $('#endereco').val(data.logradouro || '');
                    $('#bairro').val(data.bairro || '');
                    $('#municipio').val(data.localidade || '');
                    $('#estado').val(data.uf || '');
                })
                .catch(msg => {
                    FLUIGC.toast({ title: 'CEP', message: msg, type: 'danger' });
                    $('#endereco, #bairro, #municipio, #estado').val('');
                });
        });
    },
    initSalvar() {
        $('#btn-salvar-fornecedor').off('click').on('click', function() {
            if (!BasicForm.validarForm()) {
                FLUIGC.toast({ title: 'Erro', message: 'Preencha todos os campos obrigatórios!', type: 'danger' });
                return;
            }
            const json = BasicForm.montarJson();
            FLUIGC.toast({ title: 'Sucesso', message: 'Fornecedor salvo com sucesso!', type: 'success' });
            // Simula envio e download do JSON
            setTimeout(() => {
                BasicForm.baixarJson(json);
            }, 1000);
        });
    },
    validarForm() {
        let ok = true;
        ok &= !!$('#razaoSocial').val();
        ok &= !!$('#nomeFantasia').val();
        ok &= !!$('#cnpj').val();
        ok &= !!$('#cep').val();
        ok &= !!$('#endereco').val();
        ok &= !!$('#bairro').val();
        ok &= !!$('#municipio').val();
        ok &= !!$('#estado').val();
        ok &= !!$('#contato').val();
        ok &= !!$('#telefone').val();
        ok &= !!$('#email').val();
        return !!ok;
    },
    montarJson() {
        const fornecedor = {
            razaoSocial: $('#razaoSocial').val(),
            nomeFantasia: $('#nomeFantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricaoEstadual').val(),
            inscricaoMunicipal: $('#inscricaoMunicipal').val(),
            cep: $('#cep').val(),
            endereco: $('#endereco').val(),
            numero: $('#numero').val(),
            complemento: $('#complemento').val(),
            bairro: $('#bairro').val(),
            municipio: $('#municipio').val(),
            estado: $('#estado').val(),
            contato: $('#contato').val(),
            telefone: $('#telefone').val(),
            email: $('#email').val(),
            produtos: [],
            anexos: []
        };
        return JSON.stringify(fornecedor, null, 2);
    },
    baixarJson(json) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fornecedor.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

window.BasicForm = BasicForm;

$(document).ready(function() {
    if ($('#supplier-form').length) {
        BasicForm.init();
    }
});
