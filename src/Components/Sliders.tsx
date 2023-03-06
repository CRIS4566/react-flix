import { useQuery } from "react-query";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
	IGetMoviesResult,
	Types,
	TypeShows,
	getMovies,
	getTvShows,
	ITvShows,
} from "../api";

//Slider Style

const Slider = styled.div`
	position: relative;
	height: 35vh;
`;
const SliderTitle = styled.h2`
	font-size: 30px;
	margin-top: 20px;
	margin-bottom: 10px;
	padding-left: 10px;
	color: white;
	font-weight: 800;
`;
const Row = styled(motion.div)`
	display: grid;
	gap: 5px;
	grid-template-columns: repeat(6, 1fr);
	position: absolute;
	width: 100%;
`;
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
const PrevBox = styled(motion.div)`
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-items: center;
	height: 80px;
	width: 80px;
	border-radius: 60px;
	left: 0;
	top: 60px;

	font-size: 75px;
	border: 3px solid white;
	cursor: pointer;
	span {
		margin-top: -14px;
	}
`;
const NextBox = styled(motion.div)`
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-items: center;
	height: 80px;
	width: 80px;
	border-radius: 60px;
	right: 0;
	top: 60px;

	font-size: 75px;
	border: 3px solid white;
	cursor: pointer;
	span {
		margin-top: -14px;
	}
`;
const rowVariants = {
	hidden: (isNext: boolean) => {
		return {
			x: isNext ? window.innerWidth : -window.innerWidth,
		};
	},
	visible: {
		x: 0,
	},
	exit: (isNext: boolean) => {
		return {
			x: isNext ? -window.innerWidth : window.innerWidth,
		};
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

//Big Screen Viewr
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

interface IProps {
	type: Types;
}

interface TvIProps {
	type: TypeShows;
}

export function Sliders({ type }: IProps) {
	const [isSearch, setSearch] = useState(false);

	const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", type], () =>
		getMovies(type)
	);
	const history = useHistory();
	//slider 이동관련
	// isLeave: 슬라이드 내에 이동중인 애니메이션이 끝났는지 확인
	// toggleLeave: 기존 값과 반대로 설정
	// index: 슬라이드 애니메이션 방향 설정
	const [index, setIndex] = useState(0);
	const [isNext, setIsNext] = useState(true);
	const [leaving, setLeaving] = useState(false);
	const toggleLeaving = () => setLeaving((prev) => !prev);
	const increaseIndex = () => {
		if (data) {
			if (leaving) return;
			toggleLeaving();
			const totalMovies = data.results.length - 1;
			const maxIndex = Math.floor(totalMovies / offset) - 1;
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
			setIsNext(() => true);
		}
	};
	const decreaseIndex = () => {
		if (data) {
			// 애니메이션 아직 안끝남
			if (leaving) return;
			else {
				// API data.length
				const mvLength = data.results.length;
				const maxIndex = Math.floor(mvLength / offset);
				toggleLeaving();
				setIndex((prev) => (prev === 0 ? maxIndex - 1 : prev - 1));
				setIsNext(() => false);
			}
		}
	};

	//Movie Viewer
	// movieMatch: "/movie/:id" URL로 이동하였는지 확인한다.
	// searchMatch: "/search/movie/:id" URL로 이동하였는지 확인한다.
	// ScrollY: Scroll Y축으로 이동을 나타냄
	const bigMovieMatch = useRouteMatch<{ movieId: string; type: Types }>(
		`/movies/${type}/:movieId`
	);
	const { scrollY } = useViewportScroll();

	const onOverlayClick = () => history.push("/");
	const clickedMovie =
		bigMovieMatch?.params.movieId &&
		data?.results.find(
			(movie) => String(movie.id) === bigMovieMatch.params.movieId
		);
	const onBoxClicked = ({
		movieId,
		category,
	}: {
		movieId: number;
		category: string;
	}) => {
		history.push(`/movies/${category}/${movieId}`);
	};
	/* 		setTimeout(() => {
			// 검색페이지에서 모달을 클릭했는지 확인
			if (isSearch) {
				history.push(`/search/movie/${movieId}`);
			} else {
				history.push(`/movie/${movieId}`);
			}
		}, 50); */

	/* 	const onBoxClicked = (movieId: number) => {
		history.push(`/movies/${movieId}`);
	}; */

	return (
		<>
			{data ? (
				<>
					{/* Slider Code */}
					<Slider>
						<SliderTitle>{type}</SliderTitle>
						<AnimatePresence
							custom={isNext}
							initial={false}
							onExitComplete={toggleLeaving}>
							<Row
								key={type + index}
								variants={rowVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								transition={{ type: "tween", duration: 1 }}
								custom={isNext}>
								{data?.results
									.slice(offset * index, offset * index + offset)
									.map((movie) => (
										<Box
											layoutId={type + movie.id}
											key={type + movie.id}
											whileHover="hover"
											initial="normal"
											variants={boxVariants}
											onClick={() =>
												onBoxClicked({ movieId: movie.id, category: type })
											}
											transition={{ type: "tween" }}
											bgphoto={makeImagePath(movie.backdrop_path, "w500")}>
											<Info variants={infoVariants}>
												<h4>{movie.title}</h4>
											</Info>
										</Box>
									))}
							</Row>
						</AnimatePresence>
						<PrevBox
							variants={ArrowVariants}
							initial="initial"
							whileHover="hover"
							onClick={decreaseIndex}>
							<span>{"<"}</span>
						</PrevBox>
						<NextBox
							variants={ArrowVariants}
							initial="initial"
							whileHover="hover"
							onClick={increaseIndex}>
							<span>{">"}</span>
						</NextBox>
					</Slider>
					<AnimatePresence>
						{bigMovieMatch ? (
							<>
								<Overlay
									onClick={onOverlayClick}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								/>
								<BigMovie
									style={{ top: scrollY.get() + 50 }}
									layoutId={type + bigMovieMatch.params.movieId}>
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
			) : null}
		</>
	);
}

export function TvSliders({ type }: TvIProps) {
	const [isSearch, setSearch] = useState(false);

	const { data, isLoading } = useQuery<ITvShows>(["tvshows", type], () =>
		getTvShows(type)
	);
	const history = useHistory();
	//slider 이동관련
	// isLeave: 슬라이드 내에 이동중인 애니메이션이 끝났는지 확인
	// toggleLeave: 기존 값과 반대로 설정
	// index: 슬라이드 애니메이션 방향 설정
	const [index, setIndex] = useState(0);
	const [isNext, setIsNext] = useState(true);
	const [leaving, setLeaving] = useState(false);
	const toggleLeaving = () => setLeaving((prev) => !prev);
	const increaseIndex = () => {
		if (data) {
			if (leaving) return;
			toggleLeaving();
			const totaltvs = data.results.length - 1;
			const maxIndex = Math.floor(totaltvs / offset) - 1;
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
			setIsNext(() => true);
		}
	};
	const decreaseIndex = () => {
		if (data) {
			// 애니메이션 아직 안끝남
			if (leaving) return;
			else {
				// API data.length
				const mvLength = data.results.length;
				const maxIndex = Math.floor(mvLength / offset);
				toggleLeaving();
				setIndex((prev) => (prev === 0 ? maxIndex - 1 : prev - 1));
				setIsNext(() => false);
			}
		}
	};

	//Movie Viewer
	// movieMatch: "/movie/:id" URL로 이동하였는지 확인한다.
	// searchMatch: "/search/movie/:id" URL로 이동하였는지 확인한다.
	// ScrollY: Scroll Y축으로 이동을 나타냄
	const bigTvMatch = useRouteMatch<{ tvId: string; type: string }>(
		`/tvshows/${type}/:tvId`
	);
	const { scrollY } = useViewportScroll();

	const onOverlayClick = () => history.push("/tvshows");
	const onBoxClicked = ({
		tvId,
		category,
	}: {
		tvId: number;
		category: string;
	}) => {
		history.push(`/tvshows/${category}/${tvId}`);
	};
	const clickedTv =
		bigTvMatch?.params.tvId &&
		data?.results.find((tv) => String(tv.id) === bigTvMatch.params.tvId);

	/* 	const onBoxClicked = (movieId: number) => {
		history.push(`/movies/${movieId}`);
	}; */
	console.log(clickedTv);
	return (
		<>
			{data ? (
				<>
					{/* Slider Code */}
					<Slider>
						<SliderTitle>{type}</SliderTitle>
						<AnimatePresence
							custom={isNext}
							initial={false}
							onExitComplete={toggleLeaving}>
							<Row
								key={type + index}
								variants={rowVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								transition={{ type: "tween", duration: 1 }}
								custom={isNext}>
								{data?.results
									.slice(offset * index, offset * index + offset)
									.map((tv) => (
										<Box
											layoutId={type + tv.id}
											key={type + tv.id}
											whileHover="hover"
											initial="normal"
											variants={boxVariants}
											onClick={() =>
												onBoxClicked({ tvId: tv.id, category: type })
											}
											transition={{ type: "tween" }}
											bgphoto={makeImagePath(tv.backdrop_path, "w500")}>
											<Info variants={infoVariants}>
												<h4>{tv.name}</h4>
											</Info>
										</Box>
									))}
							</Row>
						</AnimatePresence>
						<PrevBox
							variants={ArrowVariants}
							initial="initial"
							whileHover="hover"
							onClick={decreaseIndex}>
							<span>{"<"}</span>
						</PrevBox>
						<NextBox
							variants={ArrowVariants}
							initial="initial"
							whileHover="hover"
							onClick={increaseIndex}>
							<span>{">"}</span>
						</NextBox>
					</Slider>
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
									layoutId={type + bigTvMatch.params.tvId}>
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
			) : null}
		</>
	);
}
