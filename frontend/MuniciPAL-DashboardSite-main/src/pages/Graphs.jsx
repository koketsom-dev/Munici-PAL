import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import ReportGraphHeader from "../Components/ReportGraphHeader";
import PieChart from "../Components/PieChart";
import BarChartRes from "../Components/BarChartRes";
import WeeklyBarChart from "../Components/WeeklyBarChart";

export default function Graphs({ backTo }) {
    const navigate = useNavigate();

    //Dummy data
    const ALL_TICKETS = [
        // Week of Oct 20–26
        { id: 1, title: "Fix login bug", status: "Pending", type: "Water", createdAt: "2025-10-21", ResolvedAt: "", owner: "Sam" },
        { id: 2, title: "Update docs", status: "In Progress", type: "Road", createdAt: "2025-10-22", ResolvedAt: "", owner: "Alex" },
        { id: 3, title: "Add dark mode", status: "Resolved", type: "Electrical", createdAt: "2025-10-23", ResolvedAt: "2025-10-25", owner: "Mik" },
        { id: 4, title: "Refactor API", status: "Resolved", type: "Refuse", createdAt: "2025-10-24", ResolvedAt: "2025-10-26", owner: "Jayden" },

        // Week of Oct 27–Nov 2
        { id: 5, title: "Improve search", status: "Resolved", type: "Road", createdAt: "2025-10-28", ResolvedAt: "2025-10-30", owner: "Sam" },
        { id: 6, title: "Fix CSS issues", status: "Pending", type: "Water", createdAt: "2025-10-29", ResolvedAt: "", owner: "Alex" },
        { id: 7, title: "Add notifications", status: "Resolved", type: "Electrical", createdAt: "2025-10-30", ResolvedAt: "2025-11-01", owner: "Mik" },
        { id: 8, title: "Optimize DB", status: "Resolved", type: "Refuse", createdAt: "2025-10-31", ResolvedAt: "2025-11-02", owner: "Jayden" },
        { id: 9, title: "Fix mobile layout", status: "In Progress", type: "Road", createdAt: "2025-11-01", ResolvedAt: "", owner: "Sam" },

        // Week of Nov 3–Nov 9 (current week, won’t show in chart yet)
        { id: 10, title: "Add analytics", status: "Resolved", type: "Water", createdAt: "2025-11-03", ResolvedAt: "2025-11-05", owner: "Alex" },
        { id: 11, title: "Update dependencies", status: "Resolved", type: "Electrical", createdAt: "2025-11-04", ResolvedAt: "2025-11-06", owner: "Mik" },
        { id: 12, title: "Fix caching bug", status: "Pending", type: "Refuse", createdAt: "2025-11-05", ResolvedAt: "", owner: "Jayden" },
        { id: 13, title: "Improve logging", status: "Resolved", type: "Road", createdAt: "2025-11-06", ResolvedAt: "2025-11-08", owner: "Sam" },
        { id: 14, title: "Add user roles", status: "Resolved", type: "Water", createdAt: "2025-11-07", ResolvedAt: "2025-11-09", owner: "Alex" },
        { id: 15, title: "Fix email alerts", status: "In Progress", type: "Electrical", createdAt: "2025-11-08", ResolvedAt: "", owner: "Mik" },
        { id: 16, title: "Enhance dashboard", status: "Resolved", type: "Refuse", createdAt: "2025-11-09", ResolvedAt: "2025-11-11", owner: "Jayden" },
    ];


    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-gray-50 pb-6">
                <ReportGraphHeader />

                <main className="space-y-4 px-6 pt-5">
                    <button
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded "
                        onClick={() => navigate(backTo = "/reports")}
                    >
                        ← Back to Reports
                    </button>

                    <div className="grid grid-cols-3 gap-6 mt-6">
                        <div className="bg-white p-4 rounded shadow">
                            <PieChart tasks={ALL_TICKETS} />
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <BarChartRes Tickets={ALL_TICKETS} />
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <WeeklyBarChart Tickets={ALL_TICKETS} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
