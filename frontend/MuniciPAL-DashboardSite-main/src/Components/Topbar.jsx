import { Landmark } from "lucide-react"; // clean icon set

function Topbar() {
  return (
    <header className="bg-blue-900 text-white flex justify-between items-center px-6 py-3">
      {/* Left side: App icon + title */}
      <div className="flex items-center space-x-2">
        <Landmark className="w-5 h-5" />   {/* Proper city/municipal icon */}
        <h1 className="text-lg font-bold">MuniciPAL</h1>
      </div>

      {/* Right side: buttons & profile */}
      <div className="flex items-center space-x-4">
        <span className="bg-blue-800 px-3 py-1 rounded-full text-sm">
          Open tickets: 0
        </span>
        <button className="border border-white px-3 py-1 rounded hover:bg-white hover:text-blue-900">
          Log
        </button>
        <button className="border border-white px-3 py-1 rounded hover:bg-white hover:text-blue-900">
          Profile
        </button>
        <button className="text-xl">🔔</button>
        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center font-bold">
          M
        </div>
      </div>
    </header>
  );
}

export default Topbar;
