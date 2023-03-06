import { useQuery } from "react-query";
import { TypeShows, IGetMoviesResult, getTvShows, ITvShows } from "../api";
import { makeImagePath } from "../utils";
//import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import styled from "styled-components";
//import { useState } from "react";
//import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { TvSliders } from "../Components/Sliders";

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

function Tv() {
	const { data, isLoading } = useQuery<ITvShows>(["tvShows", "latest"], () =>
		getTvShows(TypeShows.on_the_air)
	);

	return (
		<Wrapper>
			{isLoading ? (
				<Loader> Loading...</Loader>
			) : (
				<>
					{/* BANNER Code */}

					<Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
						<Title>{data?.results[0].name}</Title>
						<Overview>{data?.results[0].overview}</Overview>
					</Banner>
					<TvSliders type={TypeShows.on_the_air} />
					<TvSliders type={TypeShows.airing_today} />
					<TvSliders type={TypeShows.popular} />
					<TvSliders type={TypeShows.top_rated} />
				</>
			)}
		</Wrapper>
	);
}

export default Tv;
