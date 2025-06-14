import React, { useState, useEffect } from "react";
import {
    MdOutlineEditNote,
    MdOutlineCheckCircle,
    MdOutlineHistory,
    MdOutlineInsertChart,
    MdOutlineDescription,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdOutlineFileDownload,
    MdOutlineFileUpload,
    MdOutlineTimeline,
    MdOutlineInfo,
    MdOutlineAddCircleOutline
} from "react-icons/md";
import Card from "components/card";

// Dummy data for the dashboard
const visiMisiData = {
    visi: "Menjadi program studi teknik komputer terkemuka yang unggul dalam pengembangan teknologi digital dan sistem cerdas di tingkat nasional dan internasional pada tahun 2030.",
    misi: [
        "Menyelenggarakan pendidikan teknik komputer berkualitas tinggi dengan kurikulum berbasis industri dan teknologi terkini.",
        "Melaksanakan penelitian inovatif di bidang sistem digital, embedded system, dan kecerdasan buatan.",
        "Mengembangkan pengabdian kepada masyarakat melalui transfer teknologi dan solusi berbasis komputasi.",
        "Membangun kerjasama strategis dengan industri, akademisi, dan komunitas untuk memperkuat ekosistem inovasi."
    ],
    tujuan: [
        "Menghasilkan lulusan yang kompeten dan adaptif terhadap perkembangan teknologi komputer.",
        "Menghasilkan penelitian dan inovasi yang memberikan kontribusi signifikan pada perkembangan ilmu pengetahuan dan teknologi.",
        "Mengimplementasikan solusi teknologi komputer untuk menyelesaikan permasalahan di masyarakat.",
        "Menjadi mitra strategis bagi industri dan institusi dalam pengembangan teknologi komputer."
    ],
    lastUpdated: "15 April 2025",
    approvedBy: "Dr. Ahmad Fauzi, M.Kom",
    documentId: "VM-2025-04-001"
};

const strategicPlans = [
    {
        id: 1,
        title: "Peningkatan Kualitas Pembelajaran",
        period: "2025-2027",
        progress: 65,
        objectives: 8,
        completedObjectives: 5,
        status: "On Track"
    },
    {
        id: 2,
        title: "Pengembangan Riset dan Inovasi",
        period: "2025-2028",
        progress: 42,
        objectives: 6,
        completedObjectives: 2,
        status: "On Track"
    },
    {
        id: 3,
        title: "Penguatan Kerjasama Industri",
        period: "2025-2026",
        progress: 78,
        objectives: 5,
        completedObjectives: 4,
        status: "Ahead"
    },
    {
        id: 4,
        title: "Internasionalisasi Program Studi",
        period: "2025-2029",
        progress: 25,
        objectives: 7,
        completedObjectives: 1,
        status: "Behind"
    }
];

const achievements = [
    {
        id: 1,
        indicator: "Tingkat kepuasan mahasiswa",
        target: "85%",
        current: "82%",
        status: "On Track"
    },
    {
        id: 2,
        indicator: "Jumlah publikasi internasional",
        target: "25",
        current: "18",
        status: "On Track"
    },
    {
        id: 3,
        indicator: "Rata-rata waktu tunggu lulusan",
        target: "3 bulan",
        current: "3.5 bulan",
        status: "Behind"
    },
    {
        id: 4,
        indicator: "Jumlah kerjasama industri aktif",
        target: "15",
        current: "17",
        status: "Ahead"
    }
];

const documents = [
    {
        id: 1,
        title: "Dokumen Visi Misi 2025-2030",
        type: "PDF",
        uploadDate: "10 Maret 2025",
        uploadedBy: "Dr. Budi Santoso",
        size: "2.4 MB"
    },
    {
        id: 2,
        title: "Rencana Strategis Prodi",
        type: "DOCX",
        uploadDate: "18 Maret 2025",
        uploadedBy: "Prof. Dewi Anggraeni",
        size: "3.8 MB"
    },
    {
        id: 3,
        title: "SK Penetapan Visi Misi",
        type: "PDF",
        uploadDate: "5 April 2025",
        uploadedBy: "Dr. Ahmad Fauzi",
        size: "1.2 MB"
    },
    {
        id: 4,
        title: "Hasil Workshop Perumusan Visi Misi",
        type: "PDF",
        uploadDate: "28 Februari 2025",
        uploadedBy: "Dr. Siti Rahayu",
        size: "5.6 MB"
    }
];

const VisiMisiDashboard = () => {
    const [activeTab, setActiveTab] = useState("visiMisi");
    const [expandedPlan, setExpandedPlan] = useState(null);

    useEffect(() => {
        // Initialize AOS animations
        if (typeof window !== "undefined") {
            const AOS = require("aos");
            AOS.init({
                duration: 1000,
                once: true,
            });
        }
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Ahead":
                return "text-green-500";
            case "On Track":
                return "text-blue-500";
            case "Behind":
                return "text-orange-500";
            default:
                return "text-gray-500";
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 75) return "bg-green-500";
        if (progress >= 50) return "bg-blue-500";
        if (progress >= 25) return "bg-yellow-500";
        return "bg-red-500";
    };

    const togglePlanExpansion = (id) => {
        if (expandedPlan === id) {
            setExpandedPlan(null);
        } else {
            setExpandedPlan(id);
        }
    };

    return (
        <div className="mt-3 grid grid-cols-1 gap-5">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4" data-aos="fade-down">
                <div>
                    <h1 className="text-2xl font-bold text-navy-700">Visi, Misi, Tujuan & Strategi</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manajemen dan pemantauan komprehensif terhadap visi, misi, tujuan dan strategi program studi
                    </p>
                </div>
                <div className="mt-3 md:mt-0 flex space-x-2">
                    <button className="px-4 py-2 bg-brand-500 text-white rounded-md flex items-center text-sm">
                        <MdOutlineEditNote className="mr-1" size={18} />
                        Edit Data
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md flex items-center text-sm">
                        <MdOutlineFileDownload className="mr-1" size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5" data-aos="fade-up" data-aos-delay="100">
                <Card extra="!p-4 flex" data-aos="zoom-in" data-aos-delay="150">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Terakhir Diperbarui</p>
                            <h4 className="text-xl font-bold text-navy-700 mt-1">{visiMisiData.lastUpdated}</h4>
                            <p className="text-xs text-gray-500 mt-1">oleh {visiMisiData.approvedBy}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-lightPrimary flex items-center justify-center">
                            <MdOutlineHistory className="text-brand-500" size={24} />
                        </div>
                    </div>
                </Card>

                <Card extra="!p-4 flex" data-aos="zoom-in" data-aos-delay="200">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Rencana Strategis</p>
                            <h4 className="text-xl font-bold text-navy-700 mt-1">{strategicPlans.length}</h4>
                            <p className="text-xs text-gray-500 mt-1">aktif saat ini</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-lightPrimary flex items-center justify-center">
                            <MdOutlineTimeline className="text-brand-500" size={24} />
                        </div>
                    </div>
                </Card>

                <Card extra="!p-4 flex" data-aos="zoom-in" data-aos-delay="250">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Indikator Capaian</p>
                            <h4 className="text-xl font-bold text-navy-700 mt-1">{achievements.length}</h4>
                            <p className="text-xs text-gray-500 mt-1">sedang dipantau</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-lightPrimary flex items-center justify-center">
                            <MdOutlineInsertChart className="text-brand-500" size={24} />
                        </div>
                    </div>
                </Card>

                <Card extra="!p-4 flex" data-aos="zoom-in" data-aos-delay="300">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Dokumen</p>
                            <h4 className="text-xl font-bold text-navy-700 mt-1">{documents.length}</h4>
                            <p className="text-xs text-gray-500 mt-1">terunggah</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-lightPrimary flex items-center justify-center">
                            <MdOutlineDescription className="text-brand-500" size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b mb-5" data-aos="fade-right">
                <button
                    onClick={() => setActiveTab("visiMisi")}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === "visiMisi"
                        ? "text-brand-500 border-b-2 border-brand-500"
                        : "text-gray-600 hover:text-brand-500"
                        }`}
                >
                    Visi & Misi
                </button>
                <button
                    onClick={() => setActiveTab("strategicPlans")}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === "strategicPlans"
                        ? "text-brand-500 border-b-2 border-brand-500"
                        : "text-gray-600 hover:text-brand-500"
                        }`}
                >
                    Rencana Strategis
                </button>
                <button
                    onClick={() => setActiveTab("achievements")}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === "achievements"
                        ? "text-brand-500 border-b-2 border-brand-500"
                        : "text-gray-600 hover:text-brand-500"
                        }`}
                >
                    Capaian
                </button>
                <button
                    onClick={() => setActiveTab("documents")}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === "documents"
                        ? "text-brand-500 border-b-2 border-brand-500"
                        : "text-gray-600 hover:text-brand-500"
                        }`}
                >
                    Dokumen
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "visiMisi" && (
                <div data-aos="fade-up">
                    <Card extra="!p-6">
                        <div className="mb-6" data-aos="fade-up">
                            <h3 className="text-lg font-bold text-navy-700 mb-3 flex items-center">
                                <MdOutlineInfo className="mr-2" size={20} />
                                Visi Program Studi
                            </h3>
                            <div className="p-4 bg-lightPrimary rounded-lg border border-gray-100">
                                <p className="text-gray-700">{visiMisiData.visi}</p>
                            </div>
                        </div>

                        <div className="mb-6" data-aos="fade-up" data-aos-delay="100">
                            <h3 className="text-lg font-bold text-navy-700 mb-3 flex items-center">
                                <MdOutlineInfo className="mr-2" size={20} />
                                Misi Program Studi
                            </h3>
                            <div className="p-4 bg-lightPrimary rounded-lg border border-gray-100">
                                <ul className="list-disc pl-5 space-y-2">
                                    {visiMisiData.misi.map((item, index) => (
                                        <li key={index} className="text-gray-700">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="200">
                            <h3 className="text-lg font-bold text-navy-700 mb-3 flex items-center">
                                <MdOutlineInfo className="mr-2" size={20} />
                                Tujuan Program Studi
                            </h3>
                            <div className="p-4 bg-lightPrimary rounded-lg border border-gray-100">
                                <ul className="list-disc pl-5 space-y-2">
                                    {visiMisiData.tujuan.map((item, index) => (
                                        <li key={index} className="text-gray-700">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === "strategicPlans" && (
                <div data-aos="fade-up">
                    <Card extra="!p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-navy-700">Rencana Strategis</h3>
                            <button className="px-3 py-1.5 bg-brand-500 text-white rounded-md flex items-center text-sm">
                                <MdOutlineAddCircleOutline className="mr-1" size={16} />
                                Tambah Baru
                            </button>
                        </div>

                        <div className="space-y-4">
                            {strategicPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="border border-gray-200 rounded-lg overflow-hidden"
                                    data-aos="fade-up"
                                    data-aos-delay={100 + (plan.id * 50)}
                                >
                                    <div
                                        className="p-4 bg-white flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
                                        onClick={() => togglePlanExpansion(plan.id)}
                                    >
                                        <div>
                                            <h4 className="text-base font-semibold text-navy-700">{plan.title}</h4>
                                            <p className="text-sm text-gray-600">Periode: {plan.period}</p>
                                        </div>
                                        <div className="flex items-center mt-3 md:mt-0">
                                            <div className="mr-6">
                                                <div className="flex items-center">
                                                    <span className="mr-2 text-sm font-medium">{plan.progress}%</span>
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                                                        <div
                                                            className={`h-full rounded-full ${getProgressColor(plan.progress)}`}
                                                            style={{ width: `${plan.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <p className="text-xs mt-1">
                                                    <span className={getStatusColor(plan.status)}>
                                                        {plan.status}
                                                    </span>
                                                </p>
                                            </div>
                                            {expandedPlan === plan.id ? (
                                                <MdKeyboardArrowUp size={20} />
                                            ) : (
                                                <MdKeyboardArrowDown size={20} />
                                            )}
                                        </div>
                                    </div>

                                    {expandedPlan === plan.id && (
                                        <div className="p-4 bg-lightPrimary border-t border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Detail Capaian</h5>
                                                    <div className="bg-white p-3 rounded-md">
                                                        <div className="flex justify-between mb-1">
                                                            <p className="text-xs text-gray-600">Objektif selesai:</p>
                                                            <p className="text-xs font-medium">{plan.completedObjectives}/{plan.objectives}</p>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-gray-200 rounded-full">
                                                            <div
                                                                className={`h-full rounded-full ${getProgressColor(
                                                                    (plan.completedObjectives / plan.objectives) * 100
                                                                )}`}
                                                                style={{ width: `${(plan.completedObjectives / plan.objectives) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Tindakan</h5>
                                                    <div className="bg-white p-3 rounded-md flex flex-wrap gap-2">
                                                        <button className="px-2 py-1 text-xs bg-brand-500 text-white rounded">
                                                            Detail
                                                        </button>
                                                        <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                                                            Update
                                                        </button>
                                                        <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 border border-gray-200 rounded">
                                                            Lihat Dokumen
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === "achievements" && (
                <div data-aos="fade-up">
                    <Card extra="!p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-navy-700">Indikator Capaian</h3>
                            <button className="px-3 py-1.5 bg-brand-500 text-white rounded-md flex items-center text-sm">
                                <MdOutlineAddCircleOutline className="mr-1" size={16} />
                                Tambah Indikator
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px]">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Indikator</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Target</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Capaian Saat Ini</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {achievements.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={index !== achievements.length - 1 ? "border-b border-gray-200" : ""}
                                            data-aos="fade-up"
                                            data-aos-delay={100 + (index * 50)}
                                        >
                                            <td className="py-3 px-4 text-sm text-gray-700">{item.indicator}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{item.target}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{item.current}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${item.status === "Ahead" ? "bg-green-100 text-green-700" :
                                                    item.status === "On Track" ? "bg-blue-100 text-blue-700" :
                                                        "bg-orange-100 text-orange-700"
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex space-x-2">
                                                    <button className="p-1 text-brand-500 rounded hover:bg-gray-100">
                                                        <MdOutlineEditNote size={18} />
                                                    </button>
                                                    <button className="p-1 text-blue-500 rounded hover:bg-gray-100">
                                                        <MdOutlineInsertChart size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === "documents" && (
                <div data-aos="fade-up">
                    <Card extra="!p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-navy-700">Dokumen Terkait</h3>
                            <button className="px-3 py-1.5 bg-brand-500 text-white rounded-md flex items-center text-sm">
                                <MdOutlineFileUpload className="mr-1" size={16} />
                                Unggah Dokumen
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {documents.map((doc, index) => (
                                <div
                                    key={doc.id}
                                    className="border border-gray-200 rounded-lg p-4 flex items-start"
                                    data-aos="fade-up"
                                    data-aos-delay={100 + (index * 50)}
                                >
                                    <div className="h-10 w-10 bg-lightPrimary rounded-lg flex items-center justify-center mr-3">
                                        <MdOutlineDescription className="text-brand-500" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-navy-700">{doc.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Diunggah pada {doc.uploadDate} • {doc.size}
                                        </p>
                                        <div className="mt-3 flex space-x-2">
                                            <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded flex items-center">
                                                <MdOutlineFileDownload className="mr-1" size={14} />
                                                Unduh
                                            </button>
                                            <button className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800">
                                                Lihat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default VisiMisiDashboard;
