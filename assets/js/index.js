import 'regenerator-runtime/runtime'
import React from 'react'
import App from './containers/App'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './store/configureStore'
import rootSaga from './sagas'


store.runSaga(rootSaga)



const mainContainer = document.getElementById('app')
if (mainContainer) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>, mainContainer)
}
