import { Iterable } from 'immutable'
import { configureStore, createSerializableStateInvariantMiddleware, isPlain } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'

// const isSerializable = (value) => Iterable.isIterable(value) || isPlain(value)

// const getEntries = (value) =>
//   Iterable.isIterable(value) ? value.entries() : Object.entries(value)

// const serializableMiddleware = createSerializableStateInvariantMiddleware({
//   isSerializable,
//   getEntries,
// })
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
})