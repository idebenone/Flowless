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
  Edge,
  Background,
  BackgroundVariant,
  NodeTypes,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";

import customNode1 from "./nodes/customNode1";
import customNode2 from "./nodes/customNode2";

import { localSync } from "../lib/localStorage";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { syncNodes } from "@/redux/slices/nodeSlice";
import { setActiveNode } from "@/redux/slices/activeNodeSlice";
import { createEdge } from "@/redux/slices/edgesSlice";

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const nodeTypes: NodeTypes = {
  custom_node_1: customNode1,
  custom_node_2: customNode2,
};

const Flow = () => {
  const state_nodes = useSelector((state: RootState) => state.nodes);
  const state_edges = useSelector((state: RootState) => state.edges);
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
        dispatch(createEdge(params as Edge));
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

  const debouncedNodeSync = useCallback(
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
      debouncedNodeSync(nodes, changes);
    },
    [debouncedNodeSync, nodes]
  );

  // const debouncedEdgeSync = useCallback(
  //   debounce((edges) => {
  //     localSync("edges", edges);
  //     dispatch(syncEdges(edges));
  //   }, 1000),
  //   []
  // );

  // const handleEdgeChanges = useCallback(() => {
  //   debouncedEdgeSync(edges);
  // }, [debouncedEdgeSync, edges]);

  useEffect(() => {
    if (nodes !== state_nodes) setNodes(state_nodes);
    if (edges !== state_edges) setEdges(state_edges);

    if (state_edges.length !== 0) {
      localSync("edges", state_edges);
    }

    if (state_nodes.length !== 0) {
      localSync("nodes", state_nodes);
    }
  }, [state_nodes, state_edges]);

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
