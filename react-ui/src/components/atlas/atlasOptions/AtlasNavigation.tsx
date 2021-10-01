import { FC, memo } from "react";

import atlasNavigationData from "../../../assets/image_ontology_hierarchical.json";
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";

import "./AtlasNavigation.css";

interface Props {
	getCentroid: (blockNumber: number) => void;
	showHiRes: boolean;
	setShowHiRes: (showHiRes: boolean) => void;
}

const AtlasNavigation: FC<Props> = (props) => {
	const { getCentroid, showHiRes, setShowHiRes } = props;

	const onChange = (currentNode: any, selectedNodes: any) => {
		console.log("onChange::", currentNode, selectedNodes);

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
