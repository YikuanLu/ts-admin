import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
// import moment from 'moment'
import 'moment/locale/zh-cn'
import { store, persistor } from '@/store/index'

import '@/assets/sass/public.sass'
import App from './App'


ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </ConfigProvider>
  </Provider>,
  document.getElementById('root'),
)
