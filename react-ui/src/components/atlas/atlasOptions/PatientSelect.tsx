import { FC } from "react";

import "./PatientSelect.css";

interface Props {
	patientId: string;
	setPatientId: (patientId: string) => void; // review this type, is this correct?? check the react course
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
				<option value="P57-16_updated">P57-16</option>
				<option disabled value="null">
					More patients coming soon
				</option>
			</select>
		</div>
	);
};

export default PatientSelect;
