import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Edge } from "reactflow";

const initialState: Edge[] = []

export const edgeSlice = createSlice({
    name: "edges",
    initialState,
    reducers: {
        syncEdges: (_state, action: PayloadAction<Edge[]>) => {
            return action.payload;
        },
        createEdge: (_state, action: PayloadAction<Edge>) => {
            _state.push(action.payload);
        },
        editEdge: (_state, action: PayloadAction<Edge>) => {
            const index = _state.findIndex(edge => edge.id === action.payload.id);
            if (index !== -1) {
                _state[index] = action.payload;
            }
        },
        deleteEdge: (_state, action: PayloadAction<string>) => {
            return _state.filter(edge => edge.id !== action.payload);
        }
    }
});

export const { syncEdges, createEdge, editEdge, deleteEdge } = edgeSlice.actions;
export default edgeSlice.reducer;