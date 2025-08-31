type BookingUnit = {
    id: string,
    title: string;
    extendedProps: {
        unitGroup: string
        slipNumber: string
    }
}

export default BookingUnit;