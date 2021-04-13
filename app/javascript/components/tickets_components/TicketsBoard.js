import React, { useState, useEffect, Fragment } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Column from './Column'
import { makeStyles } from '@material-ui/core/styles';
import FormDialog from './FormDialog'
import Typography from '@material-ui/core/Typography';
// import axios from 'axios'
const useStyles = makeStyles(() => ({

    button_pad: {
        paddingRight: '30px'
    },
    top_bar: {
        marginTop: '20px',
        marginBottom: '5px'
    }

}));
const null_employee = [
    {
      "id":0,
      "name": "not assigned"
    }
  ]


function TicketsBoard() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [project, setProject] = useState([])
    const [loaded, setLoaded] = useState(false)
    const project_id = 1
    const [backlogTickets, setBacklogTickets] = useState([])
    const [devTickets, setDevTickets] = useState([])
    const [progressTickets, setProgressTickets] = useState([])
    const [doneTickets, setDoneTickets] = useState([])
    const [employees, setEmployees] =useState([])
    const [flag, setFlag] = useState(false)

    // useEffect(() => {
    //     const url = `api/v1/projects/${project_id}`
    //     console.log(url)
        // axios.get(url)
        //     .then(function (response) {
        //         setProject(response.data)
        //         setEmployees(null_employee.concat(response.data.employees))
        //         setLoaded(true)
        //         setBacklogTickets(response.data.tickets.filter(ticket => ticket.status === 'Backlog'))
        //         setDevTickets(response.data.tickets.filter(ticket => ticket.status === 'Selected for development'))
        //         setProgressTickets(response.data.tickets.filter(ticket => ticket.status === 'In progress'))
        //         setDoneTickets(response.data.tickets.filter(ticket => ticket.status === 'Done'))
                
        //     })
        //     .catch(resp => console.log(resp))
    // }, [flag])

    return (

        <Fragment>

            <Grid container className={classes.top_bar} direction='row' alignItems='center'>
                <Grid container item md={6} xs={12} justify='center' direction='row'>
                    {
                        loaded &&
                        <Grid item>
                             <Typography variant="h3" >
                             {project.name}        
                             </Typography>
                        </Grid>
                    }

                </Grid>
                <Grid container item md={6} xs={12} direction='row' justify='flex-end'>
                    <Grid item className={classes.button_pad}>
                        <Button variant='contained' color='primary' onClick={() => setOpen(true)}>
                            New ticket
                        </Button>
                    </Grid>
                </Grid>

            </Grid>


            {loaded &&
            //TODO each column should have all the tickets in one array
            //Including tickets
            //also pass all the way to the tickets and to the form the setters
                <Grid container direction='row' justify="center" >
                    <Column col_title='Backlog' tickets={backlogTickets}  employees={employees}project_id={project_id}
                    flag ={flag}
                    setFlag={setFlag}></Column>
                    <Column col_title='Selected for development' tickets={devTickets} employees={employees}project_id={project_id}
                    flag ={flag}
                    setFlag={setFlag}></Column>
                    <Column col_title='In progress' tickets={progressTickets} employees={employees}project_id={project_id}
                    flag ={flag}
                    setFlag={setFlag}></Column>
                    <Column col_title='Done' tickets={doneTickets} employees={employees}project_id={project_id}
                    flag ={flag}
                    setFlag={setFlag}></Column>
                </Grid>
            }

            <FormDialog
                open={open}
                setOpen={setOpen}
                employees ={employees}
                project_id = {project_id}
                flag ={flag}
                setFlag={setFlag}
            >
            </FormDialog>
        </Fragment>
    );
}

export default TicketsBoard;