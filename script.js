//GRAB ELEMENTS FROM HTML

const API_KEY = 'd8fcbd28';
const movieForm = document.getElementById('movie-form');
const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchBtn')
const movieContainer = document.getElementById('movieContainer')
const movieDetails = document.getElementById('movieDetails')
const status = document.getElementById('status')

const favoritesContainer = document.getElementById('favoritesContainer');
const pagination = document.getElementById('pagination');
const movieModal = document.getElementById('movieModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');



let favorites = [] //localstorage 
const savedFavorites = localStorage.getItem('favorites');
if (savedFavorites) {
  favorites = JSON.parse(savedFavorites);
  renderFavorites();
}

//OTHER VARIABLE NEEDED


let currentMovies = []//needed for favorite to remember
let debounceTimer;  //needed for clearTimeout()
let currentPage = 1; //needed for pagination
let currentTitle = ""; //needed to remember what was searched in next page


//CREATE SEARCH FUNCTION: async is needed because API request

async function fetchMovies(title, page = 1) {
  currentTitle = title
  currentPage = page
  try {
    status.textContent = "Loading...";
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&page=${page}`;
  let response = await fetch(url);
  const data = await response.json();
   if (data.Response === "False") {
    movieContainer.innerHTML = `<p>${data.Error}</p>` 
    status.textContent = "";
    return;
  }
  currentMovies = data.Search
  renderMovies(data.Search);
  renderPagination(Number(data.totalResults));
  console.log("totalResults:", data.totalResults);
    status.textContent = "";
  return data; 
  }
  catch (error) {
     movieContainer.innerHTML = `<p>Error fetching movie data</p>`;
     status.textContent = "";
     console.error('Error fetching movie data'); 
}}

//CREATE DISPLAYMOVIES

function renderMovies(movies) {
  movieContainer.innerHTML = "";
  movies.forEach(movie => {
    movieContainer.innerHTML +=
    `
    <div class="movie-card bg-white rounded-lg shadow-md p-4 cursor-pointer hover:scale-105 transition-transform duration-200" onclick="fetchMovieDetails('${movie.imdbID}')">
      <img src="${movie.Poster}" alt="${movie.Title}" class="w-full h-64 object-cover rounded-lg mb-4">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="addFavorite('${movie.imdbID}')">Add Favorite</button>
    </div>
    `
    ;
  });
}

//LISTEN FOR CLICKS

searchButton.addEventListener(
  'click', function (event) {
    event.preventDefault();
    const title = searchInput.value.trim();
    fetchMovies(title);
  }
)

//USING ENTER KEY FOR FUNCTIONALITY

searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const title = searchInput.value.trim();
    fetchMovies(title);
  }
})


//DEBOUNCING

searchInput.addEventListener('input', 
  function () {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const title = searchInput.value.trim();
    if (title !== "") {
      fetchMovies(title);
    }
  }, 500);
}
)

//MOVIE DETAILS

async function fetchMovieDetails(Id) 
  
{
  try {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${Id}`;
    let response = await fetch(url);
    const data = await response.json();
     modalBody.innerHTML = `
  <div class="grid md:grid-cols-2 gap-4">

    <img
      src="${data.Poster}"
      alt="${data.Title}"
      class="w-full rounded-lg"
    >

    <div>

      <h2 class="text-2xl font-bold mb-3">
        ${data.Title}
      </h2>

      <p>
        <strong>Year:</strong>
        ${data.Year}
      </p>

      <p>
        <strong>Genre:</strong>
        ${data.Genre}
      </p>

      <p>
        <strong>Director:</strong>
        ${data.Director}
      </p>

      <p>
        <strong>Actors:</strong>
        ${data.Actors}
      </p>

      <p>
        <strong>IMDb Rating:</strong>
        ${data.imdbRating}
      </p>

      <p>
        <strong>Runtime:</strong>
        ${data.Runtime}
      </p>

    </div>

  </div>

  <div class="mt-4">

    <h3 class="font-bold text-lg">
      Plot
    </h3>

    <p>
      ${data.Plot}
    </p>

  </div>
`;
    movieModal.classList.remove('hidden');
    movieModal.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
}

//FAVORITE WHERE WE STOTE IN LOCALSTORAGE

function addFavorite(id) {
  const movie = currentMovies.find(
    movie => movie.imdbID === id
  );
  const exists = favorites.some(fav => fav.imdbID === id);
  if (exists) {
    alert('Movie is already in favorites!');
    return;
  } else if (!exists) {
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
  }
  
}

//RENDER FAVORITES

function renderFavorites() {
  favoritesContainer.innerHTML = "";
  favorites.forEach(movie => {
    favoritesContainer.innerHTML += `
    <div class="favorite-card">
      <img src="${movie.Poster}" alt="${movie.Title}" width="100" height="150">
      <h3>${movie.Title}</h3>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <button onclick="removeFavorite('${movie.imdbID}')">Remove</button>
    </div>
  `});  
}

//REMOVE FAVORITE
function removeFavorite(id) {
  favorites = favorites.filter(movie => movie.imdbID !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

//PAGINATION

function renderPagination(totalResults) {
  const totalpages = Math.ceil(totalResults / 10);
  pagination.innerHTML = "";
  
  if (currentPage > 1) {
    pagination.innerHTML += `
    <button onclick="changePage(${currentPage - 1})">Previous</button>
    `;
  }
  
  if (currentPage < totalpages) {
    pagination.innerHTML += `
    <button onclick="changePage(${currentPage + 1})">Next</button>
    `;
  }
}

function changePage(page) {
  fetchMovies(currentTitle, page);
}

closeModal.addEventListener('click', () => {
  movieModal.classList.add('hidden');
});

movieModal.addEventListener('click', (event) => {
  if (event.target === movieModal) {
    movieModal.classList.add('hidden');
  }
});