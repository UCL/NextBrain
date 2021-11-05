import { FC } from "react";

import "./ImageChannelSelect.css";

interface Props {
	channel: string;
	setChannel: (channel: string) => void;
}

const ImageChannelSelect: FC<Props> = (props) => {
	const { channel, setChannel } = props;

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
				<option value="MRI">MRI</option>
			</select>
		</div>
	);
};

export default ImageChannelSelect;
