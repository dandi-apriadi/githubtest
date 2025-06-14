import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { setMicroPage } from "store/slices/authSlice";
import { useDispatch } from "react-redux";

export function SidebarLinks(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { routes } = props;

  // Fungsi untuk memeriksa apakah rute aktif berdasarkan path
  const activeRoute = (routeName) => {
    const currentPath = location.pathname.split("?")[0];
    if (routeName.includes(":")) {
      const routeBase = routeName.split("/:")[0];
      return currentPath.startsWith(routeBase);
    }
    return currentPath === routeName || currentPath.startsWith(routeName + "/");
  };

  // Menangani rute dengan makro = true
  useEffect(() => {
    const activeMacroRoute = routes.find(
      (route) => route.makro && activeRoute(`${route.layout}/${route.path}`)
    );

    if (activeMacroRoute) {
      dispatch(setMicroPage(activeMacroRoute.name)); // Set makro page jika rute makro aktif
    } else {
      dispatch(setMicroPage("unset")); // Set unset jika tidak ada rute makro yang aktif
    }
  }, [routes, location.pathname, dispatch]);

  const createLinks = (routes) => {
    // Group routes by parent path
    const mainRoutes = routes.filter(route =>
      route.layout !== "auth" && !route.parentPath
    );

    const subRoutesByParent = {};
    routes.filter(route => route.parentPath).forEach(subRoute => {
      if (!subRoutesByParent[subRoute.parentPath]) {
        subRoutesByParent[subRoute.parentPath] = [];
      }
      subRoutesByParent[subRoute.parentPath].push(subRoute);
    });

    // Function to check if any subpage of a main route is active
    const isAnySubRouteActive = (parentPath) => {
      const subRoutes = subRoutesByParent[parentPath] || [];
      return subRoutes.some(subRoute =>
        activeRoute(`${subRoute.layout}/${subRoute.path}`)
      );
    };

    // Render main routes with their subpages
    return mainRoutes.flatMap((mainRoute, mainIndex) => {
      const mainPath = `${mainRoute.layout}/${mainRoute.path}`;
      const isMainActive = activeRoute(mainPath);
      const hasActiveSubRoute = isAnySubRouteActive(mainRoute.path);
      const shouldShowSubRoutes = isMainActive || hasActiveSubRoute;

      const elements = [
        // Main route
        <Link key={`main-${mainIndex}`} to={mainPath}>
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li className="my-[3px] flex cursor-pointer items-center px-8">
              <span
                className={`${isMainActive
                  ? "font-bold text-brand-500 dark:text-white"
                  : "font-medium text-gray-600"
                  }`}
              >
                {mainRoute.icon ? mainRoute.icon : <DashIcon />}
              </span>
              <p
                className={`leading-1 ml-4 flex ${isMainActive
                  ? "font-bold text-navy-700 dark:text-white"
                  : "font-medium text-gray-600"
                  }`}
              >
                {mainRoute.name}
              </p>
            </li>
            {isMainActive ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            ) : null}
          </div>
        </Link>
      ];

      // Add subpages if parent is active or any subpage is active
      if (shouldShowSubRoutes && subRoutesByParent[mainRoute.path]) {
        const subElements = subRoutesByParent[mainRoute.path].map((subRoute, subIndex) => {
          const subPath = `${subRoute.layout}/${subRoute.path}`;
          const isSubActive = activeRoute(subPath);

          return (
            <Link key={`sub-${mainIndex}-${subIndex}`} to={subPath}>
              <div className="relative mb-3 flex hover:cursor-pointer">
                <li className="my-[3px] flex cursor-pointer items-center px-8 pl-12">
                  <span
                    className={`${isSubActive
                      ? "font-bold text-brand-500 dark:text-white"
                      : "font-medium text-gray-600"
                      }`}
                  >
                    {subRoute.icon ? subRoute.icon : <DashIcon />}
                  </span>
                  <p
                    className={`leading-1 ml-4 flex ${isSubActive
                      ? "font-bold text-navy-700 dark:text-white"
                      : "font-medium text-gray-600 text-sm"
                      }`}
                  >
                    {subRoute.name}
                  </p>
                </li>
                {isSubActive ? (
                  <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                ) : null}
              </div>
            </Link>
          );
        });

        elements.push(...subElements);
      }

      return elements;
    });
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
