import {MenuItem, TextField} from "@mui/material";
import React from "react";
import BookingUnit from "../../model/BookingUnit";

interface IProps {
    units: BookingUnit[],
    setValue: (v: string) => void,
    width: string
}

export const UnitTypeDropdown = ({units, setValue, width} : IProps) => {
    const unitTypeNames = new Set(units.map(unit => unit.extendedProps.unitTypeName));
    const options = ['All', ...unitTypeNames];

    const handleChange = (event: any) => {
        setValue(event.target.value as string);
    };

    return (
        <TextField
            id="unit-type-dropdown"
            select
            label="Unit Type"
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