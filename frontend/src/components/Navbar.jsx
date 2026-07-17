import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-10 py-5 border-b border-gray-800 bg-[#0f172a]">
      <h1 className="text-2xl font-bold text-purple-500">
        Interview Shadow AI
      </h1>

      <div className="flex gap-6 text-gray-300">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;