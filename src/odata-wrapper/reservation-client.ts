import { ODataV4 } from "@odata/client/lib/types_v4";
import Reservation from "../model/Reservation";
import {getDockOption} from './odata-helpers';

const getColor = (statusCode: number) => {
    if(statusCode === 100000001){ // Closed
        return "#d63737";
    }
    else {
        return "#3787d6";
    }
}

class ReservationClient {
    private TABLE_NAME: string = 'slc_mooragereservations';
    private oDataClient: ODataV4;

    constructor(oDataClient: ODataV4) {
        this.oDataClient = oDataClient;
    }

    getBookings: (year: number) => Promise<Reservation[]> = async (year) => {
        const entitySet = this.oDataClient.getEntitySet(this.TABLE_NAME);
        const params = entitySet.newOptions().select([
                "slc_mooragereservationid",
                "slc_dockoptionset",
                "slc_enddate",
                "_slc_reservationid_value",
                "slc_name",
                "_slc_primarycontact_value",
                "slc_renewsyn",
                "slc_resdurationoption",
                "slc_reservationnumber",
                "slc_reservationstatus",
                "slc_slipnumber",
                "slc_startdate",
        ]).filter(`slc_startdate ge ${year - 1}-01-01 and slc_startdate le ${year}-12-31`)
            .expand(['slc_PrimaryContact($select=fullname,address1_composite,telephone2,mobilephone)'])

        const response = await entitySet.retrieve(null, params).catch(err => console.error(err));

        return response.value.map((booking: any) => ({
            id: booking.slc_mooragereservationid,
            title: booking.slc_PrimaryContact.fullname,
            start: booking.slc_startdate,
            end: booking.slc_enddate,
            resourceId: booking._slc_reservationid_value,
            color: getColor(booking.slc_reservationstatus),
            extendedProps: {
                refNumber: booking.slc_reservationnumber,
                contactName: booking.slc_PrimaryContact.fullname ?? null,
                mobilePhoneNumber: booking.slc_PrimaryContact.mobilephone ?? null,
                homePhoneNumber: booking.slc_PrimaryContact.telephone2 ?? null,
                dockOption: getDockOption(booking.slc_dockoptionset),
                slipNumber: `${booking.slc_slipnumber}`
            }
        }));
    }
}

export default ReservationClient