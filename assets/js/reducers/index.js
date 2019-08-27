import { combineReducers } from 'redux'
import * as actions from '../actions'

 function currentLayoutNav (state = { layout: 0 }, action) {
    switch (action.type) {
      case actions.UPDATE_LAYOUT_NAV:
        return { layout: action.layout }
      default:
        return state
    }
  }
 

const rootReducer = combineReducers({

  currentLayoutNav
  })
  
  export default rootReducer