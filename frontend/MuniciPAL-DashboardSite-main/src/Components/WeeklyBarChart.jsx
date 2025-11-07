import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { Download } from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function WeeklyStatusChart({ Tickets }) {
    const chartRef = useRef(null);

    const now = new Date();
    const day = now.getDay();

    const thisWeekMonday = new Date(now);
    thisWeekMonday.setHours(0, 0, 0, 0);
    const diffToMonday = (day === 0 ? -6 : 1 - day);
    thisWeekMonday.setDate(now.getDate() + diffToMonday);

    //Previous week Monday
    const lastWeekMonday = new Date(thisWeekMonday);
    lastWeekMonday.setDate(thisWeekMonday.getDate() - 7);

    const prevWeekSunday = new Date(thisWeekMonday);
    prevWeekSunday.setDate(thisWeekMonday.getDate() - 1);

    const prevWeekTickets = Tickets.filter((t) => {
        const created = new Date(t.createdAt);
        return created >= lastWeekMonday && created <= prevWeekSunday;
    });

    const types = ['Water', 'Road', 'Electrical', 'Refuse'];
    const statuses = ['Pending', 'In Progress', 'Resolved'];
    const colors = {
        Pending: '#f44336',
        'In Progress': '#ff9800',
        Resolved: '#4caf50',
    };

    const grouped = {};
    types.forEach((type) => {
        grouped[type] = { Pending: 0, 'In Progress': 0, Resolved: 0 };
    });

    prevWeekTickets.forEach((ticket) => {
        if (grouped[ticket.type]){
            grouped[ticket.type][ticket.status] =
                (grouped[ticket.type][ticket.status] || 0) + 1;
        }
    });

    const datasets = statuses.map((status) => ({
        label: status,
        data: types.map((type) => grouped[type][status]),
        backgroundColor: colors[status],
        stack: 'Status',
    }));

    const data = {
        labels: types,
        datasets,
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Tickets Created Last Week by Type and Status',
                font: { size: 16, weight: 'bold' },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const status = context.dataset.label;
                        const count = context.parsed.y;
                        return `${status}: ${count} ticket(s)`;
                    },    
                },
            },
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true, precision: 0 },
        },
    };

    const manageDownload = () => {
        const chart = chartRef.current;
        if (!chart) return;
        const link = document.createElement("a");
        link.href = chart.toBase64Image();
        link.download = `task-type-distribution-${new Date().toISOString().slice(0,10)}.png`;
        link.click();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
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
            <div style={{ height: "575px" }}>
                <Bar ref={chartRef} data={data} options={options} />
            </div>
        </motion.div>
    )

}