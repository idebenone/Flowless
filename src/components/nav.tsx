import { Link } from "react-router-dom";

const paths = [
  { path: "/menu", label: "Menu" },
  { path: "/nodes", label: "Nodes" },
  { path: "/settings", label: "Settings" },
];

const Nav = () => {
  return (
    <div className="absolute top-4 left-4">
      <div className="flex gap-3">
        {paths.map((path, index) => (
          <Link
            key={index}
            to={path.path}
            className="px-4 py-2 backdrop-blur-sm rounded-md hover:bg-slate-200 transition-all duration-500 "
          >
            {path.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Nav;
