// Accesos.tsx - VERSIÓN CON ESTILOS MEJORADOS SIN BORDES
import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiMenu, FiX, FiUser, FiLock, FiSettings, FiShield } from "react-icons/fi";
import { ModalDetalles, ModalEditar, ModalConfirmar, ModalPermisos } from "./AccesosModals";
import { SearchAndFilters } from "./AccesosComponents";
import { UsuariosTab } from "./AccesosUsuarios";
import { RolesTab } from "./AccesosRoles";
import { ModulosTab } from "./AccesosModulos";
import { accesosService } from "../../services/accesosService";
import { api } from "../../services/api";

export default function Accesos() {
  const [tab, setTab] = useState("usuarios");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para datos reales del backend
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [modulos, setModulos] = useState<any[]>([]);
  const [roleModulePermissions, setRoleModulePermissions] = useState<any[]>([]);

  // Agregar este estado para roles del dropdown
  const [rolesDropdown, setRolesDropdown] = useState<any[]>([]);

  // Estados para modales
  const [modalDetalles, setModalDetalles] = useState({ 
    isOpen: false, 
    titulo: "", 
    children: null as React.ReactNode 
  });
  
  const [modalEditar, setModalEditar] = useState({ 
    isOpen: false, 
    titulo: "", 
    fields: {} as any, 
    tipo: "" 
  });
  
  const [modalConfirmar, setModalConfirmar] = useState({ 
    isOpen: false, 
    titulo: "", 
    mensaje: "", 
    onConfirm: () => {}, 
    tipo: "eliminar" 
  });

  const [modalPermisos, setModalPermisos] = useState({ 
    isOpen: false, 
    rol: null as any, 
    permisos: [] as any[] 
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
      console.log('📥 Cargando datos del backend...');
      
      const [usuariosData, rolesData, modulosData, rolesDropdownData] = await Promise.all([
        accesosService.getUsuarios(),
        accesosService.getRoles(),
        accesosService.getModulos(),
        accesosService.getRolesForDropdown()
      ]);

      console.log('✅ Datos cargados:', {
        usuarios: usuariosData.length,
        roles: rolesData.length,
        modulos: modulosData.length,
        rolesDropdown: rolesDropdownData.length
      });

      setUsuarios(usuariosData);
      setRoles(rolesData);
      setModulos(modulosData);
      setRolesDropdown(rolesDropdownData);

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      alert('Error al cargar los datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "usuarios", nombre: "Usuarios", icon: FiUser, count: usuarios.length },
    { id: "roles", nombre: "Roles", icon: FiLock, count: roles.length },
    { id: "modulos", nombre: "Módulos", icon: FiSettings, count: modulos.length }
  ];

  // Funciones de utilidad
  const getEstadoColor = (estado: string) => 
    estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  
  const getRolColor = (rolNombre: string) => {
    const colors: { [key: string]: string } = {
      'Administrador': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'Vendedor': 'bg-gradient-to-r from-green-500 to-green-600',
      'Almacenero': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'Almacén': 'bg-gradient-to-r from-amber-500 to-amber-600'
    };
    return colors[rolNombre] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getNombreCompleto = (persona: any) => 
    `${persona.nombres} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`;

  // ========== FUNCIONES USUARIOS ==========
  const verDetallesUsuario = (usuario: any) => {
    const p = usuario.persona;
    setModalDetalles({
      isOpen: true,
      titulo: `Detalles del Usuario`,
      children: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Información Personal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                    <p className="text-xl font-bold text-gray-900 mt-1">{getNombreCompleto(p)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Documento</label>
                      <p className="font-semibold text-gray-800">{p?.tipoDocumento} - {p?.numeroDocumento}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha Nacimiento</label>
                      <p className="font-semibold text-gray-800">{p?.fechaNacimiento}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Información de Contacto</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Correo Electrónico</label>
                    <p className="text-blue-600 font-semibold mt-1">{p?.correo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Teléfono</label>
                    <p className="font-semibold text-gray-800 mt-1">{p?.telefono}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dirección</label>
                    <p className="font-semibold text-gray-800 mt-1">{p?.direccion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-2xl">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Información de Cuenta</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Usuario</label>
                    <p className="font-mono text-gray-800 font-semibold mt-1">@{usuario.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rol</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRolColor(usuario.rol?.nombre || '')} text-white mt-1`}>
                      {usuario.rol?.nombre}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Estado</h3>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado de la Cuenta</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(usuario.estado)} mt-1`}>
                  {usuario.estado}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    });
  };

  const crearUsuario = () => {
    setModalEditar({
      isOpen: true,
      titulo: "Crear Nuevo Usuario",
      fields: {
        username: "",
        idRol: "",
        password: "",
        estado: "ACTIVO",
        tipoDocumento: "DNI",
        numeroDocumento: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        telefono: "",
        fechaNacimiento: "",
        direccion: ""
      },
      tipo: "usuario"
    });
  };

  const editarUsuario = (usuario: any) => {
    setModalEditar({
      isOpen: true,
      titulo: "Editar Usuario",
      fields: {
        id: usuario.id,
        username: usuario.username,
        idRol: usuario.rol.id,
        password: "",
        estado: usuario.estado,
        tipoDocumento: usuario.persona?.tipoDocumento || "DNI",
        numeroDocumento: usuario.persona?.numeroDocumento || "",
        nombres: usuario.persona?.nombres || "",
        apellidoPaterno: usuario.persona?.apellidoPaterno || "",
        apellidoMaterno: usuario.persona?.apellidoMaterno || "",
        correo: usuario.persona?.correo || "",
        telefono: usuario.persona?.telefono || "",
        fechaNacimiento: usuario.persona?.fechaNacimiento || "",
        direccion: usuario.persona?.direccion || ""
      },
      tipo: "usuario"
    });
  };

  const guardarUsuario = async (formData: any) => {
    try {
      setLoading(true);
      
      if (formData.id) {
        const usuarioActualizado = await accesosService.updateUsuario(formData.id, formData);
        setUsuarios(prev => prev.map(u => u.id === formData.id ? usuarioActualizado : u));
      } else {
        const nuevoUsuario = await accesosService.createUsuario(formData);
        setUsuarios(prev => [...prev, nuevoUsuario]);
      }
      
      console.log('✅ Usuario guardado exitosamente');
    } catch (error: any) {
      console.error('❌ Error guardando usuario:', error);
      alert('Error al guardar usuario: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminarUsuario = (usuario: any) => {
    setModalConfirmar({
      isOpen: true,
      titulo: "Eliminar Usuario",
      mensaje: `¿Estás seguro de que deseas eliminar al usuario "${getNombreCompleto(usuario.persona!)}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await accesosService.deleteUsuario(usuario.id);
          setUsuarios(prev => prev.filter(u => u.id !== usuario.id));
          console.log('✅ Usuario eliminado exitosamente');
        } catch (error: any) {
          console.error('❌ Error eliminando usuario:', error);
          alert('Error al eliminar usuario: ' + error.message);
        }
      },
      tipo: "eliminar"
    });
  };

  // ========== FUNCIONES ROLES ==========
  const verDetallesRol = (rol: any) => {
    setModalDetalles({
      isOpen: true,
      titulo: `Detalles del Rol`,
      children: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Información del Rol</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre del Rol</label>
                  <p className="text-xl font-bold text-gray-900 mt-1">{rol.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Descripción</label>
                  <p className="text-gray-700 font-medium mt-1">{rol.descripcion}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Usuarios con este Rol</label>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{rol.usuariosCount || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Módulos con Acceso</label>
                  <p className="text-3xl font-bold text-green-600 mt-1">{rol.modulosActivosCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    });
  };

  const crearRol = () => {
    setModalEditar({
      isOpen: true,
      titulo: "Crear Nuevo Rol",
      fields: {
        nombre: "",
        descripcion: ""
      },
      tipo: "rol"
    });
  };

  const editarRol = (rol: any) => {
    setModalEditar({
      isOpen: true,
      titulo: "Editar Rol",
      fields: {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion
      },
      tipo: "rol"
    });
  };

  const guardarRol = async (formData: any) => {
    try {
      setLoading(true);
      
      if (formData.id) {
        const rolActualizado = await accesosService.updateRol(formData.id, formData);
        setRoles(prev => prev.map(r => r.id === formData.id ? rolActualizado : r));
      } else {
        const nuevoRol = await accesosService.createRol(formData);
        setRoles(prev => [...prev, nuevoRol]);
        const nuevosRolesDropdown = await accesosService.getRolesForDropdown();
        setRolesDropdown(nuevosRolesDropdown);
      }
      
      console.log('✅ Rol guardado exitosamente');
    } catch (error: any) {
      console.error('❌ Error guardando rol:', error);
      alert('Error al guardar rol: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminarRol = async (rol: any) => {
    try {
      const dependencies = await accesosService.checkRolDependencies(rol.id);
      const usuariosCount = dependencies.usuariosAsociados;
      const permisosCount = dependencies.permisosAsociados;
      
      if (usuariosCount > 0) {
        alert(`❌ No se puede eliminar el rol "${rol.nombre}" porque tiene ${usuariosCount} usuario(s) asignado(s).\n\nReasigne los usuarios a otro rol primero.`);
        return;
      }
      
      let mensaje = `¿Estás seguro de que deseas eliminar el rol "${rol.nombre}"?`;
      
      if (permisosCount > 0) {
        mensaje += `\n\n⚠️ Este rol tiene ${permisosCount} permiso(s) asociado(s) que se eliminarán automáticamente.`;
      }
      
      mensaje += "\n\nEsta acción no se puede deshacer.";
      
      setModalConfirmar({
        isOpen: true,
        titulo: "Eliminar Rol",
        mensaje: mensaje,
        onConfirm: async () => {
          try {
            await accesosService.deleteRol(rol.id);
            setRoles(prev => prev.filter(r => r.id !== rol.id));
            
            const nuevosRolesDropdown = await accesosService.getRolesForDropdown();
            setRolesDropdown(nuevosRolesDropdown);
            
            alert(`✅ Rol "${rol.nombre}" eliminado correctamente${
              permisosCount > 0 ? ` (junto con ${permisosCount} permiso(s))` : ''
            }`);
            
          } catch (error: any) {
            console.error('❌ Error eliminando rol:', error);
            
            let errorMessage = `Error al eliminar el rol "${rol.nombre}"`;
            
            if (error.message.includes('usuarios asignados')) {
              errorMessage = error.message;
            } else if (error.message.includes('no encontrado')) {
              errorMessage = `El rol "${rol.nombre}" no existe o ya fue eliminado`;
            }
            
            alert(`❌ ${errorMessage}`);
          }
        },
        tipo: "eliminar"
      });
      
    } catch (error: any) {
      console.error('❌ Error verificando dependencias:', error);
      alert('Error al verificar dependencias del rol: ' + error.message);
    }
  };

  // ========== FUNCIONES PERMISOS ==========
  const gestionarPermisos = async (rol: any) => {
    try {
      setLoading(true);
      const permisos = await accesosService.getPermissionsByRol(rol.id);
      
      setModalPermisos({
        isOpen: true,
        rol,
        permisos
      });
    } catch (error: any) {
      console.error('❌ Error cargando permisos:', error);
      alert('Error al cargar permisos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const guardarPermisos = async (permisos: any[]) => {
    try {
      setLoading(true);
      
      const request = {
        idRol: modalPermisos.rol.id,
        permissions: permisos
      };
      
      await accesosService.updatePermissions(request);
      
      const modulosActivos = permisos.filter(p => p.hasAccess).length;
      setRoles(prev => prev.map(r => 
        r.id === modalPermisos.rol.id 
          ? { ...r, modulosActivosCount: modulosActivos }
          : r
      ));
      
      console.log('✅ Permisos guardados exitosamente');
    } catch (error: any) {
      console.error('❌ Error guardando permisos:', error);
      alert('Error al guardar permisos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNCIONES MÓDULOS ==========
  const verDetallesModulo = (modulo: any) => {
    setModalDetalles({
      isOpen: true,
      titulo: `Detalles del Módulo`,
      children: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Información del Módulo</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre</label>
                  <p className="text-xl font-bold text-gray-900 mt-1">{modulo.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Descripción</label>
                  <p className="text-gray-700 font-medium mt-1">{modulo.descripcion}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Configuración</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Ruta</label>
                  <p className="font-mono text-blue-600 font-semibold mt-1">{modulo.ruta}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    });
  };

  const crearModulo = () => {
    setModalEditar({
      isOpen: true,
      titulo: "Crear Nuevo Módulo",
      fields: {
        nombre: "",
        descripcion: "",
        ruta: ""
      },
      tipo: "modulo"
    });
  };

  const editarModulo = (modulo: any) => {
    setModalEditar({
      isOpen: true,
      titulo: "Editar Módulo",
      fields: {
        id: modulo.id,
        nombre: modulo.nombre,
        descripcion: modulo.descripcion,
        ruta: modulo.ruta
      },
      tipo: "modulo"
    });
  };

  const guardarModulo = async (formData: any) => {
    try {
      setLoading(true);
      
      if (formData.id) {
        const moduloActualizado = await accesosService.updateModulo(formData.id, formData);
        setModulos(prev => prev.map(m => m.id === formData.id ? moduloActualizado : m));
      } else {
        const nuevoModulo = await accesosService.createModulo(formData);
        setModulos(prev => [...prev, nuevoModulo]);
      }
      
      console.log('✅ Módulo guardado exitosamente');
    } catch (error: any) {
      console.error('❌ Error guardando módulo:', error);
      alert('Error al guardar módulo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const buscarDatosReniec = async () => {
    const dni = modalEditar.fields.numeroDocumento;

    if (!dni || dni.length !== 8) {
      alert("Por favor ingrese un DNI válido de 8 dígitos.");
      return;
    }

    try {
      setLoading(true);
      
      const datosPersona = await accesosService.consultarReniec(dni);

      if (datosPersona) {
        setModalEditar(prev => ({
          ...prev,
          fields: {
            ...prev.fields,
            nombres: datosPersona.nombres || '',
            apellidoPaterno: datosPersona.apellidoPaterno || '',
            apellidoMaterno: datosPersona.apellidoMaterno || '',
            direccion: datosPersona.direccion || prev.fields.direccion || ''
          }
        }));
        
        console.log('✅ Datos de RENIEC cargados correctamente');
      }
    } catch (error: any) {
      console.error('❌ Error consultando RENIEC:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminarModulo = (modulo: any) => {
    setModalConfirmar({
      isOpen: true,
      titulo: "Eliminar Módulo",
      mensaje: `¿Estás seguro de que deseas eliminar el módulo "${modulo.nombre}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await accesosService.deleteModulo(modulo.id);
          setModulos(prev => prev.filter(m => m.id !== modulo.id));
          console.log('✅ Módulo eliminado exitosamente');
        } catch (error: any) {
          console.error('❌ Error eliminando módulo:', error);
          alert('Error al eliminar módulo: ' + error.message);
        }
      },
      tipo: "eliminar"
    });
  };

  const handleSaveFromModal = (formData: any) => {
    if (modalEditar.tipo === "usuario") guardarUsuario(formData);
    if (modalEditar.tipo === "rol") guardarRol(formData);
    if (modalEditar.tipo === "modulo") guardarModulo(formData);
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Gestión de Accesos</h1>
            <p className="text-gray-600 text-lg">Administra usuarios, roles y permisos del sistema</p>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden mt-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 self-start"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-col lg:flex-row gap-3 mb-8">
          <div className="hidden lg:flex gap-3 bg-white p-3 rounded-2xl shadow-sm">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                  tab === t.id 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "text-gray-600 hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                <t.icon size={20} />
                <span className="font-semibold">{t.nombre}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tab === t.id ? "bg-blue-500" : "bg-gray-100 text-gray-700"
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile Tabs */}
          {mobileMenuOpen && (
            <div className="lg:hidden flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-lg">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                    tab === t.id 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <t.icon size={20} />
                  <span className="font-semibold">{t.nombre}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    tab === t.id ? "bg-blue-500" : "bg-gray-100 text-gray-700"
                  }`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Guardando...</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-8">
          {/* USUARIOS */}
          {tab === "usuarios" && (
            <div>
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterOptions={
                  <>
                    <option value="">Todos los estados</option>
                    <option value="ACTIVO">Activos</option>
                    <option value="INACTIVO">Inactivos</option>
                  </>
                }
                onFilterChange={setStatusFilter}
                onAddNew={crearUsuario}
                addButtonText="Nuevo Usuario"
              />
              
              <UsuariosTab
                usuarios={usuarios}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onVerDetalles={verDetallesUsuario}
                onEditar={editarUsuario}
                onEliminar={confirmarEliminarUsuario}
                getNombreCompleto={getNombreCompleto}
                getEstadoColor={getEstadoColor}
                getRolColor={getRolColor}
              />
            </div>
          )}

          {/* ROLES */}
          {tab === "roles" && (
            <div>
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddNew={crearRol}
                addButtonText="Nuevo Rol"
              />
              
              <RolesTab
                roles={roles}
                searchTerm={searchTerm}
                onVerDetalles={verDetallesRol}
                onEditar={editarRol}
                onEliminar={confirmarEliminarRol}
                onGestionarPermisos={gestionarPermisos}
              />
            </div>
          )}

          {/* MÓDULOS */}
          {tab === "modulos" && (
            <div>
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddNew={crearModulo}
                addButtonText="Nuevo Módulo"
              />
              
              <ModulosTab
                modulos={modulos}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onVerDetalles={verDetallesModulo}
                onEditar={editarModulo}
                onEliminar={confirmarEliminarModulo}
                getEstadoColor={getEstadoColor}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <ModalDetalles
        isOpen={modalDetalles.isOpen}
        titulo={modalDetalles.titulo}
        children={modalDetalles.children}
        onClose={() => setModalDetalles({ isOpen: false, titulo: "", children: null })}
      />

      <ModalEditar
        isOpen={modalEditar.isOpen}
        titulo={modalEditar.titulo}
        fields={modalEditar.fields}
        onSave={handleSaveFromModal}
        onClose={() => setModalEditar({ isOpen: false, titulo: "", fields: {}, tipo: "" })}
        type={modalEditar.tipo}
        rolesDropdown={rolesDropdown}
        onSearchDni={buscarDatosReniec}
        onChangeField={(campo, valor) => {
          setModalEditar(prev => ({
            ...prev,
            fields: { ...prev.fields, [campo]: valor }
          }));
        }}
      />

      <ModalConfirmar
        isOpen={modalConfirmar.isOpen}
        titulo={modalConfirmar.titulo}
        mensaje={modalConfirmar.mensaje}
        onConfirm={modalConfirmar.onConfirm}
        onCancel={() => setModalConfirmar({ isOpen: false, titulo: "", mensaje: "", onConfirm: () => {}, tipo: "eliminar" })}
        tipo={modalConfirmar.tipo}
      />

      <ModalPermisos
        isOpen={modalPermisos.isOpen}
        rol={modalPermisos.rol}
        modulos={modulos}
        permisos={modalPermisos.permisos}
        onSave={guardarPermisos}
        onClose={() => setModalPermisos({ isOpen: false, rol: null, permisos: [] })}
      />
    </div>
  );
}