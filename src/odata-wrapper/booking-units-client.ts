import { ODataV4 } from "@odata/client/lib/types_v4";
import BookingUnit from "../model/BookingUnit";
import {getDockOption} from './odata-helpers';

class BookingUnitsClient {
    private TABLE_NAME: string = 'slc_moorageunits';
    private oDataClient: ODataV4;

    constructor(oDataClient: ODataV4) {
        this.oDataClient = oDataClient;
    }

    getBookingUnits: () => Promise<BookingUnit[]> = async () => {
        const bookingUnitSet = this.oDataClient.getEntitySet(this.TABLE_NAME);

        const params = bookingUnitSet.newOptions()
            .filter('slc_displayongridyn eq true').orderby('slc_sortorder', 'asc')

        const response = await bookingUnitSet.retrieve(null, params)
            .catch(err => console.error(err));

        return response.value.map((unit: any) => {
            return ({
                id: unit.slc_moorageunitid,
                title: unit.slc_unitnumbermixed,
                extendedProps: {
                    unitGroup: unit['slc_dockoptionset@OData.Community.Display.V1.FormattedValue'],
                    slipNumber: unit.slc_unitnumbermixed,
                    shortTerm: unit.slc_shorttermslip === true,
                    sortOrder: unit.slc_sortorder,
                }
            })
        });
    }
}

export default BookingUnitsClient