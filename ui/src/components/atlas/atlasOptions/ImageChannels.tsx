import { FC } from "react";

import "./ImageChannels.css";

interface Props {
	channel: string;
	setChannel: (channel: string) => void; // review this type, is this correct?? check the react course
	showHiRes: boolean;
}

const ImageChannels: FC<Props> = (props) => {
	const { channel, setChannel, showHiRes } = props;

	return (
		<div className="image-channels-container">
			Select histological stain or MRI:
			<select
				name="channels"
				id="channels"
				className="image-channel-picker"
				value={channel}
				onChange={(e) => {
					setChannel(e.target.value);
				}}
			>
				<option value="LFB">LFB</option>
				<option value="HE">HE</option>
				<option disabled={showHiRes} value="MRI">
					MRI
				</option>
			</select>
		</div>
	);
};

export default ImageChannels;
