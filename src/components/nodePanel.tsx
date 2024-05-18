import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Node } from "reactflow";

import { PlusCircle } from "lucide-react";

import { RootState } from "../redux/store";
import {
  addNodeTypeAction,
  editNodeTypeAction,
  syncNodeTypesActions,
} from "../redux/actions/nodeTypeActions";
import { localSync } from "../lib/localStorage";
import { Button } from "./ui/button";

const NodePanel = () => {
  const nodeTypes = useSelector((state: RootState) => state.nodeType);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const [editNodeState, setEditNodeState] = useState<boolean>(false);
  const [editNode, setEditNode] = useState<Node | undefined>();

  const handleEditNodeType = () => {
    if (editNode)
      if (inputRef.current?.value)
        editNodeTypeAction(dispatch, {
          ...editNode,
          data: { ...editNode.data, label: inputRef.current?.value },
        });
  };

  const handleDragEvent = (
    event: React.DragEvent<HTMLDivElement>,
    node: Node
  ) => {
    event.dataTransfer.setData("nodeType", JSON.stringify(node));
    event.dataTransfer.effectAllowed = "move";
  };

  /*
    When the page loads / reloads, our state is initialized empty.
    If it's empty, we try to sync from localStorage.
    If not, we will overwrite the localStorage
  */
  useEffect(() => {
    if (nodeTypes.length !== 0) {
      setTimeout(() => {
        localSync("nodeTypes", nodeTypes);
      }, 1000);
    } else {
      syncNodeTypesActions(dispatch);
    }
  }, [nodeTypes, dispatch]);

  return (
    <>
      {nodeTypes.length !== 0 && (
        <div className="flex flex-wrap gap-2 m-4">
          {nodeTypes.map((nodeType, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg"
              draggable
              onDragStart={(e) => handleDragEvent(e, nodeType)}
            >
              <div onClick={() => setEditNode(nodeType)}>
                {editNode?.id == nodeType.id ? (
                  <>
                    {!editNodeState && (
                      <p
                        className="text-sm"
                        onDoubleClick={() => setEditNodeState(!editNodeState)}
                      >
                        {nodeType.data.label}
                      </p>
                    )}
                    {editNodeState && (
                      <input
                        className="focus:outline-none w-fit"
                        ref={inputRef}
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.key === "Enter") {
                            handleEditNodeType();
                            setEditNodeState(!editNodeState);
                          }
                        }}
                        placeholder={nodeType.data.label}
                        autoFocus
                      />
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm">{nodeType.data.label}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center my-4">
        <Button
          className="flex items-center gap-2"
          onClick={() => addNodeTypeAction(dispatch, "example1")}
        >
          <p>Create</p>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default NodePanel;
