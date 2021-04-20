import 'date-fns';
import React,{useState} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DatePicker(props) {

    const [selectedDate, setSelectedDate] = useState(props.selectedDateIn);

    const handleDateChange = (date) => {
        // console.log(date.getDate())
        // console.log(date.getMonth() + 1)
        // console.log(date.getFullYear())
        setSelectedDate(date);
        props.setSelectedDate(date)
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container >
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </Grid>
        </MuiPickersUtilsProvider>
    );
}