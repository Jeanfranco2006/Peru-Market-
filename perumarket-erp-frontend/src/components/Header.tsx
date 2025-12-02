import { useState, useEffect, useRef } from "react";
import { FiUser, FiLogOut, FiSettings, FiChevronDown, FiBell } from "react-icons/fi";
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
  
  // Referencia para detectar clicks fuera del dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar información del usuario desde localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const authData = localStorage.getItem('auth');
        if (authData) {
          const parsedData: AuthData = JSON.parse(authData);
          if (parsedData.user) {
            setUser(parsedData.user);
          }
        }
      } catch (error) {
        console.error('❌ Error cargando datos del usuario:', error);
      }
    };
    loadUserData();
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
    setShowDropdown(false);
  };

  const confirmLogout = () => {
    // Limpieza completa
    localStorage.clear(); 
    setShowLogoutModal(false);
    window.location.href = "/login";
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
    <>
      {/* HEADER BLANCO */}
      <header className="w-full bg-white h-[70px] flex justify-end items-center px-6 border-b border-gray-100 sticky top-0 z-20">
        
        <div className="flex items-center gap-6">
          
          {/* Botón de Notificaciones (Decorativo/Profesional) */}
          <button className="relative p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-all duration-200">
            <FiBell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Divisor Vertical */}
          <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>

          {/* Sección de Usuario */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-1.5 pl-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-200 group"
            >
              {/* Texto: Nombre y Rol */}
              <div className="text-right hidden md:block mr-1">
                <span className="text-gray-700 font-bold text-sm block leading-tight">
                  {getNombreCompleto()}
                </span>
                <span className="text-amber-500 text-[10px] font-bold tracking-wider uppercase block mt-0.5">
                  {user?.rol || "USUARIO"}
                </span>
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-amber-500/20 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                {user?.nombres ? getIniciales() : <FiUser className="w-5 h-5" />}
              </div>

              {/* Icono Chevron */}
              <FiChevronDown 
                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180 text-amber-500' : ''}`} 
              />
            </button>

            {/* --- DROPDOWN MENU --- */}
            {showDropdown && (
              <div className="absolute right-0 top-[110%] w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 py-2 animate-fadeIn origin-top-right overflow-hidden">
                
                {/* Header del Dropdown (Móvil) */}
                <div className="px-5 py-4 border-b border-gray-50 md:hidden bg-gray-50/50">
                  <p className="text-sm font-bold text-gray-800 truncate">{getNombreCompleto()}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">@{user?.username}</p>
                </div>

                {/* Opciones */}
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => { setShowDropdown(false); /* Navegar a perfil */ }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 font-medium rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-colors group"
                  >
                    <div className="p-2 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                      <FiUser size={16} />
                    </div>
                    <span>Mi Perfil</span>
                  </button>

                  <button
                    onClick={() => { setShowDropdown(false); /* Navegar a config */ }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 font-medium rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-colors group"
                  >
                    <div className="p-2 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                      <FiSettings size={16} />
                    </div>
                    <span>Configuración</span>
                  </button>
                </div>

                {/* Footer Dropdown */}
                <div className="border-t border-gray-100 mx-2 my-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors group"
                  >
                    <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                      <FiLogOut size={16} />
                    </div>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmación */}
        <ModalConfirmarLogout
          isOpen={showLogoutModal}
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-8px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
      </header>
    </>
  );
}