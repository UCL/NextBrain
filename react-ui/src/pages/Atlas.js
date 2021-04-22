import React, { useState } from "react";

import ImagePanels from "../components/atlas/imagePanels/ImagePanels";
import OptionsPanels from "../components/atlas/optionsPanels/OptionsPanels";

import "./Atlas.css";

const Atlas = () => {
	const [sagittalSlice, setSagittalSlice] = useState();
	const [sagittalX, setSagittalX] = useState();
	const [sagittalZ, setSagittalZ] = useState();

	const [coronalSlice, setCoronalSlice] = useState();
	const [coronalZ, setCoronalZ] = useState();
	const [coronalY, setCoronalY] = useState();

	const [axialSlice, setAxialSlice] = useState();
	const [axialX, setAxialX] = useState();
	const [axialY, setAxialY] = useState();

	return (
		<>
			<span>slice number sagittal: </span>{" "}
			<input
				onChange={(e) => {
					setSagittalSlice(e.target.value);
				}}
			></input>
			<span>x sagittal: </span>
			<input
				onChange={(e) => {
					setSagittalX(e.target.value);
				}}
			></input>
			<span>z sagittal: </span>
			<input
				onChange={(e) => {
					setSagittalZ(e.target.value);
				}}
			></input>
			<br></br>
			<span>slice number coronal: </span>
			<input
				onChange={(e) => {
					setCoronalSlice(e.target.value);
				}}
			></input>
			<span>z coronal: </span>
			<input
				onChange={(e) => {
					setCoronalZ(e.target.value);
				}}
			></input>
			<span>y coronal: </span>
			<input
				onChange={(e) => {
					setCoronalY(e.target.value);
				}}
			></input>
			<br></br>
			<span>slice number axial: </span>
			<input
				onChange={(e) => {
					setAxialSlice(e.target.value);
				}}
			></input>
			<span>x axial: </span>
			<input
				onChange={(e) => {
					setAxialX(e.target.value);
				}}
			></input>
			<span>y axial: </span>
			<input
				onChange={(e) => {
					setAxialY(e.target.value);
				}}
			></input>
			<main className="atlas-container">
				<ImagePanels
					sagittalSlice={sagittalSlice}
					sagittalX={sagittalX}
					sagittalZ={sagittalZ}
					coronalSlice={coronalSlice}
					coronalZ={coronalZ}
					coronalY={coronalY}
					axialSlice={axialSlice}
					axialX={axialX}
					axialY={axialY}
				/>
				<OptionsPanels />
			</main>
		</>
	);
};

export default Atlas;
