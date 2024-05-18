import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

type NodeData = {
  [key: string]: string | number | string[];
};

const CustomNode1 = ({ data }: NodeProps<NodeData>) => {
  return (
    <div className="border border-muted-foreground rounded-md w-200 h-32 w-80 bg-muted">
      <div id="header" className="bg-primary rounded-ss-md rounded-se-md p-2">
        <p className="text-white">{data.label}</p>
      </div>

      <div id="content" className="h-10 p-2">
        <p>{data.content}</p>
      </div>

      <Handle type="source" position={Position.Left} />
      <Handle type="target" position={Position.Right} />
    </div>
  );
};

export default memo(CustomNode1);
