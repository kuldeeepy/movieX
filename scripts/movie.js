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
let imageUrl = 'https://image.tmdb.org/t/p/original/'
let videoUrl = 'https://www.youtube.com/watch?v='

let seriesUrl = `https://api.themoviedb.org/3/tv/${movieID}/videos?language=en-US`; 
let movieUrl = `https://api.themoviedb.org/3/movie/${movieID}?language=en-US`; 


let container = document.getElementById("container");


// main func calls
getContent()


// movie/series details
async function getContent() {

    let options = {
        method: "GET",
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    try {
        
        let resp = await fetch(seriesUrl, options);
        let data = await resp.json()
    
        if (!data.results) {
            // data.results = data.results[0].key ? data.results[0] : data.results[1]
            let resp = await fetch(movieUrl, options);
            let data = await resp.json()

            displayContent(data.results)
        }

        displayContent(data.results)

    } catch (error) {
        console.error(error)
    }
    
}

function displayContent(movie) {

    console.log(movie);
    

    let videoCard = document.createElement("div");
    videoCard.setAttribute("id", 'video')

    videoCard.innerHTML = `
    
        <video controls width="250">
        <source src="${videoUrl + movieID}" poster=""/>
        Download the
        </video>
    `
    container.appendChild(videoCard);
}