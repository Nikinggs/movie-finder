const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchBtn');
const resultContainer = document.getElementById('movieContainer');
const Status = document.getElementById('status');


const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'd8fcbd28';


searchButton.addEventListener('click', async (event) => {
  const title = searchInput.value.trim(); 
  if (title) {
    try {
      const data = await fetchMovieData(title);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
});



async function fetchMovieData(title) {
  try {let response = await fetch(`${API_URL}?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie data:', error);
    throw error;
  }
}
//fetchMovieData("Rambo").then(data => console.log(data));