import { FC } from "react";

import "./Button.css";

interface ButtonProps extends React.ComponentProps<"button"> {
	href?: string;
	inverse?: boolean;
	danger?: boolean;
	size?: string;
	onClick?: () => void;
}

const Button: FC<ButtonProps> = (props) => {
	if (props.href) {
		return (
			<a
				className={`button button--${props.size || "default"} ${
					props.inverse && "button--inverse"
				} ${props.danger && "button--danger"}`}
				href={props.href}
			>
				{props.children}
			</a>
		);
	}

	return (
		<button
			className={`button button--${props.size || "default"} ${
				props.inverse && "button--inverse"
			} ${props.danger && "button--danger"}`}
			type={props.type}
			onClick={props.onClick}
			disabled={props.disabled}
		>
			{props.children}
		</button>
	);
};

export default Button;
