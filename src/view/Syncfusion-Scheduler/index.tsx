// import { actionBegin, ActionEventArgs, Day, DragAndDrop, DragEventArgs, EventRenderedArgs, Inject, Month, PopupOpenEventArgs, RenderCellEventArgs, Resize, SelectEventArgs, TimelineMonth, TimelineViews, ViewDirective, ViewsDirective } from '@syncfusion/ej2-react-schedule';
// import '@syncfusion/ej2-react-schedule/styles/material.css';
// import './index.css'
// import React, { useEffect, useRef, useState } from 'react';
// import { ScheduleComponent, ResourcesDirective, ResourceDirective } from '@syncfusion/ej2-react-schedule';
// import { CrudOptions, DataManager, ODataV4Adaptor, Query, RemoteArgs } from '@syncfusion/ej2-data';
// import { useRecoilValue } from 'recoil';
// import apiClientState from '../../atoms/apiClient';
// import authHeaderState from '../../atoms/authHeader';

// // For test purposes
// const addDays = (date: Date) => {
//     let newDate = new Date(date);
//     newDate.setDate(date.getDate() + 5);
//     return newDate;
// }

// class CustomODataV4Adaptor extends ODataV4Adaptor {
//     key = 'slc_bookingid'

//     processQuery(dm: any, query: any, hierarchyFilters: any) {
//         const queryResult = super.processQuery(dm, query, hierarchyFilters) as any;

//         // Remove RecurrenceRule from the query URL
//         queryResult.url = queryResult.url
//             .replace(/\(\s*ne\s*null\s*\)/g, '') // Remove invalid '( ne null)'
//             .replace(/\(\s*ne\s*''\s*\)/g, '')  // Remove invalid '( ne '')'
//             .replace(/RecurrenceRule/g, '')    // Remove unsupported RecurrenceRule
//             .replace(' or (( ne null) and ( ne \'\'))', '');

//         return queryResult;
//     }

//     batchRequest(
//         dm: DataManager,
//         changes: CrudOptions,
//         e: RemoteArgs,
//         query: Query,
//         original?: CrudOptions
//     ): Object {
//         // Clean up the minimal fields we want
//         const cleanedChanges = this.cleanBatchPayload(changes);
//         return super.batchRequest(dm, cleanedChanges, e, query, original);
//     }

//     // Helper function to clean the batch payload
//     cleanBatchPayload(changes: CrudOptions): CrudOptions {
//         const operations = ['addedRecords', 'changedRecords', 'deletedRecords'] as const;

//         operations.forEach((operation) => {
//             if (changes[operation] && operation === 'changedRecords') {
//                 changes[operation] = changes[operation]!.map((record: any) => {
//                     const isoStart = record.slc_startdatetime.toISOString(); // "2025-01-06T08:00:00Z"
//                     const isoEnd = record.slc_enddatetime.toISOString();     // "2025-01-10T08:00:00Z"

//                     const startDateOnly = isoStart.substring(0, 10);
//                     const endDateOnly = isoEnd.substring(0, 10);

//                     const {
//                         slc_startdatetime,
//                         slc_enddatetime,
//                         name,
//                         slc_bookingid,
//                     } = record;

//                     return {
//                         slc_startdate: startDateOnly,
//                         slc_enddate: endDateOnly,
//                         slc_startdatetime,
//                         slc_enddatetime,
//                         name,
//                         slc_bookingid,
//                         "slc_BookingUnitId@odata.bind": `/slc_bookingunits(${record._slc_bookingunitid_value})`
//                     }
//                 });
//             }
//             else if (changes[operation] && operation === 'addedRecords') {
//                 changes[operation] = changes[operation]!.map((record: any) => {
//                     const { slc_startdatetime, slc_enddatetime, name } = record;

//                     const isoStart = record.slc_startdatetime.toISOString(); // "2025-01-06T08:00:00Z"
//                     const isoEnd = record.slc_enddatetime.toISOString();     // "2025-01-10T08:00:00Z"

//                     const startDateOnly = isoStart.substring(0, 10);
//                     const endDateOnly = isoEnd.substring(0, 10);

//                     let payload: any = {
//                         slc_startdate: startDateOnly,
//                         slc_enddate: endDateOnly,
//                         slc_startdatetime,
//                         slc_enddatetime,
//                         name
//                     };

//                     // If the user picks a resource in the UI, record._slc_bookingunitid_value may exist:
//                     if (record._slc_bookingunitid_value) {
//                         payload["slc_BookingUnitId@odata.bind"] = `/slc_bookingunits(${record._slc_bookingunitid_value})`;
//                     }
//                     // Omit slc_bookingid so Dataverse generates it
//                     return payload;
//                 });
//             }
//         });

//         return changes;
//     }
// }

// const BookingGrid = () => {
//     const scheduleRef = useRef<ScheduleComponent>(null);

//     const apiClient = useRecoilValue(apiClientState);
//     const authHeader = useRecoilValue(authHeaderState);

//     const onActionBegin = (args: ActionEventArgs) => {
//         if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
//           // Get the new (or updated) event.
//           const newEvent = Array.isArray(args.data) ? args.data[0] : args.data!;
//           const newStart = new Date(newEvent.slc_startdatetime);
//           const newEnd = new Date(newEvent.slc_enddatetime);
    
//           // Use the schedule's current events instead of dataManager.dataSource.json.
//           const existingEvents = scheduleRef.current?.getEvents() || [];
    
//           // Check for overlap.
//           const isOverlapping = existingEvents.some((event: any) => {
//             // Skip comparing the event to itself (in case of an update).
//             if (event.slc_bookingid === newEvent.slc_bookingid) {
//               return false;
//             }
//             // Convert resource IDs to numbers (or strings) for a fair comparison.
//             const newResource = Number(newEvent._slc_bookingunitid_value);
//             const existingResource = Number(event._slc_bookingunitid_value);
//             if (newResource !== existingResource) {
//               return false; // Different resource, no conflict.
//             }
//             const existingStart = new Date(event.slc_startdatetime);
//             const existingEnd = new Date(event.slc_enddatetime);
//             // Check if time intervals overlap.
//             return newStart < existingEnd && newEnd > existingStart;
//           });
    
//           console.log('Overlap check:', isOverlapping);
    
//           if (isOverlapping) {
//             args.cancel = true;
//             // Optionally notify the user through a UI message.
//             alert('This booking overlaps with an existing booking. Please select a different time or resource.');
//           }
//         }
//       };

//     const dataManager = new DataManager({
//         batchUrl: `${process.env.REACT_APP_DATAVERSE_API_URL}`,
//         url: `${process.env.REACT_APP_DATAVERSE_API_URL}`,
//         adaptor: new CustomODataV4Adaptor(),
//         key: 'slc_bookingid',
//         headers: process.env.REACT_APP_IS_DEVELOPMENT === 'true' ? [{ Authorization: authHeader }] : [],
//     });

//     const onRenderCell = (args: RenderCellEventArgs) => {
//         if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
//             let target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
//             target.innerHTML = '<h4 style="text-align: center;">Reservation Units</h4>';
//         }
//     }

//     const [bookingUnits, setBookingUnits] = useState([]);

//     useEffect(() => {
//         apiClient.bookingUnits.getAllBookingUnits()
//             .then(res => {
//                 console.log(res);
//                 return res;
//             })
//             .then(res => setBookingUnits(res))
//             .catch(err => console.log(err));
//     }, [apiClient]);

//     return (
//         <ScheduleComponent
//             ref={scheduleRef}
//             cssClass='compact-resource-header'
//             selectedDate={new Date(Date.now())}
//             eventSettings={{
//                 includeFiltersInQuery: true,
//                 dataSource: dataManager,
//                 query: new Query().from('slc_bookings').setKey('slc_bookingid'),
//                 fields: {
//                     id: 'slc_bookingid',
//                     startTime: { name: 'slc_startdatetime' },
//                     endTime: { name: 'slc_enddatetime' },
//                     subject: { name: 'name' },
//                 },
//             }}
//             enableRecurrenceValidation={false}
//             views={['TimelineMonth']}
//             group={{ resources: ['BookingUnits'] }}
//             renderCell={onRenderCell}
//             actionBegin={onActionBegin}
//         >
//             <ResourcesDirective>
//                 <ResourceDirective
//                     field='_slc_bookingunitid_value'
//                     name='BookingUnits'
//                     title='Reservation Units'
//                     dataSource={bookingUnits}
//                     textField='name'
//                     idField='slc_bookingunitid'
//                 />
//             </ResourcesDirective>
//             <Inject services={[TimelineMonth, Resize, DragAndDrop]} />
//         </ScheduleComponent>
//     );
// }

// export default BookingGrid;