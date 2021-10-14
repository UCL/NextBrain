import { NavLink } from "react-router-dom";

import "./MainNavigation.css";

const MainNavigation = () => {
	return (
		<header className="header">
			<div className="logo">Brain Atlas</div>
			<nav className="nav">
				<ul>
					<li>
						<NavLink to="/home" activeClassName="active">
							Home
						</NavLink>
					</li>

					<li>
						<NavLink to="/atlas" activeClassName="active">
							Atlas
						</NavLink>
					</li>

					{process.env.NODE_ENV === "development" && (
						<li>
							<NavLink to="/test" activeClassName="active">
								Test
							</NavLink>
						</li>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default MainNavigation;
