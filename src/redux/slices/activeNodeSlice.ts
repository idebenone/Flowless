import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node } from "reactflow";

const initialState: Node = {
    id: "",
    position: { x: 0, y: 0 },
    data: undefined
}

export const activeNodeSlice = createSlice({
    name: "activeNode",
    initialState,
    reducers: {
        setActiveNode: (_state, action: PayloadAction<Node>) => {
            return action.payload;
        },
    }
});

export const { setActiveNode } = activeNodeSlice.actions;
export default activeNodeSlice.reducer;