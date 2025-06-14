import React from "react";
// Admin Imports
import Logout from "views/auth/Logout";
import DashboardAdmin from "views/admin/dashboard";
// Icon Imports
import {
  MdDashboard,
  MdVisibility,
  MdAssignment,
  MdDescription,
  MdBarChart,
  MdTimeline,
  MdAssessment,
  MdInsights,
} from "react-icons/md";
import StatusAkreditasi from "views/admin/dashboard/components/StatusAkreditasi";
import ProgresPengumpulanData from "views/admin/dashboard/components/ProgresPengumpulanData";
import AnalisisKesiapan from "views/admin/dashboard/components/AnalisisKesiapan";
import VisiMisiDashboard from "views/admin/Visi-Misi-Strategi";
import VisiMisi from "views/admin/Visi-Misi-Strategi/components/VisiMisi";
import TujuanProdi from "views/admin/Visi-Misi-Strategi/components/TujuanProdi";
import RencanaStrategis from "views/admin/Visi-Misi-Strategi/components/RencanaStrategis";
import EvaluasiVisiMisi from "views/admin/Visi-Misi-Strategi/components/EvaluasiVisiMisi";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <DashboardAdmin />,
  },
  {
    name: "Status Akreditasi",
    layout: "/admin",
    parentPath: "default",
    path: "status-akreditasi",
    icon: <MdBarChart className="h-6 w-6 ml-10" />,
    component: <StatusAkreditasi />,
    secondary: true,
  },
  {
    name: "Progres Pengumpulan Data",
    layout: "/admin",
    parentPath: "default",
    path: "progres-data",
    icon: <MdTimeline className="h-6 w-6 ml-10" />,
    component: <ProgresPengumpulanData />,
    secondary: true,
  },
  {
    name: "Analisis Kesiapan",
    layout: "/admin",
    parentPath: "default",
    path: "analisis-kesiapan",
    icon: <MdAssessment className="h-6 w-6 ml-10" />,
    component: <AnalisisKesiapan />,
    secondary: true,
  },
  {
    name: "Visi, Misi, & Strategi",
    layout: "/admin",
    path: "visi-misi",
    icon: <MdVisibility className="h-6 w-6" />,
    component: <VisiMisiDashboard />,
  },
  {
    name: "Visi dan Misi",
    layout: "/admin",
    parentPath: "visi-misi",
    path: "visi-misi-detail",
    icon: <MdDescription className="h-6 w-6 ml-10" />,
    component: <VisiMisi />,
    secondary: true,
  },
  {
    name: "Tujuan Program Studi",
    layout: "/admin",
    parentPath: "visi-misi",
    path: "tujuan-program",
    icon: <MdAssignment className="h-6 w-6 ml-10" />,
    component: <TujuanProdi />,
    secondary: true,
  },
  {
    name: "Rencana Strategis",
    layout: "/admin",
    parentPath: "visi-misi",
    path: "rencana-strategis",
    icon: <MdTimeline className="h-6 w-6 ml-10" />,
    component: <RencanaStrategis />,
    secondary: true,
  },
  {
    name: "Evaluasi Visi Misi",
    layout: "/admin",
    parentPath: "visi-misi",
    path: "evaluasi-visi-misi",
    icon: <MdInsights className="h-6 w-6 ml-10" />,
    component: <EvaluasiVisiMisi />,
    secondary: true,
  },
];

export default routes;