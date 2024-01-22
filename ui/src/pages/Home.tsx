import { FC } from "react";

import banner from "../assets/homepage-banner.png";
import uclLogo from "../assets/ucl-logo.png";
import ercLogo from "../assets/erc-logo.png";
import euLogo from "../assets/eu-logo.png";
import pipelineImage from "../assets/pipeline-image.7310f65e.png";

import "./Home.css";

const Atlas: FC = () => {
	return (
		<main className="homepage-container">
			<div className="homepage-header">
				<img className="header-banner" src={banner} alt="logo"></img>

				<h1 className="homepage-title">
					NextBrain: a next-generation, histological atlas of the human brain for high-resolution neuroimaging studies.
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
						<b> [In preparation] "A next-generation, histological atlas of the human brain
						and its application to automated brain MRI segmentation"</b>
					</a>
				</cite>

                <br />
                <br />
                <br />
				<img className="pipeline-banner" src={pipelineImage} alt="3D reconstruction pipeline"></img>



				<section>
                <h3>Other publications</h3>
                 <ul>
                  <li>
                    <p>
                        The raw data of the project can be found here:
                    </p>
                    <cite>
                        <a
                            href="https://doi.org/10.5522/04/24243835.v1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="reference"
                        >
                           Iglesias Gonzalez, Eugenio; Casamitjana, Adria; Atzeni, Alessia; Billot, Benjamin;
                           Thomas, David; Blackburn, Emily; et al. (2023). Registered histology, MRI, and manual
                           annotations of over 300 brain regions in 5 human hemispheres (data from ERC Starting Grant
                           677697 "BUNGEE-TOOLS"). University College London.
                           Dataset. https://doi.org/10.5522/04/24243835.v1
                        </a>
                    </cite>

                  </li>
                  <li>
                    <p>
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
                  </li>
                  <li>
                    <p>
                        The histological sections are registered to the coordinate space of the
                        ex vivo MRI using the pipeline described in the following publication:
                    </p>

                    <cite>
                        <a
                            href="https://www.sciencedirect.com/science/article/pii/S1361841521003108"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="reference"
                        >
                            Casamitjana, Adrià, et al. "Robust joint registration of multiple
                            stains and MRI for multimodal 3D histology reconstruction: Application
                            to the Allen human brain atlas." Medical image analysis 75 (2022): 102265.
                        </a>
                    </cite>
                  </li>
                  <li>
                    <p>
                        Some visualization material can be found here:
                    </p>

                    <cite>
                        <a
                            href="https://www.youtube.com/watch?v=WLFebndFggw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="reference"
                        >
                            Showcasing the 3D reconstruction of the brain hemisphere from case 5.
                        </a>
                    </cite>
                    <cite>
                        <a

                            href="https://www.youtube.com/watch?v=He4eeEAnW3Q"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="reference"
                        >
                            Description of the probabilistic atlas building procedure from all five cases and its
                            application to _in vivo_ brain MRI segmentation.
                        </a>
                    </cite>
                  </li>
                </ul>

                </section>

                 <section>
                <h3>Authors</h3>
                <ul>
                    <li><p><b>James Hughes</b><br />
                    [<a title="" href="https://github.com/jhughes982" target="_blank" rel="noopener">Github</a>]</p>
                    </li>

                    <li><p><b> Peter Schmidt</b><br />
                    [<a title="" href="https://github.com/pweschmidt" target="_blank" rel="noopener">Github</a>]</p>
                    </li>

                    <li><p><b>Adria Casamitjana</b><br />
                    a.casamitjana [at] ub.edu<br />
                    [<a title="" href="https://twitter.com/JuanEugenioIgl1" target="_blank" rel="noopener">Twitter</a>  |  
                    <a title="" href="https://scholar.google.com/citations?user=phHLLH0AAAAJ&hl=ca&oi=ao" target="_blank" rel="noopener">Scholar</a>]</p>
                    </li>

                    <li><p><b>Juan Eugenio Iglesias</b><br />
                    jiglesiasgonzalez [at] mgh.harvard.edu<br />
                    [<a title="" href="https://twitter.com/therelaxationt1" target="_blank" rel="noopener">Twitter</a>  |  
                    <a title="" href="https://www.linkedin.com/in/juan-eugenio-iglesias-820565127/" target="_blank" rel="noopener">Linkedin</a>  |  
                    <a title="" href="https://scholar.google.com/citations?user=_f2iSSQAAAAJ" target="_blank" rel="noopener">Scholar</a>]</p>
                    </li>
                </ul>
                </section>

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
