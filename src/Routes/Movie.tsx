import { useQuery } from "react-query";
import { Types, IGetMoviesResult, getMovies } from "../api";
import { makeImagePath } from "../utils";
//import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import styled from "styled-components";
//import { useState } from "react";
//import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { Sliders } from "../Components/Sliders";

const Wrapper = styled.div`
	background-color: black;
	padding-bottom: 200px;
	overflow-x: hidden;
`;

const Loader = styled.div`
	height: 20vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 60px;
	background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
		url(${(props) => props.bgphoto});
	background-size: cover;
`;

const Title = styled.h2`
	font-size: 68px;
	margin-bottom: 20px;
`;

const Overview = styled.p`
	font-size: 25px;
	width: 50%;
`;

function Movie() {
	const { data, isLoading } = useQuery<IGetMoviesResult>(
		["movie", "now_playing"],
		() => getMovies(Types.now_playing)
	);

	return (
		<Wrapper>
			{isLoading ? (
				<Loader> Loading...</Loader>
			) : (
				<>
					{/* BANNER Code */}
					<Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
						<Title>{data?.results[0].title}</Title>
						<Overview>{data?.results[0].overview}</Overview>
					</Banner>
					<Sliders type={Types.now_playing} />
					<Sliders type={Types.top_rated} />
					<Sliders type={Types.upcoming} />
				</>
			)}
		</Wrapper>
	);
}

export default Movie;

/*
const BannerBtn = styled.div`
	display: flex;
	width: 150px;
	height: 40px;
	border-radius: 30px;
	background-color: ${(props) => props.theme.black.lighter};
`;

const InfoBtn = styled.button`
	width: 150px;
	height: 40px;
	border-radius: 30px;
	background-color: ${(props) => props.theme.black.lighter};
	color: ${(props) => props.theme.white.lighter};
	font-size: 20px;
	border: none;
`;

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
`;

const BigMovie = styled(motion.div)`
	position: absolute;
	width: 40vw;
	height: 80vh;
	left: 0;
	right: 0;
	margin: 0 auto;
	border-radius: 15px;
	overflow: hidden;
	background-color: ${(props) => props.theme.black.lighter};
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

<BannerBtn>
							<InfoBtn
								onClick={() =>
									onBoxClicked(Number(nowPlayingMovies?.results[0].id))
								}>
								INFO.❗
							</InfoBtn> 
						</BannerBtn>*/

/*	Big Movie Viewer Code	 */
/* 					<AnimatePresence>
						{bigMovieMatch ? (
							<>
								<Overlay
									onClick={onOverlayClick}
									exit={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								/>
								<BigMovie
									style={{ top: scrollY.get() + 100 }}
									layoutId={bigMovieMatch.params.movieId}>
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
					 */
