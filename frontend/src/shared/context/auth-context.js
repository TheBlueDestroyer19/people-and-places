import { createContext } from "react";

export const authContext=createContext({
    isLoggedIn:false, 
    userID:null,
    login:()=>{}, 
    logout: ()=>{}
});