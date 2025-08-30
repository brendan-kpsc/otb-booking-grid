export const getDataverseAuthenticationToken = async (accessTokenUrl, clientId, clientSecret, scope) => {
    let result = await fetch(accessTokenUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'If-None-Match': null
        },
        body: JSON.stringify({
            client_id: clientId,
            scope: scope,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
            addTokenTo: 'header'
        })
    })
    .then(res => res.headers.get('Authorization'));

    return result;
}

export const getBookingUnitTypeInfo = async (apiUrl, houseboat, headers) => {
    console.log(houseboat)
    let result = await fetch(apiUrl + '/slc_bookingunittypes?$filter=slc_bookingunittypeid eq ' + houseboat._slc_unittypeid_value + '&$orderby=slc_name asc', {
        headers: headers
    })
    .then(res => res.json())
    .then(data => data.value[0]);

    return result;
}

export const checkDateConflict = (existingEvent, currentEvent) => {
     // Extract the date (year, month, day) from the event's start and end times, ignoring the time portion
     const currentEventStartDate = new Date(currentEvent.StartTime.getFullYear(), currentEvent.StartTime.getMonth(), currentEvent.StartTime.getDate());
     const currentEventEndDate = new Date(currentEvent.EndTime.getFullYear(), currentEvent.EndTime.getMonth(), currentEvent.EndTime.getDate());

    // Exclude the current event itself and check only if both events are for the same houseboat
    if (existingEvent.Id !== currentEvent.Id && existingEvent.HouseboatId === currentEvent.HouseboatId) {
        // Extract the date (year, month, day) from the existing event's start and end times
        const existingEventStartDate = new Date(existingEvent.StartTime.getFullYear(), existingEvent.StartTime.getMonth(), existingEvent.StartTime.getDate());
        const existingEventEndDate = new Date(existingEvent.EndTime.getFullYear(), existingEvent.EndTime.getMonth(), existingEvent.EndTime.getDate());

        // Compare only the dates to detect any conflicts
        return currentEventStartDate <= existingEventEndDate && existingEventStartDate <= currentEventEndDate;
    }
    return false;
}
