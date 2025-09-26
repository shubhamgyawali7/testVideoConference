"use client";

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
// import storage from "./persistStorage.js";
import rootReducer from "./rootReducer.js";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["conference"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

 const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
        ignoredPaths: ["register"],
      },
    }),
});


const persistor = persistStore(store);

export { store, persistor };
