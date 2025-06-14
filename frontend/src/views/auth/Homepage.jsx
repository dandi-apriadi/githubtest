import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdAttachMoney,
  MdAssignment,
  MdScience,
  MdVolunteerActivism,
  MdCelebration,
  MdSettings,
  MdArrowForward,
  MdAdminPanelSettings,
  MdOutlinePersonPin,
  MdSecurity,
  MdSpeed,
  MdOutlineIntegrationInstructions,
  MdMenu,
  MdClose,
  MdCheckCircle,
  MdLightbulb,
  MdAnalytics
} from 'react-icons/md';

const Homepage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Criteria cards data
  const criteriaCards = [
    {
      icon: <MdSettings className="text-4xl text-blue-600 mb-3" />,
      title: "Visi, Misi & Strategi",
      description: "Pengelolaan visi, misi, tujuan, dan strategi program studi"
    },
    {
      icon: <MdAdminPanelSettings className="text-4xl text-blue-600 mb-3" />,
      title: "Tata Pamong & Kerja Sama",
      description: "Manajemen tata pamong, tata kelola, dan kerjasama"
    },
    {
      icon: <MdPeople className="text-4xl text-blue-600 mb-3" />,
      title: "Mahasiswa",
      description: "Pengelolaan data dan kegiatan mahasiswa program studi"
    },
    {
      icon: <MdOutlinePersonPin className="text-4xl text-blue-600 mb-3" />,
      title: "SDM",
      description: "Pengelolaan sumber daya manusia dan pengembangan kompetensi"
    },
    {
      icon: <MdAttachMoney className="text-4xl text-blue-600 mb-3" />,
      title: "Keuangan",
      description: "Pengelolaan keuangan, anggaran, dan pendanaan"
    },
    {
      icon: <MdSchool className="text-4xl text-blue-600 mb-3" />,
      title: "Pendidikan",
      description: "Pengelolaan kurikulum dan kegiatan akademik"
    },
    {
      icon: <MdScience className="text-4xl text-blue-600 mb-3" />,
      title: "Penelitian",
      description: "Pengelolaan kegiatan dan output penelitian dosen"
    },
    {
      icon: <MdVolunteerActivism className="text-4xl text-blue-600 mb-3" />,
      title: "Pengabdian Masyarakat",
      description: "Pengelolaan kegiatan pengabdian kepada masyarakat"
    },
    {
      icon: <MdCelebration className="text-4xl text-blue-600 mb-3" />,
      title: "Luaran & Capaian",
      description: "Tracking luaran dan capaian tridharma perguruan tinggi"
    },
  ];

  // Features data
  const features = [
    {
      icon: <MdDashboard className="text-4xl text-white" />,
      title: "Dashboard Komprehensif",
      description: "Pantau status kelengkapan 9 kriteria akreditasi dalam satu tampilan"
    },
    {
      icon: <MdSecurity className="text-4xl text-white" />,
      title: "Manajemen Dokumen",
      description: "Upload, organisasi, dan validasi dokumen pendukung dengan aman"
    },
    {
      icon: <MdSpeed className="text-4xl text-white" />,
      title: "Monitoring Realtime",
      description: "Pantau progres pengumpulan data di semua kriteria secara langsung"
    },
    {
      icon: <MdOutlineIntegrationInstructions className="text-4xl text-white" />,
      title: "Integrasi Data",
      description: "Integrasi data antar modul untuk pelaporan dan analisis komprehensif"
    }
  ];

  // Statistics data (dummy)
  const statistics = [
    { value: "100%", label: "Kriteria Terpenuhi" },
    { value: "250+", label: "Dokumen Terkelola" },
    { value: "85%", label: "Efisiensi Waktu" },
    { value: "95%", label: "Kepuasan Pengguna" },
  ];

  return (
    <div className="font-sans">


      {/* Enhanced Hero Section */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white relative overflow-hidden pt-24">
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-15">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-indigo-300 blur-2xl"></div>
          <div className="absolute top-1/4 left-1/3 w-24 h-24 rounded-full bg-purple-300 blur-xl"></div>
        </div>

        {/* Floating animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-8 h-8 bg-white rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 left-[20%] w-4 h-4 bg-blue-200 rounded-full opacity-30 animate-float-delayed"></div>
          <div className="absolute top-60 left-[80%] w-6 h-6 bg-indigo-200 rounded-full opacity-20 animate-float-slow"></div>
          <div className="absolute top-80 left-[40%] w-5 h-5 bg-purple-200 rounded-full opacity-30 animate-float-very-slow"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center relative z-10">
            <div className="md:w-1/2 mb-12 md:mb-0" data-aos="fade-right">
              <div className="inline-block px-3 py-1 bg-blue-800/50 rounded-full text-blue-100 text-sm font-medium mb-6 backdrop-blur-sm border border-blue-700/30">
                Terakreditasi oleh BAN-PT
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Optimalisasi Proses Akreditasi Program Studi
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Sistem Manajemen Data Berbasis Enterprise Resource Planning (ERP) untuk Program Studi Teknik Komputer
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="relative overflow-hidden bg-gradient-to-r from-white to-blue-50 text-blue-700 font-semibold px-8 py-4 rounded-xl
                            shadow-[0_10px_25px_-5px_rgba(59,130,246,0.3)] 
                            hover:shadow-[0_15px_30px_-5px_rgba(59,130,246,0.4)]
                            transition-all duration-300 ease-out transform hover:-translate-y-1
                            flex items-center justify-center group border border-blue-100"
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-2">Masuk Sistem</span>
                    <span className="bg-blue-600 text-white p-1 rounded-full transform group-hover:rotate-45 transition-transform duration-300">
                      <MdArrowForward className="text-sm" />
                    </span>
                  </span>
                  <div className="absolute inset-0 w-0 h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300 ease-out group-hover:w-full opacity-90"></div>
                  <span className="absolute inset-0 w-full h-full text-white flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
                    <span className="flex items-center">
                      <span className="mr-2">Masuk Sistem</span>
                      <span className="bg-white text-blue-600 p-1 rounded-full">
                        <MdArrowForward className="text-sm" />
                      </span>
                    </span>
                  </span>
                </Link>
              </div>

              {/* Enhanced Trust indicators with better readability */}
              <div className="mt-10 flex flex-wrap gap-5">
                <div className="flex items-center bg-white/10 px-5 py-3 rounded-xl backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/20 group">
                  <div className="bg-green-500/20 p-2 rounded-full mr-3">
                    <MdCheckCircle className="text-grey-400 text-xl group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Data Terenkripsi</span>
                    <p className="text-gray-400 text-xs mt-0.5">Keamanan data terjamin</p>
                  </div>
                </div>
                <div className="flex items-center bg-white/10 px-5 py-3 rounded-xl backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/20 group">
                  <div className="bg-green-500/20 p-2 rounded-full mr-3">
                    <MdCheckCircle className="text-green-400 text-xl group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Dukungan 24/7</span>
                    <p className="text-gray-400 text-xs mt-0.5">Tim bantuan selalu siap</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2" data-aos="fade-left">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl transform rotate-3 opacity-70 blur-[2px]"></div>
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-2xl transform -rotate-3 opacity-70 blur-[2px]"></div>
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Team collaborating on project"
                  className="rounded-2xl shadow-2xl relative z-10 transform hover:scale-[1.02] transition-transform duration-300 border-4 border-white/20"
                />

                {/* Floating badges */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-3 z-20 flex items-center space-x-2 transform rotate-3">
                  <MdAnalytics className="text-blue-600 text-xl" />
                  <span className="text-gray-800 font-semibold text-sm">Real-time Analytics</span>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-xl p-3 z-20 flex items-center space-x-2 transform -rotate-3">
                  <MdLightbulb className="text-amber-500 text-xl" />
                  <span className="text-gray-800 font-semibold text-sm">Smart Solutions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Wave separator */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f9fafb" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,138.7C384,139,480,117,576,122.7C672,128,768,160,864,160C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </header>

      {/* Features Section - Update to continue */}
      <section className="py-20 bg-gray-50">
        <div className=" mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Manajemen 9 Kriteria Akreditasi</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solusi terintegrasi untuk pengelolaan data akreditasi program studi secara efisien dan komprehensif
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {criteriaCards.map((card, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="flex justify-center">{card.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Section */}
      <section className="py-20 bg-white">
        <div className=" mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Pengelolaan Berdasarkan Role</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sistem dirancang dengan fitur spesifik untuk setiap peran dalam proses akreditasi
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 bg-blue-700 text-white rounded-lg p-8" data-aos="fade-right">
              <div className="flex items-center mb-4">
                <MdAdminPanelSettings className="text-5xl mr-4" />
                <h3 className="text-2xl font-bold">Admin / Tim Akreditasi</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MdArrowForward className="mt-1 mr-2 flex-shrink-0" />
                  <span>Dashboard komprehensif dengan status kelengkapan 9 kriteria</span>
                </li>
                <li className="flex items-start">
                  <MdArrowForward className="mt-1 mr-2 flex-shrink-0" />
                  <span>Manajemen pengguna dan dokumen</span>
                </li>
                <li className="flex items-start">
                  <MdArrowForward className="mt-1 mr-2 flex-shrink-0" />
                  <span>Monitoring progres pengumpulan data</span>
                </li>
                <li className="flex items-start">
                  <MdArrowForward className="mt-1 mr-2 flex-shrink-0" />
                  <span>Pembuatan laporan untuk keperluan akreditasi</span>
                </li>
                <li className="flex items-start">
                  <MdArrowForward className="mt-1 mr-2 flex-shrink-0" />
                  <span>Pengelolaan timeline dan jadwal akreditasi</span>
                </li>
              </ul>
            </div>

            <div className="md:w-1/2 bg-indigo-700 text-white rounded-lg p-8" data-aos="fade-left">
              <div className="flex items-center mb-4">
                <MdOutlinePersonPin className="text-5xl mr-4" />
                <h3 className="text-2xl font-bold">Dosen</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MdArrowForward className="mt-1 mr-2 flex-shrink-0" />
                  <span>Dashboard personal dengan informasi input yang dibutuhkan</span>
                </li>
                <li className="flex items-start">
                  <MdArrowForward className="mt-1 mr-2 flex-shrink-0" />
                  <span>Manajemen Penelitian (tambah, edit, hapus proyek)</span>
                </li>
                <li className="flex items-start">
                  <MdArrowForward className="mt-1 mr-2 flex-shrink-0" />
                  <span>Dokumentasi aktivitas pengajaran</span>
                </li>
                <li className="flex items-start">
                  <MdArrowForward className="mt-1 mr-2 flex-shrink-0" />
                  <span>Manajemen catatan pengabdian masyarakat</span>
                </li>
                <li className="flex items-start">
                  <MdArrowForward className="mt-1 mr-2 flex-shrink-0" />
                  <span>Upload dokumen bukti pendukung</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / Features Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className=" mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Tingkatkan efisiensi proses akreditasi dengan fitur-fitur canggih kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg text-center"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="flex justify-center mb-4 bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-700">
        <div className=" mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div
                key={index}
                className="text-center text-white"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className=" mx-auto px-6 max-w-6xl text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Siap Memulai?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sederhanakan proses akreditasi program studi Anda dan tingkatkan efisiensi pengelolaan data
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/demo" className="bg-blue-700 text-white hover:bg-blue-800 px-8 py-3 rounded-lg font-semibold transition">
              Lihat Demo
            </Link>
            <Link to="/contact" className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-8 py-3 rounded-lg font-semibold transition">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className=" mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">Akreditasi ERP</h2>
              <p className="text-gray-400 mt-2">© 2025 All Rights Reserved</p>
            </div>
            <div className="flex gap-8">
              <Link to="/about" className="text-gray-400 hover:text-white transition">Tentang</Link>
              <Link to="/features" className="text-gray-400 hover:text-white transition">Fitur</Link>
              <Link to="/pricing" className="text-gray-400 hover:text-white transition">Harga</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition">Kontak</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;