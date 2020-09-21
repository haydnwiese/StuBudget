import { INITIAL_DATA } from '../constants/actionTypes';

export function submitInitialData(payload) {
    return {
        type: INITIAL_DATA,
        payload
    }
}