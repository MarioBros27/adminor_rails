
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, {useState} from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
    bottom_margin:{
        marginBottom: '15px'
    }

});

export default function DropMenu(props) {
    const classes = useStyles();
    const items = props.items;
    const [selectedItem, setSelectedItem] = useState(items.find(x => x.id === props.current));
    
  
    const handleChange = (event) => {
        setSelectedItem(event.target.value)
        props.setValue(event.target.value)
    };
    const getItemIndex = (id, items) => {
        for(let i =0; i<items.length; i++){
            if(items[i].id === id){
                return i;
            }
        }
        return '';
    };

    return (
        <Grid item container className = {classes.bottom_margin} direction='row' alignItems='center'>
            <Grid item md={4} xs={12}>
            <Typography variant="subtitle1" >
                {props.title}
            </Typography>
            </Grid>
            <Grid item md={8} xs={12}>
                <FormControl>
                    <Select displayEmpty value={items[getItemIndex(selectedItem.id,items)]} onChange={handleChange}>
                        {items.map(item => {
                            return(
                                <MenuItem key = {item.id} value = {item}>{item.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}