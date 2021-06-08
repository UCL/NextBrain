import { Fragment } from "react";

import "./Layout.css";
import MainNavigation from "./MainNavigation";

const Layout = (props) => {
	return (
		<Fragment>
			<MainNavigation />
			<main className="main">{props.children}</main>
		</Fragment>
	);
};

export default Layout;
