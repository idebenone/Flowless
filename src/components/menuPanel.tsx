import { localFlush } from "@/lib/localStorage";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { syncNodes } from "@/redux/slices/nodeSlice";
import { syncEdges } from "@/redux/slices/edgesSlice";
import { setActiveNode } from "@/redux/slices/activeNodeSlice";
import { syncNodeTypes } from "@/redux/slices/nodeTypeSlice";
import { RootState } from "@/redux/store";
import { v4 as uuidv4 } from "uuid";

const MenuPanel = () => {
  const { nodeType, nodes, edges } = useSelector((state: RootState) => state);

  const dispatch = useDispatch();

  const handleExport = () => {
    const data = { nodes, nodeType, edges };
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `flowify-${uuidv4().substring(0, 7)}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          const data = JSON.parse(json);

          if (data.nodes && data.nodeType && data.edges) {
            dispatch(syncNodes(data.nodes));
            dispatch(syncNodeTypes(data.nodeType));
            dispatch(syncEdges(data.edges));
            dispatch(
              setActiveNode({
                id: "",
                position: { x: 0, y: 0 },
                data: undefined,
              })
            );
          } else {
            console.error("Invalid data format");
          }
        } catch (error) {
          console.error("Failed to parse JSON", error);
        }
      };
      reader.readAsText(file);
    }
  };

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
      <Button variant="outline" onClick={handleExport}>
        Save
      </Button>
      <div className="flex">
        <label
          htmlFor="open"
          className="px-4 py-2 border border-muted w-full text-center rounded-md cursor-pointer"
        >
          Open
        </label>
        <input
          type="file"
          className="hidden"
          id="open"
          onChange={handleImport}
        />
      </div>
    </div>
  );
};

export default MenuPanel;
