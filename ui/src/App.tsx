import { Route, Routes, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Atlas from "./pages/Atlas";

function App() {
	return (
		<Layout>
			<Routes>
				<Route path="/" element={<Navigate replace to="/home" />} />

				<Route path="/home" element={<Home />} />

				<Route path="/atlas" element={<Atlas />} />

				<Route path="*" element={<NotFound />} />
			</Routes>
		</Layout>
	);
}

export default App;
