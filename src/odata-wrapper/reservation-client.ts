import { ODataV4 } from "@odata/client/lib/types_v4";
import Reservation from "../model/Reservation";
import {getDockOption} from './odata-helpers';

const getColor = (duration: string, renews: boolean) => {
    switch (duration) {
        case 'Yearly':
            return renews ? "#37a326" : "#4737d6";
        case 'Monthly':
            return "#3787d6";
        case 'Daily':
            return "#d67f37";
    }
}

class ReservationClient {
    private TABLE_NAME: string = 'slc_mooragereservations';
    private oDataClient: ODataV4;

    constructor(oDataClient: ODataV4) {
        this.oDataClient = oDataClient;
    }

    getBookings: () => Promise<Reservation[]> = async () => {
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
        ]).expand(['slc_PrimaryContact($select=fullname,address1_composite,telephone2,mobilephone)'])

        const response = await entitySet.retrieve(null, params).catch(err => console.error(err));

        return response.value.map((booking: any) => ({
            id: booking.slc_mooragereservationid,
            title: booking.slc_name,
            start: booking.slc_startdate,
            end: booking.slc_enddate,
            resourceId: booking._slc_reservationid_value,
            color: getColor(booking['slc_resdurationoption@OData.Community.Display.V1.FormattedValue'], booking.slc_renewsyn),
            extendedProps: {
                duration: booking['slc_resdurationoption@OData.Community.Display.V1.FormattedValue'],
                renews: booking.slc_renewsyn,
                dockOption: getDockOption(booking.slc_dockoptionset),
                slipNumber: `${booking.slc_slipnumber}`
            }
        }));
    }
}

export default ReservationClient