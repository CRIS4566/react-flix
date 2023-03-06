import { motion, useViewportScroll, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { constSelector } from "recoil";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import {
	IGetMoviesResult,
	getSearch,
	ITvShows,
	Types,
	TypeShows,
} from "../api";

const Box = styled(motion.div)<{ bgphoto: string }>`
	background-color: white;
	background-image: url(${(props) => props.bgphoto});
	background-size: cover;
	background-position: cetner center;
	height: 200px;
	font-size: 66px;
	cursor: pointer;

	&:first-child {
		transform-origin: center left;
	}
	&:last-child {
		transform-origin: center right;
	}
`;
const Info = styled(motion.div)`
	padding: 10px;
	background-color: ${(props) => props.theme.black.lighter};
	opacity: 0;
	position: absolute;
	width: 100%;
	bottom: 0;
	h4 {
		text-align: center;
		font-size: 18px;
	}
`;
const infoVariants = {
	hover: {
		opacity: 1,
		transition: {
			delay: 0.5,
			duration: 0.1,
			type: "tween",
		},
	},
};
const ArrowVariants = {
	initial: {
		opacity: 0.2,
		color: "rgba(255,255,255, 1)",
	},
	hover: {
		opacity: 0.7,
		color: "rgba(0, 0, 0, 1)",
		backgroundColor: "rgba(255,255,255, 1)",
	},
};
const boxVariants = {
	normal: {
		scale: 1,
	},
	hover: {
		scale: 1.3,
		y: -80,
		transition: {
			delay: 0.5,
			duaration: 0.1,
			type: "tween",
		},
	},
};

//Big Movie Viewer Style
const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
	z-index: 3;
`;
const BigMovie = styled(motion.div)`
	position: absolute;
	width: 45vw;
	height: 85vh;
	left: 0;
	right: 0;
	margin: 0 auto;
	border-radius: 15px;
	overflow: hidden;
	background-color: ${(props) => props.theme.black.lighter};
	z-index: 4;
`;
const BigCover = styled.div`
	width: 100%;
	background-size: cover;
	background-position: center center;
	height: 400px;
`;
const BigTitle = styled.h3`
	color: ${(props) => props.theme.white.lighter};
	padding: 20px;
	font-size: 46px;
	position: relative;
	top: -80px;
`;
const BigOverview = styled.p`
	padding: 20px;
	position: relative;
	top: -80px;
	color: ${(props) => props.theme.white.lighter};
`;
const offset = 6;

const TemplateBox = styled.div`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-template-rows: repeat(auto, 1fr);
	column-gap: 10px;
	row-gap: 50px;
	margin-bottom: 100px;
`;
const TextExcept = styled.div`
	width: 100%;
	text-align: center;
	font-size: 36px;
	font-weight: 600;
`;

export function MoviesSearchViewer({ keyword }: { keyword: string | null }) {
	const history = useHistory();
	const bigMovieMatch = useRouteMatch<{ movieId: string; type: Types }>(
		`/search/:movieId`
	);
	const { data: dataFirst, isLoading: isLoadingFirst } =
		useQuery<IGetMoviesResult>(["search: " + keyword + "movie", 1], () =>
			getSearch({
				keyword: keyword,
				category: "movie",
				page: 1,
			})
		);
	const { data: dataSecond, isLoading: isLoadingSecond } =
		useQuery<IGetMoviesResult>(["search: " + keyword + "movie", 2], () =>
			getSearch({
				keyword: keyword,
				category: "movie",
				page: 2,
			})
		);

	const noData = dataFirst?.total_pages!! < 1;
	const { scrollY } = useViewportScroll();

	const onBoxClicked = ({ movieId }: { movieId: number }) => {
		history.push(`/search/${movieId}?category=movies&keyword=${keyword}`);
	};

	const onOverlayClick = () =>
		history.push(`/search/?category=movies&keyword=${keyword}`);

	const clickedMovie =
		(bigMovieMatch?.params.movieId &&
			dataFirst?.results.find(
				(movie) => String(movie.id) === bigMovieMatch.params.movieId
			)) ||
		dataSecond?.results.find(
			(movie) => String(movie.id) === bigMovieMatch?.params.movieId
		);

	return noData ? (
		<TextExcept>No search results</TextExcept>
	) : isLoadingFirst && isLoadingSecond ? (
		<TextExcept>Loading . . .</TextExcept>
	) : (
		<>
			<TemplateBox key={"movie"}>
				{dataFirst?.results.map((movie) => (
					<Box
						layoutId={movie.id.toString()}
						key={movie.id}
						variants={boxVariants}
						onClick={() => onBoxClicked({ movieId: movie.id })}
						initial="normal"
						whileHover="hover"
						transition={{
							type: "tween",
						}} //transition을 props로 넣어줘야 끝날 때도 tween이 적용됨
						bgphoto={makeImagePath(movie.backdrop_path, "w500")}>
						<Info variants={infoVariants}>
							<h4>{movie.title}</h4>
						</Info>
					</Box>
				))}
				{dataSecond?.results.map((movie: any) => (
					<Box
						layoutId={movie.id.toString()}
						key={movie.id}
						variants={boxVariants}
						onClick={() => onBoxClicked({ movieId: movie.id })}
						initial="normal"
						whileHover="hover"
						transition={{
							type: "tween",
						}} //transition을 props로 넣어줘야 끝날 때도 tween이 적용됨
						bgphoto={makeImagePath(movie.backdrop_path, "w500")}>
						<Info variants={infoVariants}>
							<h4>{movie.title}</h4>
						</Info>
					</Box>
				))}
			</TemplateBox>
			<AnimatePresence>
				{bigMovieMatch ? (
					<>
						<Overlay
							onClick={onOverlayClick}
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						/>
						<BigMovie
							style={{ top: scrollY.get() + 100 }}
							layoutId={bigMovieMatch.params.movieId!!.toString()}>
							{clickedMovie && (
								<>
									<BigCover
										style={{
											backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
												clickedMovie.backdrop_path,
												"w500"
											)})`,
										}}
									/>
									<BigTitle>{clickedMovie.title}</BigTitle>
									<BigOverview>{clickedMovie.overview}</BigOverview>
								</>
							)}
						</BigMovie>
					</>
				) : null}
			</AnimatePresence>
		</>
	);
}

export function TvSearchViewer({ keyword }: { keyword: string | null }) {
	const history = useHistory();
	const bigTvMatch = useRouteMatch<{ tvId: string; type: Types }>(
		`/search/:tvId`
	);
	const { data: dataFirst, isLoading: isLoadingFirst } = useQuery<ITvShows>(
		["search: " + keyword + "tv", 1],
		() =>
			getSearch({
				keyword: keyword,
				category: "tv",
				page: 1,
			})
	);
	const { data: dataSecond, isLoading: isLoadingSecond } = useQuery<ITvShows>(
		["search: " + keyword + "tv", 2],
		() =>
			getSearch({
				keyword: keyword,
				category: "tv",
				page: 2,
			})
	);

	const noData = dataFirst?.total_pages!! < 1;
	const { scrollY } = useViewportScroll();

	const onBoxClicked = ({ tvId }: { tvId: number }) => {
		history.push(`/search/${tvId}?category=movies&keyword=${keyword}`);
	};

	const onOverlayClick = () =>
		history.push(`/search/?category=movies&keyword=${keyword}`);

	const clickedTv =
		(bigTvMatch?.params.tvId &&
			dataFirst?.results.find(
				(tv) => String(tv.id) === bigTvMatch.params.tvId
			)) ||
		dataSecond?.results.find((tv) => String(tv.id) === bigTvMatch?.params.tvId);

	return noData ? (
		<TextExcept>No search results</TextExcept>
	) : isLoadingFirst && isLoadingSecond ? (
		<TextExcept>Loading . . .</TextExcept>
	) : (
		<>
			<TemplateBox key={"movie"}>
				{dataFirst?.results.map((tv) => (
					<Box
						layoutId={tv.id.toString()}
						key={tv.id}
						variants={boxVariants}
						onClick={() => onBoxClicked({ tvId: tv.id })}
						initial="normal"
						whileHover="hover"
						transition={{
							type: "tween",
						}} //transition을 props로 넣어줘야 끝날 때도 tween이 적용됨
						bgphoto={makeImagePath(tv.backdrop_path, "w500")}>
						<Info variants={infoVariants}>
							<h4>{tv.name}</h4>
						</Info>
					</Box>
				))}
				{dataSecond?.results.map((tv: any) => (
					<Box
						layoutId={tv.id.toString()}
						key={tv.id}
						variants={boxVariants}
						onClick={() => onBoxClicked({ tvId: tv.id })}
						initial="normal"
						whileHover="hover"
						transition={{
							type: "tween",
						}} //transition을 props로 넣어줘야 끝날 때도 tween이 적용됨
						bgphoto={makeImagePath(tv.backdrop_path, "w500")}>
						<Info variants={infoVariants}>
							<h4>{tv.name}</h4>
						</Info>
					</Box>
				))}
			</TemplateBox>
			<AnimatePresence>
				{bigTvMatch ? (
					<>
						<Overlay
							onClick={onOverlayClick}
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						/>
						<BigMovie
							style={{ top: scrollY.get() + 100 }}
							layoutId={bigTvMatch.params.tvId!!.toString()}>
							{clickedTv && (
								<>
									<BigCover
										style={{
											backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
												clickedTv.backdrop_path,
												"w500"
											)})`,
										}}
									/>
									<BigTitle>{clickedTv.name}</BigTitle>
									<BigOverview>{clickedTv.overview}</BigOverview>
								</>
							)}
						</BigMovie>
					</>
				) : null}
			</AnimatePresence>
		</>
	);
}
