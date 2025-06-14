import React, { useState, useEffect } from "react";
import Card from "components/card";
import Chart from "react-apexcharts";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import {
    MdOutlineAssignment,
    MdOutlineWarning,
    MdCheckCircle,
    MdInfoOutline,
    MdArrowUpward,
    MdArrowDownward,
    MdMoreVert,
} from "react-icons/md";

// Register ChartJS components
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const AnalisisKesiapan = () => {
    // Dummy data for the 9 criteria
    const criteriaData = [
        {
            id: 1,
            name: "Visi, Misi, Tujuan, dan Strategi",
            score: 82,
            target: 90,
            status: "good",
            completedDocs: 18,
            totalDocs: 20,
            trend: "up",
        },
        {
            id: 2,
            name: "Tata Pamong, Tata Kelola, dan Kerjasama",
            score: 75,
            target: 85,
            status: "warning",
            completedDocs: 22,
            totalDocs: 30,
            trend: "up",
        },
        {
            id: 3,
            name: "Mahasiswa",
            score: 88,
            target: 85,
            status: "good",
            completedDocs: 15,
            totalDocs: 18,
            trend: "up",
        },
        {
            id: 4,
            name: "SDM",
            score: 65,
            target: 80,
            status: "critical",
            completedDocs: 12,
            totalDocs: 25,
            trend: "down",
        },
        {
            id: 5,
            name: "Keuangan",
            score: 70,
            target: 80,
            status: "warning",
            completedDocs: 14,
            totalDocs: 20,
            trend: "up",
        },
        {
            id: 6,
            name: "Pendidikan",
            score: 85,
            target: 90,
            status: "good",
            completedDocs: 28,
            totalDocs: 35,
            trend: "up",
        },
        {
            id: 7,
            name: "Penelitian",
            score: 72,
            target: 85,
            status: "warning",
            completedDocs: 15,
            totalDocs: 22,
            trend: "up",
        },
        {
            id: 8,
            name: "Pengabdian kepada Masyarakat",
            score: 68,
            target: 80,
            status: "warning",
            completedDocs: 12,
            totalDocs: 18,
            trend: "down",
        },
        {
            id: 9,
            name: "Luaran dan Capaian Tridharma PT",
            score: 78,
            target: 85,
            status: "warning",
            completedDocs: 20,
            totalDocs: 25,
            trend: "up",
        },
    ];

    // Calculate overall readiness score
    const overallScore = Math.round(
        criteriaData.reduce((sum, item) => sum + item.score, 0) / criteriaData.length
    );

    // Data for radar chart
    const radarData = {
        labels: criteriaData.map((item) => `Kriteria ${item.id}`),
        datasets: [
            {
                label: "Skor Saat Ini",
                data: criteriaData.map((item) => item.score),
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                borderColor: "rgba(99, 102, 241, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(99, 102, 241, 1)",
            },
            {
                label: "Target",
                data: criteriaData.map((item) => item.target),
                backgroundColor: "rgba(252, 211, 77, 0.2)",
                borderColor: "rgba(252, 211, 77, 1)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(252, 211, 77, 1)",
            },
        ],
    };

    // Options for radar chart
    const radarOptions = {
        scales: {
            r: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                },
            },
        },
        plugins: {
            legend: {
                position: "bottom",
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    // For the radial bar chart (overall progress)
    const radialBarOptions = {
        chart: {
            height: 280,
            type: "radialBar",
        },
        series: [overallScore],
        colors: [getScoreColor(overallScore)],
        plotOptions: {
            radialBar: {
                hollow: {
                    size: "65%",
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: "30px",
                        fontWeight: "700",
                        formatter: function (val) {
                            return val + "%";
                        },
                    },
                },
            },
        },
        labels: ["Kesiapan"],
    };

    // Get color based on score
    function getScoreColor(score) {
        if (score >= 85) return "#22c55e"; // green
        if (score >= 70) return "#facc15"; // yellow
        return "#ef4444"; // red
    }

    // Get status icon
    function getStatusIcon(status) {
        switch (status) {
            case "good":
                return <MdCheckCircle className="text-green-500 text-xl" />;
            case "warning":
                return <MdOutlineWarning className="text-yellow-500 text-xl" />;
            case "critical":
                return <MdOutlineWarning className="text-red-500 text-xl" />;
            default:
                return <MdInfoOutline className="text-gray-500 text-xl" />;
        }
    }

    // Get trend icon
    function getTrendIcon(trend) {
        if (trend === "up") {
            return <MdArrowUpward className="text-green-500" />;
        } else {
            return <MdArrowDownward className="text-red-500" />;
        }
    }

    // Active filter state
    const [activeFilter, setActiveFilter] = useState("all");

    // Filtered criteria based on status
    const filteredCriteria = activeFilter === "all"
        ? criteriaData
        : criteriaData.filter(item => item.status === activeFilter);

    return (
        <div className="mt-3" data-aos="fade-up" data-aos-duration="800">
            {/* Header */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 mb-5">
                <Card extra="!flex-row items-center">
                    <div className="ml-[18px] flex h-[90px] w-auto flex-col justify-center">
                        <div className="flex items-center justify-between">
                            <p className="font-dm text-sm font-medium text-gray-600">Status Kesiapan Akreditasi</p>
                            <div className={`rounded-full px-2 py-1 text-xs font-medium ${overallScore >= 85 ? "bg-green-100 text-green-800" :
                                overallScore >= 70 ? "bg-yellow-100 text-yellow-800" :
                                    "bg-red-100 text-red-800"
                                }`}>
                                {overallScore >= 85 ? "Siap" :
                                    overallScore >= 70 ? "Perlu Perhatian" :
                                        "Belum Siap"}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                            <h4 className="text-navy-700 text-xl font-bold dark:text-white">
                                {overallScore}%
                            </h4>
                            <div className="flex items-center text-sm">
                                <p className="font-medium text-gray-600">dari target minimum 85%</p>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <p className="font-medium text-gray-600 text-sm">
                                {criteriaData.filter(c => c.status === "good").length} kriteria siap
                            </p>
                            <p className="text-gray-400">•</p>
                            <p className="font-medium text-gray-600 text-sm">
                                {criteriaData.filter(c => c.status === "warning" || c.status === "critical").length} perlu perhatian
                            </p>
                        </div>
                    </div>
                </Card>

                <Card extra="!flex-row items-center">
                    <div className="ml-[18px] flex h-[90px] w-auto flex-col justify-center">
                        <p className="font-dm text-sm font-medium text-gray-600">Kelengkapan Dokumen</p>
                        <div className="flex items-center gap-1 mt-2">
                            <h4 className="text-navy-700 text-xl font-bold dark:text-white">
                                {criteriaData.reduce((sum, item) => sum + item.completedDocs, 0)}
                            </h4>
                            <div className="flex items-center text-sm">
                                <p className="font-medium text-gray-600">
                                    dari {criteriaData.reduce((sum, item) => sum + item.totalDocs, 0)} dokumen yang dibutuhkan
                                </p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="h-2 w-full bg-gray-200 rounded-full">
                                <div
                                    className="h-2 rounded-full bg-indigo-600"
                                    style={{
                                        width: `${Math.round(
                                            (criteriaData.reduce((sum, item) => sum + item.completedDocs, 0) /
                                                criteriaData.reduce((sum, item) => sum + item.totalDocs, 0)) * 100
                                        )}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card extra="!flex-row items-center">
                    <div className="h-[150px] w-full">
                        <Chart
                            options={radialBarOptions}
                            series={radialBarOptions.series}
                            type="radialBar"
                            height="100%"
                            width="100%"
                        />
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-5">
                {/* Radar Chart */}
                <Card extra="col-span-1 lg:col-span-1 h-[440px]">
                    <div className="flex items-center justify-between px-4 pt-4">
                        <h5 className="text-lg font-bold text-navy-700">Perbandingan Skor Kriteria</h5>
                        <button className="text-gray-500 hover:text-gray-700">
                            <MdMoreVert className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="h-[360px] w-full px-4">
                        <Radar data={radarData} options={radarOptions} />
                    </div>
                </Card>

                {/* Criteria List */}
                <Card extra="col-span-1 lg:col-span-2 h-[440px] flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
                        <h5 className="text-lg font-bold text-navy-700 mb-2 sm:mb-0">Detail Kesiapan per Kriteria</h5>
                        <div className="flex flex-wrap sm:flex-nowrap space-x-1 rounded-lg bg-gray-100 p-1">
                            <button
                                onClick={() => setActiveFilter("all")}
                                className={`px-3 py-1 text-xs font-medium rounded-md ${activeFilter === "all"
                                    ? "bg-white shadow-sm text-gray-800"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setActiveFilter("critical")}
                                className={`px-3 py-1 text-xs font-medium rounded-md ${activeFilter === "critical"
                                    ? "bg-white shadow-sm text-gray-800"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Kritis
                            </button>
                            <button
                                onClick={() => setActiveFilter("warning")}
                                className={`px-3 py-1 text-xs font-medium rounded-md ${activeFilter === "warning"
                                    ? "bg-white shadow-sm text-gray-800"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Perhatian
                            </button>
                            <button
                                onClick={() => setActiveFilter("good")}
                                className={`px-3 py-1 text-xs font-medium rounded-md ${activeFilter === "good"
                                    ? "bg-white shadow-sm text-gray-800"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Baik
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {filteredCriteria.length > 0 ? (
                            filteredCriteria.map((criteria) => (
                                <div
                                    key={criteria.id}
                                    className="p-3 mb-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                                    data-aos="fade-up"
                                    data-aos-delay={criteria.id * 50}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg">
                                                <MdOutlineAssignment className="text-indigo-600 text-xl" />
                                            </div>
                                            <div>
                                                <h6 className="font-semibold text-navy-700">
                                                    Kriteria {criteria.id}: {criteria.name}
                                                </h6>
                                                <div className="flex items-center mt-1">
                                                    {getStatusIcon(criteria.status)}
                                                    <span className="ml-1 text-sm font-medium text-gray-600">
                                                        {criteria.score}% dari target {criteria.target}%
                                                    </span>
                                                    <span className="flex items-center ml-2 text-sm">
                                                        {getTrendIcon(criteria.trend)}
                                                        <span className={criteria.trend === "up" ? "text-green-600" : "text-red-600"}>
                                                            {criteria.trend === "up" ? "Meningkat" : "Menurun"}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600 font-medium">
                                                {criteria.completedDocs}/{criteria.totalDocs} dokumen
                                            </div>
                                            <div className="w-16 h-16 relative">
                                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                                    <path
                                                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke="#e5e7eb"
                                                        strokeWidth="3"
                                                    />
                                                    <path
                                                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke={getScoreColor(criteria.score)}
                                                        strokeWidth="3"
                                                        strokeDasharray={`${criteria.score}, 100`}
                                                    />
                                                    <text x="18" y="20.5" className="text-3xl font-semibold" textAnchor="middle" fill={getScoreColor(criteria.score)}>
                                                        {criteria.score}
                                                    </text>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Progres</span>
                                            <span>{Math.round((criteria.completedDocs / criteria.totalDocs) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full"
                                                style={{
                                                    width: `${(criteria.completedDocs / criteria.totalDocs) * 100}%`,
                                                    backgroundColor: getScoreColor(criteria.score)
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Tidak ada kriteria yang sesuai dengan filter</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Recommendation Section */}
            <Card extra="mb-5">
                <div className="px-4 pt-4 pb-3">
                    <h5 className="text-lg font-bold text-navy-700">Rekomendasi Peningkatan Kesiapan</h5>
                    <p className="text-sm text-gray-600 mt-1">Berikut adalah langkah-langkah prioritas untuk meningkatkan skor kesiapan akreditasi</p>
                </div>
                <div className="px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {criteriaData
                            .filter(item => item.status === "critical" || item.status === "warning")
                            .sort((a, b) => a.score - b.score)
                            .slice(0, 3)
                            .map((criteria, index) => (
                                <div
                                    key={criteria.id}
                                    className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="flex items-center mb-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${criteria.status === "critical" ? "bg-red-100" : "bg-yellow-100"
                                            }`}>
                                            <span className="text-lg font-bold">{index + 1}</span>
                                        </div>
                                        <h6 className="font-semibold ml-2">Kriteria {criteria.id}: {criteria.name}</h6>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Terdapat {criteria.totalDocs - criteria.completedDocs} dokumen yang perlu dilengkapi untuk mencapai target {criteria.target}%.
                                    </p>
                                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                                        Lihat detail dokumen
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AnalisisKesiapan;
