import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import ReportGraphHeader from "../Components/ReportGraphHeader";
import PieChart from "../Components/PieChart";
import BarChartRes from "../Components/BarChartRes";
import WeeklyBarChart from "../Components/WeeklyBarChart";
import { ticketAPI } from "../../../src/services/api";

export default function Graphs({ backTo }) {
    const navigate = useNavigate();
    const [allTickets, setAllTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await ticketAPI.list({});
            
            if (response.success && response.data) {
                const parseDate = (value) => {
                    if (!value) return null;
                    const date = new Date(value);
                    if (Number.isNaN(date.valueOf())) return null;
                    return date.toISOString();
                };

                const formattedTickets = response.data.map(ticket => {
                    const createdAt = parseDate(ticket.createdAt || ticket.created_at || ticket.date_created);
                    const resolvedAt = parseDate(ticket.completedAt || ticket.resolved_at || ticket.date_completed);

                    return {
                        id: ticket.id || ticket.ticket_id,
                        title: ticket.title || ticket.subject || 'Untitled Ticket',
                        status: ticket.status || 'Pending',
                        type: ticket.issue_type || ticket.type || 'N/A',
                        createdAt,
                        ResolvedAt: resolvedAt,
                        owner: ticket.assignedTo || ticket.assigned_to || 'Unassigned'
                    };
                });
                setAllTickets(formattedTickets);
            } else {
                setAllTickets([]);
            }
        } catch (err) {
            console.error('Failed to fetch tickets:', err);
            setAllTickets([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col bg-gray-50">
                    <ReportGraphHeader />
                    <main className="flex-1 overflow-y-auto space-y-4 px-6 pt-5 flex items-center justify-center">
                        <p className="text-gray-500">Loading graphs...</p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-gray-50">
                <ReportGraphHeader />

                <main className="flex-1 overflow-y-auto space-y-4 px-6 pt-5">
                    <button
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded "
                        onClick={() => navigate("/dashboard/reports")}
                    >
                        ← Back to Reports
                    </button>

                    <div className="grid grid-cols-3 gap-6 mt-6">
                        <div className="bg-white p-4 rounded shadow">
                            <PieChart tasks={allTickets} />
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <BarChartRes Tickets={allTickets} />
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <WeeklyBarChart Tickets={allTickets} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
