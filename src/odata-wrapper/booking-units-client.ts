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

        const response = await bookingUnitSet.retrieve({
            query: {
                $orderBy: 'slc_sortorder asc',
                $filter: 'slc_displayongridyn eq \'Yes\''
            }
        }).catch(err => console.error(err));

        return response.value.map((unit: any) => {
            return ({
                id: unit.slc_moorageunitid,
                title: unit.slc_name,
                extendedProps: {
                    unitGroup: unit['slc_dockoptionset@OData.Community.Display.V1.FormattedValue']
                }
            })
        });
    }
}

export default BookingUnitsClient