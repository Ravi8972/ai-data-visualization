
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice.ts'; 
import chartDataReducer from './chartDataSlice.ts'; 

export const store = configureStore({
  reducer: {
    theme: themeReducer, 
    chartData: chartDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

