type BookingUnit = {
    id: string,
    title: string;
    extendedProps: {
        unitTypeId: string;
        unitTypeName: string;
        unitGroup: string;
    }
}

export default BookingUnit;