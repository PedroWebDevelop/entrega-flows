$(function() {
    const FormAnexos = {
        init: function() {
            this.renderAnexos();
            this.bindEvents();
        },

        renderAnexos: function() {
            const anexos = StorageService.obterAnexos();
            const template = $('#tplAnexo').html();
            let html = '';

            if (anexos.length > 0) {
                anexos.forEach(anexo => {
                    html += Mustache.render(template, anexo);
                });
            } else {
                html = '<tr><td colspan="2" class="text-muted">Nenhum anexo incluído</td></tr>';
            }

            $('#anexos-table tbody').html(html);
        },

        bindEvents: function() {
            // Evento para abrir modal de anexo (data-toggle já faz isso)
            // Evento para upload do componente Fluig
            document.addEventListener('upload-component-file', function(e) {
                const files = e.detail.files;
                if (files && files.length) {
                    Promise.all(Array.from(files).map(file => StorageService.armazenarAnexo(file)))
                        .then(() => {
                            FormAnexos.renderAnexos();
                            $('#modalAnexo').modal('hide');
                        });
                }
            });

            // Evento para upload do input file padrão (fallback)
            $(document).off('change', '#fileInputFallback').on('change', '#fileInputFallback', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                StorageService.armazenarAnexo(file).then(() => {
                    FormAnexos.renderAnexos();
                    $('#modalAnexo').modal('hide');
                });
                $(this).val('');
            });

            // Evento para remover anexo
            $(document).off('click', '.remover-anexo').on('click', '.remover-anexo', function() {
                const id = $(this).data('id');
                StorageService.removerAnexo(id);
                FormAnexos.renderAnexos();
            });

            // Evento para visualizar anexo
            $(document).off('click', '.visualizar-anexo').on('click', '.visualizar-anexo', function() {
                const id = $(this).data('id');
                StorageService.downloadAnexo(id);
            });
        }
    };

    window.FormAnexos = FormAnexos;

    // Se já estiver na página de anexos, inicializa
    if ($('#anexos-table').length) {
        FormAnexos.init();
    }
});
