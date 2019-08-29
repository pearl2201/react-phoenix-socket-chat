import { combineReducers } from 'redux'
import * as actions from '../actions'

function currentLayoutNav(state = { layout: 0 }, action) {
  switch (action.type) {
    case actions.UPDATE_LAYOUT_NAV:
      return { layout: action.layout }
    default:
      return state
  }
}


function auth(state = { isAuth: false, current_user: {} }, action) {
  switch (action.type) {
    case actions.CONNECT_SUCCESS:
    
      return { ...state, isAuth: true }

    case actions.GET_INFO_USER_SUCCESS:
      
      return { ...state, current_user: action.user }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  auth,
  currentLayoutNav
})

export default rootReducer