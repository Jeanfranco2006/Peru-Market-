import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FiHome, FiUsers, FiMenu, FiUserCheck, FiUser, FiBox,
  FiShoppingCart, FiClipboard, FiTruck, FiArchive, FiBarChart2,
  FiLogOut, FiX, FiSearch, FiSettings, FiChevronRight, FiChevronLeft
} from "react-icons/fi";
import type { AuthData, Module } from "../types/auth";
import ModalConfirmarLogout from "./modals/ModalConfirmarLogout";
import PeruMarketERPLogo from "../resources/img/PeruMarketERPLogo.png";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // --- Carga de Módulos ---
  useEffect(() => {
    const loadUserModules = () => {
      try {
        setLoading(true);
        const authData = localStorage.getItem('auth');
        if (authData) {
          const parsedData: AuthData = JSON.parse(authData);
          if (parsedData.modules && Array.isArray(parsedData.modules)) {
            setModules(parsedData.modules);
          } else {
            setModules([]);
          }
        }
      } catch (error) {
        console.error('❌ Error cargando módulos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserModules();
  }, []);

  // --- Lógica Mobile ---
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

  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  // --- Configuración de Iconos ---
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

  const handleLogout = () => setShowLogoutModal(true);
  
  const confirmLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("logged");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setShowLogoutModal(false);
    navigate("/login");
  };

  // --- COMPONENTE DE ITEM DE MENÚ ---
  const MenuItem = ({ name, icon: Icon, route, isMobile = false }: { name: string, icon: any, route: string, isMobile?: boolean }) => {
    const isActive = location.pathname.startsWith(route);
    
    // Estilos Base
    const baseClasses = "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group mb-1.5 font-medium text-sm border";
    
    // ESTILO CLAVE: Fondo gris base -> Activo se vuelve BLANCO (Estilo "Card")
    // Active: Fondo blanco, sombra suave, texto oscuro fuerte. Parece "elevado".
    const activeClasses = "bg-white border-gray-200 text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)]";
    
    // Inactive: Transparente (se ve el gris de fondo), texto gris medio.
    const inactiveClasses = "border-transparent text-gray-500 hover:bg-white/60 hover:text-gray-900";

    return (
      <Link
        to={route}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${!open && !isMobile ? 'justify-center px-0' : ''}`}
      >
        <div className={`flex items-center justify-center transition-colors ${!open && !isMobile ? 'w-full' : ''}`}>
           <Icon 
            size={20} 
            className={`flex-shrink-0 transition-colors ${isActive ? "text-amber-500" : "text-gray-400 group-hover:text-gray-600"}`} 
          />
        </div>
        
        {(open || isMobile) && (
          <span className="truncate flex-1">{name}</span>
        )}

        {(open || isMobile) && isActive && (
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></div>
        )}
      </Link>
    );
  };

  if (loading) return <div className="w-64 h-screen bg-gray-50 animate-pulse hidden lg:block border-r border-gray-200" />;

  return (
    <>
      {/* Overlay Móvil */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-[2px] z-40 lg:hidden transition-opacity" onClick={() => setMobileOpen(false)} />
      )}

      {/* --- SIDEBAR DESKTOP (FONDO GRIS) --- */}
      <div 
        className={`hidden lg:flex flex-col h-screen bg-[#F5F7FA] transition-all duration-300 relative z-30 
        border-r border-gray-200/80 
        ${open ? "w-72" : "w-20"}`}
      >
        
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-9 bg-white border border-gray-200 text-gray-400 hover:text-amber-600 p-1.5 rounded-full shadow-sm hover:shadow-md z-50 transition-all duration-200 transform hover:scale-110"
        >
          {open ? <FiChevronLeft size={14} /> : <FiChevronRight size={14} />}
        </button>

        {/* 1. Header & Logo */}
        <div className="p-6 pb-2 flex items-center justify-center">
          <div className={`flex items-center gap-3 transition-all duration-300 ${!open && 'justify-center'}`}>
            <img 
              src={PeruMarketERPLogo} 
              className={`rounded-xl object-cover transition-all duration-300 shadow-sm ${open ? "w-10 h-10" : "w-9 h-9"}`} 
              alt="Logo" 
            />
            {open && (
              <div className="flex flex-col animate-fadeIn">
                <span className="font-bold text-gray-800 text-lg leading-tight tracking-tight">PeruMarket</span>
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Workspace</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Search Bar (Estilo Input Blanco sobre Fondo Gris) */}
        <div className={`px-5 py-4 transition-all duration-300 ${!open ? 'opacity-0 pointer-events-none hidden' : 'opacity-100'}`}>
          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-white text-gray-600 text-sm rounded-xl py-2.5 pl-10 pr-4 outline-none border border-gray-200 shadow-sm focus:border-amber-300 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder-gray-400"
            />
          </div>
        </div>

        {/* 3. Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {open && <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Main Menu</p>}
          
          <nav>
            {modules.map((module) => {
              const config = getModuleConfig(module.nombre);
              return <MenuItem key={module.id} name={module.nombre} icon={config.icon} route={config.route} />;
            })}
          </nav>

          {/* Configuración al final de la lista o separada */}
          {open && modules.length > 0 && (
             <div className="mt-6 pt-4 border-t border-gray-200/60">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Cuenta</p>
                <MenuItem name="Configuración" icon={FiSettings} route="/settings" />
             </div>
          )}
           {!open && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <MenuItem name="Settings" icon={FiSettings} route="/settings" />
            </div>
          )}
        </div>

        {/* 4. Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-100/50">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full p-2.5 rounded-xl text-gray-500 hover:bg-white hover:text-red-600 hover:shadow-sm hover:border-gray-200 border border-transparent transition-all duration-200 group ${!open ? 'justify-center' : ''}`}
          >
            <FiLogOut size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {open && <span className="text-sm font-medium">Cerrar sesión</span>}
          </button>
        </div>
      </div>

      {/* --- SIDEBAR MÓVIL --- */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-30 bg-white text-gray-700 p-2.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 active:scale-95 transition-all"
        >
          <FiMenu size={22} />
        </button>

        {/* Drawer Móvil (Fondo gris también) */}
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full bg-[#F5F7FA] w-[280px] z-50 shadow-[4px_0_30px_rgba(0,0,0,0.15)] transform transition-transform duration-300 flex flex-col ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-5 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img src={PeruMarketERPLogo} className="w-8 h-8 rounded-lg" alt="Logo" />
              <span className="font-bold text-gray-800">PeruMarket</span>
            </div>
            <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
              <FiX size={20} />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="relative mb-6">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full bg-white text-gray-700 text-sm rounded-xl py-2.5 pl-10 pr-4 outline-none border border-gray-200 shadow-sm focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
            <div>
              {modules.map((module) => {
                const config = getModuleConfig(module.nombre);
                return <MenuItem key={module.id} name={module.nombre} icon={config.icon} route={config.route} isMobile={true} />;
              })}
            </div>
            
            <div className="border-t border-gray-200 my-4 pt-4">
              <MenuItem name="Configuración" icon={FiSettings} route="/settings" isMobile={true} />
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full p-3 rounded-xl bg-white border border-gray-200 text-red-500 font-medium hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
            >
              <FiLogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      <ModalConfirmarLogout
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}