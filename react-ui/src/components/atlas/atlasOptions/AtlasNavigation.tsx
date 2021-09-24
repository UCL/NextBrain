import { FC, memo } from "react";

import atlasNavigationData from "../../../assets/atlas_navigation_data.json";
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";

import "./AtlasNavigation.css";

interface Props {
	getCentroid: (blockNumber: number) => void;
}

const AtlasNavigation: FC<Props> = (props) => {
	const { getCentroid } = props;

	const onChange = (currentNode: any, selectedNodes: any) => {
		console.log("onChange::", currentNode, selectedNodes);

		const currentNodeData = currentNode.data;

		if (currentNodeData === undefined) {
			console.log("navigation coords could not be found");
			return;
		}

		getCentroid(currentNodeData);
	};

	const onAction = (node: any, action: any) => {
		console.log("onAction::", action, node);
	};

	const onNodeToggle = (currentNode: any) => {
		console.log("onNodeToggle::", currentNode);
	};

	return (
		<DropdownTreeSelect
			className="atlas-navigation2"
			data={atlasNavigationData}
			onChange={onChange}
			onAction={onAction}
			onNodeToggle={onNodeToggle}
			keepTreeOnSearch
			keepOpenOnSelect
			mode="radioSelect"
			inlineSearchInput
			texts={{ placeholder: "Navigate" }}
		/>
	);
};

export default memo(AtlasNavigation);
