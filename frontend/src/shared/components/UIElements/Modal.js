import {React, useRef, forwardRef} from "react";
import './Modal.css'
import ReactDOM from 'react-dom'
import Backdrop from "./Backdrop";
import { CSSTransition } from "react-transition-group";

const ModalOverlay=forwardRef((props,ref)=>{
    const content=(
        <div ref={ref} className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={
                props.onSubmit? props.onSubmit : event=> event.preventDefault()
            }>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer} {/*Footer seperated from the content of the form because we want to have different styling for form content and form buttons (The part of footer)*/}
                </footer>
            </form>
        </div>
    )
    return ReactDOM.createPortal(content,document.getElementById('modal-hook'));
});

const Modal=props=>{
    const nodeRef=useRef(null);

    return (
        <>
            {props.show && <Backdrop onClick={props.onCancel}/>}
            <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={250} classNames="modal" nodeRef={nodeRef}>
                <ModalOverlay {...props} ref={nodeRef}/>
            </CSSTransition>
        </>
    );
};

export default Modal;