import { FC, memo, useEffect, useState } from "react";
import DropdownTreeSelect from "react-dropdown-tree-select";

import { ASSETS_URL } from "../../utils/ASSETS_URL";

import "react-dropdown-tree-select/dist/styles.css";
import "./AtlasNavigation.css";

interface Props {
	patientId: string;
	getCentroid: (blockNumber: number) => void;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
}

const AtlasNavigation: FC<Props> = (props) => {
	const [atlasNavigationData, setAtlasNavigationData] = useState<any>(null);

	const { patientId, getCentroid, showHiRes, setShowHiRes } = props;

	useEffect(() => {
		const getAtlasNavigationData = async () => {
			const dataUrl = `${ASSETS_URL}${patientId}/image_ontology_hierarchical.json`;

			const file = await fetch(dataUrl);

			const parsedFile = await file.json();

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
			getCentroid(currentNodeData);
		} catch {
			console.log("error, no valid block returned");
		}
	};

	const onAction = (node: any, action: any) => {
		console.log("onAction::", action, node);
	};

	const onNodeToggle = (currentNode: any) => {
		console.log("onNodeToggle::", currentNode);
	};

	if (atlasNavigationData == null) {
		return <div>Could not find navigation data</div>;
	}

	return (
		<DropdownTreeSelect
			className="atlas-navigation"
			data={atlasNavigationData}
			onChange={onChange}
			onAction={onAction}
			onNodeToggle={onNodeToggle}
			keepTreeOnSearch
			keepOpenOnSelect
			mode="radioSelect"
			inlineSearchInput
			texts={{ placeholder: "Navigate Atlas" }}
		/>
	);
};

export default memo(AtlasNavigation);
