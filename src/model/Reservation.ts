type Reservation = {
    id: string;
    title: string;
    start: string;
    end: string;
    resourceId: string; // Matches booking unit ID
    colorCode: string;
    extendedProps: {
        duration: string;
        renews: boolean;
        dockOption: string;
        slipNumber: string;
    }
};

export default Reservation;