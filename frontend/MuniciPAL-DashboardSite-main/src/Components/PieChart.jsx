import React, { useRef } from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export default function PieChart({ tasks}) {
    const chartRef = useRef(null);

    const typeCount = tasks.reduce((acc, task) => {
        acc[task.type] = (acc[task.type] || 0) + 1;
        return acc;
    }, {});

    const total= tasks.length;
    const types = Object.keys(typeCount);
    const counts = Object.values(typeCount);
    const percentValues = Object.values(typeCount).map((count) => 
        ((count / total) * 100).toFixed(1));

    const data = {
        labels: types,
        datasets: [
            {
                data: percentValues,
                backgroundColor: ["#36A2EB", "#E50914", "#ffff00", "#9c5708"],
                hoverOffset: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        animation: {
            duration: 1000,
            easing: "easeOutQuart",
        },
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: "Task Type Distribution ",
                font: { size: 16, weight: "bold" },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const type = context.label;
                        const percent = context.parsed;
                        const count = typeCount[type];
                        return `${type}: ${count} tasks (${percent}%)`;
                    },
                },
            },
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
            <Pie ref={chartRef} data={data} options={options} />
        </motion.div>
    )
}