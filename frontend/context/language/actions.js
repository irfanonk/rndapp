import { CHANGE_APP_LANGUAGE } from './keys'

export const changeAppLanguage = dispatch => language => {
    dispatch({ type: CHANGE_APP_LANGUAGE, payload: language })
}