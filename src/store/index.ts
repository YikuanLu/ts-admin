import { combineReducers, createStore } from 'redux'
// import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from '@/store/reducers/user'
import commonReducer from '@/store/reducers/common'
import searchReducer from '@/store/reducers/search.ts'

const persistConfig = {
  key: 'root',
  storage
}

const reducers = combineReducers({
  userReducer,
  commonReducer,
  searchReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)
