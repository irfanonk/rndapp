import { CHANGE_APP_LANGUAGE } from './keys'

export const initialState = {
    appLanguage: '',
}

export default (state, { type, payload }) => {
    switch (type) {
        case CHANGE_APP_LANGUAGE:
            return { ...state, appLanguage: payload }
        default:
            return state
    }
}