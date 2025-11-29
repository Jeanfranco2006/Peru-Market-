import { useState, useEffect } from "react";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import ModalConfirmarLogout from "./modals/ModalConfirmarLogout";

interface UserInfo {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  rol: string;
  email: string;
}

interface AuthData {
  success: boolean;
  message: string;
  token: string;
  user: UserInfo;
  modules: any[];
}

export default function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Cargar información del usuario desde localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const authData = localStorage.getItem('auth');
        if (authData) {
          const parsedData: AuthData = JSON.parse(authData);
          if (parsedData.user) {
            setUser(parsedData.user);
            console.log('👤 Usuario cargado en Header:', parsedData.user);
          }
        }
      } catch (error) {
        console.error('❌ Error cargando datos del usuario:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
    setShowDropdown(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("logged");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setShowLogoutModal(false);
    window.location.href = "/login";
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const getNombreCompleto = () => {
    if (!user) return "Usuario";
    return `${user.nombres} ${user.apellidos}`.trim();
  };

  const getIniciales = () => {
    if (!user) return "U";
    const nombres = user.nombres.split(' ');
    const apellidos = user.apellidos.split(' ');
    
    let iniciales = '';
    if (nombres.length > 0) iniciales += nombres[0].charAt(0);
    if (apellidos.length > 0) iniciales += apellidos[0].charAt(0);
    
    return iniciales.toUpperCase() || "U";
  };

  return (
    <header className="w-f  ull bg-black h-16 flex justify-end items-center px-6 shadow-md">
      {/* Información del usuario a la derecha */}
      <div className="flex items-center gap-4 relative">
        {/* Información del usuario */}
        <div className="text-right hidden md:block">
          <span className="text-white font-semibold block text-sm">
            {getNombreCompleto()}
          </span>
          <span className="text-gray-300 text-xs block">
            {user?.rol || "Rol no asignado"}
          </span>
        </div>

        {/* Avatar con dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 flex items-center justify-center text-white font-bold text-sm border border-gray-400">
              {user?.nombres ? getIniciales() : (
                <FiUser className="w-5 h-5" />
              )}
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* Información del usuario en el dropdown */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {getNombreCompleto()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-amber-600 font-medium">
                  {user?.rol}
                </p>
              </div>

              {/* Opciones del menú */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Aquí puedes redirigir a la página de perfil cuando la tengas
                  console.log('Ir a perfil');
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiUser className="w-4 h-4" />
                Mi Perfil
              </button>

              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Aquí puedes redirigir a configuraciones cuando la tengas
                  console.log('Ir a configuraciones');
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiSettings className="w-4 h-4" />
                Configuración
              </button>

              {/* Separador */}
              <div className="border-t border-gray-100 my-1"></div>

              {/* Cerrar sesión */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar el dropdown al hacer click fuera */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Modal de confirmación de logout */}
      <ModalConfirmarLogout
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </header>
  );
}