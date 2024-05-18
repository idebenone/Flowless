import { useState } from "react";

import { Columns2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import Panel from "../components/panel";
import Flow from "../components/flow";

const Root = () => {
  const [panelState, setPanelState] = useState<boolean>(true);
  const [panelType, setPanelType] = useState<string>("node");

  return (
    <div className="relative">
      <Flow setPanelType={setPanelType} />

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
        type={panelType}
        setType={() => setPanelType("node")}
        panelState={panelState}
        setPanelState={() => setPanelState(!panelState)}
      />
    </div>
  );
};

export default Root;
