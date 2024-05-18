import { Node } from "reactflow";
import { Dispatch } from "@reduxjs/toolkit";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid"

import { createNodeType, editNodeType, syncNodeTypes } from "../slices/nodeTypeSlice";
import { localFetch } from "../../lib/localStorage";

export const syncNodeTypesActions = debounce(
    (dispatch: Dispatch) => {
        const nodes = localFetch("nodeTypes");
        dispatch(syncNodeTypes(nodes));
    },
    1000,
    { leading: false, trailing: true }
);

export function addNodeTypeAction(dispatch: Dispatch, type: string) {
    dispatch(createNodeType({
        id: uuidv4().substring(0, 7),
        type,
        data: { id: "", label: "untitled", content: "Content goes here" },
        position: { x: 0, y: 0 }
    }));
}

export function editNodeTypeAction(dispatch: Dispatch, node: Node) {
    dispatch(editNodeType(node));
}