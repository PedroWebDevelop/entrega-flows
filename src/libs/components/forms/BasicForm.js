import $ from 'jquery';
import { validarObrigatorio, validarEmail } from '../inputs/Input.js';
import { buscarEnderecoPorCep } from '../../../utils/viaCepService.js';
import StorageService from '../../../utils/storageService.js';

const BasicForm = {
    init() {
        this.initCep();
        this.initProdutos();
        this.initAnexos();
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
    initProdutos() {
        // Adiciona produto na tabela
        $('#add-product').on('click', function() {
            BasicForm.addProductRow();
        });
        // Inicializa com 1 produto
        if ($('#products-table tbody tr').length === 0) {
            BasicForm.addProductRow();
        }
        // Delegação para remover produto
        $('#products-table').on('click', '.btn-remove-product', function() {
            $(this).closest('tr').remove();
        });
        // Atualiza valor total
        $('#products-table').on('input', '.input-qtde, .input-valor-unitario', function() {
            const $row = $(this).closest('tr');
            const qtde = parseFloat($row.find('.input-qtde').val()) || 0;
            const valor = parseFloat($row.find('.input-valor-unitario').val()) || 0;
            $row.find('.input-valor-total').val((qtde * valor).toFixed(2));
        });
    },
    addProductRow() {
        const row = `<tr>
            <td><input type="text" class="form-control input-descricao" required></td>
            <td><input type="text" class="form-control input-unidade" required></td>
            <td><input type="number" class="form-control input-qtde" min="0" required></td>
            <td><input type="number" class="form-control input-valor-unitario" min="0" required></td>
            <td><input type="number" class="form-control input-valor-total" readonly></td>
            <td><button type="button" class="btn btn-danger btn-remove-product">Excluir</button></td>
        </tr>`;
        $('#products-table tbody').append(row);
    },
    initAnexos() {
        $('#add-anexo').on('click', function() {
            $('#fileInput').click();
        });
        $('#fileInput').on('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                StorageService.armazenarAnexo(file).then(anexo => {
                    BasicForm.renderAnexos();
                });
            }
            $(this).val('');
        });
        $('#anexos-table').on('click', '.btn-excluir-anexo', function() {
            const fileId = $(this).data('id');
            StorageService.removerAnexo(fileId);
            BasicForm.renderAnexos();
        });
        $('#anexos-table').on('click', '.btn-visualizar-anexo', function() {
            const fileId = $(this).data('id');
            StorageService.downloadAnexo(fileId);
        });
        BasicForm.renderAnexos();
    },
    renderAnexos() {
        const anexos = StorageService.obterAnexos();
        const $tbody = $('#anexos-table tbody');
        $tbody.empty();
        anexos.forEach(anexo => {
            $tbody.append(`<tr><td>${anexo.name}</td><td>
                <button type="button" class="btn btn-danger btn-excluir-anexo" data-id="${anexo.id}">Excluir</button>
                <button type="button" class="btn btn-info btn-visualizar-anexo" data-id="${anexo.id}">Visualizar</button>
            </td></tr>`);
        });
    },
    initSalvar() {
        $('#btn-salvar-fornecedor').on('click', function() {
            if (!BasicForm.validarForm()) return;
            const json = BasicForm.montarJson();
            FLUIGC.modal({
                title: 'Enviando...',
                content: '<div class="text-center"><span class="fluigicon fluigicon-spinner fluigicon-spin"></span> Enviando...</div>',
                size: 'small',
                actions: [{
                    label: 'Fechar',
                    classType: 'btn-primary',
                    autoClose: true
                }]
            });
            setTimeout(() => {
                console.log(json);
                BasicForm.baixarJson(json);
            }, 1000);
        });
    },
    validarForm() {
        let ok = true;
        ok &= validarObrigatorio('#razaoSocial', 'Razão Social obrigatória');
        ok &= validarObrigatorio('#nomeFantasia', 'Nome Fantasia obrigatória');
        ok &= validarObrigatorio('#cnpj', 'CNPJ obrigatório');
        ok &= validarObrigatorio('#cep', 'CEP obrigatório');
        ok &= validarObrigatorio('#endereco', 'Endereço obrigatório');
        ok &= validarObrigatorio('#bairro', 'Bairro obrigatório');
        ok &= validarObrigatorio('#municipio', 'Município obrigatório');
        ok &= validarObrigatorio('#estado', 'Estado obrigatório');
        ok &= validarObrigatorio('#contato', 'Contato obrigatório');
        ok &= validarObrigatorio('#telefone', 'Telefone obrigatório');
        ok &= validarEmail('#email', 'E-mail inválido');
        // Produtos
        if ($('#products-table tbody tr').length === 0) {
            FLUIGC.toast({ title: 'Produtos', message: 'Adicione pelo menos 1 produto', type: 'danger' });
            ok = false;
        }
        // Anexos
        if (StorageService.obterAnexos().length === 0) {
            FLUIGC.toast({ title: 'Anexos', message: 'Adicione pelo menos 1 anexo', type: 'danger' });
            ok = false;
        }
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
        $('#products-table tbody tr').each(function(i, tr) {
            const $tr = $(tr);
            fornecedor.produtos.push({
                indice: i+1,
                descricaoProduto: $tr.find('.input-descricao').val(),
                unidadeMedida: $tr.find('.input-unidade').val(),
                qtdeEstoque: $tr.find('.input-qtde').val(),
                valorUnitario: $tr.find('.input-valor-unitario').val(),
                valorTotal: $tr.find('.input-valor-total').val()
            });
        });
        StorageService.obterAnexos().forEach((anexo, i) => {
            fornecedor.anexos.push({
                indice: i+1,
                nomeArquivo: anexo.name,
                blobArquivo: anexo.data.split(',')[1]
            });
        });
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

