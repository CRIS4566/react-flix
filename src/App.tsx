import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Movie from "./Routes/Movie";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
	return (
		<Router>
			<Header />
			<Switch>
				<Route path={["/tvshows", "/tvshows/:tvId"]}>
					<Tv />
				</Route>
				<Route path="/search">
					<Search />
				</Route>
				<Route path={["/", "/movies/:moviedId"]}>
					<Movie />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
