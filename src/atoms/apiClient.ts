import { atom } from "recoil";
import createNewClient from "../odata-wrapper/odata-helpers";

const apiClientState = atom({
    key: 'apiClientState', // unique ID (with respect to other atoms/selectors)
    default: createNewClient(`${process.env.REACT_APP_DATAVERSE_API_URL!}`, process.env.REACT_APP_IS_DEVELOPMENT === 'true'), // default value (aka initial value)
});

export default apiClientState;