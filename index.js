const API_KEY  = '97be3f94220810b7fcefe5fe6c36bad1';
const BASE_API_URL = 'https://api.themoviedb.org/3/';
const BASE_IMG_URL = 'http://image.tmdb.org/t/p/w342/';

let listaGeneros = [];
let listaEmCartaz = [];

function carregaGeneros() {
	let selectGenero = document.getElementById("destaque-categorias")
	let resGeneros = JSON.parse(this.responseText);
	
	for (i = 0; i < resGeneros.genres.length; i++) {
		let genero = resGeneros.genres[i];
		listaGeneros[genero.id] = genero.name;
		selectGenero.innerHTML += `<option value="${genero.id}">${genero.name}</option>`;
	}
}

function exibeFilmesEmCartaz() {
	let carousel = document.querySelector('#carousel-lancamentos .carousel-inner');
	let texto = '';

	let dados = JSON.parse(this.responseText);
	for (i = 0; i < 10; i++) {
		let filme = dados.results[i];
		if (filme.adult){
			i--;
			continue;
		}

		let estreia = new Date(filme.release_date);

		if (i == 0) {
			texto += `<div class="carousel-item active">`;
		} else {
			texto += `<div class="carousel-item">`;
		}

		let generos = [];

		for (j = 0; j < filme.genre_ids.length; j++) {
			generos[j] = listaGeneros[filme.genre_ids[j]];
		}

		texto += `
				<div class="container">
					<div class="row">
						<div class="col-lg-6 lancamento-poster">
							<a target="_blank" class="text-info" href="/filme.html?id=${filme.id}">
								<img src="${BASE_IMG_URL}${filme.poster_path}">
							</a>
						</div>
						<div class="col-lg-6">
							<h4>
								<strong>
									<a target="_blank" class="text-info" href="/filme.html?id=${filme.id}">
										${filme.title}
										<small class="text-info"><i class="fa fa-link" aria-hidden="true"></i></small>
									</a>
								</strong>
								<small class="text-info float-right">
									${filme.vote_average} <i class="fa fa-star"></i>
								</small>
							</h4>
							<div class="row">
								<div class="col-12 lancamento-sinopse">
									<strong>Título Original: </strong>${filme.original_title} (${filme.original_language})
								</div>
							</div>
							<div class="row">
								<div class="col-12 lancamento-sinopse">
									<strong>Sinopse: </strong>${filme.overview}
								</div>
							</div>
							<div class="row">
								<div class="col-12">
									<strong>Gêneros: </strong> ${generos.join(", ")}
								</div>
							</div>
							<div class="row">
								<div class="col-12">
									<strong>Estreia: </strong> ${estreia.toLocaleDateString()}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		listaEmCartaz.push([filme.id, filme.title]);

		let xhrAvaliacoes = new XMLHttpRequest();
		xhrAvaliacoes.onload = acrescentaAvaliacoes;
		xhrAvaliacoes.open('GET', `${BASE_API_URL}movie/${filme.id}/reviews?api_key=${API_KEY}&page=1`);
		xhrAvaliacoes.send();
	};

	carousel.innerHTML = texto;
}

function acrescentaAvaliacoes() {
	let destaque = document.querySelector('.cards-avaliacao');
	let dados = JSON.parse(this.responseText);
	let nomeFilme = findInArray(listaEmCartaz, dados.id);

	let texto = '';
	for (i = 0; i < dados.results.length; i++) {

		let revisao = dados.results[i];
		let data = new Date(revisao.created_at);

		texto = `
			<div class="col-12 col-md-6 col-lg-4">
				<div class="card">
					<div class="card-body">
						<div class="row">
							<div class="col-2">
								<i class="fa fa-user-circle fa-2x"></i>
							</div>
							<div class="col-10">
								<h5 class="card-title">${revisao.author}</h5>
								<h6 class="card-subtitle mb-2 text-muted">Sobre <a target="_blank" href="/filme.html?id=${dados.id}" class="text-info">${nomeFilme}</a></h6>
								<p class="card-text">${revisao.content.length > 300 ? revisao.content.substr(0, 300) + " ..." : revisao.content}</p>
								<small class="float-right">
									<b>${data.toLocaleString()}</b>
								</small>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	destaque.innerHTML += texto;
}

function findInArray(array, id) {
	for (i = 0; i < array.length; i++) {
		if (array[i][0] === id){
			return array[i][1];
		}
	}
}

function exibeFilmesEmDestaque() {
	let destaque = document.querySelector('.filmes-destaque');
	let texto = '';

	let dados = JSON.parse(this.responseText);

	for (i = 0; i < 4; i++) {
		let filme = dados.results[i];
		if (filme.adult){
			i--;
			continue;
		}
		
		let estreia = new Date(filme.release_date);

		texto += `
			<div class="filme-destaque col-12 col-md-6 col-lg-3 thumbnail ">
				<a target="_blank" href="/filme.html?id=${filme.id}">
					<img src="${BASE_IMG_URL}${filme.poster_path}" alt="${filme.title}">
				</a>
				<p>
					<strong>${filme.title}</strong> (${estreia.getFullYear()})
					<small class="text-info float-right">
						${filme.vote_average} <i class="fa fa-star"></i>
					</small>
				</p>
			</div>
		`;
	};

	destaque.innerHTML = texto;
}

document.getElementById("destaque-categorias").addEventListener("change", (e) => {
	let xhrDestaque = new XMLHttpRequest();
	xhrDestaque.onload = exibeFilmesEmDestaque;
	xhrDestaque.open('GET', `${BASE_API_URL}discover/movie?with_genres=${e.target.value}&api_key=${API_KEY}&language=pt-BR&page=1`);
	xhrDestaque.send();

	document.querySelector(".mais-destaques").style.display = "inline";
});

function adicionaFilmesEmDestaque() {
	let destaque = document.querySelector('.filmes-destaque');
	let texto = '';

	let dados = JSON.parse(this.responseText);

	let qtd = document.querySelectorAll(".filme-destaque").length;

	for (i = qtd; i < qtd+4; i++) {
		let filme = dados.results[i];
		if (filme.adult){
			i--;
			continue;
		}
		
		let estreia = new Date(filme.release_date);

		texto += `
			<div class="filme-destaque col-12 col-md-6 col-lg-3 thumbnail ">
				<a target="_blank" href="/filme.html?id=${filme.id}">
					<img src="${BASE_IMG_URL}${filme.poster_path}" alt="${filme.title}">
				</a>
				<p>
					<strong>${filme.title}</strong> (${estreia.getFullYear()})
					<small class="text-info float-right">
						${filme.vote_average} <i class="fa fa-star"></i>
					</small>
				</p>
			</div>
		`;
	};

	if (qtd == 16) {
		document.querySelector(".mais-destaques").style.display = "none";
	}

	destaque.innerHTML += texto;
}

document.querySelector(".mais-destaques").addEventListener("click", () => {
	let xhrDestaque = new XMLHttpRequest();
	xhrDestaque.onload = adicionaFilmesEmDestaque;
	xhrDestaque.open('GET', `${BASE_API_URL}discover/movie?with_genres=${document.getElementById("destaque-categorias").value}&api_key=${API_KEY}&language=pt-BR&page=1`);
	xhrDestaque.send();
});

function buscaInformacoesIniciais() {
	let xhrGeneros = new XMLHttpRequest();
	xhrGeneros.onload = carregaGeneros;
	xhrGeneros.open('GET', `${BASE_API_URL}genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
	xhrGeneros.send();

	let xhrEmCartaz = new XMLHttpRequest();
	xhrEmCartaz.onload = exibeFilmesEmCartaz;
	xhrEmCartaz.open('GET', `${BASE_API_URL}movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=1`);
	xhrEmCartaz.send();

	let xhrDestaque = new XMLHttpRequest();
	xhrDestaque.onload = exibeFilmesEmDestaque;
	xhrDestaque.open('GET', `${BASE_API_URL}discover/movie?with_genres=28&api_key=${API_KEY}&language=pt-BR&page=1`);
	xhrDestaque.send();
}

document.getElementById("pesquisa-form").addEventListener("submit", function(e) {
	window.location.href = `/pesquisa.html?query=${document.getElementById("input-search").value}`;
	e.preventDefault();
});

buscaInformacoesIniciais();
