import { createContext } from "react";

export const authContext=createContext({
    isLoggedIn:false, 
    userID:null,
    token:null,
    login:()=>{}, 
    logout: ()=>{}
});