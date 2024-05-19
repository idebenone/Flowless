import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

interface PanelProps {
  panelState: boolean;
  setPanelState: () => void;
}

const Panel: React.FC<PanelProps> = ({ panelState, setPanelState }) => {
  const location = useLocation();
  const [pathName, setPathName] = useState<string>("");

  useEffect(() => {
    setPathName(location.pathname.split("/")[1]);
  }, [location]);

  return (
    <div
      className={`absolute right-0 top-0 backdrop-blur-sm border h-full overflow-y-scroll transition-all duration-200 ${
        panelState ? "w-[400px] animate-fade-in" : "w-0 animate-fade-out"
      }`}
    >
      <div
        id="header"
        className="sticky top-0 flex justify-between items-center p-4 border-b bg-white"
      >
        <p className="font-bold uppercase">{pathName}</p>
        <X className="w-4 h-4 cursor-pointer" onClick={setPanelState} />
      </div>

      <div className="m-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Panel;
