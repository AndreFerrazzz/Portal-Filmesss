const API_KEY  = '97be3f94220810b7fcefe5fe6c36bad1';
const BASE_API_URL = 'https://api.themoviedb.org/3/';
const BASE_SITE_URL = 'https://www.themoviedb.org/';
const BASE_IMG_URL = 'http://image.tmdb.org/t/p/w342';
const BASE_LOGO_URL = 'http://image.tmdb.org/t/p/w45';
const DEFAULT_IMAGE = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';
const DEFAULT_PROFILE = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg';

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');
const page = urlParams.get('page');

function exibeLista() {
	let lista = JSON.parse(this.responseText);
	let sectionPesquisa = document.getElementById("section-pesquisa");

	if (lista.status_code < 200 || lista.status_code > 300) {
		document.querySelector(".titulo-pesquisa").innerText = `Conteúdo Não Encontrado`;
		sectionPesquisa.innerHTML = `<i class="fa fa-warning"></i> Não foi encontrado nenhum conteúdo correspondente à pesquisa. Por favor, tente com outros termos.`;
		return;
	}

	document.querySelector(".titulo-pesquisa").innerText = `Resultados para "${query}"`;

	let texto = `<div class="list-group">`;

	for (i = 0; i < lista.results.length; i++) {
		let registro = lista.results[i];
		switch (registro.media_type) {
			case "movie":
				var data = '';
				if (registro.release_date != "") {
					data = new Date(registro.release_date);
					data = `<small>${data.toLocaleString().substring(0,10)}</small>`;
				}

				texto += `
					<a href="/filme.html?id=${registro.id}" target="_blank" class="list-group-item list-group-item-action flex-column align-items-start">
						<div class="row">
							<div class="col-12 col-md-1">
								<img src="${registro.poster_path?BASE_IMG_URL+registro.poster_path:DEFAULT_IMAGE}">
							</div>
							<div class="col-12 col-md-11">	
								<div class="d-flex w-100 justify-content-between">
									<h5 class="mb-1">${registro.title}</h5>
									${data}
								</div>
								<p class="mb-1">${registro.overview}</p>
								<small>Filme</small>
							</div>
						</div>
					</a>
				`;
				break;
			case "tv":
				var data = '';
				if (registro.first_air_date != "") {
					data = new Date(registro.first_air_date);
					data = `<small>${data.toLocaleString().substring(0,10)}</small>`;
				}
				texto += `
					<a href="${BASE_SITE_URL}tv/${registro.id}" target="_blank" class="list-group-item list-group-item-action flex-column align-items-start">
						<div class="row">
							<div class="col-12 col-md-1">
								<img src="${registro.poster_path?BASE_IMG_URL+registro.poster_path:DEFAULT_IMAGE}">
							</div>
							<div class="col-12 col-md-11">	
								<div class="d-flex w-100 justify-content-between">
									<h5 class="mb-1">${registro.name}</h5>
									${data}
								</div>
								<p class="mb-1">${registro.overview}</p>
								<small>Seriado de TV</small>
							</div>
						</div>
					</a>
				`;
				break;
			case "person":
				let conhecidaPor = '';
				if (registro.known_for.length > 0) {
					conhecidaPor += 'Conhecido por: ';
					let conhecidaPorArray = [];

					for (j = 0; j < registro.known_for.length; j++){
						conhecidaPorArray.push(registro.known_for[j].title);
					}
					conhecidaPor += conhecidaPorArray.join(", ");
				}
				texto += `
					<a href="${BASE_SITE_URL}person/${registro.id}" target="_blank" class="list-group-item list-group-item-action flex-column align-items-start">
						<div class="row">
							<div class="col-12 col-md-1">
								<img src="${registro.profile_path?BASE_IMG_URL+registro.profile_path:DEFAULT_PROFILE}">
							</div>
							<div class="col-12 col-md-11">	
								<div class="d-flex w-100 justify-content-between">
									<h5 class="mb-1">${registro.name}</h5>
								</div>
								<p class="mb-1">${conhecidaPor}</p>
								<small>Pessoa</small>
							</div>
						</div>
					</a>
				`;
				break;
		}
	}

	let paginas = '';
	for (i = 1; i <= lista.total_pages; i++) {
		paginas += `
			<li class="page-item ${lista.page==i?"disabled":""}">
				<a class="page-link text-info" href="/pesquisa.html?query=${query}&page=${i}">${i}</a>
			</li>
		`;
	}

	texto += `
	</div>
	<div class="row">
		<div class="col-12 d-flex justify-content-center">
			<nav aria-label="Page navigation example">
				<ul class="pagination">
					${paginas}
				</ul>
			</nav>
		</div>
	</div>
	`;

	sectionPesquisa.innerHTML = texto;
	console.log(lista);
}

let xhrPesquisa = new XMLHttpRequest();
xhrPesquisa.onload = exibeLista;
xhrPesquisa.open('GET', `${BASE_API_URL}search/multi?query=${query}&api_key=${API_KEY}&language=pt-BR&page=${page?page:1}&include_adult=false`);
xhrPesquisa.send();


document.getElementById("pesquisa-form").addEventListener("submit", function(e) {
	window.location.href = `/pesquisa.html?query=${document.getElementById("input-search").value}`;
	e.preventDefault();
});