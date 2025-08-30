interface QuickCreateFormParameters extends Xrm.Utility.OpenParameters {
    slc_bookingunitid: string;
    slc_bookingunitidname: string;
    slc_startdate: string;
    slc_enddate: string;
}

const openQuickCreateForm = (formParameters: QuickCreateFormParameters, callback: () => void) => {
    Xrm.Navigation.openForm({
        entityName: 'slc_reservation',
        useQuickCreateForm: true
    }, formParameters).then(callback,
                            function (error) {
                                console.log(error);
                                callback();
                            });
}

export default openQuickCreateForm;