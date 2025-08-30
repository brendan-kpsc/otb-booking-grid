import {MenuItem, TextField} from "@mui/material";
import React from "react";

export const UnitGroupDropdown = ({setValue, width}: {setValue: (value: string) => void, width: string}) => {
    const options = ['All', 'FR/MO', 'TH/SU', 'SAT', 'None']

    const handleChange = (event: any) => {
        setValue(event.target.value as string);
    };

    return (
        <TextField
            id="unit-group-dropdown"
            select
            label="Unit Group"
            defaultValue="All"
            onChange={handleChange}
            sx={{
                width: width,
            }}
        >
            {options.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </TextField>
    );
}