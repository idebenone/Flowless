import { Node } from "reactflow";
import { Dispatch } from "@reduxjs/toolkit";

import { setActiveNode } from "../slices/activeNodeSlice";

export function setActiveNodeAction(dispatch: Dispatch, node: Node) {
    dispatch(setActiveNode(node));
}