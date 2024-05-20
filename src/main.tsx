import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

import Root from "./pages/Root.tsx";
import MenuPanel from "./components/menuPanel.tsx";
import NodePanel from "./components/nodePanel.tsx";
import SettingsPanel from "./components/settingsPanel.tsx";
import Error from "./components/error.tsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <MenuPanel />,
      },
      {
        path: "menu",
        element: <MenuPanel />,
      },
      {
        path: "nodes",
        element: <NodePanel />,
      },
      {
        path: "settings",
        element: <SettingsPanel />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
