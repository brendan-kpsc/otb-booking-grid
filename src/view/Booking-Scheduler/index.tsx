import React, {useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import styled from "@mui/material/styles/styled";
import {Autocomplete, Container, ContainerProps, Stack, TextField} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";

import apiClientState from "../../atoms/apiClient";
import BookingsClient from "../../odata-wrapper/bookings-client";
import BookingUnitsClient from "../../odata-wrapper/booking-units-client";
import Booking from "../../model/Booking";
import BookingUnit from "../../model/BookingUnit";
import {CssDimValue, DateSelectArg, EventClickArg, EventDropArg} from "@fullcalendar/core";

import openQuickCreateForm from "../../form-wrappers/open-quick-create-form";
import openUpdateForm from "../../form-wrappers/open-update-form";
import openEditForm from "../../form-wrappers/open-edit-form";

import CalendarDateNav from "./CalendarDateNav";
import {UnitGroupDropdown} from "./UnitGroupDropdown";
import {UnitTypeDropdown} from "./UnitTypeDropdown";
import {DottedAnimation} from "../../components/DottedAnimation";
import {scrollToDate} from "./scrollToDate";
import {EventContent} from "./EventContent";

import "./index.css";

// Styled MUI Container for consistent layout styling
const StyledContainer = styled(Container)<ContainerProps>(() => ({
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: 'background.default'
}));

// Props interface
interface Props {
    height: CssDimValue;
}

const updateBookings = (setBookings: (params: any) => void, oDataClient: any, currentDateDisplay: any) =>
    new BookingsClient(oDataClient).getBookings(currentDateDisplay.getFullYear()).then(setBookings);

// Main Component
const BookingGrid = ({height}: Props) => {
    // Reference to FullCalendar instance
    const calendarRef = useRef<FullCalendar | null>(null);

    // Recoil state for oData client
    const [oDataClient] = useRecoilState(apiClientState);

    // Booking and Unit data state
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingUnits, setBookingUnits] = useState<BookingUnit[]>([]);

    // UI/filter state
    const [bookingUnitSearchVal, setBookingUnitSearchVal] = useState('');
    const [unitGroupFilterVal, setUnitGroupFilterVal] = useState<string>('All');
    const [unitTypeFilterVal, setUnitTypeFilterVal] = useState<string>('All');
    const [loading, setLoading] = useState<boolean>(false);

    // Current visible date in the calendar
    const [currentDateDisplay, setCurrentDateDisplay] = useState(
        calendarRef.current?.getApi().getDate() ?? new Date()
    );

    // Derived filtered list of booking units based on filters
    const filteredBookingUnits = bookingUnits
        .filter(unit =>
            bookingUnitSearchVal.length ? unit.title === bookingUnitSearchVal : true
        )
        .filter(unit =>
            unitGroupFilterVal !== 'All' ? unit.extendedProps.unitGroup === unitGroupFilterVal : true
        )
        .filter(unit =>
            unitTypeFilterVal !== 'All' ? unit.extendedProps.unitTypeName === unitTypeFilterVal : true
        );

    // Fetch bookings and units from API
    const updateGrid = () => {
        updateBookings(setBookings, oDataClient, currentDateDisplay);

        new BookingUnitsClient(oDataClient).getBookingUnits()
            .then((units: BookingUnit[]) => {
                // Flatten data to expose unitTypeName and unitGroup at top level
                const flattened = units.map(unit => ({
                    ...unit,
                    unitTypeName: unit.extendedProps.unitTypeName,
                    unitGroup: unit.extendedProps.unitGroup
                }));
                setBookingUnits(flattened);
            });
    };

    // Navigate calendar to a specific date
    const goToDate = (date: Date) => {
        const api = calendarRef.current?.getApi();
        if (api) api.gotoDate(date);
    };

    // Move forward/backward in the calendar by month or year
    const incrementDate = (type: 'month' | 'year', amount: number) => {
        calendarRef.current?.getApi()?.incrementDate({[type]: amount});
    };

    // Unit name options for Autocomplete (deduplicated)
    const autocompleteOptions = bookingUnits
        .map(unit => unit.title)
        .filter((val, idx, arr) => arr.indexOf(val) === idx);

    // Fetch data when component mounts or oDataClient changes
    useEffect(updateGrid, [oDataClient, setBookings, currentDateDisplay]);
    useEffect(() => {
        updateBookings(setBookings, oDataClient, currentDateDisplay);
    }, [oDataClient, currentDateDisplay, setBookings]);

    return (
        <StyledContainer maxWidth="xl">
            <Stack spacing={2}>
                {/* Filtering Controls */}
                <Stack direction="row" spacing={2}>
                    <Autocomplete
                        sx={{width: "30%"}}
                        renderInput={(params) => <TextField {...params} label="Unit Name"/>}
                        options={autocompleteOptions}
                        onChange={(_, val) => setBookingUnitSearchVal(val ?? "")}
                    />
                    <UnitGroupDropdown setValue={setUnitGroupFilterVal} width="20%"/>
                    <UnitTypeDropdown units={bookingUnits} setValue={setUnitTypeFilterVal} width="20%"/>
                </Stack>

                {/* Date Navigation */}
                <CalendarDateNav
                    dateDisplay={currentDateDisplay}
                    setDate={goToDate}
                    incrementDate={incrementDate}
                />

                {/* Calendar or Loading Animation */}
                {loading ? <DottedAnimation/> : (
                    <FullCalendar
                        timeZone="America/Vancouver"
                        height={height}
                        plugins={[resourceTimelinePlugin, interactionPlugin]}
                        initialView="resourceTimelineTwoMonth"
                        events={bookings}
                        resources={filteredBookingUnits}
                        selectable
                        editable
                        droppable
                        eventDurationEditable={false}
                        eventStartEditable={false}
                        initialDate={new Date()}
                        ref={calendarRef}
                        headerToolbar={false}
                        footerToolbar={{left: 'prev,next today', center: '', right: ''}}
                        eventContent={EventContent}

                        // Configure 2-month view layout
                        views={{
                            resourceTimelineTwoMonth: {
                                type: 'resourceTimeline',
                                duration: {months: 2},
                                slotLabelInterval: {days: 1},
                                slotLabelFormat: [
                                    {month: 'short', year: 'numeric'},
                                    {day: 'numeric'},
                                    {weekday: 'short'},
                                ],
                                dateIncrement: {months: 1},
                            }
                        }}

                        // Handle calendar view date change
                        datesSet={(args) => {
                            setTimeout(() => {
                                // Update internal current date state
                                setCurrentDateDisplay(
                                    new Date(args.start.getUTCFullYear(), args.start.getUTCMonth(), args.start.getUTCDate())
                                );
                            }, 1000)

                            setTimeout(() => {
                                // Highlight weekends and grey out wednesday
                                const cells = document.querySelectorAll('.fc-timeline-slots td[data-date]');
                                cells.forEach(cell => {
                                    const dateStr = cell.getAttribute('data-date');
                                    if (dateStr) {
                                        const date = new Date(dateStr);
                                        const day = date.getUTCDay();
                                        if (day === 0 || day === 6) {
                                            cell.classList.add('custom-weekend-cell');
                                        }
                                        if (day === 3) {
                                            cell.classList.add('greyed-out-cell');
                                        }
                                    }
                                });

                                // Highlight and scroll to today's date
                                const todayStr = new Date().toLocaleDateString('en-CA');
                                const todayCell = document.querySelector(`.fc-timeline-slots td[data-date="${todayStr}"]`);
                                if (todayCell) {
                                    todayCell.classList.add('current-day-highlight');
                                    if (args.start.getUTCMonth() === new Date().getUTCMonth()) {
                                        scrollToDate(new Date());
                                    }
                                }
                            }, 600);
                        }}

                        // Highlight the label for the current day
                        slotLabelDidMount={(arg) => {
                            const labelDate = arg.date;
                            const today = new Date();

                            const isSameDay =
                                labelDate.getUTCFullYear() === today.getFullYear() &&
                                labelDate.getUTCMonth() === today.getMonth() &&
                                labelDate.getUTCDate() === today.getDate();

                            if (isSameDay) {
                                arg.el.classList.add('current-day-highlight');
                            }
                        }}

                        // Handle selecting an empty date range to create a booking
                        select={(arg: DateSelectArg) => {
                            setLoading(true);
                            openQuickCreateForm({
                                slc_bookingunitid: arg.resource!.id,
                                slc_bookingunitidname: arg.resource!.title,
                                slc_startdate: arg.start!.toUTCString(),
                                slc_enddate: arg.end!.toUTCString(),
                            }, () => {
                                setLoading(false);
                                updateBookings(setBookings, oDataClient, currentDateDisplay)
                                    .then(e => {
                                        goToDate(arg.start);
                                    });
                            });
                        }}

                        // Handle clicking on an event to edit it
                        eventClick={(arg: EventClickArg) => {
                            setLoading(true);
                            openEditForm(arg.event.id, () => {
                                setLoading(false);
                                updateBookings(setBookings, oDataClient, currentDateDisplay)
                                    .then(e => {
                                        if (arg.event.start)
                                            goToDate(arg.event.start);
                                    });
                            });
                        }}

                        // Handle dragging an event to a new resource/date
                        eventDrop={(arg: EventDropArg) => {
                            let bookingUnitId: string;
                            let bookingUnitTitle: string;

                            if (!arg.newResource && !arg.oldResource) {
                                const booking = bookings.find(b => b.id === arg.event.id);
                                const unit = bookingUnits.find(u => u.id === booking?.resourceId);
                                bookingUnitId = unit!.id;
                                bookingUnitTitle = unit!.title;
                            } else {
                                bookingUnitId = arg.newResource!.id;
                                bookingUnitTitle = arg.newResource!.title;
                            }

                            setLoading(true);
                            openUpdateForm({
                                bookingId: arg.event.id,
                                bookingUnitId,
                                startDate: arg.event.start!.toUTCString(),
                                endDate: arg.event.end!.toUTCString(),
                                bookingUnitName: bookingUnitTitle
                            }, () => {
                                setLoading(false);
                                updateBookings(setBookings, oDataClient, currentDateDisplay)
                                    .then(e => {
                                        if (arg.event.start)
                                            goToDate(arg.event.start);
                                    });
                            });
                        }}

                        // Prevent overlapping events on the same resource
                        eventAllow={(dropInfo, draggedEvent) => {
                            const calendarApi = calendarRef.current?.getApi();
                            if (!calendarApi) return true;

                            const resourceId = dropInfo.resource?.id;
                            const start = dropInfo.start!;
                            const end = dropInfo.end!;

                            const overlapping = calendarApi.getEvents().some(event => {
                                if (event.id === draggedEvent?.id) return false;
                                return (
                                    event.getResources().some(r => r?.id === resourceId) &&
                                    start < event.end! && end > event.start!
                                );
                            });

                            return !overlapping;
                        }}

                        // Customize resource columns
                        resourceAreaColumns={[
                            {field: 'title', headerContent: 'Booking Unit', width: 170},
                            {field: 'unitTypeName', headerContent: 'Type', width: 60},
                            {field: 'unitGroup', headerContent: 'Unit Group', width: 70},
                        ]}
                    />
                )}
            </Stack>
        </StyledContainer>
    );
};

export default BookingGrid;
