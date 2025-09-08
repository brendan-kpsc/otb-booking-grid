import {MenuItem, TextField} from "@mui/material";
import React from "react";

export const ShortTermFilterOption = ({setValue, width}: {setValue: (value: string) => void, width: string}) => {
    const options = ['All', 'Short Term'];

    const handleChange = (event: any) => {
        setValue(event.target.value as string);
    };

    return (
        <TextField
            id="duration-filter"
            select
            label="Duration"
            defaultValue="All"
            onChange={handleChange}
            sx={{
                width: width,
            }}
        >
            {options.map((option: string) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </TextField>
    );
}