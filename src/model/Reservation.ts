type Reservation = {
    id: string;
    title: string;
    start: string;
    end: string;
    resourceId: string; // Matches booking unit ID
    colorCode: string;
    extendedProps: {
        refNumber: string;
        contactName: string;
        mobilePhoneNumber: string;
        homePhoneNumber: string;
        dockOption: string;
    }
};

export default Reservation;