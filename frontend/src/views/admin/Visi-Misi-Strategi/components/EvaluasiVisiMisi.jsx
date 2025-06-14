import React, { useState, useEffect } from "react";
import { MdAssessment, MdHistory, MdTimeline, MdFileUpload, MdDescription, MdEdit, MdSave, MdClose, MdAdd } from "react-icons/md";
import Card from "components/card";
import Chart from "react-apexcharts";
import "aos/dist/aos.css";

const EvaluasiVisiMisi = () => {
    useEffect(() => {
        // Initialize AOS animation library
        const AOS = require('aos');
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // State management
    const [activeTab, setActiveTab] = useState("visi");
    const [editMode, setEditMode] = useState(false);
    const [evaluationForm, setEvaluationForm] = useState({
        periode: "",
        pencapaian: "",
        kendala: "",
        solusi: "",
        rekomendasi: ""
    });

    // Dummy data for demonstration
    const visiContent = "Menjadi program studi unggulan dalam pengembangan teknologi komputer yang inovatif dan berdaya saing global pada tahun 2030.";
    const misiContent = [
        "Menyelenggarakan pendidikan berkualitas dalam bidang teknologi komputer",
        "Melaksanakan penelitian inovatif yang berkontribusi pada kemajuan teknologi",
        "Menjalin kerjasama dengan industri dan masyarakat"
    ];
    const tujuanContent = [
        "Menghasilkan lulusan yang kompeten dan berdaya saing global",
        "Menghasilkan publikasi ilmiah bereputasi internasional",
        "Mengembangkan teknologi tepat guna berbasis komputer"
    ];
    const strategiContent = [
        "Pengembangan kurikulum berbasis industri 4.0",
        "Peningkatan kualitas dan kuantitas penelitian dosen",
        "Perluasan jaringan kerjasama dengan mitra nasional dan internasional"
    ];

    // Historical evaluation dummy data
    const historicalData = [
        { tahun: "2022", pencapaian: 75 },
        { tahun: "2023", pencapaian: 82 },
        { tahun: "2024", pencapaian: 88 }
    ];

    // Chart options for KPI
    const chartOptions = {
        chart: {
            type: 'radar',
            toolbar: {
                show: false
            }
        },
        series: [
            {
                name: "Target",
                data: [90, 85, 95, 80, 90]
            },
            {
                name: "Pencapaian",
                data: [80, 70, 85, 75, 70]
            }
        ],
        labels: ["Kurikulum", "Penelitian", "Pengabdian", "Kerjasama", "Lulusan"],
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors: "#e9e9e9",
                    fill: {
                        colors: ["#f8f8f8", "#fff"]
                    }
                }
            }
        },
        colors: ["#4318FF", "#6AD2FF"],
        markers: {
            size: 5,
            colors: ["#4318FF", "#6AD2FF"],
            strokeColor: "#fff",
            strokeWidth: 2,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%";
                }
            }
        }
    };

    // Line chart for historical data
    const lineChartOptions = {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            }
        },
        series: [
            {
                name: "Pencapaian",
                data: historicalData.map(item => item.pencapaian)
            }
        ],
        xaxis: {
            categories: historicalData.map(item => item.tahun)
        },
        colors: ["#4318FF"],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 5
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%";
                }
            }
        }
    };

    // Handle form changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEvaluationForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here would be the API call to save the evaluation
        console.log("Form submitted:", evaluationForm);
        setEditMode(false);
        // Show success notification (would be implemented with a notification system)
        alert("Evaluasi berhasil disimpan!");
    };

    // Get content based on active tab
    const getActiveContent = () => {
        switch (activeTab) {
            case "visi":
                return visiContent;
            case "misi":
                return misiContent;
            case "tujuan":
                return tujuanContent;
            case "strategi":
                return strategiContent;
            default:
                return "";
        }
    };

    // Render content with appropriate formatting
    const renderContent = (content) => {
        if (Array.isArray(content)) {
            return (
                <ul className="list-disc pl-5 space-y-2">
                    {content.map((item, index) => (
                        <li key={index} className="text-navy-700">{item}</li>
                    ))}
                </ul>
            );
        }
        return <p className="text-navy-700">{content}</p>;
    };

    // Tab button component
    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === id
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
                }`}
        >
            <Icon className="mr-2 h-5 w-5" />
            {label}
        </button>
    );

    return (
        <div className="mt-3" data-aos="fade-up">
            <Card extra={"w-full p-4"}>
                {/* Header */}
                <div className="mb-8 w-full">
                    <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                        Evaluasi Visi, Misi, Tujuan & Strategi
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">
                        Lakukan evaluasi berkala terhadap pencapaian visi, misi, tujuan, dan strategi program studi
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
                    <TabButton id="visi" label="Visi" icon={MdDescription} />
                    <TabButton id="misi" label="Misi" icon={MdDescription} />
                    <TabButton id="tujuan" label="Tujuan" icon={MdDescription} />
                    <TabButton id="strategi" label="Strategi" icon={MdDescription} />
                </div>

                {/* Main content area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Current content display */}
                    <div
                        className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
                        data-aos="fade-right"
                        data-aos-delay="100"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h5 className="font-bold text-navy-700 capitalize">
                                {activeTab} Saat Ini
                            </h5>
                            <button
                                className="text-indigo-600 flex items-center text-sm font-medium"
                                onClick={() => setEditMode(!editMode)}
                            >
                                {editMode ? (
                                    <>
                                        <MdClose className="mr-1" /> Batal
                                    </>
                                ) : (
                                    <>
                                        <MdEdit className="mr-1" /> Edit
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="border-b pb-4 mb-4">
                            {renderContent(getActiveContent())}
                        </div>

                        {/* KPI Metrics */}
                        <div>
                            <h6 className="font-bold text-navy-700 mb-3 flex items-center">
                                <MdAssessment className="mr-2" /> Ketercapaian KPI
                            </h6>
                            <div className="h-96" data-aos="zoom-in" data-aos-delay="300">
                                <Chart
                                    options={chartOptions}
                                    series={chartOptions.series}
                                    type="radar"
                                    height="100%"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="lg:col-span-1">
                        {/* Evaluation form */}
                        <div
                            className="bg-white rounded-xl shadow-md p-6 mb-5"
                            data-aos="fade-left"
                            data-aos-delay="200"
                        >
                            <h5 className="font-bold text-navy-700 mb-4 flex items-center">
                                <MdAssessment className="mr-2" /> Form Evaluasi
                            </h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Periode Evaluasi
                                    </label>
                                    <select
                                        name="periode"
                                        value={evaluationForm.periode}
                                        onChange={handleFormChange}
                                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                                        required
                                    >
                                        <option value="">Pilih Periode</option>
                                        <option value="2023-1">Semester Ganjil 2023/2024</option>
                                        <option value="2023-2">Semester Genap 2023/2024</option>
                                        <option value="2024-1">Semester Ganjil 2024/2025</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tingkat Pencapaian (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="pencapaian"
                                        min="0"
                                        max="100"
                                        value={evaluationForm.pencapaian}
                                        onChange={handleFormChange}
                                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kendala yang Dihadapi
                                    </label>
                                    <textarea
                                        name="kendala"
                                        value={evaluationForm.kendala}
                                        onChange={handleFormChange}
                                        rows="3"
                                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Solusi yang Diterapkan
                                    </label>
                                    <textarea
                                        name="solusi"
                                        value={evaluationForm.solusi}
                                        onChange={handleFormChange}
                                        rows="3"
                                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rekomendasi Perbaikan
                                    </label>
                                    <textarea
                                        name="rekomendasi"
                                        value={evaluationForm.rekomendasi}
                                        onChange={handleFormChange}
                                        rows="3"
                                        className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dokumen Pendukung
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <MdFileUpload className="w-8 h-8 mb-3 text-gray-500" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">PDF, DOC, atau DOCX (Max. 10MB)</p>
                                            </div>
                                            <input type="file" className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <MdSave className="mr-2" /> Simpan Evaluasi
                                </button>
                            </form>
                        </div>

                        {/* Historical data */}
                        <div
                            className="bg-white rounded-xl shadow-md p-6"
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            <h5 className="font-bold text-navy-700 mb-4 flex items-center">
                                <MdHistory className="mr-2" /> Historis Evaluasi
                            </h5>
                            <div className="h-64 mb-4">
                                <Chart
                                    options={lineChartOptions}
                                    series={lineChartOptions.series}
                                    type="line"
                                    height="100%"
                                />
                            </div>
                            <div className="border-t pt-4">
                                <h6 className="font-bold text-navy-700 mb-2 flex items-center text-sm">
                                    <MdTimeline className="mr-2" /> Timeline Evaluasi
                                </h6>
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                    {historicalData.map((item, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="flex flex-col items-center mr-4">
                                                <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                                                {index < historicalData.length - 1 && (
                                                    <div className="w-0.5 h-full bg-gray-300"></div>
                                                )}
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 text-sm w-full">
                                                <div className="font-medium text-navy-700">Evaluasi Tahun {item.tahun}</div>
                                                <div className="text-gray-600">Pencapaian: {item.pencapaian}%</div>
                                                <button className="text-indigo-600 text-xs mt-1">Lihat Detail</button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-center mt-2">
                                        <button className="text-indigo-600 text-sm flex items-center">
                                            <MdAdd className="mr-1" /> Lihat Semua Riwayat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default EvaluasiVisiMisi;
