import React  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid'

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'

const color ={
    red:"#f50057",
    yellow:"#999900",
    green:"#52b202",
    gray:"#add8e6"
}
const StyledButton = withStyles({
    root: {
        width: '100%',
        justifyContent: "flex-start",
        textAlign: 'left',
    },
    label: {
        textTransform: 'none'
    },
})(Button);

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginTop: '20px',
        marginBottom: '20px',
        backgroundColor: theme.palette.background.paper,

    },
}));

export default function CheckboxList(props) {
    const classes = useStyles();

    const handleToggle = (id) => (event) => {
        props.changeTaskStatus(event.target.checked,id);
    };

    return (
        <List className={classes.root}>
            
            {props.tasks.map(task => {
                let value = task.id
                
                return (
                    <ListItem key={value} role={undefined} dense style={{ 
                        border: `1px solid ${color[task.color]}` }}>

                        <ListItemIcon>

                            <Checkbox
                                edge="start"
                                onChange={handleToggle(value)}
                                checked={task.done}
                            />

                        </ListItemIcon>
                        <Divider orientation="vertical" flexItem style={{ marginLeft: "-20px" }} />
                        <Grid container direction='row' alignItems="center">
                            <Grid item md={10} xs={12}  >
                                <Typography variant='body1'>
                                    
                                    <StyledButton onClick={() => props.handleOpenEditTask(task)}>{task.name}</StyledButton>
                                </Typography>
                            </Grid>
                            <Divider orientation="vertical" flexItem style={{ marginRight: "-1px" }} />
                            <Grid item container md={2} xs={12} justify="center">
                                <p style={{color:color[task.color]}}>{task.pretty_date}</p>

                            </Grid>
                        </Grid>

                        <Divider orientation="vertical" flexItem />

                        <ListItemSecondaryAction onClick={()=>props.handleOpenDeleteTask(value)}>
                            <IconButton edge="end" aria-label="comments">
                                <DeleteIcon></DeleteIcon>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            })}
        </List>
    );
}
