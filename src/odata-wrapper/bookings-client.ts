import { ODataV4 } from "@odata/client/lib/types_v4";
import Booking from "../model/Booking";

const getColor = (statusCode: number) => {
    if((statusCode >= 100000001 && statusCode <= 100000005) || statusCode === 100000010) { // Deposit owing
        return "#b67c00";
    }
    else if(statusCode === 100000009) {  // Cancelled
        return "#d63737";
    }
    else if(statusCode >= 100000006 && statusCode <= 100000008) { // Paid
        return "#117611";
    }
    else {
        return "#3787d6";
    }
}

class BookingsClient {
    private TABLE_NAME: string = 'slc_bookings';
    private oDataClient: ODataV4;

    constructor(oDataClient: ODataV4) {
        this.oDataClient = oDataClient;
    }

    getBookings: (year: number) => Promise<Booking[]> = async (year) => {
        const entitySet = this.oDataClient.getEntitySet(this.TABLE_NAME);
        const params = entitySet.newOptions().select([
            "slc_bookingid",
            "slc_griddisplayname",
            "slc_startdatetime",
            "slc_enddatetime",
            "_slc_bookingunitid_value",
            "slc_refnumber",
            "slc_bookingstatus"
        ]).filter(`slc_startdatetime ge ${year - 1}-01-01 and slc_startdatetime le ${year}-12-31`)
            .expand(['slc_ContactId($select=telephone1,company,telephone2,fullname)'])

        const response = await entitySet.retrieve(null, params).catch(err => console.error(err));

        return response.value.map((booking: any) => ({
            id: booking.slc_bookingid,
            title: booking.slc_griddisplayname,
            start: booking.slc_startdatetime,
            end: booking.slc_enddatetime,
            resourceId: booking._slc_bookingunitid_value, // Match resource ID
            color: getColor(booking.slc_bookingstatus),
            extendedProps: {
                refNumber: booking.slc_refnumber,
                contactName: booking.slc_ContactId?.fullname ?? null,
                businessPhoneNumber: booking.slc_ContactId?.telephone1 ?? null,
                companyPhoneNumber: booking.slc_contactId?.company ?? null,
                homePhoneNumber: booking.slc_contactId?.telephone2 ?? null,
            }
        }));
    }
}

export default BookingsClient