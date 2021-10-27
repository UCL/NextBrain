import { FC } from "react";

import "./PatientSelect.css";

interface Props {
	patientId: string;
	setPatientId: (patientId: string) => void;
}

const PatientSelect: FC<Props> = (props) => {
	const { patientId, setPatientId } = props;

	return (
		<div className="patient-select-container">
			Select Case:
			<select
				name="patient-select"
				id="patient-select"
				className="patient-select-picker"
				value={patientId}
				onChange={(e) => {
					setPatientId(e.target.value);
				}}
			>
				<option value="BrainAtlas-P57-16/main/P57-16">P57-16</option>
				<option value="BrainAtlas-P41-16/main/P41-16">P41-16</option>
				<option disabled value="BrainAtlas-P58-16/main/P58-16">
					P58-16
				</option>
				<option disabled value="BrainAtlas-P85-18/main/P85-18">
					P85-18
				</option>
				<option disabled value="BrainAtlas-EX-19/main/EX-19">
					EX-19
				</option>
			</select>
		</div>
	);
};

export default PatientSelect;
