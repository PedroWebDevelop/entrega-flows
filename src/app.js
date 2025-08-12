const App = {
		init() {
				this.loadLayout('src/layout/LayoutHome.html');
		},

		loadLayout(path) {
				fetch(path)
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
		}
};

document.addEventListener('DOMContentLoaded', () => App.init());
