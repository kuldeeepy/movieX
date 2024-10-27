import getMovie from './index.mjs'

/////////////
let loggedUser = JSON.parse(localStorage.getItem("user"));

let userIcon = document.querySelector(".user")

if (!loggedUser) {
    window.location.href = './Pages/login.html'
} else {
    userIcon.classList.remove("fa-regular", "fa-user")
    userIcon.classList.add("fa-solid", "fa-user")
}
/////////////

let param = new URLSearchParams(window.location.search);
let movieID = param.get("movie_id");

let token = apiToken;
let key = apiKey;
let imageUrl = 'https://image.tmdb.org/t/p/original/';

let seriesVideo = `https://api.themoviedb.org/3/tv/${movieID}/videos?language=en-US`; 
let movieVideo = `https://api.themoviedb.org/3/movie/${movieID}/videos?language=en-US`; 

let seriesInfo = `https://api.themoviedb.org/3/tv/${movieID}?language=en-U`
let movieInfo = `https://api.themoviedb.org/3/movie/${movieID}?language=en-US`


let container = document.getElementById("container");

getContentById()


async function getContentById() {

    let ops = {
        method: "GET",
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

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
        console.error("Sorry content not found, try different one!")
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
                <p>Country: ${movie.origin}</p>
                <p>Genre: ${movie.genre}</p>
                <p>Released: ${movie.releasedOn}</p>
                <p>Production: ${movie.production}</p>
            </div>
            </div>
        </div>
    `
    container.appendChild(mainPage);

    recommendation();
}

async function recommendation() {

    const details = document.querySelector(".page");

    let recommends = document.createElement("div");
    recommends.className = 'recommends';

    let ops = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    };

    let resp = await fetch(`https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${Math.floor(Math.random() * 100)}`, ops);
    let data = await resp.json();

    const movies = data.results.slice(0, 8);

    movies.forEach((movie) => {
        let card = document.createElement("div");

        let title = movie.name.split(":")[0];

        title.length > 28 ? title = title.slice(0,25) : title;
        
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
