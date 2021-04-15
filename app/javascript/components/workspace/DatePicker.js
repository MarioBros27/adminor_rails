import 'date-fns';
import React,{useState} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DatePicker(props) {
    // The first commit of Material-UI
    //   const dummyDate = new Date('')
    const [selectedDate, setSelectedDate] = useState(props.selectedDateIn);
    // if (props.date) {
    //     //TODO: get sent date and set it to selectedDate
    //     const dummyDate = format(new Date(2022, 1, 11), 'yyyy-MM-dd')
    //     console.log(dummyDate)

    // }  
    


    const handleDateChange = (date) => {
        console.log(date.getDate())
        console.log(date.getMonth() + 1)
        console.log(date.getFullYear())
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
                {/* <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date picker dialog"
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="Time picker"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        /> */}
            </Grid>
        </MuiPickersUtilsProvider>
    );
}