import { localFlush } from "@/lib/localStorage";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { syncNodes } from "@/redux/slices/nodeSlice";
import { syncEdges } from "@/redux/slices/edgesSlice";
import { setActiveNode } from "@/redux/slices/activeNodeSlice";
import { syncNodeTypes } from "@/redux/slices/nodeTypeSlice";

const MenuPanel = () => {
  const dispatch = useDispatch();

  const handleNewProject = () => {
    dispatch(syncNodes([]));
    dispatch(syncEdges([]));
    dispatch(syncNodeTypes([]));
    dispatch(
      setActiveNode({ id: "", position: { x: 0, y: 0 }, data: undefined })
    );
    localFlush();
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleNewProject}>New</Button>
    </div>
  );
};

export default MenuPanel;
