import createDataContext from '../createDataContext'
import reducer, { initialState } from './reducer'
import * as actions from './actions'

export const {
    Context: LanguageContext,
    Provider: LanguageProvider
} = createDataContext(reducer, { ...actions }, initialState)