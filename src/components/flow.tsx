import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";
import ReactFlow, {
  ReactFlowProvider,
  Node,
  FitViewOptions,
  DefaultEdgeOptions,
  addEdge,
  Controls,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Background,
  BackgroundVariant,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

import customNode1 from "./nodes/customNode1";
import customNode2 from "./nodes/customNode2";

import { localFetch, localSync } from "../lib/localStorage";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { syncNodes } from "@/redux/slices/nodeSlice";
import { setActiveNode } from "@/redux/slices/activeNodeSlice";

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const nodeTypes: NodeTypes = {
  example1: customNode1,
  example2: customNode2,
};

const Flow = () => {
  const state_nodes = useSelector((state: RootState) => state.nodes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const isSourceConnected = edges.some(
        (edge) => edge.source === params.source
      );

      if (!isSourceConnected) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        alert("A node can have only one source");
      }
    },
    [edges, setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const nodeType: Node = JSON.parse(event.dataTransfer.getData("nodeType"));
      if (typeof nodeType === "undefined" || !nodeType) {
        return;
      }
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const id = uuidv4().substring(0, 7);
      setNodes((nds) =>
        nds.concat({
          ...nodeType,
          id,
          position,
          data: { ...nodeType.data, id },
        })
      );
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const debouncedSync = useCallback(
    debounce((nodes, changes) => {
      localSync("nodes", nodes);
      dispatch(syncNodes(nodes));
      const activeNode = nodes.find((node: Node) => {
        return node.id === changes[0].id;
      });
      dispatch(setActiveNode(activeNode));
    }, 1000),
    []
  );

  const handleNodeChanges = useCallback(
    (changes: any) => {
      debouncedSync(nodes, changes);
    },
    [debouncedSync, nodes]
  );

  const fetchLocalNodesAndSync = debounce(
    () => {
      if (nodes.length === 0) {
        const _nodes = localFetch("nodes");
        setNodes(_nodes);
        dispatch(syncNodes(_nodes));
      }
    },
    1000,
    {
      leading: false,
      trailing: true,
    }
  );

  useEffect(() => {
    fetchLocalNodesAndSync();
  }, []);

  useEffect(() => {
    if (nodes !== state_nodes) setNodes(state_nodes);
  }, [state_nodes]);

  useEffect(() => {
    const handleLocalEdgeSync = debounce(
      () => {
        if (edges.length === 0) {
          setEdges(localFetch("edges"));
        } else {
          localSync("edges", edges);
        }
      },
      1000,
      {
        leading: false,
        trailing: true,
      }
    );

    handleLocalEdgeSync();
  }, [edges, setEdges]);

  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            onNodesChange(changes);
            handleNodeChanges(changes);
          }}
          onEdgesChange={onEdgesChange}
          defaultEdgeOptions={defaultEdgeOptions}
          onInit={setReactFlowInstance}
          onConnect={onConnect}
          onDrop={(e) => onDrop(e)}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitViewOptions={fitViewOptions}
          onNodeClick={(_, node) => {
            navigate("settings", { replace: true });
            dispatch(setActiveNode(node));
          }}
          fitView
        >
          <Background
            id="1"
            gap={10}
            color="#ccc"
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
        <Controls />
      </ReactFlowProvider>
    </div>
  );
};

export default memo(Flow);
