import "./ImageChannels.css";

const ImageChannels = (props) => {
	const { channel, setChannel } = props;

	return (
		<div className="image-channels-container">
			Channel:
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

export default ImageChannels;
