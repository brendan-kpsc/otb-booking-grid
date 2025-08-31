import { authHeader } from "../msalConfig";
import { OData } from "@odata/client";

const createNewClient = async (dataverseApiUrl: string, isDevelopment: boolean) => {
    let commonHeaders: {[p: string]: string} = {
        Prefer: 'odata.include-annotations="*"'
    };
    
    if (isDevelopment) commonHeaders = { ...commonHeaders, Authorization: (await authHeader())! };

    return OData.New4({
        serviceEndpoint: dataverseApiUrl + '/',
        commonHeaders: commonHeaders
    });
}

const getDockOption = (optionNum: number) => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[optionNum-100000000]
}

export default createNewClient;
export {createNewClient, getDockOption}