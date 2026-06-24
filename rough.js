//GRAB ELEMENTS FROM HTML

const API_KEY = 'd8fcbd28';
const movieForm = document.getElementById('movie-form');
const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchBtn')
const movieContainer = document.getElementById('movieContainer')
const movieDetails = document.getElementById('movieDetails')
const status = document.getElementById('status')

const favoritesContainer = document.getElementById('favoritesContainer');



let favorites = [] //localstorage 
const savedFavorites = localStorage.getItem('favorites');
if (savedFavorites.length > 0) {
  favorites = JSON.parse(savedFavorites);
  renderFavorites();
}

//OTHER VARIABLE NEEDED


let currentMovies = []
let debounceTimer;  //needed for clearTimeout()
let currentPage = 1; //needed for pagination
let currentTitle = ""; //needed to remember what was searched in next page


//CREATE SEARCH FUNCTION: async is needed because API request takes time
//status to show loading before API runs
//construct URL
//make request with fetch()
//convert response to json so we can access data.fetch
//handle no results
//DISPLAY MOVIES
//If result exist
//then
//error handling


async function fetchMovies(title, page = 1) {
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
  status.textContent = "";
  return data; 
  }
  catch (error) {
     movieContainer.innerHTML = `<p>Error fetching movie data</p>`;
     status.textContent = "";
     console.error('Error fetching movie data'); 
}}
//fetchMovies('rambo') 


//CREATE DISPLAYMOVIES
//movies = data.Search, movies becomes an array from Search
//loop through the movie with map {element parameter = movie}, 
//where movie is just a variable name
//forEach means go through every items in the array one by one
//moviecontainer.html += is the iteration that replace previous card
//each iteration have title, year, poster and idmb rating
//then build the html inside the loop
//

function renderMovies(movies) {
  movieContainer.innerHTML = "";
  movies.forEach(movie => {
    movieContainer.innerHTML +=
    `
    <div class="movie-card" onclick="fetchMovieDetails('${movie.imdbID}')">
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="addFavorite('${movie.imdbID}')">Add Favorite</button>
    </div>
    `
    ;
  });
}

//LISTEN FOR CLICKS
//when user click search button, the function is called and the title is passed to fetchMovies
//when user click search button, prevent default form submission
//prevent default says don't do the default browser behavior of refreshing the page when the form is submitted, let javascript handle the form submission instead
//then get the title from the input field and call fetchMovies with the title

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
//create the debounceTimer variable
//set timeout to 500ms
//understand and set cleartimeout
//cleartimeout after every input 
//set timeout to 500ms after user stop typing
//if user type again before 500ms, the previous timeout is cleared and a new one is set
//call fetchMovies with the title after 500ms of no typing if title is not empty


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
//create a function to fetch movie details by imdbID
//create a function to render movie details in a modal or separate section
//add event listener to each movie card to fetch and display details when clicked
//When a user clicks on a movie, we want to fetch and show title, year, plot, director, actors, runtime, genre, and ratings. 
//Now we need another API call to get the details of the movie. We can use the imdbID from the search results to make this call.
//now we add movie details in html.
//lets make the card clickable using onclick in html

async function fetchMovieDetails(Id) 
  
{
  try {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${Id}`;
    let response = await fetch(url);
    const data = await response.json();
    movieDetails.innerHTML = `
    <h1>${data.Title}</h1>
    <p><strong>Year:</strong> ${data.Year}</p>
    <p><strong>Plot:</strong> ${data.Plot}</p>
`;
movieDetails.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
}


//FAVORITE WHERE WE STOTE IN LOCALSTORAGE
//CREAT favorit variable
//create where to store current search
//add onclick to favorite button in render
//save data.search in currentmovies inside fetch
//create addfavorite function
//find the movie
//push movie to favorites
//check if movie already exist in favorites avoid duplicates
//save to local storage
//load from local storage by saving in a variable savedfavorites at the top 
//creat html to display favorites in a separate section
//grab the favorites container from html


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
  console.log(movie)
}

//RENDER FAVORITES
//create a function to render favorites in the favorites container
//loop through the favorites array and create html for each favorite movie
//display title, year, poster and remove button
//add event listener to remove button to remove favorite from local storage and update the favorites array
//renderfavorites in addfavorite function after adding a movie to favorites
//add remove button to each favorite movie card

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

//REMOVE FAVORITEremove button function 
function removeFavorite(id) {
  favorites = favorites.filter(movie => movie.imdbID !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}


//PAGINATION
//ADD PAGINATION TO HTML
//PLACE IT AFTER MOVIE CONTAINER
//grab the element
//update search title: currentTitle in fetchmovies to title
//create pagination function
//creat changepage function
//call pagination inside ferchmovie

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