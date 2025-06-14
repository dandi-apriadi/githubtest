import React, { useState, useEffect } from 'react';
import {
    MdAssessment,
    MdAdd,
    MdEdit,
    MdDelete,
    MdSearch,
    MdFilterList,
    MdOutlineCheckCircle,
    MdOutlineRemoveRedEye,
    MdOutlineInfo,
    MdBarChart,
    MdOutlineFlag
} from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Dummy data for objectives
const dummyObjectives = [
    {
        id: 1,
        strategic_plan_id: 101,
        description: "Menghasilkan lulusan yang kompeten dalam bidang teknik komputer dengan kemampuan adaptasi teknologi yang tinggi",
        target: "90% lulusan memiliki pekerjaan sesuai bidang dalam 6 bulan",
        achievement_indicator: "Persentase lulusan yang bekerja sesuai bidang",
        priority: "Tinggi",
        progress: 75,
        year: "2023-2025"
    },
    {
        id: 2,
        strategic_plan_id: 101,
        description: "Meningkatkan publikasi ilmiah dosen dan mahasiswa di jurnal internasional bereputasi",
        target: "Minimal 10 publikasi internasional per tahun",
        achievement_indicator: "Jumlah publikasi di jurnal Q1 dan Q2",
        priority: "Sedang",
        progress: 60,
        year: "2023-2025"
    },
    {
        id: 3,
        strategic_plan_id: 102,
        description: "Menciptakan ekosistem penelitian kolaboratif dengan industri dan perguruan tinggi lain",
        target: "5 kerjasama penelitian dengan industri per tahun",
        achievement_indicator: "Jumlah MoU dan implementasi kerjasama penelitian",
        priority: "Tinggi",
        progress: 50,
        year: "2023-2025"
    },
    {
        id: 4,
        strategic_plan_id: 102,
        description: "Mengembangkan kurikulum berbasis MBKM yang adaptif terhadap kebutuhan industri",
        target: "100% mata kuliah memiliki komponen praktis dan industri",
        achievement_indicator: "Persentase mata kuliah dengan keterlibatan industri",
        priority: "Tinggi",
        progress: 85,
        year: "2023-2025"
    },
    {
        id: 5,
        strategic_plan_id: 103,
        description: "Meningkatkan kapasitas laboratorium untuk mendukung riset unggulan prodi",
        target: "Akuisisi minimal 3 peralatan riset baru per tahun",
        achievement_indicator: "Jumlah dan kualitas peralatan riset",
        priority: "Sedang",
        progress: 40,
        year: "2023-2025"
    }
];

// Statistics for overview section
const dummyStats = [
    { label: "Total Tujuan", value: 5, icon: <MdOutlineFlag className="text-blue-500" /> },
    { label: "Prioritas Tinggi", value: 3, icon: <MdOutlineInfo className="text-red-500" /> },
    { label: "Rata-rata Progres", value: "62%", icon: <MdBarChart className="text-green-500" /> },
    { label: "Renstra Terkait", value: 3, icon: <MdAssessment className="text-purple-500" /> }
];

const TujuanProdi = () => {
    const [objectives, setObjectives] = useState(dummyObjectives);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        // Initialize AOS animation library
        AOS.init({
            duration: 800,
            once: false,
        });
    }, []);

    // Filter objectives based on search term
    const filteredObjectives = objectives.filter(objective =>
        objective.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        objective.target.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDetail = (objective) => {
        setSelectedObjective(objective);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
    };

    // Priority badge color mapping
    const priorityColorMap = {
        'Tinggi': 'bg-red-100 text-red-800',
        'Sedang': 'bg-yellow-100 text-yellow-800',
        'Rendah': 'bg-green-100 text-green-800'
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Tujuan Program Studi</h1>
                <p className="text-gray-600">
                    Pengelolaan tujuan program studi beserta indikator ketercapaiannya sebagai penjabaran dari visi dan misi
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {dummyStats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow p-4 flex items-center"
                        data-aos="zoom-in"
                        data-aos-delay={index * 100}
                    >
                        <div className="rounded-full bg-gray-100 p-3 mr-4">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <h3 className="text-xl font-bold">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action & Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center shadow-md hover:bg-blue-700 transition-colors"
                    data-aos="fade-right"
                >
                    <MdAdd className="mr-2" /> Tambah Tujuan Baru
                </button>

                <div
                    className="relative w-full sm:w-auto"
                    data-aos="fade-left"
                >
                    <input
                        type="text"
                        placeholder="Cari tujuan program studi..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 md:w-80 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MdSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
            </div>

            {/* Objectives List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredObjectives.map((objective, index) => (
                    <div
                        key={objective.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        data-aos="fade-up"
                        data-aos-delay={index * 150}
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${priorityColorMap[objective.priority]}`}>
                                    {objective.priority}
                                </span>
                                <span className="text-sm text-gray-600">Periode: {objective.year}</span>
                            </div>

                            <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">{objective.description}</h3>

                            <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-1">Target:</p>
                                <p className="text-sm font-medium">{objective.target}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Indikator Ketercapaian:</p>
                                <p className="text-sm font-medium">{objective.achievement_indicator}</p>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-2">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">Progress</span>
                                    <span className="text-sm font-semibold">{objective.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${objective.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="bg-gray-50 px-5 py-3 flex justify-between">
                            <button
                                onClick={() => handleViewDetail(objective)}
                                className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                            >
                                <MdOutlineRemoveRedEye className="mr-1" /> Detail
                            </button>

                            <div className="flex space-x-3">
                                <button className="text-gray-600 hover:text-gray-800">
                                    <MdEdit size={18} />
                                </button>
                                <button className="text-red-500 hover:text-red-700">
                                    <MdDelete size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredObjectives.length === 0 && (
                <div
                    className="bg-white rounded-lg shadow-md p-8 text-center"
                    data-aos="fade-up"
                >
                    <MdOutlineInfo className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Tidak ada tujuan yang ditemukan</h3>
                    <p className="text-gray-600 mb-4">Coba ubah kata kunci pencarian atau tambahkan tujuan baru</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center mx-auto shadow-md hover:bg-blue-700 transition-colors">
                        <MdAdd className="mr-2" /> Tambah Tujuan Baru
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedObjective && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
                        data-aos="zoom-in"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Detail Tujuan Program Studi</h2>
                                <button
                                    onClick={closeDetailModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Deskripsi Tujuan</h3>
                                    <p className="mt-1">{selectedObjective.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Prioritas</h3>
                                        <p className="mt-1">
                                            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded ${priorityColorMap[selectedObjective.priority]}`}>
                                                {selectedObjective.priority}
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Rencana Strategis ID</h3>
                                        <p className="mt-1">{selectedObjective.strategic_plan_id}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Target</h3>
                                        <p className="mt-1">{selectedObjective.target}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Periode</h3>
                                        <p className="mt-1">{selectedObjective.year}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Indikator Ketercapaian</h3>
                                    <p className="mt-1">{selectedObjective.achievement_indicator}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                                    <div className="mt-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{selectedObjective.progress}% Tercapai</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${selectedObjective.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={closeDetailModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Tutup
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    <MdEdit className="inline mr-1" /> Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TujuanProdi;
