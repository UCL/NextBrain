import { NavLink } from "react-router-dom";

import "./MainNavigation.css";

const MainNavigation = () => {
	return (
		<header className="header">
			<div className="logo">NextBrain</div>
			<nav className="nav">
				<ul>
					<li>
						<NavLink
							to="/home"
							className={(navData) => (navData.isActive ? " active" : "")}
						>
							Home
						</NavLink>
					</li>

					<li>
						<NavLink
							to="/atlas"
							className={(navData) => (navData.isActive ? " active" : "")}
						>
							Data explorer
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default MainNavigation;
