# MovieX

MovieX is a mini streaming app where you can watch trailers for the latest movies and shows. Explore genres, search top hits, and enjoy a fast and easy way to preview what’s popular. Perfect for quick browsing, anytime!

## Directory Structure

```
movieX/
├── public/
│   ├── scripts/
│   │   ├── index.mjs
│   │   ├── movie.mjs
│   │   └── apiService.mjs
│   ├── styles/
│   │   ├── index.css
│   │   └── movie.css
│   ├── index.html
│   ├── login.html
│   ├── movie.html
│   └── signup.html
├── .gitignore
├── README.md
└── package.json
```

## Endpoints

```http
  Primary URL https://api.themoviedb.org/3
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Search content by ID

```http
  GET /tv/${ID}/videos?language=en-US
  GET /movie/${ID}/videos?language=en-US
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Search content by name

```http
  GET /search/multi?include_adult=false&language=en-US&page=1&query={Q}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `q`       | `string` | **Required**. query to fetch item |

## Getting started locally

To get it on your local system, enter the following commands in your terminal:

```bash
# clone the repository
git clone https://github.com/kuldeeepy/movieX.git

# move into directory
cd movieX

# Add the following environment variables to your .env file
`API_TOKEN` | `API_KEY`

Enjoy, happy coding!
```

## Snapshot

![App Screenshot](https://snipboard.io/K5RnSk.jpg)

### [Quick demo &#11118;](https://youtu.be/AiJb6ZoMMso)

### Get in touch

[![Website](https://img.shields.io/badge/portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://iamkuldeep.vercel.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kuldeeep-yadav)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=x&logoColor=white)](https://x.com/iamkuldeepY)
