import { combineReducers } from "redux"
import authReducer from './authReducer'
import boardReducer from './boardReducer'

const rootReducer = combineReducers({ authReducer, boardReducer})

export default rootReducer