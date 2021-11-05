import { FC } from "react";

import banner from "../assets/homepage-banner.png";
import uclLogo from "../assets/ucl-logo.png";
import ercLogo from "../assets/erc-logo.png";
import euLogo from "../assets/eu-logo.png";

import "./Home.css";

const Atlas: FC = () => {
	return (
		<main className="homepage-container">
			<div className="homepage-header">
				<img className="header-banner" src={banner} alt="logo"></img>

				<h1 className="homepage-title">
					A 3D histological atlas of the human brain for high-resolution
					neuroimaging studies
				</h1>
			</div>

			<div className="homepage-body">
				<p>
					We are building a new atlas of the human brain using histological
					sections of five full human hemispheres with manual annotations for
					~300 structures. This website enables the interactive inspection of
					one of these cases using a 3D navigation interface and search
					functionality. Further cases will be uploaded soon.
				</p>

				<p>
					The histological sections are registered to the coordinate space of an
					ex vivo MRI using a pipeline described in the following publication:
				</p>

				<cite>
					<a
						href="https://www.nature.com/articles/s41598-020-69163-z"
						target="_blank"
						rel="noopener noreferrer"
						className="reference"
					>
						Mancini, Matteo, Adrià Casamitjana, Loic Peter, Eleanor Robinson,
						Shauna Crampsie, David L. Thomas, Janice L. Holton, Zane
						Jaunmuktane, and Juan Eugenio Iglesias. "A multimodal computational
						pipeline for 3D histology of the human brain." Scientific reports.
					</a>
				</cite>

				<p>
					This research is primarily funded by the European Research Council{" "}
					<a
						href="https://cordis.europa.eu/project/id/677697"
						target="_blank"
						rel="noopener noreferrer"
						className="reference"
					>
						(Starting Grant 677696, project "BUNGEE-TOOLS")
					</a>
					.
				</p>
			</div>

			<div className="homepage-footer">
				<img className="footer-logo" src={uclLogo} alt="logo"></img>
				<img className="footer-logo" src={ercLogo} alt="logo"></img>
				<img className="footer-logo" src={euLogo} alt="logo"></img>
			</div>
		</main>
	);
};

export default Atlas;
