import { Route, Switch, Redirect } from "react-router-dom";

import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Atlas from "./pages/Atlas";
// import Test from "./pages/Test";

function App() {
	return (
		<Layout>
			<Switch>
				<Route path="/" exact>
					<Redirect to="/atlas" />
				</Route>

				<Route path="/home" exact>
					<Home />
				</Route>

				<Route path="/atlas" exact>
					<Atlas />
				</Route>

				<Route path="*">
					<NotFound />
				</Route>
			</Switch>
		</Layout>
	);
}

export default App;
