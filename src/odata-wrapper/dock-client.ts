import { ODataV4 } from "@odata/client/lib/types_v4";
import Dock from "../model/Dock";

class DockClient {
    private TABLE_NAME: string = 'slc_docks';
    private oDataClient: ODataV4;

    constructor(oDataClient: ODataV4) {
        this.oDataClient = oDataClient;
    }

    getAvailableDocks: () => Promise<Dock[]> = async () => {
        const docks = this.oDataClient.getEntitySet(this.TABLE_NAME);
        const params = docks.newOptions().select(['slc_name', 'slc_displayongridyn'])
            .filter('slc_displayongridyn eq true').orderby('slc_name', 'asc')

        const response = await docks.retrieve(null, params).catch(err => console.error(err));

        return response.value.map((dock: any) => {
            return ({
                id: dock.slc_dockid,
                name: dock.slc_name,
                displayOnGrid: dock.slc_displayongridyn,
            })
        });
    }
}

export default DockClient