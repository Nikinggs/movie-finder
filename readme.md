C3
Movie Finder — Full Project
Search with debounce (500ms)
Results display: poster, title, year, IMDb rating
Movie detail view: plot, actors, director, genre
Error handling: API errors, no results, rate limits
Loading states and pagination
Favourites feature (localStorage)
Fully responsive design 

requirements
-search movies
-debounce search (500ms)
-display poster, year, title and rating
-movie details
-error handling
-loading state
-pagination
-favorites (localstorage)
-resposive design

Build Order which most developer would follow
-HTML structure
-CSS layout
-Search Input
-API fetch
-Display Result
-Debounce
-Loading state
-Error Handling
-Movie Details
-Favorites
-Pagination
-Responsive Design
-Refractor Code




step 1: understand what we are building
-user types
-after 500ms[api request]
-API returns[{
  Title:
  Year:
  Poster:
  idmbRating:
}]
-then we display
-clicking the card shows -Actors-director-plot-genre-rating

step 2: Get Api Key
-we will use omdb api


step 3: project structure
movie finder
|___index.html
|___style.css
|___script.js


step 4: build html
-h1
-input
-status div
-moviecontainer div


step 5: Grab elements from the page with document.getelementbyid()
-search input
-status
-moviecontainer

step 6: Store Api keys
-const api_key : representing https://www.omdbapi.com/?apikey=d8fcdb28
-const api_url : https://www.omdbapi.com/?


step 7: create search/fetch function
async function fetchmovies(title) {
  status.textContent = "Loading...";
  let response = await fetch(``${API_URL}?t=${encodeURIComponent(title)}&apikey=${API_KEY}``);
  const data = await response.json();
  status.textcontent = "";
  console.log(data);
}
thought process
user input - call API - wait - convert response to json - display movies


step 8: event listening
-searchInput.addeventlistener("input", function () {fetchMovies(searchInput.value)});

thought process
every key press: typing fires the input, and this may create many API calls, hence why we need debounce


step 9: Debouncing
-requirement is 500ms debounce: meaing wait until user stops typing before calling api
-create timer variable
let timer;
-searchInput.addeventlistener("input", function () {
  clearTimeout(timer);
  timer = setTimeout(() => {
    fetchMovies(searchInput.value)}, 500)
});


step 10: Displaying Movies
-create 
function renderMovieResult(movies) {
  moviecontainer.innerhtml = "";
  movies.forEach(movie => {
    moviesContainer.innerhtml += `
    <div>
    <img src="${movie.Poster}">
    <h3>${movie.Title}</h3>
    <p>${movie.Year</p>
    </div>
    `};
  })
}
fetchmovies()
renderMovieRsult(data.Search)


step 11: Handle No results
-if omdb returns
{
  Response: "false",
  Error: "Movie not found!"
}
 check
 if (data.Response === "False") {
  movieContainer.innerHtml = "<p>No Movies found</p>"
  return;
 }

step 12: Add Ratings
-search api does not provide ratings
-we need second API call

step 13: Movie Details
<div class="movie-card" onclick="getMovieDetails(`${movie.imdbID}`)">
function
async function getMovieDetails(id) {
  const response = await fetch(`the link inclding id`);
  const data = await response.json()
  console.log(data);
}
-Title
-Actors
-Director
-genre
-plot
-runtime
-rating
async function getMovieDetails(id) {

 const response =
 await fetch(
  https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}
 );

 const data = await response.json();

 console.log(data);
}


step 14: Favorites
-let favorites = JSON.parse(localstorage.getItems("favorites")) || []
-convert string back to array
-favorites.push(movie);
localStorage.setItemss(favorites, JSON.stringify(favorites));


step 15: Pagination
-store
let currentPage = 1
-fetchMovies(searchTerm, currentPage)
<button id="prev">Previous</button>
<button id="next">Next</button>

step 16: loading status
status.context = "loading..."
status.context = ""


step 17: Error Handling
try {
  const response = await fetch(url)
  const data = await response.json();
}
catch(error) {
  movieContainer.innerHtml = <p>something went wrong</p>
}

step 18: Responsive CSS
#movies{
  display:grid
  grid-template-columns: repeat(auto-fit, minimax(250px, 1fr));
  gap:20px
}








name.title
name.year
name.poster
name.idmbRating