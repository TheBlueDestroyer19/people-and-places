import {React, useRef} from "react";
import './SideDrawer.css';
import ReactDOM from 'react-dom';
import {CSSTransition} from 'react-transition-group'

const SideDrawer=props=>{
    const nodeRef=useRef(null);

    const content=(
        <CSSTransition in={props.show} timeout={300} classNames="slide-in-left" mountOnEnter unmountOnExit nodeRef={nodeRef}>
            <aside ref={nodeRef} className="side-drawer" onClick={props.onClick}>
                {props.children}
            </aside>
        </CSSTransition>);
    
    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
}

export default SideDrawer;