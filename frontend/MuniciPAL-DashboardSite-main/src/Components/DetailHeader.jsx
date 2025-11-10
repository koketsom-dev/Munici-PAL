import { User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header({ backTo }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6 pr-4 pl-0">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
      </div>


      <div className="flex-1 flex justify-center items-center mx-4 max-w-lg"></div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
          <User className="w-5 h-5 mr-2" />
          <span>Employee Name</span>
        </button>
      </div>
    </div>
  );
}

export default Header;
