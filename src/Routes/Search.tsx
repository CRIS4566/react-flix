import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { MoviesSearchViewer, TvSearchViewer } from "../Components/Serchview";

const Wrapper = styled.div`
	margin: 150px 60px 0px 90px;
`;

const Btns = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 120px;
`;

const CatButton = styled(motion.div)`
	color: rgb(255, 255, 255);
	cursor: pointer;
	margin: 0px 60px 0px 0px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Keyword = styled.h1`
	margin: 50px 0px;
	font-size: 36px;
	font-weight: 500;
`;

const btnVariants = {
	start: {
		width: "60px",
		height: "60px",
	},
	end: ({ category }: { category: boolean }) => ({
		width: "80px",
		height: "80px",
		transition: {
			duration: 0.4,
			type: "tween",
		},
		opacity: category ? 1 : 0.3,
	}),
};

const btnTextVariants = {
	start: {
		fontSize: "16px",
	},
	end: ({ category }: { category: boolean }) => ({
		fontSize: "16px",
		fontWeight: category ? 600 : 300,
		transition: {
			duration: 0.4,
			type: "tween",
		},
		opacity: category ? 1 : 0.3,
	}),
};

function Search() {
	const location = useLocation();
	const searchTab = new URLSearchParams(location.search);
	const history = useHistory();
	const keyword = searchTab.get("keyword");
	const [category, setCategory] = useState(
		searchTab.get("category") === "movies"
	);

	const movieBtnClicked = () => {
		setCategory(true);
		searchTab.set("category", "movies");
		history.push(`/search/${searchTab.toString()}`);
	};
	const tvBtnClicked = () => {
		setCategory(false);
		searchTab.set("category", "movies");
		history.push(`/search/${searchTab.toString()}`);
	};

	return (
		<>
			<Wrapper>
				<Btns>
					<CatButton onClick={movieBtnClicked}>
						<motion.svg
							variants={btnVariants}
							initial="start"
							animate="end"
							custom={{ category: category }}
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 576 512"
							fill="currentColor">
							<path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
						</motion.svg>
						<motion.span
							variants={btnTextVariants}
							initial="start"
							animate="end"
							custom={{ category: category }}>
							MOVIE
						</motion.span>
					</CatButton>
					<CatButton onClick={tvBtnClicked}>
						{/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 64V352H576V64H64zM0 64C0 28.7 28.7 0 64 0H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM128 448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>*/}
						<motion.svg
							variants={btnVariants}
							initial="start"
							animate="end"
							custom={{ category: !category }}
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 512"
							fill="currentColor">
							<path d="M64 64V352H576V64H64zM0 64C0 28.7 28.7 0 64 0H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM128 448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
						</motion.svg>
						<motion.span
							variants={btnTextVariants}
							initial="start"
							animate="end"
							custom={{ category: !category }}>
							TV
						</motion.span>
					</CatButton>
				</Btns>

				<Keyword>Search: {keyword}</Keyword>
				{category ? (
					<MoviesSearchViewer keyword={keyword} />
				) : (
					<>
						<TvSearchViewer keyword={keyword} />
					</>
				)}
			</Wrapper>
		</>
	);
}

export default Search;
