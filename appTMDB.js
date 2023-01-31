//import moment from "moment";

const API_KEY = "95775b42e188d6443a0bfb132dcec5e1";
const BASE_URL = `https://api.themoviedb.org/3`;
const URL_TREND = `${BASE_URL}/trending/movie/week`;
const URL_SEARCH = `${BASE_URL}/search/movie`;
const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
const URL_MOVIE = `${BASE_URL}/movie/`;

getMovies();

async function getMovies() {
  const resp = await fetch(`${URL_TREND}?api_key=${API_KEY}`, {
    method: "GET",
  });

  const respData = await resp.json();
  showMovies(respData);
}

function getClassByRate(rating) {
  if (rating >= 7) {
    return "green";
  } else if (rating > 5) {
    return "orange";
  } else {
    return "red";
  }
}

// M O V I E  L I S T   R E N D E R
function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  document.querySelector(".movies").innerHTML = "";

  data.results.forEach((movie) => {
    //let myDate = new Date(movie.release_date);

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
        <div class="movie__cover--inner">
            ${
              movie.poster_path
                ? `<img
              src="${BASE_IMG_URL}${movie.poster_path}"
              class="movie__cover"
              alt="${movie.title}"
            />`
                : `<img
              src="https://www.theoxygenstore.com/images/source/No-image.jpg"
              class="movie__cover"
              alt="${movie.title}"
            />`
            }
            
            <div class="movie__cover--blur"></div>
          </div>
          <div class="movie__info">
            <div class="movie__title">${movie.title}</div>
            <div class="movie__category">Release date - ${
              movie.release_date
            }</div>
            ${
              movie.vote_average
                ? `${
                    movie.vote_average &&
                    `<div class="movie__rating movie__rating--${getClassByRate(
                      movie.vote_average
                    )}">${movie.vote_average.toFixed(1)}</div>
            `
                  }`
                : ""
            }
            
            
          </div>`;
    movieEl.addEventListener("click", () => openModal(movie.id));
    moviesEl.appendChild(movieEl);
  });
}

// S E A R CH
const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", onSearch);

function onSearch(evt) {
  evt.preventDefault();

  if (search.value) {
    getMoviesBySearch();
    search.value = "";
  }
}

async function getMoviesBySearch() {
  const query = search.value;
  const resp = await fetch(`${URL_SEARCH}?api_key=${API_KEY}&query=${query}`, {
    method: "GET",
  });

  const respData = await resp.json();
  showMovies(respData);
}

// async function getMoviesVideo(id) {
//     //console.log(respData)
//     //const id = ;
//     const resp = await fetch(`${URL_MOVIE}${id}/videos?api_key=${API_KEY}`, {
//         method: 'GET',
//     });

//     const respData = await resp.json();
//     console.log(respData)
//     //showMovies(respData)
// }

// M O D A L
const modalEl = document.querySelector(".modal");

async function openModal(id) {
  const resp = await fetch(`${URL_MOVIE}${id}?api_key=${API_KEY}`, {
    method: "GET",
  });

  const respData = await resp.json();

  modalEl.classList.add("modal--show");
  document.body.classList.add("stop-scrolling");
  {
    /* <li>Video: <a class='modal-movie__video' href='${respData.video}'>${respData.video}</a></li> */
  }
  modalEl.innerHTML = `
<div class='modal__card'>
${
  respData.poster_path
    ? `<img class='modal-movie__backdrop' src='${BASE_IMG_URL}${respData.poster_path}' alt='${respData.title}'>`
    : `<img class='modal-movie__backdrop' src='https://www.theoxygenstore.com/images/source/No-image.jpg' alt='${respData.title}'>`
}

<h2>
<span class='modal-movie__title'>${respData.title}</span>
<span class='modal-movie__realese-year'>- ${respData.release_date.slice(
    0,
    4
  )}</span>
</h2>
<ul class='modal-movie__info'>
<div class='loader'></div>
<li class='modal-movie__genre'>Genre - ${respData.genres.map(
    (elem) => " " + elem.name
  )}</li>
${
  respData.runtime
    ? `<li class='modal-movie__runtime'>Runtime - ${respData.runtime} minutes</li>`
    : ""
}
${
  respData.homepage
    ? `<li>Site: <a class='modal-movie__site' href='${respData.homepage}'>${respData.homepage}</a></li>`
    : ""
}

<li class='modal-movie__overview'>${respData.overview}</li>
</ul>
<button type='button' class='modal__btn-close'>Close</button>
</div>
`;
  const btnClose = document.querySelector(".modal__btn-close");
  btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (evt) => {
  if (evt.target === modalEl) {
    closeModal();
  }
});

window.addEventListener("keydown", (evt) => {
  if (evt.keyCode === 27) {
    closeModal();
  }
});
