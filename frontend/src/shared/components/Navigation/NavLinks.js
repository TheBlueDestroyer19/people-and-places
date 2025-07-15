import React, { useContext } from "react";

import './NavLinks.css';
import {NavLink, useHistory} from 'react-router-dom'
import { authContext } from "../../context/auth-context";

const NavLinks=props=>{
    const auth=useContext(authContext);
    const history = useHistory();

    const logouthandler=()=>{
        auth.logout();
        history.push('/login');
    };


    return (
        <ul className="nav-links">
            <li>
                <NavLink to='/' exact>ALL USERS</NavLink>
            </li>
            {auth.isLoggedIn && <li>
                <NavLink to={`/${auth.userID}/places`}>MY PLACES</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to='/places/new'>ADD PLACES</NavLink>
            </li>}
            {!auth.isLoggedIn && <li>
                <NavLink to='/login' exact>AUTHENTICATE</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <button onClick={logouthandler}>LOGOUT</button>
            </li>}
        </ul>
    );
}

export default NavLinks;