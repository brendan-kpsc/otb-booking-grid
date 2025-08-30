import React from "react";
import { Button, Stack, Typography } from "@mui/material";

interface CalendarDateNavProps {
    setDate: (date: Date) => void;
    dateDisplay: Date;
    incrementDate: (type: 'month' | 'year', amount: number) => void;
}

const CalendarDateNav: React.FC<CalendarDateNavProps> = ({ setDate, dateDisplay, incrementDate }) => {
    const selectedYear = dateDisplay.getFullYear();

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const handleMonthClick = (monthIndex: number) => {
        setDate(new Date(selectedYear, monthIndex, 1));
    };

    const incrementYear = (value: number) => {
        incrementDate('year', value);
    }

    const incrementYearHandler = () => incrementYear(1);
    const decrementYearHandler = () => incrementYear(-1);

    return (
        <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
                {months.map((month, index) => (
                    <Button
                        key={index}
                        variant="outlined"
                        onClick={() => handleMonthClick(index)}
                    >
                        {month}
                    </Button>
                ))}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" justifySelf='end'>
                <Button onClick={decrementYearHandler} variant="outlined" color="primary">◀</Button>
                <Typography variant="h6">{selectedYear}</Typography>
                <Button onClick={incrementYearHandler} variant="outlined" color="primary">▶</Button>
            </Stack>
        </Stack>
    );
};

export default CalendarDateNav;
