$(function() {
    $('#cep').on('blur', function() {
        const cep = $(this).val().replace(/\D/g, '');
        if (!cep) {
            alert('CEP obrigatório!');
            return;
        }
        if (cep.length !== 8) {
            alert('CEP inválido!');
            return;
        }
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado!');
                    $('#endereco, #bairro, #municipio, #estado').val('');
                } else {
                    $('#endereco').val(data.logradouro || '');
                    $('#bairro').val(data.bairro || '');
                    $('#municipio').val(data.localidade || '');
                    $('#estado').val(data.uf || '');
                }
            })
            .catch(() => alert('Erro ao buscar CEP!'));
    });
});
