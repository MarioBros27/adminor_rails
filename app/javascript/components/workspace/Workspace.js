
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react'
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button'
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TasksList from './TasksList'
import DatePicker from './DatePicker'
import axios from 'axios'
import LinearProgress from '@material-ui/core/LinearProgress';

const drawerWidth = 240;
let taskToDelete = -1
let projectToDelete = -1
let editingProject = false
let editingTask = false
const dev = "http://localhost:3000"
const prod = "https://adminor.herokuapp.com"
const url = prod

let prettyDates = ['', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DEC']
const color ={
    red:"#f50057",
    yellow:"#999900",
    green:"#52b202",
    gray:"#add8e6"
}
const sortArray = (lista) => {
    
    const today = new Date().setHours(0, 0, 0, 0)
    let sortedByDate = []
    let sortedByName = []
    lista.forEach(el => {
        const splitted = el['due_date'].split("-")
        const day = parseInt(splitted[0])
        const month = parseInt(splitted[1]) - 1
        const year = parseInt(splitted[2])
        const dateT = new Date(year, month, day).setHours(0, 0, 0, 0)
        if (dateT < today) {//It's in the past
            sortedByName.push(el)
        }else{
            el['date'] = dateT
            sortedByDate.push(el)
        }
    })
    sortedByDate.sort((a, b) => a.date - b.date)
    sortedByName.sort( (a, b) => a.name.localeCompare(b.name, 'es', {ignorePunctuation: true}));

    return(sortedByDate.concat(sortedByName))
}
const getColor = (date)=>{
    const splitted = date.split("-")
    const day = parseInt(splitted[0])
    const month = parseInt(splitted[1]) - 1
    const year = parseInt(splitted[2])
    const dateT = new Date(year, month, day).setHours(0,0,0,0)
    const today = new Date().setHours(0,0,0,0)
    const difference = parseInt((dateT - today)/(24*3600*1000))
    let color = ""

    if (dateT < today){
        color = "gray"
    }else if (difference <= 1){
        color = "red"
    }else if (difference< 7){
        color = "yellow"
    }else if (difference >= 7){
        color = "green"
    }
    return color
}
const StyledLinearProgress = withStyles({
    root: {
        color: '52b202',
        witdh: '100%',
        height: '4px'

    }
})(LinearProgress);
const StyledAddButton = withStyles({
    root: {
        //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: '#52b202',
        borderRadius: 3,
        border: 0,
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
})(Button);

const SaveButton = withStyles({
    root: {
        //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: '#52b202',
        borderRadius: 3,
        border: 0,
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
})(Button);
const DeleteButton = withStyles({
    root: {
        //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: '#f50057',
        borderRadius: 3,
        border: 0,
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
})(Button);
const LogOutButton = withStyles({
    root: {
        //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: '#f50057',
        borderRadius: 3,
        border: 0,
        height: 48,
        padding: '0 30px',
        marginTop: '20px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
})(Button);
const AddButton = withStyles({
    root: {
        //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: '#52b202',
        borderRadius: 3,
        border: 0,
        height: 48,
        padding: '0 30px',
        marginTop: '20px',
        marginBottom: '4px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
})(Button);
export default function Workspace(props) {
    // console.log(props.user)
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

    let isLaptop = useMediaQuery('(min-width: 600px)', { noSsr: true })
        
    //Play with drawer width with different sizes, simply modify variable drawerWidth
    const useStyles = makeStyles((theme) => {
        let shift = {}
        if (isLaptop) {
            shift = {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                // marginLeft: 0,
                marginLeft: drawerWidth,

            }
        } else {
            shift = {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),

            }
        }

        return ({
            root: {
                display: 'flex',
            },
            appBar: {
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            },
            appBarShift: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
            menuButton: {
                marginRight: theme.spacing(2),
            },
            hide: {
                display: 'none',
            },
            drawer: {
                width: drawerWidth,
                flexShrink: 0,
            },
            drawerPaper: {
                width: drawerWidth,
            },
            drawerHeader: {
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0, 1),
                // necessary for content to be below app bar
                ...theme.mixins.toolbar,
                justifyContent: 'flex-end',
            },
            content: {
                flexGrow: 1,
                padding: theme.spacing(3),
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            },
            contentShift: shift
        })
    });

    const classes = useStyles();
    const [open, setOpen] = useState(isLaptop);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    // console.log("login state workspace", props.loggedIn)
    const [notDone, setNotDone] = useState([])//Objects
    const [done, setDone] = useState([])//Objects
    const [deleteTask, setDeleteTask] = useState(false)//Dialog delete task boolean
    const [deleteProject, setDeleteProject] = useState(false)//Dialog delete project boolean
    const [projectTitle, setProjectTitle] = useState('')//Project title placeholder
    const [openNewProjectD, setOpenNewProjectD] = useState(false)//Dialog create project boolean 
    const [taskTitle, setTaskTitle] = useState('')//Task title placeholder
    const [openNewTaskD, setOpenNewTaskD] = useState(false)//Dialog create task boolean
    // const [projects, setProjects] = useState(starting_projects)//Objects
    const [projects, setProjects] = useState(props.user.projects)//Objects
    const [currentViewingProject, setCurrentViewingProject] = useState({})//Selected viewing project object
    const [currentTask, setCurrentTask] = useState({})//Selected task object that will be modified
    const [loading, setLoading] = useState(false)
    const [loadingPopup, setLoadingPopup] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [addedColorToProjects, setAddedColorToProjects] = useState(false)
    useEffect(()=>{
        // console.log("errorosm")
        projects.forEach(el=>{
            el['color'] = getColor(el.due_date)
        })
        setProjects(sortArray(projects))
        // console.log(projects)
        setAddedColorToProjects(true)

    },[])
    const handleLogoutButtonPressed = () => {
        axios.delete(`${url}/logout`, { withCredentials: true }).then(response => {
            props.handleLogout()
        })

    }
    //Functino to change the task status
    const changeTaskStatus = function (value, id) {
        //If value is true it means that a not done is changed to done. If else the opposite
        var doneTemp = done
        var notDoneTemp = notDone
        const doneBackup = done
        const notDoneBackup = notDone
        axios.put(`${url}/tasks/${id}`, {
            done: value
        }).then(response => {

        }).catch(error => {
            if (value) {
                setDone(doneBackup)
            } else {
                setNotDone(notDoneBackup)
            }

        })
        //Removing the element to be transfered
        if (value) {
            //Transfering to new list
            const toBeTransfered = notDoneTemp.filter(el => el.id === id)
            const actuallyToBeTransfered = toBeTransfered[0]
            actuallyToBeTransfered.done = value

            //Pushing
            doneTemp.push(actuallyToBeTransfered)
            //Sort them by date
            doneTemp = sortArray(doneTemp)
            //Deleting from previous list
            notDoneTemp = notDoneTemp.filter(el => el.id !== id)
        } else {
            //Transfering to new list
            const toBeTransfered = doneTemp.filter(el => el.id === id)
            const actuallyToBeTransfered = toBeTransfered[0]
            actuallyToBeTransfered.done = value
            // console.log(actuallyToBeTransfered)
            // console.log(actuallyToBeTransfered[0].value)
            // //Pushing
            notDoneTemp.push(actuallyToBeTransfered)
            //Sort them by date
            notDoneTemp = sortArray(notDoneTemp)
            //Deleting from previous list
            doneTemp = doneTemp.filter(el => el.id !== id)
        }
        setDone(doneTemp)
        setNotDone(notDoneTemp)


    }
    //Delete task Dialog
    const handleOpenDeleteTask = function (id) {
        setDeleteTask(true);
        taskToDelete = id
        // console.log(taskToDelete)
    };

    const handleCloseDeleteTask = () => {
        setDeleteTask(false);
    };
    const handleDeleteTask = () => {
        const urlo = `${url}/tasks/${taskToDelete}`
        axios.delete(urlo).then(response => {
            //Delete from wherever it is try not done and done
            setNotDone(notDone.filter(el => el.id !== taskToDelete))
            setDone(done.filter(el => el.id !== taskToDelete))
            setDeleteTask(false);
        }).catch(error => {
        })

    };
    //Delete Project DIalog
    const handleOpenDeleteProject = function (id) {
        setDeleteProject(true);
        projectToDelete = id
        // console.log(projectToDelete)
    };

    const handleCloseDeleteProject = () => {
        setDeleteProject(false);
    };
    const handleDeleteProject = () => {
        setLoading(true)
        const urlo = `${url}/projects/${projectToDelete}`
        axios.delete(urlo).then(response => {
            setDeleteProject(false);
            setProjects(projects.filter(el => el.id !== projectToDelete))
            setLoading(false)
            // console.log(projectToDelete)
        }).catch(error => {
            setLoading(false)
            // console.log(error)
        })

    };

    ///NEw Project
    const handleOpenNewProject = function () {
        editingProject = false
        setSelectedDate(new Date())
        setOpenNewProjectD(true)
    };

    const handleCloseNewProject = () => {
        setOpenNewProjectD(false)
        setProjectTitle('')
    };
    const postProject = (date) => {
        // console.log(date)
        setLoadingPopup(true)
        var name = projectTitle
        if (projectTitle === '') {
            name = 'No name'
        }
        axios.post(`${url}/projects`, {
            name: name,
            user_id: props.user.id,
            due_date: date
        }).then(response => {
            // console.log(response.data)
            const new_guy = response.data
            new_guy['color'] = getColor(new_guy.due_date)
            projects.push(new_guy)
            setProjects(sortArray(projects))
            setProjectTitle('')
            setOpenNewProjectD(false)
            setLoadingPopup(false)
        }).catch(error => {
            setLoadingPopup(false)
            return -1
        })
    }
    const putProject = (date) => {
        const urlo = `${url}/projects/${currentViewingProject.id}`
        setLoadingPopup(true)
        axios.put(urlo, {
            name: projectTitle,
            due_date: date
        }).then(response => {
            projects.forEach(el => {
                if (el.id === currentViewingProject.id) {
                    el['name'] = projectTitle
                    el['due_date'] = date
                    el['color'] = getColor(date)
                }
                
            })
            // setProjects(sortArray(projects))
            setAddedColorToProjects(true)
            // console.log(addedColorToProjects)
            setProjects(sortArray(projects))

            // console.log(projects)
            // projects[currentViewingProject.id]['name'] = projectTitle
            currentViewingProject.name = projectTitle
            currentViewingProject['due_date'] = date
            currentViewingProject['pretty_date'] = getPrettyDate(date)
            currentViewingProject['color'] = getColor(date)
            
            setProjectTitle('')
            setOpenNewProjectD(false)
            setLoadingPopup(false)
            //async update projects after fetching the server
        }).catch(error => {
            setLoadingPopup(false)
            return -1
        })
    }
    ///Save new or edited project
    const handleSaveNewProject = () => {
        // console.log(selectedDate)
        var date = selectedDate.getDate().toString()
        var month = (selectedDate.getMonth() + 1).toString()
        var year = selectedDate.getFullYear().toString()
        var newDate = `${date}-${month}-${year}`
        // console.log(newDate)
        if (!editingProject) {//Post new
            postProject(newDate)

        } else {//Edit 
            if (projectTitle !== '') {
                putProject(newDate)
            }
        }
    };
    //Edit project 
    const handleOpenEditProject = function () {
        editingProject = true
        var splitted = currentViewingProject.due_date.split("-")
        var day = parseInt(splitted[0])
        var month = parseInt(splitted[1]) - 1
        var year = parseInt(splitted[2])
        var date = new Date(year, month, day)
        // var date = format(new Date(year, month, day), 'yyyy-MM-dd')
        // console.log(date)
        setSelectedDate(date)
        setProjectTitle(currentViewingProject.name)
        setOpenNewProjectD(true)
    };
    ///NEw Task
    const handleOpenNewTask = function () {
        editingTask = false
        setSelectedDate(new Date())
        setOpenNewTaskD(true)
    };

    const handleCloseNewTask = () => {
        setOpenNewTaskD(false)
        setTaskTitle('')
    };
    const postTask = (date) => {
        var name = taskTitle
        setLoadingPopup(true)
        if (taskTitle === '') {
            name = 'Nada'
        }
        axios.post(`${url}/tasks`, {
            name: name,
            project_id: currentViewingProject.id,
            due_date: date,
            done: false
        }).then(response => {
            const new_guy = response.data
            // console.log(new_guy)
            new_guy['pretty_date'] = getPrettyDate(new_guy['due_date'])
            new_guy['color'] = getColor(new_guy['due_date'])
            notDone.push(new_guy)
            setNotDone(sortArray(notDone))

            setTaskTitle('')
            setOpenNewTaskD(false)
            setLoadingPopup(false)
        }).catch(error => {
            setLoadingPopup(false)
            return -1
        })
    }
    const putTask = (date) => {
        var name = taskTitle
        if (taskTitle === '') {
            name = 'Nada'
        }
        setLoadingPopup(true)
        axios.put(`${url}/tasks/${currentTask.id}`, {
            name: name,
            due_date: date
        }).then(response => {
            // console.log("made it here", currentTask)
            // console.log(currentTask.done)
            const new_guy = response.data
            // console.log(new_guy)
            new_guy['pretty_date'] = getPrettyDate(new_guy['due_date'])
            new_guy['color'] = getColor(new_guy['due_date'])
            // console.log(new_guy['pretty_date'])
            if (currentTask.done) {
                let newList = []
                done.forEach(el => {

                    if (el.id === new_guy.id) {
                        newList.push(new_guy)
                    } else {
                        newList.push(el)
                    }
                })

                // setDone(newList)
                setDone(sortArray(newList))

            } else {
                let newList = []
                notDone.forEach(el => {

                    if (el.id === new_guy.id) {
                        newList.push(new_guy)
                    } else {
                        newList.push(el)
                    }
                })
                // console.log("newlist", newList)
                // setNotDone(newList)
                setNotDone(sortArray(newList))
            }
            setTaskTitle('')
            setOpenNewTaskD(false)
            setLoadingPopup(false)

        }).catch(error => {
            setLoadingPopup(false)

            return -1
        })
    }
    //Saving new or editing a task
    const handleSaveNewTask = () => {
        // console.log(selectedDate)
        var date = selectedDate.getDate().toString()
        var month = (selectedDate.getMonth() + 1).toString()
        var year = selectedDate.getFullYear().toString()
        var newDate = `${date}-${month}-${year}`
        // console.log(newDate)
        if (!editingTask) {
            postTask(newDate)
        } else {
            putTask(newDate)
        }
    };
    //Edit Task 
    const handleOpenEditTask = function (task) {
        // setOpenNewProjectD(true)
        editingTask = true
        var splitted = task.due_date.split("-")
        var day = parseInt(splitted[0])
        var month = parseInt(splitted[1]) - 1
        var year = parseInt(splitted[2])
        var date = new Date(year, month, day)
        // var date = format(new Date(year, month, day), 'yyyy-MM-dd')
        // console.log(date)
        setSelectedDate(date)
        setCurrentTask(task)
        setTaskTitle(task.name)
        setOpenNewTaskD(true)
    };

    const showProject = (id) => {
        //Fetch it's tasks by calling project from the api
        //TODO tasks
        setLoading(true)
        const urlo = `${url}/projects/${id}`
        axios.get(urlo).then(response => {
            const proj = response.data
            //Set tickets
            const doneT = response.data.tasks.filter(el => el.done === true)
            const notDoneT = response.data.tasks.filter(el => el.done === false)
            doneT.forEach(el => {
                el["pretty_date"] = getPrettyDate(el.due_date)
                el["color"] = getColor(el.due_date)
            })
            notDoneT.forEach(el => {
                el["pretty_date"] = getPrettyDate(el.due_date)
                el["color"] = getColor(el.due_date)
            })
            // setDone(doneT)
            setDone(sortArray(doneT))
            setNotDone(sortArray(notDoneT))
            proj["pretty_date"] = getPrettyDate(proj.due_date)
            proj["color"] = getColor(proj.due_date)
            //Set project but remove the tickets to optimize memory use
            delete proj.tasks
            setCurrentViewingProject(proj)
            setLoading(false)
        }).catch(error => { setLoading(false) })
    }
    const getPrettyDate = (ugly_date) => {
        var splitted = ugly_date.split("-")
        var day = parseInt(splitted[0])
        var month = parseInt(splitted[1])
        var year = parseInt(splitted[2])
        return `${day}-${prettyDates[month]}-${year}`
    }

    
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h3" noWrap>
                        Adminor
                    </Typography>
                    
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    {
                        isLaptop === false &&
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    }

                </div>
                <Divider />
                {loading && <StyledLinearProgress  />}
                <List>
                    {addedColorToProjects && projects.map(proj => {
                    //    console.log("hallelujah")
                       return (
                            <ListItem button onClick={() => showProject(proj.id)} key={proj.id} style={{ 
                                border: `3px solid ${color[proj.color]}` }}>
                                <ListItemText primary={proj.name} />
                                <ListItemSecondaryAction onClick={() => handleOpenDeleteProject(proj.id)}>
                                    <IconButton edge="end" aria-label="delete">
                                        <DeleteIcon></DeleteIcon>
                                    </IconButton>
                                </ListItemSecondaryAction>

                            </ListItem>);
                    })}
                </List>
                <Divider />
                <StyledAddButton onClick={() => handleOpenNewProject()}>new project</StyledAddButton>
                <LogOutButton onClick={() => handleLogoutButtonPressed()}>Log Out</LogOutButton>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {"name" in currentViewingProject ? (<>
                    <Grid container direction='row' alignItems="flex-start">
                        <Grid item xs={11}  >

                            <Typography variant="h3" >{currentViewingProject.name}</Typography>
                            {/* <Typography variant="subtitle1" >{currentViewingProject.pretty_date}</Typography> */}
                            <h3 style={{marginTop: "4px", marginBotton: "0px", color:color[currentViewingProject.color] }}>{currentViewingProject.pretty_date}</h3>
                        </Grid>

                        <Grid item container xs={1} >
                            <Button onClick={handleOpenEditProject}>
                                <EditIcon></EditIcon>
                            </Button>

                        </Grid>
                    </Grid>
                    <AddButton onClick={handleOpenNewTask}>new task</AddButton>
                    <Divider />
                    <TasksList tasks={notDone} handleOpenDeleteTask={handleOpenDeleteTask} handleOpenEditTask={handleOpenEditTask} changeTaskStatus={changeTaskStatus}></TasksList>
                    <Divider />
                    <Typography variant='h4'>Done</Typography>
                    <TasksList tasks={done} handleOpenDeleteTask={handleOpenDeleteTask} handleOpenEditTask={handleOpenEditTask} changeTaskStatus={changeTaskStatus}></TasksList>
                </>) :
                    <Typography color='secondary' variant='h3'>Select a project from the sidebar</Typography>
                }
            </main>
            <Dialog
                open={deleteTask}
                onClose={handleCloseDeleteTask}
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Sure you wanna delete the task?
                        </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteTask} variant="contained" color="primary">
                        Nah
                        </Button>
                    <Button onClick={handleDeleteTask} variant="contained" color="secondary" autoFocus>
                        Yeah
                        </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteProject}
                onClose={handleCloseDeleteProject}
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Sure you wanna delete the project?
                        </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteProject} variant="contained" color="primary">
                        Nah
                        </Button>
                    <Button onClick={handleDeleteProject} variant="contained" color="secondary" autoFocus>
                        Yeah
                        </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openNewProjectD}
                onClose={handleCloseNewProject}
            >
                {loadingPopup && <StyledLinearProgress  />}
                <DialogContent>
                

                    <TextField
                        id="title-project-name"
                        label="Project name"
                        variant="outlined"
                        inputProps={{ maxLength: 80 }}
                        multiline
                        color="primary"
                        rowsMax={5}
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                    />
                    <DatePicker selectedDateIn={selectedDate} setSelectedDate={setSelectedDate}></DatePicker>
                </DialogContent>
                <DialogActions>
                    <DeleteButton onClick={handleCloseNewProject} variant="contained" color="secondary">
                        Cancel
                        </DeleteButton>
                    <SaveButton onClick={handleSaveNewProject} variant="contained" color="primary" autoFocus>
                        Save
                        </SaveButton>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openNewTaskD}
                onClose={handleCloseNewTask}
            >
                {loadingPopup && <StyledLinearProgress  />}
                <DialogContent>
                    <TextField
                        id="title-task-name"
                        label="Task name"
                        variant="outlined"
                        inputProps={{ maxLength: 80 }}
                        multiline
                        color="primary"
                        rowsMax={5}
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                    />
                    <DatePicker selectedDateIn={selectedDate} setSelectedDate={setSelectedDate}></DatePicker>
                </DialogContent>
                <DialogActions>
                    <DeleteButton onClick={handleCloseNewTask} variant="contained" color="secondary">
                        Cancel
                        </DeleteButton>
                    <SaveButton onClick={handleSaveNewTask} variant="contained" color="primary" autoFocus>
                        Save
                        </SaveButton>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
}

