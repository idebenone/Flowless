import { ArrowLeft, X } from "lucide-react";

import NodePanel from "./nodePanel";
import SettingsPanel from "./settingsPanel";

interface PanelProps {
  type: string;
  setType: () => void;
  panelState: boolean;
  setPanelState: () => void;
}

const Panel: React.FC<PanelProps> = ({
  type,
  setType,
  panelState,
  setPanelState,
}) => {
  return (
    panelState && (
      <div className="absolute right-0 top-0 backdrop-blur-sm w-[400px] border h-full overflow-y-scroll">
        <div
          id="header"
          className="flex justify-between items-center p-4 border-b bg-white"
        >
          <span className="flex items-center gap-4">
            {type !== "node" && (
              <ArrowLeft className="w-4 h-4 cursor-pointer" onClick={setType} />
            )}
            <p className="font-bold">
              {type == "node" ? "Node Panel" : "Settings"}
            </p>
          </span>
          <X className="w-4 h-4 cursor-pointer" onClick={setPanelState} />
        </div>
        {type == "node" ? <NodePanel /> : <SettingsPanel />}
      </div>
    )
  );
};

export default Panel;
