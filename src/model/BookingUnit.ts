type BookingUnit = {
    id: string,
    title: string;
    extendedProps: {
        unitGroup: string
        slipNumber: string
        shortTerm: boolean
        sortOrder: number
    }
}

export default BookingUnit;