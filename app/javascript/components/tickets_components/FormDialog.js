import React,{useState} from 'react'
import { Dialog, DialogContent } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
// import axios from 'axios'
import DropMenu from './DropMenu'
const useStyles = makeStyles({
    bottom_field: {
        marginTop: '10px',
        width: '98%'
    },
    popup: {
        minHeight: '80vh'
    },
    title: {
        width: '98%'
    },
    description: {
        width: '98%'
    },
    extras: {
        paddingLeft: '14px'
    }

});
const priorityItems = [
    {
        id: 1,
        name: 'High'
    },
    {
        id: 2,
        name: 'Medium'
    },
    {
        id: 3,
        name: 'Low'
    },
]

const statusItems = [
    {
        id:1,
        name: 'Backlog'
    },
    {
        id:2,
        name: 'Selected for development'
    },
    {
        id:3,
        name: 'In progress'
    },
    {
        id:4,
        name: 'Done'
    },
]

export default function FormDialog(props) {
    const classes = useStyles();
    const { open, setOpen } = props;
    const [priority, setPriority] = useState(priorityItems[0])
    const [assignee, setAssignee] = useState([])
    const [reporter, setReporter] = useState([])
    const [status, setStatus] = useState(statusItems[0])
    const [title, setTitle] = useState('')
    const [description,setDescription] = useState('')

    const changePriority = (value) =>{
        setPriority(value)
    }
    const changeAssignee = (value) =>{
        setAssignee(value)
    }
    const changeReporter = (value) =>{
        setReporter(value)
    }
    const changeStatus = (value) =>{
        setStatus(value)
    }
    const post = () =>{
        
        var repo = null
        var ass = null
        if(reporter.length != 0){
            if(reporter.id != 0){
                repo = reporter.id
            }
        }
        if(assignee.length !=0){
            if(assignee.id !=0){
                ass = assignee.id
            }
        }
        if(title === '' || description === ''){
            return;
        }
        close()
        const new_data = {
            title: title,
            description: description,
            priority: priority.name,
            status: status.name,
            reporter: repo,
            assignee: ass,
            project_id: props.project_id
        }
        
       
        
        // axios.post('api/v1/tickets',new_data)
        // .then(function(response) {
        //     // console.log(response)
        //     props.setFlag(!props.flag)
        // })
        // .catch(resp=> console.log(resp))
    }
    const close = () =>{
        setOpen(false)
        setTitle('')
        setDescription('')
    }
    return (
        <Dialog open={open} maxWidth='md' fullWidth={true} className={classes.popup}>

            <DialogContent className={classes.popup}>
                <Grid item container xs={12} justify='flex-end' >
                    <Button onClick={close}>
                        X
                        </Button>
                </Grid>
                <Grid container direction='row' className={classes.popup}>
                    <Grid item container md={7} xs={12} direction='column'>
                        <Grid item className={classes.title} >
                            <TextField
                                className={classes.title}
                                id="title"
                                label="Title"
                                variant="outlined"
                                inputProps={{ maxLength: 120 }}
                                multiline
                                rowsMax={2}
                                value={title}
                                onChange={(e)=> setTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item className={classes.bottom_field} >



                            <TextField
                                className={classes.description}
                                rows={22}
                                id="Description"
                                label="Description"
                                variant="outlined"
                                inputProps={{ maxLength: 5000 }}
                                multiline
                                rowsMax={22}

                                value={description}
                                onChange={(e)=> setDescription(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container md={5} xs={12} className={classes.extras} direction='column'>
                        <DropMenu title='Priority' items={priorityItems} current={1} setValue={changePriority}/>
                        <DropMenu title='Assignee' items={props.employees} current={0} setValue={changeAssignee}/>
                        <DropMenu title='Reporter' items={props.employees} current={0} setValue={changeReporter}/>
                        <DropMenu title='Status' items={statusItems}current={1} setValue={changeStatus}/> 
                            <Grid item >
                                <Button variant='contained' color='primary' onClick={post}>
                                    Save
                                </Button>
                            </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}