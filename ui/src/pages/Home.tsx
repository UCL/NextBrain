import { FC } from "react";
import { NavLink } from "react-router-dom";

import banner from "../assets/homepage-banner.png";
import uclLogo from "../assets/ucl-logo.png";
import ercLogo from "../assets/erc-logo.png";
import euLogo from "../assets/eu-logo.png";
import pipelineImage from "../assets/pipeline-image.7310f65e.png";

import HomeNavigation from "../components/layout/HomeNavigation"
import "./Home.css";


const Atlas: FC = () => {
	return (
        <>
		    <HomeNavigation />
            <main className="homepage-container">
			<div className="homepage-header" id="nextbrain">
				<img className="header-banner" src={banner} alt="logo"></img>

				<h1 className="homepage-title">
					NextBrain: a next-generation, histological atlas of the human brain for high-resolution neuroimaging studies.
				</h1>
			</div>

			<div className="homepage-body">
				<p>

				    We present a next-generation probabilistic atlas   of the human brain using
				    histological sections of five full human hemispheres with manual annotations
				    for 333 regions of interest. This website enables the interactive inspection
				    of these five cases using a &nbsp;
				    <NavLink to="/atlas" className={(navData) => (navData.isActive ? " active" : "")}>
				        3D navigation interface
					</NavLink>
				    &nbsp; and search functionality.
				</p>

				<p>
					A comprehensive description of the 3D probabilistic atlas and its application
					to brain Bayesian segmentation can be found in the following publication:
				</p>
                    <p className="tab">
                        <b>A next-generation, histological atlas of the human brain
                        and its application to automated brain MRI segmentation </b> <br />

                        A. Casamitjana, M. Mancini, E. Robinson, L. Peter,  Ro. Annunziata, J. Althonayan,
                        S. Crampsie, E. Blackburn,  <br />
                        B. Billot, A. Atzeni, O. Puonti, Y.Balbastre,  P. Schmidt,
                        J. Hughes, J.C. Augustinack, B.L. Edlow, L. Zöllei,  <br />
                        D.L. Thomas, D. Kliemann, M. Bocchetta, C. Strand, J.L. Holton, Z. Jaunmuktane, J.E. Iglesias <br />
                        Submitted (2024) <br />

                        <cite>
                            <a href="https://www.biorxiv.org/content/10.1101/2024.02.05.579016v1">[pre-print]</a> &nbsp;&nbsp;
                        </cite>

                    </p>

                    <br />
                <section id="videos">
                    <h2>Videos</h2>
                    <p>
                        Some visualization material showing the 3D histology reconstruction of LFB, H&E and high
                        resolution labels
                        as well as its alignment to brain ex vivo MRI of case 5 (left) and the probabilistic atlas
                        construction
                        using all 5 cases (center) and a tutorial for the Data Explorer functionality (right)
                    </p>

                    <center>

                        <iframe width="500" height="315" src="https://www.youtube.com/embed/uRbUyC-KChk"
                                title="YouTube video player"> AA
                        </iframe>
                        &nbsp;&nbsp;
                        <iframe width="500" height="315" src="https://www.youtube.com/embed/bgpbX_2Hm74"
                                title="YouTube video player"> AA
                        </iframe>
                        &nbsp;&nbsp;
                        <iframe width="500" height="315" src="https://www.youtube.com/embed/pVOfximndPE"
                                title="YouTube video player"> AA
                        </iframe>
                    </center>

                    <br/><br/><br/><br/>

                    <p>
                        The NextBrain data release includes a 200um isotropic labeling of the right hemisphere of the
                        ex vivo scan publicly released by Edlow et al. in <em>“7 Tesla MRI of the ex vivo human brain at
                        100 micron resolution”</em>, Scientific data 6, 244 (2019). The following two videos fly over the
                        coronal and axial slices of the dataset (download links for the imaging volumes can be found
                        under “Code and Data” below):

                    </p>

                    <center>

                        <iframe width="500" height="315" src="https://www.youtube.com/embed/bH09BVNjLek"
                                title="YouTube video player"> AA
                        </iframe>
                        &nbsp;&nbsp;
                        <iframe width="500" height="315" src="https://www.youtube.com/embed/SkX0GRm3p4c"
                                title="YouTube video player"> AA
                        </iframe>
                    </center>
                </section>


                <br/>
                <br/>
                <br/>
                <br/>
                <section id="pipeline">
                    <h2>Pipeline</h2>
                    <p>
                        The different steps of the pipeline from the fresh tissue donation to the joint multimodal 3D
                        registration
                        of LFB and HE stains, labels and MRI are summarized in the following figure:
                    </p>
                    <center>
                        <img className="pipeline-banner" src={pipelineImage} alt="3D reconstruction pipeline"></img>
                    </center>
                </section>

                <br/>
                <br/>
                <section id="publications">
                    <h2>Other publications</h2>
                    <ul>
                        <li>
                            <p>
                                The data acquisition and tissue processing pipeline are described in the
                                following publication:
                            </p>
                                <b>A multimodal computational  pipeline for 3D histology of the human brain. </b> <br />
                                M. Mancini, A. Casamitjana, L. Peter, E. Robinson,
                                S. Crampsie, D.L. Thomas, J.L. Holton, Z. Jaunmuktane, J.E. Iglesias <br />
                                Scientific Reports 10, 13839 (2020) <br />
                                <cite>
                                    <a href="https://www.nature.com/articles/s41598-020-69163-z">[article]</a> &nbsp;&nbsp;
                                </cite>

                                <cite>
                                    <a href="https://www.biorxiv.org/content/10.1101/2020.02.10.941948.abstract">[arxiv]</a> &nbsp;&nbsp;
                                </cite>

                                <cite>
                                    <a href="https://github.com/UCL/NextBrain/blob/6563100e1ae9ca23676fd50ad6e95801a73d8fd3/ui/src/assets/bibtext.bib">[citation]</a>
                                </cite>
                        </li>

                        <li>
                            <p>
                                The histological sections are registered to the coordinate space of the
                                ex vivo MRI using the pipeline described in the following publication:
                            </p>

                                <b>Robust joint registration of multiple
                                stains and MRI for multimodal 3D histology reconstruction: Application
                                to the Allen human brain atlas. </b> <br />
                                A. Casamitjana, M. Lorenzi, S. Ferraris, L. Peter, M. Modat, A. Stevens, B. Fischl,
                                T. Vercauteren, J.E. Iglesias <br />
                                Medical image analysis 75 (2022) <br />
                                <cite>
                                    <a href="https://www.sciencedirect.com/science/article/pii/S1361841521003108">[article]</a> &nbsp;&nbsp;
                                </cite>

                                <cite>
                                    <a href="https://arxiv.org/pdf/2104.14873.pdf">[arxiv]</a> &nbsp;&nbsp;
                                </cite>

                                <cite>
                                    <a href="https://github.com/UCL/NextBrain/blob/6563100e1ae9ca23676fd50ad6e95801a73d8fd3/ui/src/assets/bibtext.bib">[citation]</a> &nbsp;&nbsp;
                                </cite>

                                <cite>
                                    <a href="https://github.com/acasamitjana/3dhirest">[code]</a>
                                </cite>
                        </li>
                        <li>
                            <p>
                                The histological sections are registered to the coordinate space of the
                                ex vivo MRI using the pipeline described in the following publication:
                            </p>

                                <b> Synth-by-Reg (SbR): Contrastive learning for synthesis-based registration of paired
                                images </b> <br />
                                A. Casamitjana, M. Mancini, J.E. Iglesias <br />
                                Simulation and Synthesis in Medical Imaging Workshop (SASHIMI, 2021) <br />
                                <cite>
                                    <a href="https://link.springer.com/chapter/10.1007/978-3-030-87592-3_5">[article]</a> &nbsp;&nbsp;
                                </cite>

                                <cite>
                                    <a href="https://arxiv.org/pdf/2107.14449.pdf">[arxiv]</a> &nbsp;&nbsp;
                                </cite>

                                <cite>
                                    <a href="https://github.com/UCL/NextBrain/blob/6563100e1ae9ca23676fd50ad6e95801a73d8fd3/ui/src/assets/bibtext.bib">[citation]</a> &nbsp;&nbsp;
                                </cite>

                                <cite>
                                    <a href="https://github.com/acasamitjana/SynthByReg">[code]</a>
                                </cite>
                        </li>

                    </ul>
                </section>

				<br />
				<br />
				<section id="data">
                    <h2>Code and data</h2>
                    <ul>
                        <li>
                            <p>
                                The raw data of the project can be found here:
                            </p>
                            <b>Registered histology, MRI, and manual annotations of over 300 brain regions in 5 human
                                hemispheres (data from ERC Starting Grant 677697 "BUNGEE-TOOLS") </b> <br/>
                            J.E Iglesias Gonzalez, A. Casamitjana, A. Atzeni, B. Billot, D. Thomas, E. Blackburn, J.
                            Hughes,
                            J. Althonayan, L. Peter, M. Mancini, N. Robinson, P. Schmidt, S. Crampsie <br/>
                            <cite>
                                <a href="https://doi.org/10.5522/04/24243835.v1">[data repository]</a> &nbsp;&nbsp;
                            </cite>
                            <cite>
                                <a href="https://github.com/UCL/NextBrain/blob/6563100e1ae9ca23676fd50ad6e95801a73d8fd3/ui/src/assets/bibtext.bib">[citation]</a>
                            </cite>
                        </li>
                        <li>
                            <p>
                                Code used for the 3D histology reconstruction
                            </p>
                            <cite>
                                <a href="https://github.com/acasamitjana/ERC_reconstruction">[github]</a> &nbsp;&nbsp;
                            </cite>
                        </li>
                        <li>
                            <p>
                                Bayesian segmentation using NextBrain probabilistic atlas
                            </p>
                            <cite>
                                <a href="https://surfer.nmr.mgh.harvard.edu/fswiki/HistoAtlasSegmentation">[ready-to-use
                                    tool in FreeSurfer]</a> &nbsp;&nbsp;
                            </cite>
                            <cite>
                                <a href="https://github.com/freesurfer/freesurfer/tree/dev/mri_histo_util">[github]</a> &nbsp;&nbsp;
                            </cite>
                        </li>

                        <li>
                            <p>
                                200um isotropic labeling of the right hemisphere of the ex vivo scan publicly released
                                by Edlow et al., (2019):


                            </p>
                            <cite>
                                <a href="https://github.com/UCL/NextBrain/blob/6563100e1ae9ca23676fd50ad6e95801a73d8fd3/data/Edlow.200um.nii.gz">[200um scan]</a> &nbsp;&nbsp;
                            </cite>
                            <cite>
                                <a href="https://github.com/UCL/NextBrain/blob/6563100e1ae9ca23676fd50ad6e95801a73d8fd3/data/Edlow.200um.labels.nii.gz">[200um labels]</a> &nbsp;&nbsp;
                            </cite>
                            <cite>
                                <a href="https://github.com/UCL/NextBrain/blob/6563100e1ae9ca23676fd50ad6e95801a73d8fd3/data/Edlow.200um.lut.txt">[Lookup table of labels in Freeview format]</a> &nbsp;&nbsp;
                            </cite>

                            <p>
                                You can open these files in Freeview with the command: freeview Edlow.200um.nii.gz
                                Edlow.200um.labels.nii.gz:colormap=lut:lut=Edlow.200um.lut.txt
                            </p>
                        </li>


                    </ul>
                </section>


                <br/>
                <br/>
                <section id="authors">
                    <h2>Authors</h2>
                    <ul>
                        <li><p><b>James Hughes</b><br/>
                            [<a title="" href="https://github.com/jhughes982" target="_blank" rel="noopener">Github</a>]
                        </p>
                        </li>

                        <li><p><b> Peter Schmidt</b><br/>
                            [<a title="" href="https://github.com/pweschmidt" target="_blank" rel="noopener">Github</a>]
                        </p>
                        </li>

                        <li><p><b>Adria Casamitjana</b><br />
                        a.casamitjana [at] ub.edu<br />
                        [<a title="" href="https://twitter.com/therelaxationt1" target="_blank" rel="noopener">Twitter</a>  |  
                        <a title="" href="https://scholar.google.com/citations?user=phHLLH0AAAAJ&hl=ca&oi=ao" target="_blank" rel="noopener">Scholar</a>]</p>
                        </li>

                        <li><p><b>Juan Eugenio Iglesias</b><br />
                        jiglesiasgonzalez [at] mgh.harvard.edu<br />
                        [<a title="" href="https://twitter.com/JuanEugenioIgl1" target="_blank" rel="noopener">Twitter</a>  |  
                        <a title="" href="https://www.linkedin.com/in/juan-eugenio-iglesias-820565127/" target="_blank" rel="noopener">Linkedin</a>  |  
                        <a title="" href="https://scholar.google.com/citations?user=_f2iSSQAAAAJ" target="_blank" rel="noopener">Scholar</a>]</p>
                        </li>
                    </ul>
                </section>

				<br />
				<br />
				<h2  id="credits">Credits</h2>
                    <p>
                    This research is primarily funded by the European Research Council{" "}
                    </p>


					<a
						href="https://cordis.europa.eu/project/id/677697"
						target="_blank"
						rel="noopener noreferrer"
						className="reference"
					>
						(Starting Grant 677696, project "BUNGEE-TOOLS")
					</a>
					.

			</div>

			<div className="homepage-footer">
				<img className="footer-logo" src={uclLogo} alt="logo"></img>
				<img className="footer-logo" src={ercLogo} alt="logo"></img>
				<img className="footer-logo" src={euLogo} alt="logo"></img>
			</div>




		</main>
        </>
	);
};

export default Atlas;
