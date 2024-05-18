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
import { syncNodeAction } from "../redux/actions/nodeActions";
import { RootState } from "../redux/store";
import { setActiveNodeAction } from "../redux/actions/activeNodeActions";

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

interface FlowProps {
  setPanelType: (type: string) => void;
}

const Flow: React.FC<FlowProps> = ({ setPanelType }) => {
  const state_nodes = useSelector((state: RootState) => state.nodes);
  const dispatch = useDispatch();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const handleNodeChanges = () => {
    localSync("nodes", nodes);
    syncNodeAction(dispatch, nodes);
  };

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

  useEffect(() => {
    if (nodes.length === 0) {
      const _nodes = localFetch("nodes");
      setNodes(_nodes);
      syncNodeAction(dispatch, _nodes);
    }
  }, [dispatch, nodes, setNodes]);

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
            handleNodeChanges();
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
            setPanelType("settings");
            setActiveNodeAction(dispatch, node);
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
