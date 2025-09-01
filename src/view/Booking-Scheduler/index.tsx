import React, {useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import styled from "@mui/material/styles/styled";
import {Autocomplete, Container, ContainerProps, Stack, TextField} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";

import apiClientState from "../../atoms/apiClient";
import ReservationClient from "../../odata-wrapper/reservation-client";
import BookingUnitsClient from "../../odata-wrapper/booking-units-client";
import Reservation from "../../model/Reservation";
import BookingUnit from "../../model/BookingUnit";
import {CssDimValue, DateSelectArg, EventClickArg, EventDropArg} from "@fullcalendar/core";

import openQuickCreateForm from "../../form-wrappers/open-quick-create-form";
import openUpdateForm from "../../form-wrappers/open-update-form";
import openEditForm from "../../form-wrappers/open-edit-form";

import CalendarDateNav from "./CalendarDateNav";
import {DottedAnimation} from "../../components/DottedAnimation";
import {scrollToDate} from "./scrollToDate";
import {EventContent} from "./EventContent";
import {DockDropdown} from "./DockDropdown";

import "./index.css";
import Dock from "../../model/Dock";
import DockClient from "../../odata-wrapper/dock-client";

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

const updateBookings = (setBookings: (params: any) => void, oDataClient: any) =>
    new ReservationClient(oDataClient).getBookings().then(setBookings);

// Main Component
const BookingGrid = ({height}: Props) => {
    // Reference to FullCalendar instance
    const calendarRef = useRef<FullCalendar | null>(null);

    // Recoil state for oData client
    const [oDataClient] = useRecoilState(apiClientState);
    const dockClient = new DockClient(oDataClient);

    // Reservation and Unit data state
    const [bookings, setBookings] = useState<Reservation[]>([]);
    const [bookingUnits, setBookingUnits] = useState<BookingUnit[]>([]);
    const [availableDocks, setAvailableDocks] = useState<Dock[]>([]);

    // UI/filter state
    const [bookingUnitSearchVal, setBookingUnitSearchVal] = useState('');
    const [dockSearchVal, setDockSearchVal] = useState('');

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
            (dockSearchVal.length && dockSearchVal !== 'All') ? unit.extendedProps.unitGroup === dockSearchVal : true
        );

    // Fetch bookings and units from API
    const updateGrid = () => {
        updateBookings(setBookings, oDataClient);

        new BookingUnitsClient(oDataClient).getBookingUnits()
            .then((units: BookingUnit[]) => {
                setBookingUnits(units);
            });

        dockClient.getAvailableDocks().then((availableDocks) => {
            setAvailableDocks(availableDocks);
        })
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
        updateBookings(setBookings, oDataClient);
    }, [oDataClient, currentDateDisplay, setBookings]);

    return (
        <StyledContainer maxWidth="xl">
            <Stack spacing={2}>
                {/* Filtering Controls */}
                <Stack direction="row" spacing={2}>
                    <Autocomplete
                        sx={{width: "30%"}}
                        renderInput={(params) => <TextField {...params} label="Slip #"/>}
                        options={autocompleteOptions}
                        onChange={(_, val) => setBookingUnitSearchVal(val ?? "")}
                    />
                    <DockDropdown width='20%' setValue={setDockSearchVal} available_dock_names={availableDocks.map(d => d.name)}/>
                </Stack>

                {/* Date Navigation */}
                {
                    calendarRef.current?.getApi().view.type !== 'resourceTimelineTwoYear' &&
                    <CalendarDateNav
                        dateDisplay={currentDateDisplay}
                        setDate={goToDate}
                        incrementDate={incrementDate}
                    />
                }

                {/* Calendar or Loading Animation */}
                {loading ? <DottedAnimation/> : (
                    <FullCalendar
                        height={height}
                        contentHeight={filteredBookingUnits.length <= 5 ? 'auto' : undefined}
                        plugins={[resourceTimelinePlugin, interactionPlugin]}
                        initialView="resourceTimelineTwoYear"
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
                        footerToolbar={{left: 'prev,next today', center: '', right: 'resourceTimelineTwoYear,resourceTimelineTwoMonth'}}
                        eventContent={EventContent}
                        nowIndicator={true}

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
                                buttonText: "Month"
                            },
                            resourceTimelineTwoYear: {
                                type: 'resourceTimeline',
                                duration: { years: 2 },
                                slotDuration: { months: 1 },
                                buttonText: "Year"
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
                                    }
                                });

                                // Scroll to today's date
                                const todayStr = new Date().toLocaleDateString('en-CA');
                                const todayCell = document.querySelector(`.fc-timeline-slots td[data-date="${todayStr}"]`);
                                if (todayCell) {
                                    if (args.start.getMonth() === new Date().getMonth()) {
                                        scrollToDate(new Date());
                                    }
                                }
                            }, 600);
                        }}

                        // Handle selecting an empty date range to create a booking
                        select={(arg: DateSelectArg) => {
                            const currentCalDate = calendarRef.current?.getApi().getDate();
                            setLoading(true);
                            openQuickCreateForm({
                                slc_bookingunitid: arg.resource!.id,
                                slc_startdate: arg.start!.toUTCString()
                            }, () => {
                                setLoading(false);
                                updateBookings(setBookings, oDataClient)
                                    .then((e: any) => {
                                        if(currentCalDate) {
                                            goToDate(currentCalDate);
                                        }
                                    });
                            });
                        }}

                        // Handle clicking on an event to edit it
                        eventClick={(arg: EventClickArg) => {
                            const currentCalDate = calendarRef.current?.getApi().getDate();
                            setLoading(true);
                            openEditForm(arg.event.id, () => {
                                setLoading(false);
                                updateBookings(setBookings, oDataClient)
                                    .then((e: any) => {
                                        if(currentCalDate) {
                                            goToDate(currentCalDate);
                                        }
                                    });
                            });
                        }}

                        // Handle dragging an event to a new resource/date
                        eventDrop={(arg: EventDropArg) => {
                            let reservationId: string;
                            let moorageUnitName: string;

                            if (!arg.newResource && !arg.oldResource) {
                                const booking = bookings.find(b => b.id === arg.event.id);
                                const unit = bookingUnits.find(u => u.id === booking?.resourceId);
                                reservationId = unit!.id;
                                moorageUnitName = unit!.title;
                            } else {
                                reservationId = arg.newResource!.id;
                                moorageUnitName = arg.newResource!.title;
                            }

                            const currentCalDate = calendarRef.current?.getApi().getDate();

                            setLoading(true);
                            openUpdateForm({
                                moorageReservationId: arg.event.id,
                                reservationId: reservationId,
                                moorageUnitName: moorageUnitName,
                                startDate: arg.event.start!.toUTCString(),
                                endDate: arg.event.end!.toUTCString()
                            }, () => {
                                setLoading(false);
                                updateBookings(setBookings, oDataClient)
                                    .then((e: any) => {
                                        if(currentCalDate) {
                                            goToDate(currentCalDate);
                                        }
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
                            {field: 'title', headerContent: 'Slip #'},
                            {field: 'unitGroup', headerContent: 'Dock'}
                        ]}
                        resourceAreaWidth={200}
                    />
                )}
            </Stack>
        </StyledContainer>
    );
};

export default BookingGrid;
