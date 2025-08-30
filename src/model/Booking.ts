type Booking = {
    id: string;
    title: string;
    start: string;
    end: string;
    resourceId: string; // Matches booking unit ID
    colorCode: string;
    extendedProps: {
        refNumber: string;
        contactName: string;
        businessPhoneNumber: string;
        companyPhoneNumber: string;
        homePhoneNumber: string;
    }
};

export default Booking;