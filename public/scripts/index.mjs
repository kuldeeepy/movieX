
// Authentication 
/////////////
let loggedUser = JSON.parse(localStorage.getItem("user"));

let userIcon = document.querySelector(".user")

if (!loggedUser) {
    window.location.href = './login.html'
} else {
    userIcon.classList.remove("fa-regular", "fa-user")
    userIcon.classList.add("fa-solid", "fa-user")
}
/////////////

const networks = [213, 49, 2739, 1024]; 

let apiUrl = 'https://api.themoviedb.org/3/';
let token = window.env.API_TOKEN;
let key = window.env.API_KEY;
let imageUrl = 'https://image.tmdb.org/t/p/original/'

// func calls
getDiscover()
getTrending()
getLatestMovies()
getLatestShows()
getUpcoming()

let container = document.getElementById("container")


export default function getMovie(id) {
    
   window.location.href = `./movie.html?movie_id=${id}`
}

// Upcoming movies
async function getUpcoming() {
    
    try {
        let resp1 = await fetch(`${apiUrl}discover/tv?api_key=${key}&sort_by=release_date.desc&page=1`)
        let resp2 = await fetch(`${apiUrl}discover/tv?api_key=${key}&sort_by=release_date.desc&page=2`)

        let data1 = await resp1.json();
        let data2 = await resp2.json();

        data2.results = data2.results.slice(0,7)

        let data = []
    
        if (data1.results && data2.results) {

            data.push(...data1.results, ...data2.results)
            displayUpcoming(data)
        } else {
            console.log('Error: No result found in response.')
        }

    } catch (error) {
        console.error(error);
    }
}

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
async function getLatestShows() {
    
    let options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    try {
        let resp1 = await fetch(`${apiUrl}trending/tv/day?language=en-US&page=${Math.floor(Math.random() * 5)+1}`, options)
        let resp2 = await fetch(`${apiUrl}trending/tv/day?language=en-US&page=${Math.floor(Math.random() * 10)+1}`, options)

        let data1 = await resp1.json();
        let data2 = await resp2.json();

        data2.results = data2.results?.slice(0,7)
        

        let data = []
    
        if (data1.results && data2.results) {
            data.push(...data1.results, ...data2.results)
            displayShows(data)
        } else {
            console.log('Error: No series found in response.')
        }

    } catch (error) {
        console.error(error);
    }
}

function displayShows(movies) {

    let latestDiv = document.querySelector(".latest-shows");

    movies?.forEach((movie) => {
        
        let card = document.createElement("div");

        let imageUrl = `https://image.tmdb.org/t/p/original/${movie.poster_path || movie.backdrop_path}`

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

// Latest movies
async function getLatestMovies() {
    
    let options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    try {
        let resp1 = await fetch(`${apiUrl}movie/now_playing?language=en-US&page=${Math.floor(Math.random() * 10)+1}`, options)
        let resp2 = await fetch(`${apiUrl}movie/now_playing?language=en-US&page=${Math.floor(Math.random() * 11)+1}`, options)

        let data1 = await resp1.json();
        let data2 = await resp2.json();
        
        data2.results = data2.results?.slice(0,7)

        let data = []
    
        if (data1.results && data2.results) {
            data.push(...data1.results, ...data2.results)
            displayMovies(data)
        } else {
            console.log('Error: No movies found in response.')
        }

    } catch (error) {
        console.error(error);
    }
}

function displayMovies(movies) {

    let latestDiv = document.querySelector(".latest-movies");

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
        if (latestDiv) latestDiv.append(card);
    })
    
    return latestDiv;
}

// Trending
async function getTrending() {
    
    let options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    try {
        let resp1 = await fetch(`${apiUrl}movie/popular?language=en-US&page=${Math.floor(Math.random() * 2)+1}`, options)
        let resp2 = await fetch(`${apiUrl}movie/popular?language=en-US&page=${Math.floor(Math.random() * 2)+1}`, options)

        let data1 = await resp1.json();
        let data2 = await resp2.json();

        data2.results = data2.results?.slice(0,7)
        
        let data = []

        if (data1.results && data2.results) {
            data.push(...data1.results, ...data2.results)
            displayTrending(data)
        } else {
            console.log('Error: No movie found in response.')
        }

    } catch (error) {
        console.error(error);
    }
}

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

// Discover banner 
async function getDiscover() {

    try {
        let resp = await fetch(`${apiUrl}discover/tv?api_key=${key}&with_networks=${networks[Math.floor(Math.random() * 4)]}`)
        let data = await resp.json();
    
        if (data.results) {

            let theData = data.results[Math.floor(Math.random() * data.results.length)]
            displayBanner(theData)
        } else {
            console.log('Error: No banner found in response.')
        }

    } catch (error) {
        console.error(error);
    }
}

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
    let imageUrl = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
    
    if (bannerDiv) bannerDiv.style.backgroundImage = `url(${imageUrl})`;

    let btn = banner.querySelector(".btn");
    btn.addEventListener("click", getMovie.bind(null, movie.id))

    if (bannerDiv) bannerDiv.appendChild(banner);
    return bannerDiv;
}
