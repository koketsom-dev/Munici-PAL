import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function ResolvedTimeChart({ Tickets }) {
    const chartRef = useRef(null);

    const defaultTypes = ["Water", "Roads", "Electricity", "Refuse"];
    const typeDuration = {};

    Tickets.forEach((ticket) => {
        if (!ticket || ticket.status !== "Resolved" || !ticket.ResolvedAt) {
            return;
        }

        const created = ticket.createdAt ? new Date(ticket.createdAt) : null;
        const resolved = ticket.ResolvedAt ? new Date(ticket.ResolvedAt) : null;

        if (!created || !resolved || Number.isNaN(created.valueOf()) || Number.isNaN(resolved.valueOf())) {
            return;
        }

        const duration = (resolved - created) / (1000 * 60 * 60 * 24);
        if (!Number.isFinite(duration)) {
            return;
        }

        const typeKey = ticket.type || "Unspecified";
        if (!typeDuration[typeKey]) typeDuration[typeKey] = [];
        typeDuration[typeKey].push(duration);
    });

    const chartTypes = Array.from(new Set([...defaultTypes, ...Object.keys(typeDuration)]));

    const avgDurations = chartTypes.map((type) => {
        const durations = typeDuration[type] || [];
        if (durations.length === 0) return 0;
        const total = durations.reduce((sum, value) => sum + value, 0);
        return total / durations.length;
    });

    const colorPalette = ["#36A2EB", "#E50914", "#ffff00", "#9c5708", "#10b981", "#7c3aed"];

    const data = {
        labels: chartTypes,
        datasets: [
            {
                label: "Avg. Resolution Time (days)",
                data: avgDurations.map((value) => Number(value.toFixed(1))),
                backgroundColor: chartTypes.map((_, index) => colorPalette[index % colorPalette.length]),
                borderRadius: 5,
                hoverOffset: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: "easeOutQuart",
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Average Ticket Resolution Time by Type",
                font: { size: 16, weight: "bold" },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const type = context.label;
                        const aveTime = context.parsed?.y ?? 0;
                        return `${type}: Avg. ${aveTime.toFixed(1)} days`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Days",
                },
            },
        },
    };

    const manageDownload = () => {
        const chart = chartRef.current;
        if (!chart) return;
        const link = document.createElement("a");
        link.href = chart.toBase64Image();
        link.download = `avg-resolution-time-${new Date().toISOString().slice(0, 10)}.png`;
        link.click();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
            style={{ height: "575px" }}
        >
            <div className="flex justify-end mb-2">
                <button
                    onClick={manageDownload}
                    className="bg-blue-600 text-white px-3 py-1 rounded flex items-center hover:bg-blue-700 transition"
                >
                    <Download className="w-4 h-4 mr-1" />
                    Download Chart
                </button>
            </div>
            <Bar ref={chartRef} data={data} options={options} />
        </motion.div>
    )
}