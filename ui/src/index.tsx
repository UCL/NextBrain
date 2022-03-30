import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";

// we use HashRouter to make it compatible with GitHub pages
// https://medium.com/@bennirus/deploying-a-create-react-app-with-routing-to-github-pages-f386b6ce84c2
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
	<React.StrictMode>
		<HashRouter>
			<App />
		</HashRouter>
	</React.StrictMode>
);
