import { NavLink } from "react-router-dom";
import { HashLink as Link } from 'react-router-hash-link';

import "./HomeNavigation.css";

const HomeNavigation = () => {
	return (
		<header className="hheader">
			<nav className="hnav">
				<ul>
					<li>
						<Link
                        to="/home#nextbrain"
                        scroll={el => { el.scrollIntoView(true); window.scrollBy(0, -100) }}> NextBrain </Link>
					</li>

					<li>
						<Link
                        to="/home#videos"
                        scroll={el => { el.scrollIntoView(true); window.scrollBy(0, -100) }}> Videos </Link>
					</li>

					<li>
						<Link
                        to="/home#pipeline"
                        scroll={el => { el.scrollIntoView(true); window.scrollBy(0, -100) }}> Pipeline </Link>
					</li>

					<li>
						<Link
                        to="/home#publications"
                        scroll={el => { el.scrollIntoView(true); window.scrollBy(0, -100) }}> Other publications </Link>
					</li>

					<li>
						<Link
                        to="/home#data"
                        scroll={el => { el.scrollIntoView(true); window.scrollBy(0, -100) }}> Code and data </Link>
					</li>

					<li>
						<Link
                        to="/home#authors"
                        scroll={el => { el.scrollIntoView(true); window.scrollBy(0, -100) }}> Authors </Link>
					</li>

					<li>
						<Link
                        to="/home#credits"
                        scroll={el => { el.scrollIntoView(true); window.scrollBy(0, -100) }}> Credits </Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default HomeNavigation;
