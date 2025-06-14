import { useState, useEffect } from "react";
import {
    MdVisibility,
    MdFlag,
    MdTrackChanges,
    MdTimeline,
    MdTrendingUp,
    MdCheck,
    MdEdit,
    MdSave,
    MdCancel,
    MdAddCircle,
    MdExpandMore,
    MdExpandLess
} from "react-icons/md";
import Card from "components/card";
import AOS from 'aos';
import 'aos/dist/aos.css';

const VisiMisi = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Dummy data for initial design
    const [visiMisiData, setVisiMisiData] = useState({
        visi: "Menjadi program studi teknik komputer yang unggul dan diakui secara nasional dan internasional dalam pendidikan, penelitian, dan pengabdian kepada masyarakat yang berfokus pada teknologi komputer dan sistem cerdas pada tahun 2030.",
        misi: [
            "Menyelenggarakan pendidikan berkualitas tinggi di bidang teknik komputer yang relevan dengan kebutuhan industri dan masyarakat.",
            "Melaksanakan penelitian inovatif di bidang teknologi komputer dan sistem cerdas yang berkontribusi pada kemajuan ilmu pengetahuan dan teknologi.",
            "Menerapkan hasil penelitian untuk menyelesaikan permasalahan di masyarakat melalui kegiatan pengabdian.",
            "Menjalin kerjasama strategis dengan industri, institusi pendidikan, dan masyarakat baik di tingkat nasional maupun internasional."
        ],
        tujuan: [
            "Menghasilkan lulusan yang kompeten, adaptif, dan beretika dalam bidang teknik komputer.",
            "Menghasilkan penelitian berkualitas dan berimpact di bidang teknologi komputer dan sistem cerdas.",
            "Mengimplementasikan hasil penelitian dalam bentuk solusi teknologi yang bermanfaat bagi masyarakat.",
            "Membangun networking dan kerjasama yang berkelanjutan dengan stakeholders."
        ],
        strategi: [
            {
                id: 1,
                name: "Pengembangan Kurikulum Berbasis KKNI dan SKKNI",
                timeline: "2023-2025",
                status: "On Track",
                progress: 65,
                kpi: [
                    { name: "Kurikulum direvisi sesuai standar industri", target: "100%", achieved: "65%" },
                    { name: "Jumlah mata kuliah project-based", target: "12", achieved: "8" }
                ]
            },
            {
                id: 2,
                name: "Peningkatan Kualifikasi dan Kompetensi Dosen",
                timeline: "2023-2026",
                status: "On Track",
                progress: 40,
                kpi: [
                    { name: "Dosen dengan gelar S3", target: "40%", achieved: "25%" },
                    { name: "Dosen dengan sertifikasi industri", target: "75%", achieved: "45%" }
                ]
            },
            {
                id: 3,
                name: "Penguatan Infrastruktur Riset",
                timeline: "2024-2027",
                status: "Planning",
                progress: 15,
                kpi: [
                    { name: "Jumlah laboratorium riset", target: "5", achieved: "2" },
                    { name: "Penelitian kolaboratif dengan industri", target: "10/tahun", achieved: "4/tahun" }
                ]
            },
            {
                id: 4,
                name: "Membangun Ekosistem Startup dan Inovasi",
                timeline: "2025-2028",
                status: "Not Started",
                progress: 0,
                kpi: [
                    { name: "Startup yang dilahirkan", target: "5/tahun", achieved: "0" },
                    { name: "Produk inovatif yang dihasilkan", target: "8/tahun", achieved: "0" }
                ]
            }
        ]
    });

    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({ ...visiMisiData });
    const [activeStrategy, setActiveStrategy] = useState(null);

    const handleEdit = () => {
        setEditData({ ...visiMisiData });
        setEditMode(true);
    };

    const handleSave = () => {
        setVisiMisiData({ ...editData });
        setEditMode(false);
        // Here would be API call to save data
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "On Track": return "text-green-500 bg-green-50";
            case "At Risk": return "text-yellow-500 bg-yellow-50";
            case "Delayed": return "text-red-500 bg-red-50";
            case "Planning": return "text-blue-500 bg-blue-50";
            case "Not Started": return "text-gray-500 bg-gray-50";
            default: return "text-gray-500 bg-gray-50";
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 75) return "bg-green-500";
        if (progress >= 50) return "bg-blue-500";
        if (progress >= 25) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="mt-3 grid grid-cols-1 gap-5">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div data-aos="fade-right">
                    <h4 className="text-2xl font-bold text-navy-700">
                        Visi, Misi, Tujuan & Strategi
                    </h4>
                    <p className="text-gray-600">
                        Panduan arah pengembangan Program Studi Teknik Komputer
                    </p>
                </div>
                <div data-aos="fade-left">
                    {editMode ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                            >
                                <MdSave /> Simpan
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                            >
                                <MdCancel /> Batal
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                        >
                            <MdEdit /> Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Visi Section */}
            <Card
                extra="flex flex-col p-6"
                data-aos="fade-up"
            >
                <div className="flex items-center mb-4">
                    <MdVisibility className="h-8 w-8 text-blue-500 mr-3" />
                    <h5 className="text-xl font-bold text-navy-700">Visi</h5>
                </div>
                <div className="ml-11">
                    {editMode ? (
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            value={editData.visi}
                            onChange={(e) => setEditData({ ...editData, visi: e.target.value })}
                        />
                    ) : (
                        <p className="text-gray-600 text-justify leading-relaxed">
                            "{visiMisiData.visi}"
                        </p>
                    )}
                </div>
            </Card>

            {/* Misi Section */}
            <Card
                extra="flex flex-col p-6"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <div className="flex items-center mb-4">
                    <MdFlag className="h-8 w-8 text-indigo-500 mr-3" />
                    <h5 className="text-xl font-bold text-navy-700">Misi</h5>
                </div>
                <ul className="space-y-4 ml-11">
                    {editMode ? (
                        <>
                            {editData.misi.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-500 text-sm font-bold flex-shrink-0 mt-1">
                                        {index + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            rows="2"
                                            value={item}
                                            onChange={(e) => {
                                                const newMisi = [...editData.misi];
                                                newMisi[index] = e.target.value;
                                                setEditData({ ...editData, misi: newMisi });
                                            }}
                                        />
                                    </div>
                                    <button
                                        className="p-2 text-red-500 hover:text-red-700 transition-all"
                                        onClick={() => {
                                            const newMisi = editData.misi.filter((_, i) => i !== index);
                                            setEditData({ ...editData, misi: newMisi });
                                        }}
                                    >
                                        <MdCancel className="h-5 w-5" />
                                    </button>
                                </li>
                            ))}
                            <button
                                className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 transition-all mt-2"
                                onClick={() => {
                                    setEditData({ ...editData, misi: [...editData.misi, ""] });
                                }}
                            >
                                <MdAddCircle className="h-5 w-5" /> Tambah Misi
                            </button>
                        </>
                    ) : (
                        visiMisiData.misi.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-3"
                                data-aos="fade-right"
                                data-aos-delay={150 + (index * 50)}
                            >
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-500 text-sm font-bold flex-shrink-0 mt-1">
                                    {index + 1}
                                </div>
                                <p className="text-gray-600">{item}</p>
                            </li>
                        ))
                    )}
                </ul>
            </Card>

            {/* Tujuan Section */}
            <Card
                extra="flex flex-col p-6"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                <div className="flex items-center mb-4">
                    <MdTrackChanges className="h-8 w-8 text-purple-500 mr-3" />
                    <h5 className="text-xl font-bold text-navy-700">Tujuan</h5>
                </div>
                <ul className="space-y-4 ml-11">
                    {editMode ? (
                        <>
                            {editData.tujuan.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-500 text-sm font-bold flex-shrink-0 mt-1">
                                        {index + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            rows="2"
                                            value={item}
                                            onChange={(e) => {
                                                const newTujuan = [...editData.tujuan];
                                                newTujuan[index] = e.target.value;
                                                setEditData({ ...editData, tujuan: newTujuan });
                                            }}
                                        />
                                    </div>
                                    <button
                                        className="p-2 text-red-500 hover:text-red-700 transition-all"
                                        onClick={() => {
                                            const newTujuan = editData.tujuan.filter((_, i) => i !== index);
                                            setEditData({ ...editData, tujuan: newTujuan });
                                        }}
                                    >
                                        <MdCancel className="h-5 w-5" />
                                    </button>
                                </li>
                            ))}
                            <button
                                className="flex items-center gap-1 text-purple-500 hover:text-purple-700 transition-all mt-2"
                                onClick={() => {
                                    setEditData({ ...editData, tujuan: [...editData.tujuan, ""] });
                                }}
                            >
                                <MdAddCircle className="h-5 w-5" /> Tambah Tujuan
                            </button>
                        </>
                    ) : (
                        visiMisiData.tujuan.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-3"
                                data-aos="fade-right"
                                data-aos-delay={250 + (index * 50)}
                            >
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-500 text-sm font-bold flex-shrink-0 mt-1">
                                    {index + 1}
                                </div>
                                <p className="text-gray-600">{item}</p>
                            </li>
                        ))
                    )}
                </ul>
            </Card>

            {/* Strategi Section */}
            <Card
                extra="flex flex-col p-6"
                data-aos="fade-up"
                data-aos-delay="300"
            >
                <div className="flex items-center mb-4">
                    <MdTimeline className="h-8 w-8 text-teal-500 mr-3" />
                    <h5 className="text-xl font-bold text-navy-700">Strategi Pencapaian</h5>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 ml-11">
                    {visiMisiData.strategi.map((strategy, index) => (
                        <div
                            key={strategy.id}
                            className={`border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${activeStrategy === strategy.id ? 'border-teal-500 shadow-md' : 'border-gray-200'}`}
                            data-aos="zoom-in"
                            data-aos-delay={350 + (index * 50)}
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h6 className="font-bold text-navy-700">{strategy.name}</h6>
                                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(strategy.status)}`}>
                                        {strategy.status}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 mb-3">
                                    Timeline: {strategy.timeline}
                                </p>

                                <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Progress</span>
                                        <span className="font-semibold">{strategy.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${getProgressColor(strategy.progress)}`}
                                            style={{ width: `${strategy.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <button
                                    className="w-full mt-3 flex items-center justify-center gap-1 py-2 text-teal-500 hover:text-teal-700 transition-all border-t border-gray-100"
                                    onClick={() => setActiveStrategy(activeStrategy === strategy.id ? null : strategy.id)}
                                >
                                    {activeStrategy === strategy.id ? (
                                        <>
                                            <MdExpandLess className="h-5 w-5" /> Sembunyikan Detail
                                        </>
                                    ) : (
                                        <>
                                            <MdExpandMore className="h-5 w-5" /> Lihat Detail
                                        </>
                                    )}
                                </button>
                            </div>

                            {activeStrategy === strategy.id && (
                                <div className="bg-gray-50 p-4 border-t border-gray-200" data-aos="fade-up">
                                    <h6 className="font-semibold text-sm text-navy-700 mb-3 flex items-center">
                                        <MdTrendingUp className="mr-2 h-5 w-5 text-teal-500" /> KPI Monitoring
                                    </h6>
                                    <div className="space-y-3">
                                        {strategy.kpi.map((kpi, kIndex) => (
                                            <div key={kIndex} className="p-3 bg-white rounded-lg shadow-sm">
                                                <div className="text-sm font-medium text-navy-700 mb-2">{kpi.name}</div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <span className="text-xs text-gray-500 mr-1">Target:</span>
                                                        <span className="text-sm font-semibold">{kpi.target}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-xs text-gray-500 mr-1">Tercapai:</span>
                                                        <span className="text-sm font-semibold text-teal-500">{kpi.achieved}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {editMode && (
                    <div className="flex justify-center mt-5">
                        <button
                            className="flex items-center gap-1 px-5 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
                            onClick={() => {
                                // Logic to add a new strategy would go here
                            }}
                        >
                            <MdAddCircle className="h-5 w-5" /> Tambah Strategi Baru
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default VisiMisi;
