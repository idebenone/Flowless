import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node } from "reactflow";

const initialState: Node[] = []

export const nodeTypeSlice = createSlice({
    name: "nodeType",
    initialState,
    reducers: {
        syncNodeTypes: (_state, action: PayloadAction<Node[]>) => {
            _state.push(...action.payload);
        },
        createNodeType: (_state, action: PayloadAction<Node>) => {
            _state.push(action.payload);
        },
        editNodeType: (_state, action: PayloadAction<Node>) => {
            const index = _state.findIndex(node => node.id === action.payload.id);
            if (index !== -1) {
                _state[index] = action.payload;
            }
        },
        deleteNodeType: (_state, actioon: PayloadAction<string>) => {
            return _state.filter(node => node.id !== actioon.payload);
        }
    }
});

export const { syncNodeTypes, createNodeType, editNodeType, deleteNodeType } = nodeTypeSlice.actions;
export default nodeTypeSlice.reducer;