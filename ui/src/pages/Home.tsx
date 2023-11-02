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
					BLUE-Brain: a 3D histological atlas of the human brain for high-resolution
					neuroimaging studies
				</h1>
			</div>

			<div className="homepage-body">
				<p>
					We are presenting a next-generation probabilistic atlas of the human 
					brain using histological sections of five full human hemispheres 
					with manual annotations for ~300 structures. This website enables the
					interactive inspection of these five cases using a 3D navigation 
					interface and search functionality.
				</p>

				<p>
					A comprehensive description of the 3D probabilistic atlas and its application
					to brain Bayesian segmentation can be found in the following publication:
				</p>
				
				<cite>
					<a>
						[In preparation] "BLUE-Brain: a next generation probabilistic atlas 
						of human brain anatomy built from 3D histology and companion 
						Bayesian segmentation tool" 
					</a>
				</cite>

				
				<p>
					The raw data of the project can be found here: doi.org/10.5522/04/24243835 
					The data acquisition and tissue processing pipeline are described in the 
					following publication:
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
					The histological sections are registered to the coordinate space of the
					ex vivo MRI using a pipeline described in the following publications:
				</p>
				
				<cite>
					<a
						target="_blank"
						rel="noopener noreferrer"
						className="reference"
					>
						Casamitjana, Adrià, et al. "Robust joint registration of multiple 
						stains and MRI for multimodal 3D histology reconstruction: Application 
						to the Allen human brain atlas." Medical image analysis 75 (2022): 102265.
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
