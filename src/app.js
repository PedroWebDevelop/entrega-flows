const App = {
    init() {
        this.loadLayout('src/layout/LayoutHome.html')
            .then(() => {
                document.querySelectorAll('.nav-tabs a').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const url = this.getAttribute('href');
                        App.loadContent(url, '#fluig-style-guide-main');
                        document.querySelectorAll('.nav-tabs li').forEach(li => li.classList.remove('active'));
                        this.parentElement.classList.add('active');
                    });
                });

                this.loadContent('src/layout/HomeChart.html', '#fluig-style-guide-main');
            });
    },

    loadLayout(path) {
        return fetch(path)  // Retorna a promise para poder encadear
            .then(response => response.text())
            .then(html => {
                const temp = document.createElement('div');
                temp.innerHTML = html.trim();

                const fluigWrapper = temp.querySelector('.fluig-style-guide');
                document.getElementById('app').innerHTML = fluigWrapper ? fluigWrapper.innerHTML : temp.innerHTML;
            })
            .catch(err => {
                console.error('Erro ao carregar layout:', err);
                document.getElementById('app').innerHTML = `<p>Erro ao carregar layout.</p>`;
            });
    },

    // Função para carregar conteúdo em um elemento específico
    loadContent(path, targetSelector) {
        fetch(path)
            .then(response => response.text())
            .then(template => {
                const content = document.querySelector(targetSelector);
                if (template.includes('{{')) {
                    const data = {};
                    content.innerHTML = Mustache.render(template, data);
                } else {
                    content.innerHTML = template;
                }
                // Inicializa componentes SEMPRE após renderizar
                setTimeout(() => {
                    if ($('#anexos-table').length && window.FormAnexos) {
                        window.FormAnexos.init();
                    }
                    if ($('#products-table').length && window.FormProduct) {
                        window.FormProduct.init();
                    }
                    if (window.BasicForm && $('#supplier-form').length) {
                        window.BasicForm.init();
                    }
                    if (window.createSupplierChart){
                        window.createSupplierChart();
                    }
                }, 0);
            })
            .catch(err => {
                console.error('Erro ao carregar conteúdo:', err);
            });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
