import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'

import Hidden from '@material-ui/core/Hidden';

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
                password_confirmation: confirmPassword
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

    const handleSignInButtonPressed = ()=>{
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
                            <LogInGoogleButton>Log in with Google</LogInGoogleButton>

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
                            <LogInButton onClick={()=>handleSignInButtonPressed()}>Log in</LogInButton>

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