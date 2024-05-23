import { useEffect, useState } from "react";

import { Columns2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import Panel from "@/components/panel";
import Flow from "@/components/flow";
import Nav from "@/components/nav";
import { debounce } from "lodash";
import { localFetch } from "@/lib/localStorage";
import { useDispatch } from "react-redux";
import { syncNodeTypes } from "@/redux/slices/nodeTypeSlice";
import { syncNodes } from "@/redux/slices/nodeSlice";
import { syncEdges } from "@/redux/slices/edgesSlice";

const Root = () => {
  const dispatch = useDispatch();
  const [panelState, setPanelState] = useState<boolean>(true);

  const fetchLocalAndSyncState = debounce(
    () => {
      const nodeTypes = localFetch("nodeTypes");
      const nodes = localFetch("nodes");
      const edges = localFetch("edges");
      dispatch(syncNodeTypes(nodeTypes));
      dispatch(syncNodes(nodes));
      dispatch(syncEdges(edges));
    },
    1000,
    { leading: false, trailing: true }
  );

  useEffect(() => {
    fetchLocalAndSyncState();
  }, []);

  return (
    <div className="relative">
      <Flow />
      <Nav />

      <div className="absolute top-2 right-2">
        <Button
          className="flex gap-2 items-center"
          onClick={() => setPanelState(!panelState)}
        >
          <p>Panel</p>
          <Columns2 className="h-4 w-4" />
        </Button>
      </div>

      <Panel
        panelState={panelState}
        setPanelState={() => setPanelState(!panelState)}
      />
    </div>
  );
};

export default Root;
