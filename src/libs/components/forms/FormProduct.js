$(function() {
    console.log('FormProduct.js carregado');
    function getProdutos() {
        const data = sessionStorage.getItem('produtos');
        return data ? JSON.parse(data) : [];
    }

    function saveProdutos(produtos) {
        if (produtos.length === 0) {
            StorageService.removeFromSession('produtos');
        } else {
            sessionStorage.setItem('produtos', JSON.stringify(produtos));
        }
    }

    function renderProdutos() {
        const produtos = getProdutos();
        let html = '';
        if (produtos.length > 0) {
            produtos.forEach((p, i) => {
                html += `<tr>
                    <td>${p.descricao}</td>
                    <td>${p.unidade}</td>
                    <td>${p.qtde}</td>
                    <td>${p.valorUnitario}</td>
                    <td>${p.valorTotal}</td>
                    <td>
                        <button class="fs-btn fs-btn-link fs-btn-sm remover-produto" data-index="${i}">Excluir</button>
                    </td>
                </tr>`;
            });
        } else {
            html = '<tr><td colspan="6" class="text-muted">Nenhum produto incluído</td></tr>';
        }
        $('#products-table tbody').html(html);
    }

    // Abrir modal (já funciona pelo data-toggle, mas garante via JS também)
    $(document).off('click', '#btnOpenProdutoModal').on('click', '#btnOpenProdutoModal', function() {
        $('#modalProduto').modal('show');
    });

    // Adicionar produto via modal
    $(document).off('submit', '#formProduto').on('submit', '#formProduto', function(e) {
        e.preventDefault();
        console.log('Submit do produto acionado');
        const descricao = $('#descricaoProduto').val();
        const unidade = $('#unidadeProduto').val();
        const qtde = parseInt($('#qtdeProduto').val(), 10) || 0;
        const valorUnitario = parseFloat($('#valorUnitarioProduto').val()) || 0;
        const valorTotal = (qtde * valorUnitario).toFixed(2);

        // Adicione este log:
        console.log('Produto a ser salvo:', { descricao, unidade, qtde, valorUnitario, valorTotal });

        if (!descricao || !unidade || !qtde || !valorUnitario) {
            alert('Preencha todos os campos!');
            return;
        }

        const produtos = getProdutos();
        produtos.push({
            descricao,
            unidade,
            qtde,
            valorUnitario: valorUnitario.toFixed(2),
            valorTotal
        });
        saveProdutos(produtos);
        renderProdutos();

        // Limpa campos e fecha modal
        $('#formProduto')[0].reset();
        $('#modalProduto').modal('hide');
    });

    // Remover produto
    $(document).off('click', '.remover-produto').on('click', '.remover-produto', function() {
        const index = $(this).data('index');
        const produtos = getProdutos();
        produtos.splice(index, 1);
        saveProdutos(produtos);
        renderProdutos();
    });

    // Inicializa tabela ao carregar
    if ($('#products-table').length) {
        renderProdutos();
    }
    window.FormProduct = {
        init: renderProdutos
    };
});

