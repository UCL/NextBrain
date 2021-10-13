import React, { CSSProperties, FC, ReactElement } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import "./Modal.css";

interface ModalOverlayProps {
	className?: string;
	style?: CSSProperties | null | undefined; // is this a good solution?
	headerClass?: string;
	header?: string;
	onSubmit?: () => void | undefined;
	contentClass?: string;
	footerClass?: string;
	footer?: ReactElement;
}

interface ModalProps extends ModalOverlayProps {
	show: boolean;
	onCancel: () => void;
}

const ModalOverlay: FC<ModalOverlayProps> = (props) => {
	const content = (
		<div className={`modal ${props.className}`} style={props.style!}>
			<header className={`modal__header ${props.headerClass}`}>
				<h2>{props.header}</h2>
			</header>
			<form
				onSubmit={
					props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
				}
			>
				<div className={`modal__content ${props.contentClass}`}>
					{props.children}
				</div>
				<footer className={`modal__footer ${props.footerClass}`}>
					{props.footer}
				</footer>
			</form>
		</div>
	);
	return ReactDOM.createPortal(content, document.getElementById("modal-hook")!);
};

const Modal: FC<ModalProps> = (props) => {
	return (
		<>
			{props.show && <Backdrop onClick={props.onCancel} />}
			<CSSTransition
				in={props.show}
				mountOnEnter
				unmountOnExit
				timeout={200}
				classNames="modal"
			>
				<ModalOverlay {...props} />
			</CSSTransition>
		</>
	);
};

export default Modal;
