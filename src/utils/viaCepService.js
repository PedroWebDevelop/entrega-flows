
import $ from 'jquery';
const ViaCepService = {

    buscarEnderecoPorCep: function(cep) {
        return new Promise((resolve, reject) => {
            // Remove caracteres não numéricos
            cep = cep.replace(/\D/g, '');
            
            if (!Validators.cep(cep)) {
                reject('CEP inválido');
                return;
            }
            
            $.ajax({
                url: `https://viacep.com.br/ws/${cep}/json/`,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (data.erro) {
                        reject('CEP não encontrado');
                    } else {
                        resolve(data);
                    }
                },
                error: function() {
                    reject('Erro ao consultar o CEP');
                }
            });
        });
    },
    buscarEndereco: function(cep) {
        return $.ajax({
            url: `https://viacep.com.br/ws/${cep}/json/`,
            method: 'GET',
            dataType: 'json'
        });
    }
};
