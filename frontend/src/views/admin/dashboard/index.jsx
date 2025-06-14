import React, { useState, useEffect } from "react";
import {
    MdAssessment,
    MdSchool,
    MdPeople,
    MdAttachMoney,
    MdBook,
    MdScience,
    MdVolunteerActivism,
    MdWorkOutline,
    MdVisibility,
    MdInsertChart,
    MdNotifications,
    MdWarning,
    MdCheckCircle
} from "react-icons/md";
import Chart from 'react-apexcharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const AdminDashboard = () => {
    // Dummy data for the 9 criteria
    const [criteriaData, setCriteriaData] = useState([
        { id: 1, name: "Visi, Misi, Tujuan, Strategi", icon: <MdVisibility className="text-2xl" />, progress: 85, color: "blue" },
        { id: 2, name: "Tata Pamong, Tata Kelola dan Kerja Sama", icon: <MdAssessment className="text-2xl" />, progress: 72, color: "purple" },
        { id: 3, name: "Mahasiswa", icon: <MdSchool className="text-2xl" />, progress: 65, color: "green" },
        { id: 4, name: "SDM", icon: <MdPeople className="text-2xl" />, progress: 78, color: "pink" },
        { id: 5, name: "Keuangan", icon: <MdAttachMoney className="text-2xl" />, progress: 90, color: "yellow" },
        { id: 6, name: "Pendidikan", icon: <MdBook className="text-2xl" />, progress: 60, color: "indigo" },
        { id: 7, name: "Penelitian", icon: <MdScience className="text-2xl" />, progress: 45, color: "red" },
        { id: 8, name: "Pengabdian Kepada Masyarakat", icon: <MdVolunteerActivism className="text-2xl" />, progress: 50, color: "orange" },
        { id: 9, name: "Luaran dan Capaian Tridharma PT", icon: <MdWorkOutline className="text-2xl" />, progress: 68, color: "teal" },
    ]);

    // Dummy stats data
    const statsData = [
        { title: "Total Dosen", value: 42, change: "+3", isIncrease: true },
        { title: "Total Dokumen", value: 387, change: "+28", isIncrease: true },
        { title: "Dokumen Perlu Review", value: 18, change: "-5", isIncrease: false },
        { title: "Deadline Terdekat", value: "14 Mei", change: "3 hari lagi", isIncrease: false }
    ];

    // Chart data for progress tracking
    const progressChartOptions = {
        chart: {
            id: "accreditation-progress",
            toolbar: {
                show: false
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']
        },
        colors: ['#4338CA', '#10B981'],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: "vertical",
                opacityFrom: 0.7,
                opacityTo: 0.2,
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            position: 'top'
        }
    };

    const progressChartSeries = [
        {
            name: "Target",
            data: [30, 45, 55, 65, 75, 85]
        },
        {
            name: "Aktual",
            data: [28, 42, 53, 68, 72, 79]
        }
    ];

    // Recent activities data
    const recentActivities = [
        {
            id: 1,
            user: "Dr. Agus Wijaya",
            action: "mengunggah dokumen",
            item: "Laporan Penelitian 2024",
            criteria: "Penelitian",
            time: "2 jam yang lalu",
            status: "completed"
        },
        {
            id: 2,
            user: "Dr. Budi Santoso",
            action: "memperbarui",
            item: "RPS Mata Kuliah Algoritma",
            criteria: "Pendidikan",
            time: "3 jam yang lalu",
            status: "completed"
        },
        {
            id: 3,
            user: "Tim Akreditasi",
            action: "mereview",
            item: "Dokumen Visi Misi",
            criteria: "Visi, Misi, Tujuan, Strategi",
            time: "5 jam yang lalu",
            status: "pending"
        },
        {
            id: 4,
            user: "Sistem",
            action: "deadline",
            item: "Pengumpulan Bukti Kerjasama",
            criteria: "Tata Pamong, Tata Kelola dan Kerja Sama",
            time: "1 hari lagi",
            status: "warning"
        }
    ];

    // Calculate overall accreditation progress
    const overallProgress = criteriaData.reduce((total, item) => total + item.progress, 0) / criteriaData.length;

    useEffect(() => {
        // Add AOS animation initialization
        const AOS = require('aos');
        import('aos/dist/aos.css');
        AOS.init({
            duration: 800,
            once: true
        });
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Dashboard Header */}
            <div data-aos="fade-down" className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
                    <p className="text-gray-600">Sistem Manajemen Akreditasi Program Studi Teknik Komputer</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="relative p-2 rounded-full bg-white shadow-sm hover:bg-gray-100">
                        <MdNotifications className="text-xl text-gray-600" />
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                    </button>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">TA</div>
                        <div className="ml-3 hidden md:block">
                            <p className="text-sm font-medium text-gray-800">Tim Akreditasi</p>
                            <p className="text-xs text-gray-500">admin@tekkom.ac.id</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div data-aos="fade-up" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statsData.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                            </div>
                            <div className={`self-start px-2 py-1 rounded-full text-xs font-medium ${stat.isIncrease ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall Progress */}
            <div data-aos="zoom-in" className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-lg shadow-sm col-span-1">
                    <h2 className="text-lg font-semibold mb-4">Progress Akreditasi</h2>
                    <div className="flex justify-center">
                        <div className="w-36 h-36">
                            <CircularProgressbar
                                value={overallProgress}
                                text={`${Math.round(overallProgress)}%`}
                                styles={buildStyles({
                                    textSize: '16px',
                                    pathColor: `rgba(67, 56, 202, ${overallProgress / 100})`,
                                    textColor: '#4338CA',
                                    trailColor: '#F3F4F6',
                                })}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 text-center">
                            Status: <span className="font-medium text-indigo-600">Dalam Proses</span>
                        </p>
                        <p className="text-xs text-gray-500 text-center mt-1">
                            Target penyelesaian: 15 Agustus 2025
                        </p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Tren Progress</h2>
                    <Chart
                        options={progressChartOptions}
                        series={progressChartSeries}
                        type="area"
                        height={280}
                    />
                </div>
            </div>

            {/* Criteria Cards */}
            <div data-aos="fade-up">
                <h2 className="text-lg font-semibold mb-4">Status 9 Kriteria</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {criteriaData.map((criteria) => (
                        <div key={criteria.id} className="bg-white rounded-lg shadow-sm p-5 transition-all hover:shadow-md cursor-pointer">
                            <div className="flex items-center mb-3">
                                <div className={`w-10 h-10 rounded-full bg-${criteria.color}-100 flex items-center justify-center text-${criteria.color}-600 mr-3`}>
                                    {criteria.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{criteria.name}</h3>
                                    <p className="text-xs text-gray-500">Kriteria {criteria.id}</p>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`bg-${criteria.color}-600 h-2.5 rounded-full`}
                                    style={{ width: `${criteria.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{criteria.progress}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activities */}
            <div data-aos="fade-up" className="bg-white rounded-lg shadow-sm p-5 mb-6">
                <h2 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengguna</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktivitas</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kriteria</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentActivities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{activity.user}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        {activity.action} <span className="font-medium">{activity.item}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{activity.criteria}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{activity.time}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {activity.status === "completed" && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                <MdCheckCircle className="inline mr-1" />
                                                Selesai
                                            </span>
                                        )}
                                        {activity.status === "pending" && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                <MdInsertChart className="inline mr-1" />
                                                Proses
                                            </span>
                                        )}
                                        {activity.status === "warning" && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                                <MdWarning className="inline mr-1" />
                                                Perhatian
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
