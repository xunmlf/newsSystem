
import { configureStore } from "@reduxjs/toolkit";
import collapsedReducer from "./modules/collapsedReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "xunmlf",
    storage,
};

const persistedReducer = persistReducer(persistConfig, collapsedReducer);



const store = configureStore({
    reducer: {
        collapsed: persistedReducer,
    },
});


export const persistor = persistStore(store);

export default store;
