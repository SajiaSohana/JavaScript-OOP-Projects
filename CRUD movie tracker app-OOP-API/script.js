// Fetch movies from OMDb API
document.getElementById('searchBtn').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value;
  if (query) {
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=b65b6731`);
    const data = await response.json();
    if (data.Response === 'True') {
      displayMovies(data.Search, 'searchResults');
    } else {
      alert('Movie not found!');
    }
  }
});

// Display movies in cards
function displayMovies(movies, targetElementId) {
  const targetElement = document.getElementById(targetElementId);
  targetElement.innerHTML = ''; // Clear previous results

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('col-md-4'); // 3 columns per row on medium+ devices
    card.innerHTML = `
      <div class="card h-100">
        <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
        <div class="card-body">
          <h5 class="card-title">${movie.Title}</h5>
          <p class="card-text">Year: ${movie.Year}</p>
          <button class="btn btn-outline-light" onclick="addToWatchlist('${movie.imdbID}')">Add to Watchlist</button>
        </div>
      </div>
    `;
    targetElement.appendChild(card);
  });
}

// Add to Watchlist
function addToWatchlist(imdbID) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!watchlist.includes(imdbID)) {
    watchlist.push(imdbID);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert('Added to Watchlist!');
    displayWatchlist(); // Update Watchlist UI
  } else {
    alert('Already in Watchlist!');
  }
}

// Display Watchlist
async function displayWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  const watchlistContainer = document.getElementById('watchlist');
  watchlistContainer.innerHTML = ''; // Clear previous watchlist

  for (let imdbID of watchlist) {
    const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=b65b6731`);
    const movie = await response.json();

    const card = document.createElement('div');
    card.classList.add('col-md-4');
    card.innerHTML = `
      <div class="card h-100">
        <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
        <div class="card-body">
          <h5 class="card-title">${movie.Title}</h5>
          <p class="card-text">Year: ${movie.Year}</p>
          <button class="btn btn-outline-light" onclick="markAsWatched('${imdbID}')">Mark as Watched</button>
          <button class="btn btn-outline-danger mt-2" onclick="removeFromWatchlist('${imdbID}')">Remove</button>
        </div>
      </div>
    `;
    watchlistContainer.appendChild(card);
  }
}

// Mark as Watched
function markAsWatched(imdbID) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  watchlist = watchlist.filter(id => id !== imdbID); // Remove from watchlist
  localStorage.setItem('watchlist', JSON.stringify(watchlist));

  let watched = JSON.parse(localStorage.getItem('watched')) || [];
  if (!watched.includes(imdbID)) {
    watched.push(imdbID);
    localStorage.setItem('watched', JSON.stringify(watched));
  }
  displayWatchlist(); // Update Watchlist UI
  displayWatched();   // Update Watched UI
}

// Remove from Watchlist
function removeFromWatchlist(imdbID) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  watchlist = watchlist.filter(id => id !== imdbID); // Filter out removed movie
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  displayWatchlist(); // Update Watchlist UI
}

// Display Watched Movies
async function displayWatched() {
  const watched = JSON.parse(localStorage.getItem('watched')) || [];
  const watchedContainer = document.getElementById('watchedList');
  watchedContainer.innerHTML = ''; // Clear previous watched list

  for (let imdbID of watched) {
    const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=b65b6731`);
    const movie = await response.json();

    const card = document.createElement('div');
    card.classList.add('col-md-4');
    card.innerHTML = `
      <div class="card h-100">
        <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
        <div class="card-body">
          <h5 class="card-title">${movie.Title}</h5>
          <p class="card-text">Year: ${movie.Year}</p>
          <button class="btn btn-outline-danger" onclick="removeFromWatched('${imdbID}')">Remove</button>
        </div>
      </div>
    `;
    watchedContainer.appendChild(card);
  }
}

// Remove from Watched
function removeFromWatched(imdbID) {
  let watched = JSON.parse(localStorage.getItem('watched')) || [];
  watched = watched.filter(id => id !== imdbID); // Filter out removed movie
  localStorage.setItem('watched', JSON.stringify(watched));
  displayWatched(); // Update Watched UI
}

// Display watchlist and watched movies on load
document.addEventListener('DOMContentLoaded', () => {
  displayWatchlist();
  displayWatched();
});
