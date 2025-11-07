import { User, Funnel} from "lucide-react";
import { useState, useRef, useEffect } from "react";


function Header() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const dropdownRef = useRef(null);

  //Initial filter options
  const filters = ["Status", "Type"];

  //Detailed filter options
  const filterOptions = {
    Status: ["In Progress", "Resolved", "Pending"],
    Type: ["Water", "Electrical", "Road"]
  }

  //Close drop down automatically
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold">MuniciPAL</h1>
      </div>

      <div className="flex-1 flex justify-center items-center mx-4 max-w-lg space-x-2 relative">
        <input
          id="search-ticket"
          name="search-ticket"
          type="text"
          placeholder="Search Ticket"
          className="border rounded px-2 py-1 flex-1"
        />
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center border rounded px-3 py-1 hover:bg-gray-100 transition">
            <Funnel className="w-5 h-6" />
          </button>
          {showFilters && (
            <div className="absolute top-full mt-1 left-0 w-40 bg-white border rounded shadow-lg z-10">
              {!selectedFilter &&
                filters.map((filter)=>(
                  <button key={filter} 
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={()=> setSelectedFilter(filter)}
                  >
                    {filter}
                  </button>
                ))
              }

              {selectedFilter &&
                filterOptions[selectedFilter].map((option)=>(
                  <button key={option}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={()=>{
                      setShowFilters(false);
                      setSelectedFilter(null);
                    }}
                  >
                    {option}
                  </button>  
                ))
              }
            </div>  
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <select id="sort-by" name="sort-by" className="border rounded px-2 py-1" defaultValue="">
          <option value="">Sort By</option>
          <option>Newest to Oldest</option>
          <option>Oldest to Newest</option>
          <option>Type</option>
          <option>Subject</option>
        </select>
        <button className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
          <User className="w-5 h-5 mr-2" />
          <span>Employee Name</span>
        </button>
      </div>
    </div>
  );
}

export default Header;
