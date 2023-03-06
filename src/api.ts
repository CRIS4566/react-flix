const API_KEY = "4af1a975dd2c17efb0f80b9039a5b286";
const BASE_PATH = "https://api.themoviedb.org/3";

export enum Types {
	"now_playing" = "now_playing",
	"latest" = "latest",
	"top_rated" = "top_rated",
	"upcoming" = "upcoming",
}

export enum TypeShows {
	"on_the_air" = "on_the_air",
	"airing_today" = "airing_today",
	"popular" = "popular",
	"top_rated" = "top_rated",
}
interface IMovie {
	id: number;
	backdrop_path: string;
	poster_path: string;
	title: string;
	overview: string;

	original_language?: string;
	original_title?: string;
	popularity?: number;
	release_date?: string;
	adult?: boolean;
	video?: boolean;
	vote_average?: number;
	vote_count?: number;
}

export interface IGetMoviesResult {
	dates: {
		maximum: string;
		minimum: string;
	};
	page: number;
	results: IMovie[];
	total_pages: number;
	total_results: number;
}

interface ITvShow {
	backdrop_path: string;
	first_air_date: string;
	genre_ids: number[];
	id: number;
	name: string;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	vote_average: number;
	vote_count: number;
}

export interface ITvShows {
	page: number;
	results: ITvShow[];
	total_pages: number;
}

export async function getSearch({
	keyword,
	category,
	page,
}: {
	keyword: string | null;
	category: string;
	page: number;
}) {
	return (
		await fetch(
			`${BASE_PATH}/search/${category}?api_key=${API_KEY}&query=${keyword}&page=${page}`
		)
	).json();
}

//Movie-NowPlaing
export function getMovies(type: Types) {
	return fetch(`${BASE_PATH}/movie/${type}?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

// TV - latest
export function getTvShows(type: TypeShows) {
	return fetch(`${BASE_PATH}/tv/${type}?api_key=${API_KEY}`).then((response) =>
		response.json()
	);
}

// TV - Airing Today
export function getAiring() {
	return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

// TV - Popular
export function getPopularTv() {
	return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
		response.json()
	);
}

// TV - Top Rated
export function getTopRated() {
	return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}
