import { FC, memo, useEffect, useState } from "react";
import DropdownTreeSelect from "react-dropdown-tree-select";

import { ASSETS_URL } from "../../utils/ASSETS_URL";

import getMatrix from "../../utils/getMatrix";
import matrixMultiplier from "../../utils/matrixMultiplier";

import { NavPanelCoords } from "../../../models/navPanelCoords.model";
import { AtlasNavigationData } from "../../../models/atlasNavigationData.model";

import "react-dropdown-tree-select/dist/styles.css";
import "./AtlasNavigation.css";

interface Props {
	patientId: string;
	setNavPanelCoords: (navPanelCoords: NavPanelCoords) => void;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
}

const AtlasNavigation: FC<Props> = (props) => {
	const [atlasNavigationData, setAtlasNavigationData] =
		useState<AtlasNavigationData | null>(null);

	const { patientId, setNavPanelCoords, showHiRes, setShowHiRes } = props;

	useEffect(() => {
		const getAtlasNavigationData = async () => {
			const dataUrl = `${ASSETS_URL}${patientId}/image_ontology_hierarchical.json`;

			const file = await fetch(dataUrl);

			const parsedFile = await file.json();

			console.log(parsedFile);

			setAtlasNavigationData(parsedFile);
		};

		getAtlasNavigationData();
	}, [patientId]);

	const onChange = (currentNode: any, selectedNodes: any) => {
		if (showHiRes) setShowHiRes(false);

		const currentNodeData = currentNode.data;

		if (currentNodeData === undefined) {
			console.log("navigation coords could not be found");
			return;
		}

		try {
			updateNavPanelCoordsHandler(currentNodeData);
		} catch {
			console.log("error, no valid navigation coords returned");
		}
	};

	const updateNavPanelCoordsHandler = async (
		navPanelCoords: NavPanelCoords
	) => {
		const matrix = await getMatrix(
			navPanelCoords!.blockNumber,
			"histology",
			patientId
		);

		// why is the order of params here different compared to the function that handles physical clicks?
		// the x and y are swapped here compared to the histologyToMri function
		// there must be some sort of flipping of axes somewhere
		// regardless, the app seems to work with this configuration
		const singleMriCoord = matrixMultiplier(matrix, [
			navPanelCoords!.xh,
			navPanelCoords!.yh,
			navPanelCoords!.zh,
			1,
		]);

		setNavPanelCoords(singleMriCoord);
	};

	if (atlasNavigationData == null) {
		return <div>Could not find navigation data</div>;
	}

	return (
		<DropdownTreeSelect
			className="atlas-navigation"
			data={atlasNavigationData}
			onChange={onChange}
			keepTreeOnSearch
			keepOpenOnSelect
			mode="radioSelect"
			inlineSearchInput
			texts={{ placeholder: "Navigate Atlas" }}
		/>
	);
};

export default memo(AtlasNavigation); // memo prevents unnecessary component re-rendering
