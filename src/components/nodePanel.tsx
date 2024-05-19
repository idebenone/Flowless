import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";

import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";

import { RootState } from "../redux/store";
import { localFetch, localSync } from "../lib/localStorage";
import {
  createNodeType,
  editNodeType,
  syncNodeTypes,
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

  const fetchLocalTypesAndSyncState = debounce(
    () => {
      const nodeTypes = localFetch("nodeTypes");
      dispatch(syncNodeTypes(nodeTypes));
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  );

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
    fetchLocalTypesAndSyncState();
  }, []);

  useEffect(() => {
    fetchStateTypesAndSyncLocal();
  }, [nodeTypes]);

  return (
    <>
      {nodeTypes.length !== 0 && (
        <div className="flex flex-wrap gap-2">
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
          onClick={() =>
            dispatch(
              createNodeType({
                id: uuidv4().substring(0, 7),
                type: "example1",
                data: {
                  id: "",
                  label: "untitled",
                  content: "Content goes here",
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
