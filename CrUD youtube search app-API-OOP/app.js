const API_KEY = ''; //api key 
const channelList = JSON.parse(localStorage.getItem('favoriteChannels')) || [];

document.addEventListener('DOMContentLoaded', () => {
  displayChannels();
  displayLatestVideos();
});

document.getElementById('searchBtn').addEventListener('click', async () => {
  const query = document.getElementById('channelSearch').value;
  if (query) {
    const results = await searchYouTubeChannels(query);
    displaySearchResults(results);
  }
});

async function searchYouTubeChannels(query) {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${query}&key=${API_KEY}`);
  const data = await response.json();
  return data.items;
}

function displaySearchResults(results) {
  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = ''; // Clear previous results

  results.forEach(result => {
    const card = document.createElement('div');
    card.classList.add('card', 'col-12', 'col-md-4', 'col-lg-3');
    card.innerHTML = `
      <img src="${result.snippet.thumbnails.high.url}" class="card-img-top" alt="${result.snippet.title}">
      <div class="card-body">
        <h5 class="card-title">${result.snippet.title}</h5>
        <button class="btn btn-primary" onclick="saveChannel('${result.id.channelId}', '${result.snippet.title}', '${result.snippet.thumbnails.high.url}')">Add to Favorites</button>
      </div>
    `;
    searchResultsDiv.appendChild(card);
  });
}

function saveChannel(channelId, title, thumbnail) {
  if (!channelList.some(channel => channel.id === channelId)) {
    channelList.push({ id: channelId, title, thumbnail });
    localStorage.setItem('favoriteChannels', JSON.stringify(channelList));
    displayChannels();
    displayLatestVideos();
  }
}

function displayChannels() {
  const channelListDiv = document.getElementById('channelList');
  channelListDiv.innerHTML = '';
  
  channelList.forEach(channel => {
    const card = document.createElement('div');
    card.classList.add('card', 'col-12', 'col-md-4', 'col-lg-3');
    card.innerHTML = `
      <img src="${channel.thumbnail}" class="card-img-top" alt="${channel.title}">
      <div class="card-body">
        <h5 class="card-title">${channel.title}</h5>
        <button class="btn btn-danger" onclick="removeChannel('${channel.id}')">Remove</button>
      </div>
    `;
    channelListDiv.appendChild(card);
  });
}

function removeChannel(channelId) {
  const index = channelList.findIndex(channel => channel.id === channelId);
  if (index !== -1) {
    channelList.splice(index, 1);
    localStorage.setItem('favoriteChannels', JSON.stringify(channelList));
    displayChannels();
    displayLatestVideos();
  }
}

async function displayLatestVideos() {
  const videoListDiv = document.getElementById('videoList');
  videoListDiv.innerHTML = '';

  for (const channel of channelList) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id}&order=date&type=video&maxResults=5&key=${API_KEY}`);
    const data = await response.json();

    data.items.forEach(video => {
      const card = document.createElement('div');
      card.classList.add('card', 'col-12', 'col-md-4', 'col-lg-3');
      card.innerHTML = `
        <img src="${video.snippet.thumbnails.high.url}" class="card-img-top" alt="${video.snippet.title}">
        <div class="card-body">
          <h5 class="card-title">${video.snippet.title}</h5>
          <a href="https://www.youtube.com/watch?v=${video.id.videoId}" class="btn btn-primary" target="_blank">Watch</a>
        </div>
      `;
      videoListDiv.appendChild(card);
    });
  }
}
