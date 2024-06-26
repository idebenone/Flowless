import { configureStore } from "@reduxjs/toolkit";
import nodeTypeSlice from "./slices/nodeTypeSlice";
import nodeSlice from "./slices/nodeSlice";
import activeNodeSlice from "./slices/activeNodeSlice";
import edgeSlice from "./slices/edgesSlice";

export const store = configureStore({
    reducer: {
        nodes: nodeSlice,
        edges: edgeSlice,
        nodeType: nodeTypeSlice,
        activeNode: activeNodeSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;