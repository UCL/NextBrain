import { NavLink } from "react-router-dom";

import "./MainNavigation.css";

const MainNavigation = () => {
	return (
		<header className="header">
			<div className="logo">Brain Atlas</div>
			<nav className="nav">
				<ul>
					<li>
						<NavLink to="/Home" activeClassName="active">
							Home
						</NavLink>
					</li>
					<li>
						<NavLink to="/atlas" activeClassName="active">
							See Atlas
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default MainNavigation;
