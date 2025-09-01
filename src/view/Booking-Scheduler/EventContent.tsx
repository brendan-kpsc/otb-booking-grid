import Tooltip, {TooltipProps} from '@mui/material/Tooltip';
import React from "react";
import {tooltipClasses, Typography} from "@mui/material";
import styled from "@mui/material/styles/styled";

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} followCursor />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
    },
});

export const EventContent =  (arg: any) => {
    const contactName = arg.event.extendedProps.contactName;
    const eventName = arg.event.title;
    const homePhoneNumber = arg.event.extendedProps.homePhoneNumber?.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
    const mobilePhoneNumber = arg.event.extendedProps.mobilePhoneNumber?.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');

    const label = <>
        <Typography variant="body2"><strong>Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{eventName}</Typography>
        <Typography variant="body2"><strong>Contact:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{contactName}</Typography>
        <Typography variant="body2"><strong>Phone (M):</strong>&nbsp;&nbsp;{mobilePhoneNumber}</Typography>
        <Typography variant="body2"><strong>Phone (H):</strong>&nbsp;&nbsp;{homePhoneNumber}</Typography>
    </>

    return (
        <CustomWidthTooltip title={label} arrow>
            <span className="fc-event-title">{arg.event.title}</span>
        </CustomWidthTooltip>
    );
}