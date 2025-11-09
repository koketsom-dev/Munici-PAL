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

    const typeDuration = {};
    Tickets.forEach((ticket) => {
        if (ticket.status !== "Resolved" || !ticket.ResolvedAt) {
            return;
        }

        const created = new Date(ticket.createdAt);
        const resolved = new Date(ticket.ResolvedAt);
        const duration = (resolved - created) / (1000 * 60 * 60 * 24);

        if (!typeDuration[ticket.type]) typeDuration[ticket.type] = [];
        typeDuration[ticket.type].push(duration);
    });

    const avgDurations = Object.fromEntries(
        Object.entries(typeDuration).map(([type, durations]) => [
            type,
            durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
        ])
    );

    const data = {
        labels: Object.keys(avgDurations),
        datasets: [
            {
                label: "Avg. Resolution Time (days)",
                data: Object.values(avgDurations).map((d) => d.toFixed(1)),
                backgroundColor: ["#ffff00", "#9c5708", "#E50914", "#36A2EB"],
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
                        const aveTime = context.parsed.y;
                        return `${type}: Avg. ${aveTime} days`;
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