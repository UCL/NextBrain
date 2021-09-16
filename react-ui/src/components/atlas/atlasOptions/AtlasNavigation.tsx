import { FC } from "react";

import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";

import "./AtlasNavigation.css";

const AtlasNavigation: FC = () => {
	const data = {
		label: "Left Cerebral White Matter",
		value: "lcwm",
		children: [
			{
				label: "Frontomarginal gyrus",
				value: "fmg",
			},
			{
				label: "White matter of forebrain",
				value: "wmof",
			},
		],
	};

	const onChange = (currentNode: any, selectedNodes: any) => {
		console.log("onChange::", currentNode, selectedNodes);
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
			data={data}
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

export default AtlasNavigation;
