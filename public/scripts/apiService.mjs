
const networks = [213, 49, 2739, 1024]; 

const apiUrl = 'https://api.themoviedb.org/3/';
const token = window.env.API_TOKEN;
const key = window.env.API_KEY;

let options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
}

// For Home Page //

// Upcoming 
export async function getUpcoming() {

    let resp1 = await fetch(`${apiUrl}discover/tv?api_key=${key}&sort_by=release_date.desc&page=1`)
    let resp2 = await fetch(`${apiUrl}discover/tv?api_key=${key}&sort_by=release_date.desc&page=2`)

    let data1 = await resp1.json();
    let data2 = await resp2.json();

    data2.results = data2.results?.slice(0,7)

    const data = []

    if (data1.results && data2.results) {
        data.push(...data1.results, ...data2.results)
        return data;
    } else {
        console.error('Error: No movie found, try next time.')
    }

}

// Latest Show
export async function getLatestShows() {

    let resp1 = await fetch(`${apiUrl}trending/tv/day?language=en-US&page=${Math.floor(Math.random() * 5)+1}`, options)
    let resp2 = await fetch(`${apiUrl}trending/tv/day?language=en-US&page=${Math.floor(Math.random() * 10)+1}`, options)

    let data1 = await resp1.json();
    let data2 = await resp2.json();

    data2.results = data2.results?.slice(0,7)

    const data = []

    if (data1.results && data2.results) {
        data.push(...data1.results, ...data2.results)
        return data;
    } else {
        console.error('Error: No show found, try next time.')
    }

}

// Latest Movie
export async function getLatestMovies() {

    let resp1 = await fetch(`${apiUrl}movie/now_playing?language=en-US&page=${Math.floor(Math.random() * 10)+1}`, options)
    let resp2 = await fetch(`${apiUrl}movie/now_playing?language=en-US&page=${Math.floor(Math.random() * 11)+1}`, options)

    let data1 = await resp1.json();
    let data2 = await resp2.json();

    data2.results = data2.results?.slice(0,7)

    const data = []

    if (data1.results && data2.results) {
        data.push(...data1.results, ...data2.results)
        return data;
    } else {
        console.error('Error: No movie found, try next time.')
    }

}

// Trending
export async function getTrending() {

    let resp1 = await fetch(`${apiUrl}movie/popular?language=en-US&page=${Math.floor(Math.random() * 2)+1}`, options)
    let resp2 = await fetch(`${apiUrl}movie/popular?language=en-US&page=${Math.floor(Math.random() * 2)+1}`, options)

    let data1 = await resp1.json();
    let data2 = await resp2.json();

    data2.results = data2.results?.slice(0,7)

    const data = []

    if (data1.results && data2.results) {
        data.push(...data1.results, ...data2.results)
        return data;
    } else {
        console.error('Error: No movie found, try next time.')
    }

}

// Discover Banner
export async function getDiscover() {

    let response = await fetch(`${apiUrl}discover/tv?api_key=${key}&with_networks=${networks[Math.floor(Math.random() * 4)]}`)
    let data = await response.json();

    if (data.results) {
        let theData = data.results[Math.floor(Math.random() * data.results?.length)]
        return theData

    } else {
        console.error('Error: No banner found, try next time.')
    }
}