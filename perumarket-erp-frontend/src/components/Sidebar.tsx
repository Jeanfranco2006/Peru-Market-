import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FiHome,
  FiUsers,
  FiMenu,
  FiUserCheck,
  FiUser,
  FiBox,
  FiShoppingCart,
  FiClipboard,
  FiTruck,
  FiArchive,
  FiBarChart2,
  FiLogOut,
  FiX
} from "react-icons/fi";
import type { AuthData, Module } from "../types/auth";
import ModalConfirmarLogout from "./modals/ModalConfirmarLogout";
import PeruMarketERPLogo from "../resources/img/PeruMarketERPLogo.png";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cargar módulos permitidos del usuario
  useEffect(() => {
    const loadUserModules = () => {
      try {
        setLoading(true);
        const authData = localStorage.getItem('auth');
        if (authData) {
          const parsedData: AuthData = JSON.parse(authData);
          // Los módulos están en el objeto principal
          if (parsedData.modules && Array.isArray(parsedData.modules)) {
            setModules(parsedData.modules);
            console.log('✅ Módulos cargados:', parsedData.modules);
          } else {
            console.warn('⚠️ No se encontraron módulos en authData');
            setModules([]);
          }
        } else {
          console.warn('⚠️ No se encontró authData en localStorage');
          setModules([]);
        }
      } catch (error) {
        console.error('❌ Error cargando módulos:', error);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserModules();
  }, []);

  // Configuración de touch para deslizar
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && mobileOpen) {
      setMobileOpen(false);
    }
    if (isRightSwipe && !mobileOpen) {
      setMobileOpen(true);
    }
  };

  // Cerrar sidebar móvil al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileOpen]);

  // Cerrar sidebar móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  // Agregar event listener para gestos en toda la pantalla
  useEffect(() => {
    const handleGlobalTouchStart = (e: TouchEvent) => {
      if (!mobileOpen) {
        setTouchEnd(null);
        setTouchStart(e.touches[0].clientX);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!mobileOpen) {
        setTouchEnd(e.touches[0].clientX);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (!mobileOpen && touchStart && touchEnd) {
        const distance = touchStart - touchEnd;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isRightSwipe) {
          setMobileOpen(true);
        }
      }
    };

    document.addEventListener('touchstart', handleGlobalTouchStart);
    document.addEventListener('touchmove', handleGlobalTouchMove);
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleGlobalTouchStart);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [mobileOpen, touchStart, touchEnd]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("logged");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Mapeo de nombres de módulos a iconos y rutas
  const getModuleConfig = (moduleName: string) => {
    const configMap: { [key: string]: { icon: any; route: string } } = {
      'Dashboard': { icon: FiHome, route: '/dashboard' },
      'Accesos': { icon: FiUsers, route: '/accesos' },
      'Empleados': { icon: FiUserCheck, route: '/empleados' },
      'Clientes': { icon: FiUser, route: '/clientes' },
      'Inventario': { icon: FiBox, route: '/inventario' },
      'Ventas': { icon: FiShoppingCart, route: '/ventas' },
      'Pedidos': { icon: FiClipboard, route: '/pedidos' },
      'Compras': { icon: FiArchive, route: '/compras' },
      'Proveedores': { icon: FiUsers, route: '/proveedores' },
      'Envios': { icon: FiTruck, route: '/envios' },
      'Reportes': { icon: FiBarChart2, route: '/reportes' },
    };

    return configMap[moduleName] || { icon: FiBox, route: `/${moduleName.toLowerCase().replace(/\s+/g, '-')}` };
  };

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <div className="hidden lg:block">
        <div className="bg-black text-white h-screen p-4 w-64">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-6"></div>
            <div className="flex items-center justify-center mb-10">
              <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
            </div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-700 rounded mb-2"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Si no hay módulos, mostrar mensaje
  if (modules.length === 0 && !loading) {
    return (
      <div className="hidden lg:block">
        <div className="bg-black text-white h-screen p-4 w-64 flex flex-col">
          <div className="flex items-center justify-center mb-10">
            <img src={PeruMarketERPLogo} className="w-20 h-20 rounded-full object-cover" alt="Logo Peru Market" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <FiBox className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">No tiene módulos asignados</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full hover:bg-red-600 bg-red-500 rounded-lg transition-colors"
          >
            <FiLogOut size={20} className="flex-shrink-0" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay para móvil */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar para desktop */}
      <div className="hidden lg:block">
        <div
          className={`bg-black text-white h-screen p-4 flex flex-col justify-between transition-all duration-300 ${
            open ? "w-64" : "w-20"
          }`}
        >
          {/* ----- TOP SECTION ----- */}
          <div>
            <button
              onClick={() => setOpen(!open)}
              className="text-white mb-6 text-xl hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              <FiMenu />
            </button>

            {/* Logo centrado - MÁS GRANDE */}
            <div className="flex justify-center mb-10">
              <img 
                src={PeruMarketERPLogo} 
                className={`rounded-full object-cover transition-all duration-300 ${
                  open ? "w-24 h-24" : "w-16 h-16"
                }`} 
                alt="Logo Peru Market" 
              />
            </div>

            <nav className="space-y-2">
              {modules.map((module) => {
                const { icon: Icon, route } = getModuleConfig(module.nombre);
                return (
                  <Link 
                    key={module.id}
                    to={route} 
                    className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {open && <span className="group-hover:text-gray-200">{module.nombre}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ----- LOGOUT BOTTOM SECTION ----- */}
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 w-full hover:bg-red-600 bg-red-500 rounded-lg transition-colors group"
            >
              <FiLogOut size={20} className="flex-shrink-0" />
              {open && <span className="group-hover:text-white">Cerrar sesión</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar para móvil */}
      <div className="lg:hidden">
        {/* Botón flotante para abrir sidebar en móvil */}
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-30 bg-black text-white p-3 rounded-full shadow-lg lg:hidden"
        >
          <FiMenu size={20} />
        </button>

        {/* Sidebar móvil */}
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full bg-black text-white z-50 flex flex-col justify-between transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } w-64`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex flex-col h-full">
            {/* ----- TOP SECTION ----- */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {/* Header móvil con logo centrado - MÁS GRANDE */}
                <div className="flex flex-col items-center mb-8">
                  <div className="flex items-center justify-between w-full mb-6">
                    <div className="w-6"></div> {/* Espacio para balancear */}
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                  <img 
                    src={PeruMarketERPLogo} 
                    className="w-24 h-24 rounded-full object-cover mb-4" 
                    alt="Logo Peru Market" 
                  />
                </div>

                {/* Menú móvil */}
                <nav className="space-y-1">
                  {modules.map((module) => {
                    const { icon: Icon, route } = getModuleConfig(module.nombre);
                    return (
                      <Link 
                        key={module.id}
                        to={route} 
                        className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors group"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        <span className="group-hover:text-gray-200 text-sm">{module.nombre}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* ----- LOGOUT BOTTOM SECTION ----- */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 p-3 w-full hover:bg-red-600 bg-red-500 rounded-lg transition-colors group"
              >
                <FiLogOut size={18} className="flex-shrink-0" />
                <span className="group-hover:text-white text-sm">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de swipe para móvil - Solo mostrar cuando el menú está cerrado */}
      {!mobileOpen && (
        <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded-full text-xs">
          ← Desliza desde el borde para abrir →
        </div>
      )}

      {/* Modal de confirmación de logout */}
      <ModalConfirmarLogout
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}