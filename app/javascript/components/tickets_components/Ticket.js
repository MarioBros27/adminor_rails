import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import EditDialog from './EditDialog'

const useStyles = makeStyles({
  root: {
    width: '100%',
    marginBottom: '8px',
    paddingBottom: '1px',

  },
  title: {
    fontSize: 14,
  },
  no_pad: {
    paddingLeft: '0',
    paddingTop: '0',
  },
  small_pad: {
    padding: ' 5px 16px 0px',

    "&:last-child": {
      paddingBottom: '5px'
    },
  },
  card_details: {
    paddingTop: '2px'
  }
});

export default function Ticket(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const assignee_id = props.ticket.assignee === null ? 0 : props.ticket.assignee
  const assignee_name = props.ticket.assignee === null ? 'Not assigned': props.employees.find(x => x.id === assignee_id).name;
  const reporter_id = props.ticket.reporter === null ? 0 : props.ticket.reporter
  
  return (
    <>
      <Card className={classes.root}>
        <CardContent className={classes.small_pad}>
          <Grid container  alignItems='center'>
            <Grid item xs={5} >
              <Typography className={classes.title} color="textSecondary" >
                ID-{props.ticket.id}
        </Typography>
            </Grid>
            <Grid container item xs={7} alignItems='center' justify='flex-end'>
              <Grid item >
                <Button size="small"onClick={()=>setOpen(true)} >Edit</Button>
              </Grid>

            </Grid>
          </Grid>


          <Typography variant="body2" component="p">
            {props.ticket.title}
        </Typography>

          <Grid container className={classes.card_details}  alignItems='center'>

            <Grid item xs={6} >
              <Typography className={classes.title} color="textSecondary" >
              {props.ticket.priority}
        </Typography>
            </Grid>
            <Grid item xs={6}  >
              <Typography className={classes.title} color="textSecondary" >
              {assignee_name}
        </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <EditDialog
        open={open}
        setOpen={setOpen}
        employees ={props.employees}
        ticket={props.ticket}
        reporter_id ={reporter_id}
        assignee_id={assignee_id}
        project_id={props.project_id}
        flag ={props.flag}
        setFlag={props.setFlag}
      >

      </EditDialog>
    </>
  );
}