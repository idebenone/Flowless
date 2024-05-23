import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";

import { PlusCircle, Workflow, X } from "lucide-react";
import { Button } from "./ui/button";

import { RootState } from "../redux/store";
import { localSync } from "../lib/localStorage";
import {
  createNodeType,
  deleteNodeType,
  editNodeType,
} from "@/redux/slices/nodeTypeSlice";

const NodePanel = () => {
  const nodeTypes = useSelector((state: RootState) => state.nodeType);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editNodeState, setEditNodeState] = useState<boolean>(false);
  const [editNode, setEditNode] = useState<Node | undefined>();

  const handleEditNodeType = () => {
    if (editNode)
      if (inputRef.current?.value)
        dispatch(
          editNodeType({
            ...editNode,
            data: { ...editNode.data, label: inputRef.current?.value },
          })
        );
  };

  const handleDragEvent = (
    event: React.DragEvent<HTMLDivElement>,
    node: Node
  ) => {
    event.dataTransfer.setData("nodeType", JSON.stringify(node));
    event.dataTransfer.effectAllowed = "move";
  };

  const fetchStateTypesAndSyncLocal = debounce(
    () => {
      if (nodeTypes.length !== 0) {
        setTimeout(() => {
          localSync("nodeTypes", nodeTypes);
        }, 1000);
      }
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  );

  useEffect(() => {
    fetchStateTypesAndSyncLocal();
  }, [nodeTypes]);

  return (
    <>
      {nodeTypes.length !== 0 ? (
        <div className="flex flex-wrap gap-2">
          {nodeTypes.map((nodeType, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg cursor-grab relative group"
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

              <span
                className="p-0.5 absolute -top-1 -right-1 cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full bg-black"
                onClick={() => dispatch(deleteNodeType(nodeType.id))}
              >
                <X className="h-3 w-3 text-white" />
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
          <Workflow className="h-16 w-16" />
          <p className="font-semibold">No nodes found</p>
        </div>
      )}

      <div className="flex justify-center my-4">
        <Button
          className="flex items-center gap-2"
          onClick={() =>
            dispatch(
              createNodeType({
                id: uuidv4().substring(0, 7),
                type: "custom_node_1",
                data: {
                  id: "",
                  label: "untitled",
                  content: "Content",
                },
                position: { x: 0, y: 0 },
              })
            )
          }
        >
          <p>Create</p>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default NodePanel;
