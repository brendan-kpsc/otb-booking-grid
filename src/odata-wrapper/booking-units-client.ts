import { ODataV4 } from "@odata/client/lib/types_v4";
import BookingUnit from "../model/BookingUnit";

class BookingUnitsClient {
    private TABLE_NAME: string = 'slc_bookingunits';
    private oDataClient: ODataV4;

    constructor(oDataClient: ODataV4) {
        this.oDataClient = oDataClient;
    }

    getBookingUnits: () => Promise<BookingUnit[]> = async () => {
        const bookingUnitSet = this.oDataClient.getEntitySet(this.TABLE_NAME);
        const unitTypeSet = this.oDataClient.getEntitySet('slc_bookingunittypes')

        const unitTypesPromise = unitTypeSet.retrieve({}).catch(err => console.error(err));

        const response = await bookingUnitSet.retrieve({
            query: {
                $orderBy: 'slc_sortorder asc',
                $filter: 'slc_displayongridyn eq \'Yes\''
            }
        }).catch(err => console.error(err));

        const unitTypes = (await unitTypesPromise).value;

        return response.value.map((unit: any) => {
            const unitType = unitTypes.find((u: any) => u.slc_bookingunittypeid === unit._slc_unittypeid_value)

            return ({
                id: unit.slc_bookingunitid,
                title: unit.slc_name,
                extendedProps: {
                    unitTypeId: unit._slc_unittypeid_value,
                    unitTypeName: unitType.slc_name,
                    unitGroup: unit["slc_unitgrouping@OData.Community.Display.V1.FormattedValue"]?.trim() ?? 'None'
                }
            })
        });
    }
}

export default BookingUnitsClient