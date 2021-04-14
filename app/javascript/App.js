
import React, { useState, useEffect } from 'react'

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/home/Home'
import Workspace from './components/workspace/Workspace'
import Error from './components/Error'
import axios from 'axios'
export default function App(props) {
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState({})
    
    const handleLogin = (data) => {
        setLoggedIn(true)
        setUser(data.user)
    }
    const handleLogout = () => {
        setLoggedIn(false)
        setUser({})
    }
    
    const checkLoginStatus = () => {
        axios.get("http://localhost:3000/logged_in", { witchCredentials: true }).then(response => {
            if (response.data.logged_in && !loggedIn) {
                setLoggedIn(true)
                setUser(response.user)
                props.history.push("/workspace")
            } else if (!response.data.logged_in && loggedIn) {
                setLoggedIn(false)
                setUser({})
            }
        })
    }
    useEffect(() => checkLoginStatus(), [])
    return (
        <Router>
            <Switch>
                <Route exact path="/" render={(props) =>
                    loggedIn ? (
                        <Redirect exact to="/workspace" />
                    ) : (
                        <Home  {...props} handleLogin={handleLogin} loggedIn={loggedIn} />)
                } />
                <Route exact path="/workspace" render={(props) =>
                    loggedIn ? (<Workspace {...props} handleLogout={handleLogout} loggedIn={loggedIn} />) : (
                        <Redirect to="/" />)
                } />
                <Route component={Error}></Route>
            </Switch>
        </Router>
    )

}