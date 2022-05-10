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
				<option value="BrainAtlas-P57-16/main/P57-16">P57-16</option>
				<option value="BrainAtlas-P41-16/main/P41-16">P41-16</option>
				<option value="BrainAtlas-P58-16/main/P58-16">P58-16</option>
				<option value="BrainAtlas-P85-18/main/P85-18">P85-18</option>
				<option value="BrainAtlas-EX9-19/main/EX9-19">EX9-19</option>
			</select>
		</div>
	);
};

export default PatientSelect;
