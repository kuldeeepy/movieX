
import { getDiscover, getTrending, getLatestMovies, getLatestShows, getUpcoming } from "./apiService.mjs";

let loggedUser = JSON.parse(localStorage.getItem("user"));
let userIcon = document.querySelector(".user")

if (!loggedUser) {
    window.location.href = './login.html'
} else {
    userIcon.classList.remove("fa-regular", "fa-user")
    userIcon.classList.add("fa-solid", "fa-user")
}

export default function getMovie(id) {
   window.location.href = `./movie.html?movie_id=${id}`
}

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${window.env.API_TOKEN}`
    }
}

// Search
let searchTimer;
const imageUrl = 'https://image.tmdb.org/t/p/original'
const banner = document.querySelector(".banner")
const container = document.getElementById("container")

let search = document.getElementById("search")
let searchI = document.querySelector(".fa-magnifying-glass")

// debouncing
search.addEventListener("input", debouncedSearch);

// throttling
search?.addEventListener("keydown", (e) => e.key === "Enter" && search.value ? debouncedSearch() : null);
searchI?.addEventListener("click", () => search.value ? debouncedSearch() : null);

function debouncedSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        searchContent()
    }, 650)
}


async function searchContent() {

    if (search.value?.length >= 2) {

        banner ? banner.style.display = 'none' : null
        container ? container.style.display = 'none' : null
        
        let resp = await fetch(`https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1&query=${search.value}`, options);
        let data = await resp.json();
        displayResults(data.results)
    }
}

function displayResults(content) {

    let searchRes = document.querySelector(".search-res");
    searchRes.innerHTML = ""; 

    content?.forEach((movie) => {
        let card = document.createElement("div");
        let childObj = {};

        if (movie.known_for && movie.known_for.length > 0) {
            childObj = movie.known_for.find(item => Object.values(item).every(val => val != null)) || movie.known_for[0];
        }

        const { 
            poster_path, 
            backdrop_path, 
            original_title, 
            vote_average, 
            release_date 
        } = childObj;


        let imgPath = poster_path || backdrop_path || movie.poster_path || movie.backdrop_path;
        imgPath = imgPath ? `${imageUrl}/${imgPath}` : 'https://tinyurl.com/4nu9nsc8';

        let title = movie.original_title || movie.title || movie.original_name || original_title;

        // title = title.split(/[:|,]/)[0].trim().slice(0, 21);
        if (title.length > 15) title = title.slice(0, 11) + '...';

        let release = movie.release_date || movie.first_air_date || release_date;
        let stars = movie.vote_average || vote_average;

        card.innerHTML = `
            <img src="${imgPath}" alt="${original_title || movie.title || movie.name}" loading="lazy"/>
            <p>${title}</p>
            <div class="info">
                <h2>${release?.slice(0, 4) || new Date().getFullYear()}</h2>
                <p>&starf; ${stars?.toFixed(1) || '5.7'}</p>
            </div>
        `;

        card?.addEventListener("click", getMovie.bind(null, movie.id));
        searchRes.append(card);
    });

    return searchRes;
}

// main init func
async function init() {

    try {

        let discoverBanner = await getDiscover();
        displayBanner(discoverBanner);

        let trending = await getTrending();
        displayTrending(trending);

        let latestMovies = await getLatestMovies();
        displayMovies(latestMovies);

        let latestShows = await getLatestShows();
        displayShows(latestShows);

        let upcomings = await getUpcoming();
        displayUpcoming(upcomings)
        
    } catch (error) {
        console.error(error)
    }
}

init();

function displayUpcoming(movies) {

    let latestDiv = document.querySelector(".coming-soon");

    movies?.forEach((movie) => {

        let card = document.createElement("div");

        let imageUrl = `https://image.tmdb.org/t/p/original/${movie.poster_path}`


        let title = movie.name.split(":")[0]

        title.length > 28 ? title = title.slice(0,25) : title;

        card.innerHTML = `
        
            <img src="${imageUrl}" alt="${movie.title}" loading="lazy"/>
            <p>${title}</p>
            <div class="info">
                <h2>${movie.first_air_date.slice(0,4)}</h2>
                <p>&starf; ${movie.vote_average.toFixed(1)}</p>
            </div>
        `

        card.addEventListener("click", getMovie.bind(null, movie.id))
        if (latestDiv) latestDiv.append(card);
    })
    
    return latestDiv;
}

// Latest TV Shows
function displayShows(shows) {

    let latestDiv = document.querySelector(".latest-shows");

    shows?.forEach((show) => {
        
        let card = document.createElement("div");

        let imageUrl = `https://image.tmdb.org/t/p/original/${show.poster_path || show.backdrop_path}`

        let title = show.name.split(":")[0]

        title.length > 28 ? title = title.slice(0,21) : title;

        card.innerHTML = `
        
            <img src="${imageUrl}" alt="${show.title}" loading="lazy"/>
            <p>${title}</p>
            <div class="info">
                <h2>${show.first_air_date.slice(0,4)}</h2>
                <p>&starf; ${show.vote_average.toFixed(1)}</p>
            </div>
        `

        card.addEventListener("click", getMovie.bind(null, show.id))
        if (latestDiv) latestDiv.append(card);
    })
    
    return latestDiv;
}

// Latest movies
function displayMovies(movies) {

    let latestDiv = document.querySelector(".latest-movies");

    movies?.forEach((movie) => {
        
        let card = document.createElement("div");

        let imageUrl = `https://image.tmdb.org/t/p/original/${movie.poster_path}`


        let title = movie.title.split(/[:|,]/)[0].trim().slice(0, 21);
        if (title.length > 20) title = title.slice(0, 21) + '...';

        card.innerHTML = `
        
            <img src="${imageUrl}" alt="${movie.title}" loading="lazy"/>
            <p>${title}</p>
            <div class="info">
                <h2>${movie.release_date.slice(0,4)}</h2>
                <p>&starf; ${movie.vote_average.toFixed(1)}</p>
            </div>
        `

        card.addEventListener("click", getMovie.bind(null, movie.id))
        if (latestDiv) latestDiv.append(card);
    })
    
    return latestDiv;
}

// Trending
function displayTrending(movies) {
    
    let trendingDiv = document.querySelector(".trending");

    movies?.forEach((movie) => {

        let card = document.createElement("div");

        let imageUrl = `https://image.tmdb.org/t/p/original/${movie.poster_path}`


        let title = movie.title.split(":")[0]
        card.innerHTML = `
        
            <img src="${imageUrl}" alt="${movie.title}" loading="lazy"/>
            <p>${title}</p>
            <div class="info">
                <h2>${movie.release_date.slice(0,4)}</h2>
                <p>&starf; ${movie.vote_average.toFixed(1)}</p>
            </div>
        `

        card.addEventListener("click", getMovie.bind(null, movie.id))
        if (trendingDiv) trendingDiv.append(card);
    })
    
    return trendingDiv;
}

// async function updateBanner() {

//     document.querySelector(".banner").innerHTML = "";
//     let content = await getDiscover();

//     if(content) {
//         displayBanner(content)
//     }
// }

// setInterval(updateBanner, 3000)

// Discover banner 
function displayBanner(movie) {  
    
    let bannerDiv = document.querySelector(".banner");

    let maxLength = 165;
    if (movie.overview.length > maxLength ) {
        movie.overview = movie.overview.slice(0, maxLength) + '...'
    }
        
    let banner = document.createElement("div"); 
    banner.classList.add("banner-content")

    banner.innerHTML = `

        <h1>${movie.name}</h1>
        <div class="detail">
            <p>4K</p>
            <p>TMDB: ${movie.vote_average.toFixed(1)}</p>
            <p>Adult: ${movie.adult ? 'Yes' : 'No'}</p>
        </div>
        <p class="desc">${movie.overview}<p>
        <div>
            <i class="fa-solid fa-play"></i>
            <h3 class="btn">Watch now</h3>
        </div>
    `
    let img = `${imageUrl}/${movie.backdrop_path}`;
    
    if (bannerDiv) bannerDiv.style.backgroundImage = `url(${img})`;

    let btn = banner.querySelector(".btn");
    btn.addEventListener("click", getMovie.bind(null, movie.id))

    if (bannerDiv) bannerDiv.appendChild(banner);
    return bannerDiv;
}