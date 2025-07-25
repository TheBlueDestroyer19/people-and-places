import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';  
import { useState, useCallback} from 'react';

import './App.css';
import Users from './user/pages/Users'
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import NewPlace from './places/pages/NewPlace';
import EditPlace from './places/pages/EditPlace';
import AuthPage from './places/pages/AuthPage';
import { authContext } from './shared/context/auth-context';

const App=() => {
  const [token, setToken]=useState(false);
  const [userID, setUserID]=useState(null);

  const login=useCallback((uid, token)=>{
    setToken(token);
    setUserID(uid);
    localStorage.setItem("userData", JSON.stringify({userID: uid, token: token}));
  },[]);
  const logout=useCallback(()=>{
    setToken(null);
    setUserID(null);
  },[]);

  let routes;

  if(token) {
    routes=(
      <Switch>
        <Route path='/' exact>
          <Users/>
        </Route>
        <Route path='/:userId/places'>
          <UserPlaces/>
        </Route>
        <Route path='/places/new'>
          <NewPlace/>
        </Route>
        <Route path='/places/:placeID'>
          <EditPlace/>
        </Route>
        <Redirect to='/'/>
      </Switch>
    );
  } else {
    routes=(
      <Switch>
        <Route path='/' exact>
          <Users/>
        </Route>
        <Route path='/:userId/places'>
          <UserPlaces/>
        </Route>
        <Route path='/login' exact>
          <AuthPage/>
        </Route>
        <Redirect to='/login'/>
      </Switch>
    );
  }

  return (
    <authContext.Provider value={{isLoggedIn:!!token, token: token, userID: userID, login:login, logout: logout}}>
      <Router>
        <MainNavigation /> 
        <main>
          {routes}
        </main>
      </Router>
    </authContext.Provider>
  );
}

export default App;
