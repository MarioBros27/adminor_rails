import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden';
import GoogleLogin from 'react-google-login';
import { Typography } from '@material-ui/core';
import axios from 'axios'

const dev = "http://localhost:3000"
const prod = "https://adminor.herokuapp.com"
const url = prod

const LogInButton = withStyles({
    root: {
        background: '#2196f3',
        borderRadius: 3,
        border: 0,
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
})(Button);
const LogInGoogleButton = withStyles({
    root: {
        //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: '#4caf50',
        borderRadius: 3,
        border: 0,
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
})(Button);

const SignUpButton = withStyles({
    root: {
        //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: '#e91e63',
        borderRadius: 3,
        border: 0,
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
})(Button);
export default function Home(props) {

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        () =>
            createMuiTheme({

                palette: {
                    type: prefersDarkMode ? 'dark' : 'light',

                },
            }),
        [prefersDarkMode],
    );
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [signUp, setSignUp] = useState(false)
    const [error, setError] = useState("")

    const handleSuccesfulAuth = (data) => {
        props.handleLogin(data)
        props.history.push("/workspace")
    }

    const handleSubmit = function () {
        if(email === ""){
            setError("Please enter an email")
            return
        }
        if(password === ""){
            setError("Please enter a password")
            return
        }
        if(confirmPassword ===""){
            setError("Please confirm password")
            return
        }
        if(password !== confirmPassword){
            setError("Passwords don't match")
            return
        }
        axios.post(`${url}/registrations`, {
            user: {
                email: email,
                password: password,
                password_confirmation: confirmPassword,
                is_google: false
            }
        },
            { withCredentials: true }
        ).then(response => {
            if (response.data.status === "created") {
                handleSuccesfulAuth(response.data)
            }
        }).catch(error => {
            setError("Try a different e-mail or username")
        })
        // event.preventDefault();

    }

    const handleSignInButtonPressed = () => {
        if(email === ""){
            setError("Please enter an email")
            return
        }
        if(password == ""){
            setError("please enter a password")
            return
        }
        axios.post(`${url}/sessions`, {
            user: {
                email: email,
                password: password
            }
        },
            { withCredentials: true }
        ).then(response => {
            if (response.data.logged_in) {
                handleSuccesfulAuth(response.data)
            }
        }).catch(error => {
            setError("Wrong user or password")
        })
    }
    const handleGoogleLogin = (data) => {
        const email = data.profileObj.email

        axios.post(`${url}/sessions`, {
            user: {
                email: email,
                is_google: true
            }
        },
            { withCredentials: true }
        ).then(response => {
            console.log("la respuesta fue", response)
            if (response.data.logged_in) {
                handleSuccesfulAuth(response.data)
            }
        }).catch(error => {
            console.log("error", error)
            if (error.response.status === 404) { ///THen create the account
                axios.post(`${url}/registrations`, {
                    user: {
                        email: email,
                        is_google: true
                    }
                },
                    { withCredentials: true }
                ).then(response => {
                    console.log("response 2", response)
                    if (response.data.status === "created") {

                        handleSuccesfulAuth(response.data)
                    }
                }).catch(error => {
                    console.log("fatal error")
                    setError("Something went wrong while trying to sign in with Google, try again")
                })
            } else {//something else happened and tell user to check something else
                setError("Ooops something went wrong, please try again or contact us")
            }
        })
    }
    const handleGoogleLogInFailure = ()=>{
        setError("Something failed while trying to sign in with Google, try again")
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Grid container
                spacing={0}
                direction="row"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}>
                <Hidden smDown>
                    <Grid item sm={2} >
                    </Grid>
                </Hidden>
                <Grid item container spacing={3} direction="column"
                    alignItems="center" justify="center" xs={12} sm={8}>
                    <Typography variant='h1'>Adminor</Typography>
                    <Grid item container justify="center">
                        <Grid item>
                            <GoogleLogin
                                clientId="351611436819-32uve5bdc2i7tlk76cf59552p2s7chuj.apps.googleusercontent.com"
                                render={renderProps => (
                                    <LogInGoogleButton onClick={renderProps.onClick}  disabled={renderProps.disabled} >Sign in with Google</LogInGoogleButton>

                                )}
                                onSuccess={handleGoogleLogin}
                                onFailure={()=>handleGoogleLogInFailure}
                                cookiePolicy={'single_host_origin'}
                            />

                        </Grid>

                    </Grid>
                    <Grid item container justify="center" style={{ width: '100%' }}>
                        <TextField
                            id="txt-username"
                            label="E-mail / Username"
                            variant="outlined"
                            inputProps={{ maxLength: 80 }}
                            color="primary"
                            value={email}
                            style={{ width: '90%' }}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item container justify="center" style={{ width: '100%' }}>
                        <TextField
                            id="txt-password"
                            label="password"
                            variant="outlined"
                            inputProps={{ maxLength: 80 }}
                            color="primary"
                            value={password}
                            type="password"
                            style={{ width: '90%' }}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>
                    
                    {signUp &&
                        <Grid item container justify="center" style={{ width: '100%' }}>
                            <TextField
                                id="txt-confirm-password"
                                label="confirm-password"
                                variant="outlined"
                                inputProps={{ maxLength: 80 }}
                                color="primary"
                                value={confirmPassword}
                                type="password"
                                style={{ width: '90%' }}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Grid>
                    }
                    {(!props.loggIn && error!="") &&
                     <Typography color="secondary" variant="subtitle2">{error}</Typography>}

                    <Grid item container justify="space-evenly">
                        <Grid item>
                            <LogInButton onClick={() => handleSignInButtonPressed()}>Log in</LogInButton>

                        </Grid>
                        <Grid item>
                            <SignUpButton onClick={() => { if (signUp) { handleSubmit() } else { setSignUp(true) } }}>Sign up</SignUpButton>

                        </Grid>
                    </Grid>



                </Grid>
                <Hidden smDown>
                    <Grid item sm={2}>

                    </Grid>
                </Hidden>
            </Grid>
        </ThemeProvider>
    )
}