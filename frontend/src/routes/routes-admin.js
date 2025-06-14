import React from "react";
// Admin Imports
import DashboardAdmin from "views/admin/dashboard";
// Icon Imports
import {
  MdDashboard,
  MdBarChart,
  MdTimeline,
  MdAssessment,
} from "react-icons/md";
import StatusAkreditasi from "views/admin/dashboard/components/StatusAkreditasi";
import ProgresPengumpulanData from "views/admin/dashboard/components/ProgresPengumpulanData";
import AnalisisKesiapan from "views/admin/dashboard/components/AnalisisKesiapan";
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
];

export default routes;