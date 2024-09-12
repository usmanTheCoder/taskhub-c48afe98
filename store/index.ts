import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './slices/authSlice';
import taskSliceReducer from './slices/taskSlice';

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    tasks: taskSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;