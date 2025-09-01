type BookingUnit = {
    id: string,
    title: string;
    extendedProps: {
        unitGroup: string
        slipNumber: string
        shortTerm: boolean
    }
}

export default BookingUnit;