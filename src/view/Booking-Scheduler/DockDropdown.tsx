import {MenuItem, TextField} from "@mui/material";
import React from "react";

export const DockDropdown = ({setValue, width}: {setValue: (value: string) => void, width: string}) => {
    const options = ['All', ...'ABCDEF'.split('').map(letter => `Dock ${letter}`)];

    const handleChange = (event: any) => {
        setValue(event.target.value as string);
    };

    return (
        <TextField
            id="dock-dropdown"
            select
            label="Dock"
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