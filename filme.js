const API_KEY  = '97be3f94220810b7fcefe5fe6c36bad1';
const BASE_API_URL = 'https://api.themoviedb.org/3/';
const BASE_IMG_URL = 'http://image.tmdb.org/t/p/w342';
const BASE_LOGO_URL = 'http://image.tmdb.org/t/p/w45';

function exibeFilme() {
	let filme = JSON.parse(this.responseText);
	let sectionFilme = document.getElementById("section-filme");

	if (filme.status_code < 200 || filme.status_code > 300) {
		sectionFilme.innerHTML = `<i class="fa fa-warning"></i> O filme não foi encontrado. Por favor, tente outro código.`;
		document.querySelector(".titulo-filme").innerText = `Filme Não Encontrado`;
		return;
	}

	document.querySelector(".titulo-filme").innerText = filme.title;

	let estreia = new Date(filme.release_date);
	let generos = [];
	for (i = 0; i < filme.genres.length; i++) {
		generos.push(filme.genres[i].name);
	}
	let paises = [];
	for (i = 0; i < filme.production_countries.length; i++) {
		paises.push(filme.production_countries[i].iso_3166_1);
	}
	let idiomas = [];
	for (i = 0; i < filme.spoken_languages.length; i++) {
		idiomas.push(filme.spoken_languages[i].iso_639_1);
	}
	let produtoras = '';
	for (i = 0; i < filme.production_companies.length; i++) {
		let produtora = filme.production_companies[i];
		
		if (!produtora.logo_path) {
			continue;
		}

		produtoras += `
			<img src="${BASE_LOGO_URL}${produtora.logo_path}"> 
		`;
	}

	sectionFilme.innerHTML = `
		<div class="row">
			<div class="col-lg-5 lancamento-poster">
				<img src="${BASE_IMG_URL}${filme.poster_path}">
			</div>
			<div class="col-lg-7">
				<h2>
					<strong class="text-info">${filme.title}</strong>
					<small class="text-info float-right">
						${filme.vote_average} <i class="fa fa-star"></i>
						<span class="votos">(${filme.vote_count} votos)</span>
					</small>
				</h2>
				<br>
				<div class="row">
					<div class="col-12">
						<strong>Título Original: </strong>${filme.original_title} (${filme.original_language})
					</div>
				</div>
				<div class="row">
					<div class="col-12 filme-sinopse">
						<strong>Sinopse: </strong>${filme.overview}
					</div>
				</div>
				<div class="row">
					<div class="col-12 col-md-6">
						<strong>Gêneros: </strong>${generos.join(", ")}
					</div>
					<div class="col-12 col-md-6">
						<strong>Data de Estreia: </strong>${estreia.toLocaleDateString()}
					</div>
				</div>
				<div class="row">
					<div class="col-12 col-md-6">
						<strong>Site: </strong><a href="${filme.homepage}">${filme.homepage}</a>
					</div>
					<div class="col-12 col-md-6">
						<strong>Duração: </strong>${filme.runtime} minutos
					</div>
				</div>
				<div class="row">
					<div class="col-12 col-md-6">
						<strong>Orçamento: </strong>$${filme.budget.toLocaleString()},00
					</div>
					<div class="col-12 col-md-6">
						<strong>Receita: </strong>$${filme.revenue.toLocaleString()},00
					</div>
				</div>
				<div class="row">
					<div class="col-12 col-md-6">
						<strong>Países de Produção: </strong>${paises.join(", ")}
					</div>
					<div class="col-12 col-md-6">
						<strong>Idiomas Falados: </strong>${idiomas.join(", ")}
					</div>
				</div>
				<div class="row produtoras-row">
					<div class="col-12">
						${produtoras}
					</div>
				</div>
			</div>
		</div>
	`;
}

const urlParams = new URLSearchParams(window.location.search);
const idFilme = urlParams.get('id');

let xhrFilme = new XMLHttpRequest();
xhrFilme.onload = exibeFilme;
xhrFilme.open('GET', `${BASE_API_URL}movie/${idFilme}?api_key=${API_KEY}&language=pt-BR`);
xhrFilme.send();

document.getElementById("pesquisa-form").addEventListener("submit", function(e) {
	window.location.href = `/pesquisa.html?query=${document.getElementById("input-search").value}`;
	e.preventDefault();
});
