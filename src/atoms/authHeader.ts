import { atom } from "recoil";

const authHeaderState = atom({
    key: 'authHeaderState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

export default authHeaderState;