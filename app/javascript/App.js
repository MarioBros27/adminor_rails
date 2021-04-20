
import React, { useState, useEffect } from 'react'

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/home/Home'
import Workspace from './components/workspace/Workspace'
import Error from './components/Error'
import axios from 'axios'
const dev = "http://localhost:3000"
const prod = "https://adminor.herokuapp.com"
const url = prod

export default function App(props) {
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState({})

    const handleLogin = (data) => {
        
        setUser(data.user)
        setLoggedIn(true)
    }
    const handleLogout = () => {
        setLoggedIn(false)
        setUser({})
    }

    const checkLoginStatus = () => {
        axios.get(`${url}/logged_in`, { witchCredentials: true }).then(response => {
            if (response.data.logged_in && !loggedIn) {
                console.log(response.data.user)
                setUser(response.data.user)
                setLoggedIn(true)
                // console.log(response)
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
                    loggedIn ? (<Workspace {...props} user={user} handleLogout={handleLogout} loggedIn={loggedIn} />) : (
                        <Redirect to="/" />)
                } />
                <Route component={Error}></Route>
            </Switch>
        </Router>
    )

}