import React, { useState, useEffect } from "react";
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdFileUpload,
    MdTimeline,
    MdCheckCircle,
    MdWarning,
    MdErrorOutline,
    MdSearch,
    MdFilterList,
    MdChevronRight,
    MdExpandMore,
    MdDownload,
    MdAssignment
} from "react-icons/md";

// Dummy data for strategic plans
const dummyStrategicPlans = [
    {
        id: 1,
        title: "Pengembangan Kurikulum Berbasis Industri 4.0",
        description: "Menyesuaikan kurikulum program studi dengan kebutuhan industri 4.0 untuk meningkatkan relevansi lulusan di dunia kerja.",
        start_date: "2025-01-01",
        end_date: "2027-12-31",
        status: "Aktif",
        progress: 25,
        document_id: "DOC-2025-001",
        objectives: [
            {
                id: 101,
                description: "Revisi kurikulum dengan masukan dari stakeholders industri",
                target: "Kurikulum baru terimplementasi",
                achievement_indicator: "100% mata kuliah telah disesuaikan",
                priority: "Tinggi",
                progress: 40
            },
            {
                id: 102,
                description: "Pengembangan laboratorium dengan teknologi terkini",
                target: "3 laboratorium baru",
                achievement_indicator: "Laboratorium terbangun dan operasional",
                priority: "Sedang",
                progress: 10
            }
        ]
    },
    {
        id: 2,
        title: "Peningkatan Publikasi Ilmiah Internasional",
        description: "Mendorong dosen dan mahasiswa untuk melakukan penelitian berkualitas tinggi dan publikasi di jurnal internasional bereputasi.",
        start_date: "2025-02-15",
        end_date: "2026-12-31",
        status: "Aktif",
        progress: 35,
        document_id: "DOC-2025-002",
        objectives: [
            {
                id: 201,
                description: "Pelatihan penulisan jurnal internasional",
                target: "Min. 4 pelatihan per tahun",
                achievement_indicator: "Minimal 80% dosen mengikuti pelatihan",
                priority: "Tinggi",
                progress: 50
            },
            {
                id: 202,
                description: "Pendanaan penelitian unggulan",
                target: "20 penelitian didanai",
                achievement_indicator: "Minimal 15 publikasi Q1/Q2",
                priority: "Tinggi",
                progress: 20
            }
        ]
    },
    {
        id: 3,
        title: "Pengembangan Kerjasama Internasional",
        description: "Memperluas jaringan kerjasama dengan universitas dan industri di luar negeri untuk program pertukaran dan riset bersama.",
        start_date: "2025-03-10",
        end_date: "2028-03-10",
        status: "Persiapan",
        progress: 10,
        document_id: "DOC-2025-003",
        objectives: [
            {
                id: 301,
                description: "MoU dengan universitas luar negeri",
                target: "5 MoU baru",
                achievement_indicator: "MoU yang aktif dan implementatif",
                priority: "Sedang",
                progress: 20
            },
            {
                id: 302,
                description: "Program pertukaran mahasiswa",
                target: "10 mahasiswa per tahun",
                achievement_indicator: "Jumlah mahasiswa yang berpartisipasi",
                priority: "Sedang",
                progress: 0
            }
        ]
    }
];

const RencanaStrategis = () => {
    const [strategicPlans, setStrategicPlans] = useState(dummyStrategicPlans);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [showAddModal, setShowAddModal] = useState(false);
    const [expandedPlanId, setExpandedPlanId] = useState(null);

    // Filter plans based on search term and status
    const filteredPlans = strategicPlans.filter((plan) => {
        const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "Semua" || plan.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Toggle expanded view for a plan
    const toggleExpandPlan = (id) => {
        if (expandedPlanId === id) {
            setExpandedPlanId(null);
        } else {
            setExpandedPlanId(id);
        }
    };

    // Function to get status color class
    const getStatusColorClass = (status) => {
        switch (status) {
            case "Aktif":
                return "bg-green-100 text-green-800";
            case "Persiapan":
                return "bg-blue-100 text-blue-800";
            case "Selesai":
                return "bg-purple-100 text-purple-800";
            case "Tertunda":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Function to get progress color class
    const getProgressColorClass = (progress) => {
        if (progress >= 75) return "bg-green-500";
        if (progress >= 50) return "bg-blue-500";
        if (progress >= 25) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="w-full p-4" data-aos="fade-up" data-aos-duration="800">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Rencana Strategis</h1>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                className="btn flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                                onClick={() => setShowAddModal(true)}
                                data-aos="zoom-in"
                                data-aos-delay="200"
                            >
                                <MdAdd size={20} /> Tambah Rencana
                            </button>
                            <button className="btn flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-all">
                                <MdDownload size={20} /> Export
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                placeholder="Cari rencana strategis..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <MdSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>
                        <div className="relative">
                            <select
                                className="appearance-none pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-all"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="Semua">Semua Status</option>
                                <option value="Aktif">Aktif</option>
                                <option value="Persiapan">Persiapan</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Tertunda">Tertunda</option>
                            </select>
                            <MdFilterList className="absolute right-3 top-2.5 text-gray-400" size={20} />
                        </div>
                    </div>

                    {/* Dashboard Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" data-aos="fade-up" data-aos-delay="100">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Rencana</p>
                                    <h3 className="text-2xl font-semibold text-gray-800 mt-1">{strategicPlans.length}</h3>
                                </div>
                                <div className="bg-blue-200 p-2 rounded-full">
                                    <MdAssignment className="text-blue-700" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Rencana Aktif</p>
                                    <h3 className="text-2xl font-semibold text-gray-800 mt-1">
                                        {strategicPlans.filter(plan => plan.status === "Aktif").length}
                                    </h3>
                                </div>
                                <div className="bg-green-200 p-2 rounded-full">
                                    <MdCheckCircle className="text-green-700" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Dalam Persiapan</p>
                                    <h3 className="text-2xl font-semibold text-gray-800 mt-1">
                                        {strategicPlans.filter(plan => plan.status === "Persiapan").length}
                                    </h3>
                                </div>
                                <div className="bg-yellow-200 p-2 rounded-full">
                                    <MdWarning className="text-yellow-700" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Target Tercapai</p>
                                    <h3 className="text-2xl font-semibold text-gray-800 mt-1">
                                        {Math.round(strategicPlans.reduce((acc, plan) => acc + plan.progress, 0) / strategicPlans.length)}%
                                    </h3>
                                </div>
                                <div className="bg-purple-200 p-2 rounded-full">
                                    <MdTimeline className="text-purple-700" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Strategic Plans List */}
                    <div className="space-y-4">
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
                                    data-aos="fade-up"
                                    data-aos-delay={100 + plan.id * 50}
                                >
                                    <div
                                        className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-4 cursor-pointer"
                                        onClick={() => toggleExpandPlan(plan.id)}
                                    >
                                        <div className="flex-grow">
                                            <div className="flex items-start gap-3">
                                                <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColorClass(plan.status)}`}>
                                                    {plan.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-1">{plan.description}</p>

                                            <div className="flex flex-wrap items-center gap-6 mt-3">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs text-gray-500">Periode:</span>
                                                    <span className="text-xs font-medium">
                                                        {new Date(plan.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} -
                                                        {new Date(plan.end_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">Progress:</span>
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${getProgressColorClass(plan.progress)}`}
                                                            style={{ width: `${plan.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-medium">{plan.progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                                            <button className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-all">
                                                <MdEdit size={20} />
                                            </button>
                                            <button className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-all">
                                                <MdDelete size={20} />
                                            </button>
                                            {expandedPlanId === plan.id ? (
                                                <MdExpandMore size={24} className="text-gray-500" />
                                            ) : (
                                                <MdChevronRight size={24} className="text-gray-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {expandedPlanId === plan.id && (
                                        <div className="p-4 border-t bg-white" data-aos="fade-down">
                                            <h4 className="font-medium text-gray-800 mb-3">Target & Sasaran</h4>

                                            {/* Objectives/Targets */}
                                            <div className="space-y-4 mb-6">
                                                {plan.objectives.map((objective) => (
                                                    <div key={objective.id} className="bg-gray-50 border rounded-lg p-3">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                            <div className="flex-grow">
                                                                <p className="font-medium text-gray-800">{objective.description}</p>
                                                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-xs text-gray-500">Target:</span>
                                                                        <span className="text-xs">{objective.target}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-xs text-gray-500">Indikator:</span>
                                                                        <span className="text-xs">{objective.achievement_indicator}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-xs text-gray-500">Prioritas:</span>
                                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${objective.priority === 'Tinggi' ? 'bg-red-100 text-red-800' :
                                                                                objective.priority === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                                                                                    'bg-green-100 text-green-800'
                                                                            }`}>
                                                                            {objective.priority}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full ${getProgressColorClass(objective.progress)}`}
                                                                            style={{ width: `${objective.progress}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-xs font-medium">{objective.progress}%</span>
                                                                </div>
                                                                <button className="p-1.5 rounded-full hover:bg-gray-200 text-gray-600 transition-all">
                                                                    <MdEdit size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Dokumen Pendukung */}
                                            <div className="border-t pt-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-800">Dokumen Pendukung</h4>
                                                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                                                        <MdFileUpload size={18} />
                                                        <span>Upload</span>
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                                                    <MdAssignment className="text-gray-500" size={20} />
                                                    <div className="flex-grow">
                                                        <p className="text-sm font-medium text-gray-700">SK Rencana Strategis</p>
                                                        <p className="text-xs text-gray-500">ID: {plan.document_id}</p>
                                                    </div>
                                                    <button className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition-all">
                                                        <MdDownload size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-end mt-4 pt-3 border-t">
                                                <button className="btn bg-white border hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-all mr-3">
                                                    Tutup
                                                </button>
                                                <button className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all">
                                                    Edit Rencana
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6" data-aos="fade-in">
                                <MdErrorOutline size={40} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-500">Tidak ada rencana strategis yang ditemukan.</p>
                                <p className="text-gray-400 text-sm">Coba ubah filter atau kata kunci pencarian.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Strategic Plan Modal (just a placeholder) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" data-aos="zoom-in">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Rencana Strategis Baru</h2>
                        </div>

                        <div className="p-6">
                            {/* Form fields would go here */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Rencana</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                    <textarea rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                        <input type="date" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir</label>
                                        <input type="date" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option>Persiapan</option>
                                        <option>Aktif</option>
                                        <option>Tertunda</option>
                                        <option>Selesai</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Dokumen Pendukung</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <MdFileUpload className="w-10 h-10 mb-3 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                                            </div>
                                            <input type="file" className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t flex justify-end gap-3">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                                onClick={() => setShowAddModal(false)}
                            >
                                Batal
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RencanaStrategis;
