import getMovie from './index.mjs'

let loggedUser = JSON.parse(localStorage.getItem("user"));

let userIcon = document.querySelector(".user")

if (!loggedUser) {
    window.location.href = './login.html'
} else {
    userIcon.classList.remove("fa-regular", "fa-user")
    userIcon.classList.add("fa-solid", "fa-user")
}

let param = new URLSearchParams(window.location.search);
let movieID = param.get("movie_id");

let token = window.env.API_TOKEN;
// let key = window.env.API_KEY;
let imageUrl = 'https://image.tmdb.org/t/p/original/';

let seriesVideo = `https://api.themoviedb.org/3/tv/${movieID}/videos?language=en-US`; 
let movieVideo = `https://api.themoviedb.org/3/movie/${movieID}/videos?language=en-US`; 

let seriesInfo = `https://api.themoviedb.org/3/tv/${movieID}?language=en-U`
let movieInfo = `https://api.themoviedb.org/3/movie/${movieID}?language=en-US`


let container = document.getElementById("container");

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${window.env.API_TOKEN}`
    }
}

// Search

let search = document.getElementById("search")
let searchI = document.querySelector(".fa-magnifying-glass")
search?.addEventListener("keydown", (e) => search.value ? e.keyCode === 13 ? searchContent(search.value) : null : null);
searchI.addEventListener("click", () => search.value ? searchContent(search.value) : null);


async function searchContent(query) {

    if (container) container.style.display = 'none'
    
    let resp = await fetch(`https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1&query=${query}`, options);
    let data = await resp.json();
    
    displayResults(data.results)
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
        imgPath = imgPath ? `${imageUrl}${imgPath}` : 'https://tinyurl.com/4nu9nsc8';

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

getContentById()

async function getContentById() {

    let ops = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    };

    try {

        let seriesChek = await fetch(seriesVideo, ops);

        if (seriesChek.status === 200) {
            return await getSeriesContent(ops)
        }

        let movieCheck = await fetch(movieVideo, ops);

        if (movieCheck.status === 200) {
            return await getMovieContent(ops)
        }
        
    } catch (error) {
        alert("Sorry content not found, Redirecting you back in 2s")
        console.error("Sorry content not found, Redirecting you back in 2s")

        setTimeout(() => {
            window.location.href = './index.html'
        }, 2000)
    }
}

async function getMovieContent(ops) {

    let resp = await fetch(movieVideo, ops);
    let video = await resp.json();

    if (!video.results && video.results.length == 0) {
        return new Error("No video found!")
    }    

    // console.log(video.results);
    
    let iteration = 20;
    let key = undefined;

    for (let idx = 0; idx < Math.min(iteration, video.results.length); idx++) {
        if (video.results[idx].name.toLowerCase().includes('trailer') && video.results[idx].key) {
            key = video.results[idx].key;
            break; 
        }
    }
    
    // let key = video.results[0].key || video.results[1].key || null;

    let res = await fetch(movieInfo, ops);
    let info = await res.json();  

    const movieContent = {
        name: info.original_title,
        video: key,
        imageOne: info.backdrop_path,
        imageTwo: info.poster_path,
        releasedOn: info.release_date,
        no_of_seasons: info.number_of_seasons,
        brief: info.overview,
        genre: info.genres.map(genre => genre.name).join(', ') || 'N/A',
        avg_rating: info.vote_average,
        production: info.production_companies.map(prod => prod.name).join(', ') || 'N/A',
        lang: info.spoken_languages.length > 0 ? info.spoken_languages[0]?.english_name : 'N/A',
        origin: info.production_countries.length > 0 ? info.production_countries[0].name : 'N/A',
    };

    displayContent(movieContent);
}

async function getSeriesContent(ops) {

    let resp = await fetch(seriesVideo, ops);
    let video = await resp.json();

    if (!video.results && video.results.length == 0) {
        return new Error("No video found!")
    }    
    
    let key = video.results[0].key || video.results[1].key || null;

    let res = await fetch(seriesInfo, ops);
    let info = await res.json();
    
    const tvContent = {
        name: info.name,
        video: key,
        imageOne: info.backdrop_path,
        imageTwo: info.poster_path,
        releasedOn: info.first_air_date,
        no_of_seasons: info.number_of_seasons,
        brief: info.overview,
        genre: info.genres.map(genre => genre.name).join(', ') || 'N/A',
        avg_rating: info.vote_average,
        production: info.production_companies.map(prod => prod.name).join(', ') || 'N/A',
        lang: info.spoken_languages.length > 0 ? info.spoken_languages[0]?.english_name : 'N/A',
        origin: info.production_countries.length > 0 ? info.production_countries[0].name : 'N/A',
    };

    displayContent(tvContent);
}

function displayContent(movie) {

    let mainPage = document.createElement("div");
    mainPage.className = 'page'
    
    let videoCard = document.createElement("div");
    videoCard.setAttribute("id", 'video')

    videoCard.innerHTML = `
        <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/${movie.video}?controls=0&showinfo=0" 
            title="${movie.name}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
            allowfullscreen>
        </iframe>
    `

    mainPage.appendChild(videoCard);

    mainPage.innerHTML += `
    
        <div>
            <div class='details'>
            <img src="${imageUrl + movie.imageTwo || imageUrl + movie.imageOne}" />
            <div>
                <h1>${movie.name}</h1>
                <div>
                    <p>4K</p>
                    <p>&starf; ${movie.avg_rating.toFixed(1)}</p>
                </div>
                <p>${movie.brief}</p>
                <p><strong>Country:</strong> ${movie.origin}</p>
                <p><strong>Genre:</strong> ${movie.genre}</p>
                <p><strong>Release:</strong> ${movie.releasedOn}</p>
                <p><strong>Production:</strong> ${movie.production}</p>
            </div>
            </div>
        </div>
    `
    container.appendChild(mainPage);

    recommendation();
}

async function recommendation() {

    let ops = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    };

    const details = document.querySelector(".page");

    let recommends = document.createElement("div");
    recommends.className = 'recommends';

    let resp = await fetch(`https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${Math.floor(Math.random() * 100)}`, ops);
    let data = await resp.json();

    const movies = data.results.slice(0, 8);

    movies.forEach((movie) => {
        let card = document.createElement("div");

        let title = movie.name.split(":")[0];

        title.length >= 24 ? title = title.slice(0,19) : title;
        
        card.innerHTML += `
        <div>
            <img src="${imageUrl + movie.poster_path}" alt="${movie.name}" loading="lazy"/>
            <p>${title}</p>
            <div class="info">
                <h2>${movie.first_air_date.slice(0,4)}</h2>
                <p>&starf; ${movie.vote_average.toFixed(1)}</p>
            </div>
        </div>
        `;
        card.addEventListener("click", getMovie.bind(null, movie.id));
        recommends.appendChild(card);
    });

    details.appendChild(recommends);
}
