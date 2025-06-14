import React, { useState } from "react";
import {
    MdOutlineAssessment,
    MdOutlineSchool,
    MdPeopleOutline,
    MdOutlinePersonSearch,
    MdAttachMoney,
    MdOutlineMenuBook,
    MdOutlineBiotech,
    MdOutlineVolunteerActivism,
    MdOutlineWorkspacePremium,
    MdInfoOutline,
    MdFilterList,
    MdArrowUpward,
    MdArrowDownward,
} from "react-icons/md";
import Card from "components/card";

const ProgresPengumpulanData = () => {
    const [sortOrder, setSortOrder] = useState("desc");
    const [filterActive, setFilterActive] = useState(false);

    // Dummy data for 9 criteria
    const criteriaData = [
        {
            id: 1,
            name: "Visi, Misi, Tujuan, Strategi",
            progress: 85,
            documents: 24,
            pendingValidation: 3,
            lastUpdate: "2 hari yang lalu",
            icon: <MdOutlineAssessment className="text-2xl" />,
        },
        {
            id: 2,
            name: "Tata Pamong, Tata Kelola dan Kerja Sama",
            progress: 60,
            documents: 18,
            pendingValidation: 7,
            lastUpdate: "1 hari yang lalu",
            icon: <MdOutlineSchool className="text-2xl" />,
        },
        {
            id: 3,
            name: "Mahasiswa",
            progress: 75,
            documents: 30,
            pendingValidation: 5,
            lastUpdate: "3 hari yang lalu",
            icon: <MdPeopleOutline className="text-2xl" />,
        },
        {
            id: 4,
            name: "SDM",
            progress: 90,
            documents: 28,
            pendingValidation: 2,
            lastUpdate: "1 hari yang lalu",
            icon: <MdOutlinePersonSearch className="text-2xl" />,
        },
        {
            id: 5,
            name: "Keuangan",
            progress: 45,
            documents: 15,
            pendingValidation: 8,
            lastUpdate: "5 hari yang lalu",
            icon: <MdAttachMoney className="text-2xl" />,
        },
        {
            id: 6,
            name: "Pendidikan",
            progress: 80,
            documents: 32,
            pendingValidation: 4,
            lastUpdate: "2 hari yang lalu",
            icon: <MdOutlineMenuBook className="text-2xl" />,
        },
        {
            id: 7,
            name: "Penelitian",
            progress: 50,
            documents: 20,
            pendingValidation: 10,
            lastUpdate: "4 hari yang lalu",
            icon: <MdOutlineBiotech className="text-2xl" />,
        },
        {
            id: 8,
            name: "Pengabdian Kepada Masyarakat",
            progress: 65,
            documents: 18,
            pendingValidation: 6,
            lastUpdate: "3 hari yang lalu",
            icon: <MdOutlineVolunteerActivism className="text-2xl" />,
        },
        {
            id: 9,
            name: "Luaran dan Capaian Tridharma PT",
            progress: 70,
            documents: 22,
            pendingValidation: 4,
            lastUpdate: "1 hari yang lalu",
            icon: <MdOutlineWorkspacePremium className="text-2xl" />,
        },
    ];

    // Calculate overall progress
    const overallProgress = Math.floor(
        criteriaData.reduce((sum, item) => sum + item.progress, 0) / criteriaData.length
    );

    // Sort criteria data based on progress
    const sortedCriteriaData = [...criteriaData].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.progress - b.progress;
        } else {
            return b.progress - a.progress;
        }
    });

    // Filter criteria with progress less than 70% if filter is active
    const displayedCriteria = filterActive
        ? sortedCriteriaData.filter((item) => item.progress < 70)
        : sortedCriteriaData;

    // Function to determine progress bar color
    const getProgressColor = (progress) => {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 60) return "bg-blue-500";
        if (progress >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };

    // Function to handle sort toggle
    const handleSortToggle = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <div data-aos="fade-up" data-aos-duration="800">
            <Card extra="w-full p-4">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h4 className="text-xl font-bold text-navy-700">Progres Pengumpulan Data</h4>
                        <p className="text-sm text-gray-600 mt-1">
                            Status kelengkapan data 9 kriteria akreditasi
                        </p>
                    </div>
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                        <button
                            onClick={() => setFilterActive(!filterActive)}
                            className={`flex items-center text-sm py-2 px-3 rounded-lg ${filterActive ? "bg-gray-200" : "bg-gray-100"
                                } hover:bg-gray-200 transition-colors`}
                        >
                            <MdFilterList className="mr-1" />
                            {filterActive ? "Semua Kriteria" : "Perlu Perhatian"}
                        </button>
                        <button
                            onClick={handleSortToggle}
                            className="flex items-center text-sm py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Urutkan
                            {sortOrder === "asc" ? (
                                <MdArrowUpward className="ml-1" />
                            ) : (
                                <MdArrowDownward className="ml-1" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <h5 className="font-semibold text-navy-700">Total Progres</h5>
                        <span className="font-bold text-xl">{overallProgress}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getProgressColor(overallProgress)} transition-all duration-500`}
                            style={{ width: `${overallProgress}%` }}
                        ></div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Total Dokumen</p>
                            <p className="text-xl font-bold">
                                {criteriaData.reduce((sum, item) => sum + item.documents, 0)}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Menunggu Validasi</p>
                            <p className="text-xl font-bold text-orange-500">
                                {criteriaData.reduce((sum, item) => sum + item.pendingValidation, 0)}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Kriteria Lengkap</p>
                            <p className="text-xl font-bold text-green-500">
                                {criteriaData.filter((item) => item.progress >= 80).length}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Perlu Perhatian</p>
                            <p className="text-xl font-bold text-red-500">
                                {criteriaData.filter((item) => item.progress < 60).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Detail Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayedCriteria.map((criteria) => (
                        <div
                            key={criteria.id}
                            className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start">
                                <div className="p-2 rounded-full bg-gray-100 mr-3">
                                    {criteria.icon}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <h6 className="font-semibold text-navy-700">{criteria.name}</h6>
                                        <span
                                            className={`py-1 px-2 text-xs font-medium rounded-full ${criteria.progress >= 80
                                                    ? "bg-green-100 text-green-800"
                                                    : criteria.progress >= 60
                                                        ? "bg-blue-100 text-blue-800"
                                                        : criteria.progress >= 40
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {criteria.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                                        <div
                                            className={`h-full ${getProgressColor(
                                                criteria.progress
                                            )} transition-all duration-500`}
                                            style={{ width: `${criteria.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span className="flex items-center">
                                            <MdInfoOutline className="mr-1" /> {criteria.documents} dokumen
                                        </span>
                                        <span>
                                            {criteria.pendingValidation > 0 ? (
                                                <span className="text-orange-500">
                                                    {criteria.pendingValidation} menunggu validasi
                                                </span>
                                            ) : (
                                                <span className="text-green-500">Semua tervalidasi</span>
                                            )}
                                        </span>
                                        <span>Update: {criteria.lastUpdate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state when filter is active but no data to show */}
                {filterActive && displayedCriteria.length === 0 && (
                    <div className="text-center py-6">
                        <p className="text-gray-500">Semua kriteria sudah mencapai progres minimal 70%</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ProgresPengumpulanData;
