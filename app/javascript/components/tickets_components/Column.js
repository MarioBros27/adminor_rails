import React from 'react'
import Grid from '@material-ui/core/Grid'
import Ticket from './Ticket'
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles({
    hi: {

        background: '#ddd',
        borderRadius: '10px',
        paddingLeft: '10px',
        paddingRight: '10px'

    },
    lo:{
        paddingLeft:'10px',
        paddingRight: '10px',
        marginTop:'10px'
    },
    header:{
        marginTop: '10px',
        paddingLeft: '10px',
        paddingBottom: '10px',
    }
});

export default function Column(props) {
    const classes = useStyles();
    
    return (
        <Grid md={3} xs={12}sm={6}className={classes.lo} item >
            <Grid className={classes.hi}container>
                <Grid item className={classes.header} xs={12} >
                <Typography variant="subtitle1" >
                {props.col_title} {props.tickets.length}        
                </Typography>
                    
                </Grid>
                <Grid item xs={12}>
                {props.tickets.map(ticket => {
                            return(
                                <Ticket key={ticket.id}ticket={ticket}employees={props.employees} project_id={props.project_id}
                                flag ={props.flag}
                                setFlag={props.setFlag}/>
                            )
                        })}
                    
                </Grid>
            </Grid>
        </Grid>


    );
}