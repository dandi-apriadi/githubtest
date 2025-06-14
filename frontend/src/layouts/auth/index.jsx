import authImg from "assets/img/auth/auth.jpg";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "../../routes/routes-auth.js";
import Navbar from "components/navbarhome";
import { useEffect, useState } from "react";

const FULL_WIDTH_PAGES = ['Homepage'];

export default function Auth() {
  const [page, setPage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    const currentRoute = routes.find(
      (route) => route.layout === "/auth" && route.path === currentPath
    );

    if (currentRoute) {
      setPage(currentRoute.name);
      document.title = currentRoute.name + " - Sistem Akreditasi";
    }
  }, [location.pathname]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full bg-white">
        {/* Academic-themed background for Sign In page */}
        {page === "Sign In" && (
          <div className="absolute inset-0 bg-white">
            {/* Subtle academic pattern */}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%230e4a89' fill-opacity='0.6' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                backgroundSize: "180px",
                opacity: 0.08
              }}
            ></div>
          </div>
        )}

        <main className="mx-auto min-h-screen relative z-10">
          <Navbar />
          <div className={`relative flex ${FULL_WIDTH_PAGES.includes(page) ? "w-full h-screen" : ""}`}>
            <div className={`
              ${FULL_WIDTH_PAGES.includes(page)
                ? "w-full h-full p-0 m-0 max-w-none"
                : page === "Sign In"
                  ? "mx-auto flex min-h-full w-full flex-col justify-start pt-8 md:px-8 lg:max-w-full lg:pt-0 xl:min-h-[100vh]"
                  : "mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:min-h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]"
              }
            `}>
              <div className={`mb-auto flex flex-col ${page === "Sign In" ? "px-4 md:px-8 lg:px-12 xl:px-16" : "pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full"}`}>
                <Routes>
                  {getRoutes(routes)}
                  <Route
                    path="/"
                    element={<Navigate to="/auth/sign-in" replace />}
                  />
                </Routes>
              </div>
            </div>
            {page === "Sign In" && (
              <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
                <div className="absolute inset-0">
                  {/* Academic-themed background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-blue-900/90 lg:rounded-bl-[120px] xl:rounded-bl-[200px]" />

                  {/* Background image with academic effect */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay lg:rounded-bl-[120px] xl:rounded-bl-[200px]"
                    style={{ backgroundImage: `url(${authImg})` }}
                  />

                  {/* Academic pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-30 lg:rounded-bl-[120px] xl:rounded-bl-[200px]"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='0.1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23d1d1d1' fill-opacity='0.2'%3E%3Crect x='100' width='100' height='100'/%3E%3Crect y='100' width='100' height='100'/%3E%3C/g%3E%3Cg fill-opacity='0.2'%3E%3Cpolygon fill='url(%23a)' points='100 30 0 0 200 0'/%3E%3Cpolygon fill='url(%23b)' points='100 100 0 130 0 100 200 100 200 130'/%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-white">
                    <div className="w-20 h-20 mb-6 bg-white/15 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">SIAKRE<span className="text-white/80">DITASI</span></h2>
                    <p className="text-lg text-center max-w-md opacity-90 mb-6">
                      Sistem Manajemen Akreditasi Program Studi Teknik Komputer
                    </p>
                    <div className="flex gap-6 mt-2">
                      <div className="text-center">
                        <p className="text-3xl font-bold">9</p>
                        <p className="text-sm opacity-80">Kriteria</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold">100+</p>
                        <p className="text-sm opacity-80">Indikator</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold">ERP</p>
                        <p className="text-sm opacity-80">Terintegrasi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
