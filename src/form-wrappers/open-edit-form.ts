const openEditForm = (bookingId: string, callback: () => void) => {
    Xrm.Navigation.navigateTo({
        entityName: 'slc_booking',
        pageType: 'entityrecord',
        entityId: bookingId
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

export default openEditForm;