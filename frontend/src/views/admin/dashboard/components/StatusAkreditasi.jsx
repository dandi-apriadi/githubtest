import React, { useState } from "react";
import { MdCheckCircle, MdWarning, MdPending, MdArrowForward, MdTimeline, MdBarChart, MdPieChart, MdInfo } from "react-icons/md";
import Card from "components/card";

const StatusAkreditasi = () => {
    // Dummy data for 9 criteria
    const [criteriaData, setCriteriaData] = useState([
        {
            id: 1,
            name: "Visi, Misi, Tujuan, Strategi",
            progress: 85,
            status: "In Progress",
            lastUpdate: "2 hari yang lalu",
            documents: 24,
            completedDocs: 18,
            deadline: "15 Mei 2025"
        },
        {
            id: 2,
            name: "Tata Pamong, Tata Kelola dan Kerja Sama",
            progress: 70,
            status: "In Progress",
            lastUpdate: "5 hari yang lalu",
            documents: 31,
            completedDocs: 21,
            deadline: "20 Mei 2025"
        },
        {
            id: 3,
            name: "Mahasiswa",
            progress: 100,
            status: "Completed",
            lastUpdate: "1 minggu yang lalu",
            documents: 18,
            completedDocs: 18,
            deadline: "10 Mei 2025"
        },
        {
            id: 4,
            name: "SDM",
            progress: 60,
            status: "In Progress",
            lastUpdate: "3 hari yang lalu",
            documents: 27,
            completedDocs: 16,
            deadline: "22 Mei 2025"
        },
        {
            id: 5,
            name: "Keuangan",
            progress: 45,
            status: "In Progress",
            lastUpdate: "1 hari yang lalu",
            documents: 19,
            completedDocs: 8,
            deadline: "25 Mei 2025"
        },
        {
            id: 6,
            name: "Pendidikan",
            progress: 90,
            status: "In Progress",
            lastUpdate: "4 hari yang lalu",
            documents: 33,
            completedDocs: 29,
            deadline: "18 Mei 2025"
        },
        {
            id: 7,
            name: "Penelitian",
            progress: 30,
            status: "Pending",
            lastUpdate: "1 minggu yang lalu",
            documents: 22,
            completedDocs: 6,
            deadline: "30 Mei 2025"
        },
        {
            id: 8,
            name: "Pengabdian Kepada Masyarakat",
            progress: 25,
            status: "Pending",
            lastUpdate: "5 hari yang lalu",
            documents: 17,
            completedDocs: 4,
            deadline: "5 Juni 2025"
        },
        {
            id: 9,
            name: "Luaran dan Capaian Tridharma PT",
            progress: 50,
            status: "In Progress",
            lastUpdate: "2 hari yang lalu",
            documents: 29,
            completedDocs: 14,
            deadline: "28 Mei 2025"
        },
    ]);

    const [selectedCriteria, setSelectedCriteria] = useState(null);

    // Calculate overall progress
    const overallProgress = Math.round(
        criteriaData.reduce((sum, item) => sum + item.progress, 0) / criteriaData.length
    );

    // Get status icon based on status
    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <MdCheckCircle className="text-green-500 text-xl" />;
            case "In Progress":
                return <MdTimeline className="text-blue-500 text-xl" />;
            case "Pending":
                return <MdPending className="text-amber-500 text-xl" />;
            default:
                return <MdWarning className="text-red-500 text-xl" />;
        }
    };

    // Get status color based on progress
    const getProgressColor = (progress) => {
        if (progress === 100) return "bg-green-500";
        if (progress >= 70) return "bg-blue-500";
        if (progress >= 40) return "bg-amber-500";
        return "bg-red-500";
    };

    // Handle criteria click
    const handleCriteriaClick = (criteria) => {
        setSelectedCriteria(criteria.id === selectedCriteria ? null : criteria.id);
    };

    // Filter criteria by status
    const [statusFilter, setStatusFilter] = useState("All");
    const filteredCriteria = statusFilter === "All"
        ? criteriaData
        : criteriaData.filter(criteria => criteria.status === statusFilter);

    return (
        <div className="w-full">
            {/* Overall Progress Summary */}
            <Card extra="mb-5">
                <div className="flex flex-col md:flex-row items-center justify-between p-4">
                    <div className="flex flex-col mb-4 md:mb-0">
                        <h4 className="text-xl font-bold text-navy-700">Status Akreditasi Prodi</h4>
                        <p className="text-sm text-gray-600 mt-1">Periode 2025-2030</p>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Overall Progress */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold">{overallProgress}%</span>
                                </div>
                                <svg className="w-24 h-24" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#eee"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke={overallProgress >= 70 ? "#3B82F6" : overallProgress >= 40 ? "#F59E0B" : "#EF4444"}
                                        strokeWidth="3"
                                        strokeDasharray={`${overallProgress}, 100`}
                                    />
                                </svg>
                            </div>
                            <p className="text-sm font-medium mt-2">Total Progress</p>
                        </div>

                        {/* Status Counts */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center p-2 bg-green-100 rounded-lg">
                                <MdCheckCircle className="text-green-500 text-xl" />
                                <span className="text-lg font-bold">{criteriaData.filter(c => c.status === "Completed").length}</span>
                                <span className="text-xs">Completed</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-blue-100 rounded-lg">
                                <MdTimeline className="text-blue-500 text-xl" />
                                <span className="text-lg font-bold">{criteriaData.filter(c => c.status === "In Progress").length}</span>
                                <span className="text-xs">In Progress</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-amber-100 rounded-lg">
                                <MdPending className="text-amber-500 text-xl" />
                                <span className="text-lg font-bold">{criteriaData.filter(c => c.status === "Pending").length}</span>
                                <span className="text-xs">Pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Filter Options */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => setStatusFilter("All")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === "All" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => setStatusFilter("Completed")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === "Completed" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Completed
                </button>
                <button
                    onClick={() => setStatusFilter("In Progress")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === "In Progress" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    In Progress
                </button>
                <button
                    onClick={() => setStatusFilter("Pending")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === "Pending" ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Pending
                </button>
            </div>

            {/* Hint text for better UX */}
            <div className="flex items-center gap-1 mb-3 text-gray-600 text-sm">
                <MdInfo className="text-blue-500" />
                <span>Klik pada card untuk melihat detail kriteria</span>
            </div>

            {/* Criteria Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCriteria.map((criteria) => (
                    <Card
                        key={criteria.id}
                        extra={`cursor-pointer transform transition-transform hover:scale-[1.02] ${selectedCriteria === criteria.id ? "ring-2 ring-blue-500" : ""
                            }`}
                        onClick={() => handleCriteriaClick(criteria)}
                    >
                        <div className="p-4">
                            {/* Header with Number and Status */}
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                                        {criteria.id}
                                    </div>
                                    <div className="flex items-center">
                                        {getStatusIcon(criteria.status)}
                                        <span className={`text-sm font-medium ml-1 ${criteria.status === "Completed" ? "text-green-500" :
                                            criteria.status === "In Progress" ? "text-blue-500" : "text-amber-500"
                                            }`}>
                                            {criteria.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Updated: {criteria.lastUpdate}
                                </div>
                            </div>

                            {/* Criteria Name */}
                            <h5 className="font-bold text-navy-700 mb-2 line-clamp-2">
                                {criteria.name}
                            </h5>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                                <div
                                    className={`h-2 rounded-full ${getProgressColor(criteria.progress)}`}
                                    style={{ width: `${criteria.progress}%` }}
                                ></div>
                            </div>

                            {/* Progress Stats */}
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{criteria.progress}% Completed</span>
                                <span className="text-gray-600">Deadline: {criteria.deadline}</span>
                            </div>

                            {/* Document Completion */}
                            <div className="mt-3 flex items-center justify-between">
                                <div className="text-sm">
                                    <span className="font-medium">{criteria.completedDocs}/{criteria.documents}</span> dokumen
                                </div>
                                <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                                    Lihat Detail <MdArrowForward className="ml-1" />
                                </button>
                            </div>
                        </div>

                        {/* Extended info when selected */}
                        {selectedCriteria === criteria.id && (
                            <div className="p-4 bg-gray-50 border-t">
                                <h6 className="font-semibold text-sm mb-2">Statistik Dokumen</h6>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-2 rounded shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <MdPieChart className="text-purple-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">Dokumen Lengkap</p>
                                                <p className="font-bold">{Math.round((criteria.completedDocs / criteria.documents) * 100)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-2 rounded shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <MdBarChart className="text-blue-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">Dokumen Tersisa</p>
                                                <p className="font-bold">{criteria.documents - criteria.completedDocs}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 text-center">
                                    <button className="w-full bg-blue-50 text-blue-600 py-1 rounded-md hover:bg-blue-100 text-sm font-medium">
                                        Kelola Dokumen
                                    </button>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default StatusAkreditasi;
