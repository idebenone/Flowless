import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node } from "reactflow";

const initialState: Node[] = []

export const nodeSlice = createSlice({
    name: "nodes",
    initialState,
    reducers: {
        syncNodes: (_state, action: PayloadAction<Node[]>) => {
            return action.payload;
        },
        editNode: (_state, action: PayloadAction<Node>) => {
            const index = _state.findIndex(node => node.id === action.payload.id);
            if (index !== -1) {
                _state[index] = action.payload;
            }
        },
        deleteNode: (_state, actioon: PayloadAction<string>) => {
            return _state.filter(node => node.id !== actioon.payload);
        }
    }
});

export const { syncNodes, editNode, deleteNode } = nodeSlice.actions;
export default nodeSlice.reducer;