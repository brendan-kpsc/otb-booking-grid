import PageInputEntityRecord = Xrm.Navigation.PageInputEntityRecord;
import LookupValue = Xrm.LookupValue;

interface UpdateFormParameters extends Xrm.Utility.OpenParameters {
    moorageReservationId: string;
    reservationId: string;  // The moorage unit ID
    moorageUnitName: string;
    startDate: string;
    endDate: string;
}

const openUpdateForm = (formParameters: UpdateFormParameters, callback: () => void) => {
    console.log(formParameters);

    const moorageUnitLookup: LookupValue = {
        id: formParameters.reservationId,
        entityType: 'slc_moorageunit'
    }

    const pageInput: PageInputEntityRecord = {
        pageType: 'entityrecord',
        entityName: 'slc_mooragereservation',
        entityId: formParameters.moorageReservationId,
        createFromEntity: moorageUnitLookup,
        data: {
            "slc_reservationid": formParameters.reservationId,
            "slc_reservationidname": formParameters.moorageUnitName,
            "slc_startdate": formParameters.startDate,
            "slc_enddate": formParameters.endDate
        }
    };
    Xrm.Navigation.navigateTo(pageInput, {
        target: 2,
        width: {value: 80, unit:"%"},
        position: 1
    }).then(callback,
        function (error) {
            console.log(error);
            callback();
        });
}

export default openUpdateForm;