import { combineReducers } from 'redux'
import auth from '../ducks/auth'
import channel from '../ducks/channel'
import chatroom from '../ducks/chatroom'

const rootReducer = combineReducers({
  auth,
  channel,
  chatroom
})

export default rootReducer