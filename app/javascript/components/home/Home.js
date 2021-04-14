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

const LogInButton = withStyles({
    root: {
        //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
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


    console.log("logged in home?", props.loggedIn)
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

    const handleSuccesfulAuth = (data) => {
        props.handleLogin(data)
        props.history.push("/workspace")
    }

    const handleSubmit = function () {
        console.log(email)
        console.log(password)
        console.log(confirmPassword)
        axios.post('http://localhost:3000/registrations', {
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
                console.log("hurray")
                handleSuccesfulAuth(response.data)
            }
            console.log("registration response", response)
        }).catch(error => {
            console.log("registration error", error)
        })
        // event.preventDefault();

    }

    const handleSignInButtonPressed = () => {
        console.log(email)
        console.log(password)
        axios.post('http://localhost:3000/sessions', {
            user: {
                email: email,
                password: password
            }
        },
            { withCredentials: true }
        ).then(response => {
            if (response.data.logged_in) {
                console.log("hurray")
                handleSuccesfulAuth(response.data)
            }
            console.log("Login response", response)
        }).catch(error => {
            console.log("Login error", error)
        })
    }
    const handleGoogleLogin = (data) => {
        console.log(data.profileObj.email)
        const email = data.profileObj.email
        //Try to log in, if it's an error try to create, if there's an error you fucked up with syntax cause it doesn't exist
        //Actually there's no syntax error here just if there's an error it doesn't exist
        //BBUUUT we need to handle when you are logging in normally with a google kind email
        //And handle what if they type wrong email, wrong password, etc
        axios.post('http://localhost:3000/sessions', {
            user: {
                email: email,
                is_google: true
            }
        },
            { withCredentials: true }
        ).then(response => {
            if (response.data.logged_in) {
                console.log("hurray google login")
                handleSuccesfulAuth(response.data)
            }
            console.log("Login google response", response)
        }).catch(error => {
            if (error.response.status === 404) { ///THen create the account
                axios.post('http://localhost:3000/registrations', {
                    user: {
                        email: email,
                        is_google: true
                    }
                },
                    { withCredentials: true }
                ).then(response => {
                    if (response.data.status === "created") {

                        handleSuccesfulAuth(response.data)
                    }
                }).catch(error => {
                    console.log("registration error", error)//Let know that something weird went wrong
                })
            } else {//something else happened and tell user to check something else

            }
        })
    }
    const handleGoogleLogInFailure = ()=>{
        //TODO notify there was a damn error when trying to Log in with google
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
                                    <LogInGoogleButton onClick={renderProps.onClick} disabled={renderProps.disabled} >Log in with Google</LogInGoogleButton>

                                )}
                                onSuccess={handleGoogleLogin}
                                onFailure={handleGoogleLogInFailure}
                                cookiePolicy={'single_host_origin'}
                            />

                        </Grid>

                    </Grid>
                    <Grid item container justify="center" style={{ width: '100%' }}>
                        <TextField
                            id="txt-username"
                            label="e-mail"
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