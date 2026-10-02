import { useState } from "react";


import {
  Boxes,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Tags,
  UserRound,
} from "lucide-react";


import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";


import { useAuth } from "../../auth/AuthContext";


const navigation = [
  {
    label: "Inicio",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Productos",
    path: "/products",
    icon: Package,
  },
  {
    label: "Categorías",
    path: "/categories",
    icon: Tags,
  },
  {
    label: "Colecciones",
    path: "/collections",
    icon: Boxes,
  },
];


function AdminLayout() {
  const navigate = useNavigate();


  const {
    user,
    logout,
  } = useAuth();


  const [loggingOut, setLoggingOut] =
    useState(false);


  async function handleLogout() {
    try {
      setLoggingOut(true);


      await logout();


      navigate(
        "/login",
        {
          replace: true,
        },
      );
    } catch (error) {
      console.error(
        "Error cerrando sesión:",
        error,
      );
    } finally {
      setLoggingOut(false);
    }
  }


  const userInitial =
    user?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "A";


  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">
            S
          </div>


          <div>
            <strong>
              SPIEGELAU
            </strong>


            <span>
              Administración
            </span>
          </div>
        </div>


        <nav className="sidebar-nav">
          {navigation.map(
            (item) => {
              const Icon =
                item.icon;


              return (
                <NavLink
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  className={({
                    isActive,
                  }) =>
                    `sidebar-link ${
                      isActive
                        ? "active"
                        : ""
                    }`
                  }
                >
                  <Icon
                    size={18}
                  />


                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );
            },
          )}
        </nav>


        <div className="sidebar-footer">
          <NavLink
            to="/settings"
            className={({
              isActive,
            }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
            }
          >
            <Settings
              size={18}
            />


            <span>
              Configuración
            </span>
          </NavLink>


          <div className="sidebar-divider" />


          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {userInitial}
            </div>


            <div className="sidebar-user-info">
              <strong>
                {user?.name ||
                  "Administrador"}
              </strong>


              <span>
                @
                {user?.username ||
                  "admin"}
              </span>
            </div>
          </div>


          <button
            type="button"
            className="sidebar-link sidebar-button logout-button"
            onClick={
              handleLogout
            }
            disabled={
              loggingOut
            }
          >
            <LogOut
              size={18}
            />


            <span>
              {loggingOut
                ? "Cerrando..."
                : "Cerrar sesión"}
            </span>
          </button>
        </div>
      </aside>


      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}


export default AdminLayout;




