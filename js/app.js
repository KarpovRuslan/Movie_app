const API_URL_POP = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword';
const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const API_KEY = '015afbc2-ec24-4600-96e9-2d440492673c';

getMovies(API_URL_POP)

async function getMovies(url) {
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
    });
    
    const respData = await resp.json();
    showMovies(respData)
};

function getClassByRate(rating) {
    if (rating >= 7) {
        return 'green';
    } else if (rating>5) {
        return 'orange';
    } else {
        return "red";
    }
};

function showMovies(data) {
    const moviesEl = document.querySelector('.movies');

    document.querySelector('.movies').innerHTML = '';

    data.films.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <div class="movie__cover--inner">
            <img
              src="${movie.posterUrlPreview}"
              class="movie__cover"
              alt="${movie.nameEn}"
            />
            <div class="movie__cover--blur"></div>
          </div>
          <div class="movie__info">
            <div class="movie__title">${movie.nameEn}</div>
            <div class="movie__category">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
            ${movie.rating && `
            <div class="movie__rating movie__rating--${getClassByRate(movie.rating)}">${movie.rating}</div>
            `}
            
          </div>`;
        moviesEl.addEventListener('click', () => openModal(movie.filmId));
        moviesEl.appendChild(movieEl)
    });
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', onSearch);

function onSearch(evt) {
    evt.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}=${search.value}`;
    if (search.value) {
        getMovies(apiSearchUrl);
        search.value = '';
    }

};


// Modal 
const modalEl = document.querySelector('.modal');

async function openModal(id) {
    const resp = await fetch(API_URL_MOVIE_DETAILS+id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
    });
    
    const respData = await resp.json();

    modalEl.classList.add('modal--show');
    document.body.classList.add('stop-scrolling');

    modalEl.innerHTML = `
<div class='modal__card'>
<img class='modal-movie__backdrop' src='${respData.posterUrl}' alt='${respData.nameEn}'>
<h2>
<span class='modal-movie__title'>Name - ${respData.nameEn}</span>
<span class='modal-movie__realese-year'>- ${respData.year}</span>
</h2>
<ul class='modal-movie__info'>
<div class='loader'></div>
<li class='modal-movie__genre'>genre - ${respData.genres.map((genre)=>`<span>${genre.genre}</span>`)}</li>
${respData.filmLength ? `<li class='modal-movie__runtime'>Runtime - ${respData.filmLength} minutes</li>` : ''}
<li>Site: <a class='modal-movie__site' href='${respData.webUrl}'>${respData.webUrl}</a></li>
<li class='modal-movie__overview'>${respData.description}</li>
</ul>
<button type='button' class='modal__btn-close'>Close</button>
</div>
`
    const btnClose = document.querySelector('.modal__btn-close');
    btnClose.addEventListener('click', () => closeModal());
}

function closeModal() {
    modalEl.classList.remove('modal--show');
    document.body.classList.remove('stop-scrolling');
};

window.addEventListener('click', (evt) => {
    if (evt.target===modalEl) {
        closeModal();
    }
})

window.addEventListener('keydown', (evt) => {
    if (evt.keyCode===27) {
        closeModal();
    }
})

async function main() {
    const filmsData = await getMovies();
    let currentPage = 1;
    let rows = 10;

    function displayList(arrData, rowPerPage, page) { 
        const filmsEl = document.querySelector('.movies');
        
        const start = rowPerPage*page;
        const end = start + rowPerPage;
        const paginatedData = arrData.slice(start, end);
        paginatedData.forEach((elem) => {
            const filmEl = document.createElement('div');
            filmEl.classList.add('film');
            filmEl.innerText = `${elem.title}`;
            filmsEl.appendChild(filmEl);
        })
    }
    function displayPagination() { }
    function displayPaginationBtn(){}

    displayList(filmsData,rows,currentPage)
}

main();