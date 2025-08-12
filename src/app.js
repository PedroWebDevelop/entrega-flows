const App = {
    init() {
        this.loadLayout('src/layout/LayoutHome.html')
            .then(() => {

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
            .then(html => {
                const content = document.querySelector(targetSelector);
                if (content) {
                    content.innerHTML = html;
                    if (window.createSupplierChart){
                        window.createSupplierChart();
                    }

                } else {
                    console.error('Elemento alvo não encontrado:', targetSelector);
                }
            })
            .catch(err => {
                console.error('Erro ao carregar conteúdo:', err);
            });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());


