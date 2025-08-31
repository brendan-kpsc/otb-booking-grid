interface UpdateFormParameters extends Xrm.Utility.OpenParameters {
    bookingId: string;
    bookingUnitId: string;
    bookingUnitName: string;
    startDate: string;
    endDate: string;
};

const openUpdateForm = (formParameters: UpdateFormParameters, callback: () => void) => {
    Xrm.Navigation.navigateTo({
        entityName: 'slc_mooragereservation',
        pageType: 'entityrecord',
        entityId: formParameters.bookingId,
        data: {
            slc_bookingunitid: formParameters.bookingUnitId,
            slc_bookingunitidname: formParameters.bookingUnitName,
            slc_startdate: formParameters.startDate,
            slc_enddate: formParameters.endDate
        }
    }, {
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