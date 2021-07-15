import "./ImageChannels.css";

const ImageChannels = (props) => {
	return (
		<div className="image-channels-container">
			Channel:
			<select
				name="channels"
				id="channels"
				className="image-channel-picker"
				value={props.channel}
				onChange={(e) => {
					props.setChannel(e.target.value);
				}}
			>
				{"ll" === "Choose a unit" ? (
					<option defaultValue="LFB">LFB</option>
				) : null}
				<option value="LFB">LFB</option>
				<option value="HE">HE</option>
				<option value="MRI">MRI</option>
			</select>
		</div>
	);
};

export default ImageChannels;
