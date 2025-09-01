import Tooltip, {TooltipProps} from '@mui/material/Tooltip';
import React from "react";
import {tooltipClasses, Typography} from "@mui/material";
import styled from "@mui/material/styles/styled";
import {EventContentArg} from "@fullcalendar/core";

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} followCursor />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
    },
});

const KeyValue = ({label, value}: {label: string, value: string}) => (
    <Typography variant="body2"><strong>{label}:</strong>&nbsp;&nbsp;{value}</Typography>
)

export const EventContent =  (arg: EventContentArg) => {
    const duration = arg.event.extendedProps.duration;
    const eventName = arg.event.title;
    const start = arg.event.start?.toISOString().slice(0, 10);
    const end = arg.event.end?.toISOString().slice(0, 10);

    const label = <>
        <KeyValue label='Duration' value={duration}/>
        <br/>
        <KeyValue label='Name' value={eventName}/>
        <br/>
        <KeyValue label='Start' value={start ?? "None"}/>
        <br/>
        <KeyValue label='End' value={end ?? "None"}/>
        {
            (arg.event.extendedProps.renews === true && duration === 'Yearly') &&
            <>
                <br/>
                <Typography variant="body2" component="div">
                    <strong>Renews*</strong>
                </Typography>
            </>
        }
    </>

    return (
        <CustomWidthTooltip title={label} arrow>
            <span className="fc-event-title">{arg.event.title}</span>
        </CustomWidthTooltip>
    );
}