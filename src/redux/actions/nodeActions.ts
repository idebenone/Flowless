import { Node } from "reactflow";
import { Dispatch } from "@reduxjs/toolkit";
import { debounce } from "lodash";

import { deleteNode, editNode, syncNodes } from "../slices/nodeSlice";

export const syncNodeAction = debounce(
    (dispatch: Dispatch, nodes: Node[]) => {
        dispatch(syncNodes(nodes));
    },
    1000,
    { leading: false, trailing: true }
);

export function editNodeAction(dispatch: Dispatch, node: Node) {
    dispatch(editNode(node));
}

export function deleteAction(dispatch: Dispatch, id: string) {
    dispatch(deleteNode(id))
}