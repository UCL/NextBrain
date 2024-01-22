import { FC } from "react";

import "./PatientSelect.css";

interface Props {
	patientId: string;
	setPatientId: (patientId: string) => void;
	setInitializeAtlas: (initializeAtlas: boolean) => void;
	setShowHiRes: (showHiRes: boolean) => void;
	setShowLabels: (showLabels: boolean) => void;
	setChannel: (channel: string) => void;
}

const PatientSelect: FC<Props> = (props) => {
	const {
		patientId,
		setPatientId,
		setInitializeAtlas,
		setShowHiRes,
		setShowLabels,
		setChannel,
	} = props;

	const setPatientIdHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setShowHiRes(false);
		setShowLabels(false);
		setChannel("LFB");
		setInitializeAtlas(true); // causes entire application to re-render, prevents memory leaks in unmounted components

		setPatientId(e.target.value);
	};

	return (
		<div className="patient-select-container">
			Select Case:
			<select
				name="patient-select"
				id="patient-select"
				className="patient-select-picker"
				value={patientId}
				onChange={(e) => setPatientIdHandler(e)}
			>
				<option value="NextBrain-Case-1/main/P57-16">Case-1</option>
				<option value="NextBrain-Case-2/main/P41-16">Case-2</option>
				<option value="NextBrain-Case-3/main/P58-16">Case-3</option>
				<option value="NextBrain-Case-4/main/P85-18">Case-4</option>
				<option value="NextBrain-Case-5/main/EX9-19">Case-5</option>
			</select>
		</div>
	);
};

export default PatientSelect;
