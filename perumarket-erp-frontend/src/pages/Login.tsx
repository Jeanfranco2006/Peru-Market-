import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PeruMarketERPLogo from "../resources/img/PeruMarketERPLogo.png";
import { authService, type LoginRequest } from "../services/authService";
import "../styles/Login.css"; // Importamos el CSS separado

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [bubbles, setBubbles] = useState<Array<{id: number, size: number, left: number, delay: number, duration: number, opacity: number}>>([]);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/test');
        console.log('✅ Backend conectado:', response.status);
      } catch (error) {
        console.error('❌ Backend no disponible:', error);
      }
    };
    
    checkBackend();
  }, []);

  useEffect(() => {
    const generateBubbles = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const bubbleCount = isMobile ? 6 : isTablet ? 10 : 15;
      
      const newBubbles = Array.from({ length: bubbleCount }, (_, i) => ({
        id: i,
        size: Math.random() * (isMobile ? 60 : isTablet ? 100 : 120) + (isMobile ? 20 : 40),
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: Math.random() * 20 + 15,
        opacity: Math.random() * 0.25 + 0.05
      }));
      
      setBubbles(newBubbles);
    };

    generateBubbles();
    
    const handleResize = () => generateBubbles();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async () => {
    if (user === "" || pass === "") {
      setError("Por favor, complete todos los campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const credentials: LoginRequest = {
        username: user,
        password: pass
      };

      const response = await authService.login(credentials);
      
      if (response.success) {
        authService.storeAuthData(response);
        localStorage.setItem("logged", "true");
        localStorage.setItem("username", response.user.username);

        localStorage.setItem("usuarioId", response.user.id.toString());
  localStorage.setItem("almacenId", response.user.almacenId?.toString() || "1"); // fallback 1
  localStorage.setItem("username", response.user.username);
        navigate("/dashboard");
      } else {
        setError(response.message || "Credenciales incorrectas. Intente nuevamente.");
      }
    } catch (err: any) {
      console.error("Error en login:", err);
      setError(err.response?.data?.message || "Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }   
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-3 sm:p-4 bg-[#0B0F19] relative overflow-hidden font-sans selection:bg-amber-500 selection:text-white login-container">
      
      {/* Fondos optimizados para todos los dispositivos */}
      <div className="absolute top-[-15%] left-[-15%] w-[250px] h-[250px] xs:w-[300px] xs:h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-amber-600/20 rounded-full blur-[60px] xs:blur-[80px] md:blur-[100px] lg:blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[250px] h-[250px] xs:w-[300px] xs:h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-green-900/20 rounded-full blur-[60px] xs:blur-[80px] md:blur-[100px] lg:blur-[120px]"></div>
      <div className="absolute top-[35%] left-[65%] w-[150px] h-[150px] xs:w-[200px] xs:h-[200px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] bg-yellow-700/10 rounded-full blur-[40px] xs:blur-[60px] md:blur-[80px] lg:blur-[100px]"></div>

      {/* Burbujas animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full animate-float blur-md"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              bottom: '-100px',
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`,
              background: `radial-gradient(circle at center, rgba(217, 119, 6, ${bubble.opacity}), transparent 70%)`,
            }}
          />
        ))}
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-20 items-center">
        
        {/* Logo para móvil y tablet */}
        <div className="lg:hidden flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 mb-2 sm:mb-4 animate-slide-in-up">
          <div className="relative mobile-logo">
            <div className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40">
              <div className="w-full h-full rounded-full glass-effect p-4 sm:p-6 flex items-center justify-center">
                <img 
                  src={PeruMarketERPLogo} 
                  alt="Peru Market Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl xs:text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200">
              Peru Market
            </h1>
            <p className="text-xs xs:text-sm sm:text-base text-gray-400 font-light px-4">
              Sistema de Gestión Empresarial
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full max-w-md mx-auto lg:mx-0 form-container animate-slide-in-up lg:animate-slide-in-right">
          <div className="relative glass-effect-intense p-4 xs:p-5 sm:p-6 md:p-8 lg:p-9 rounded-2xl sm:rounded-3xl">
            
            {/* Header del formulario */}
            <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
              <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
                Bienvenido
              </h2>
              <p className="text-gray-400 text-xs xs:text-sm sm:text-base">
                Ingrese sus credenciales para acceder
              </p>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-3 xs:mb-4 sm:mb-5 md:mb-6 p-2 xs:p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 xs:gap-3 animate-shake">
                <svg className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs xs:text-xs sm:text-sm text-red-200 flex-1">{error}</span>
              </div>
            )}

            {/* Campos del formulario */}
            <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
              
              {/* Campo usuario */}
              <div className="space-y-1 xs:space-y-2">
                <label className="text-xs font-medium text-gray-300 uppercase tracking-wider ml-1">
                  Usuario
                </label>
                <div className="relative group">
                  <div className="absolute left-3 xs:left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                    <svg className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full bg-[#1A1F2E] border border-gray-700 text-gray-200 rounded-xl py-2.5 xs:py-3 sm:py-3.5 pl-10 xs:pl-10 sm:pl-12 pr-3 xs:pr-4 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 placeholder-gray-600 text-sm xs:text-sm sm:text-base focus-visible:ring-amber-500"
                    placeholder="Ingrese su usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Campo contraseña */}
              <div className="space-y-1 xs:space-y-2">
                <label className="text-xs font-medium text-gray-300 uppercase tracking-wider ml-1">
                  Contraseña
                </label>
                <div className="relative group">
                  <div className="absolute left-3 xs:left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                    <svg className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-[#1A1F2E] border border-gray-700 text-gray-200 rounded-xl py-2.5 xs:py-3 sm:py-3.5 pl-10 xs:pl-10 sm:pl-12 pr-10 xs:pr-10 sm:pr-12 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 placeholder-gray-600 text-sm xs:text-sm sm:text-base focus-visible:ring-amber-500"
                    placeholder="Ingrese su contraseña"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 xs:right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer p-1"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Opciones adicionales */}
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0 pt-1">
                <label className="flex items-center cursor-pointer group order-2 xs:order-1">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 xs:w-4 xs:h-4 rounded border-gray-600 bg-[#1A1F2E] text-amber-600 focus:ring-2 focus:ring-amber-600/50 focus:ring-offset-0 transition-colors" 
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-xs xs:text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                    Recordarme
                  </span>
                </label>
                
                <button 
                  className="text-xs xs:text-sm text-amber-500 hover:text-amber-400 font-medium transition-colors order-1 xs:order-2 text-center xs:text-right mb-2 xs:mb-0"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón de login */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none login-button"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <div className="relative flex justify-center items-center gap-2 text-sm xs:text-sm sm:text-base">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar al Sistema</span>
                      <svg className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-4 xs:mt-5 sm:mt-6 md:mt-8 pt-3 xs:pt-4 sm:pt-5 md:pt-6 border-t border-gray-700/50 text-center">
              <p className="text-xs text-gray-500">
                &copy; 2024 Peru Market S.A.C. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>

        {/* Columna derecha - Solo en desktop */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6 xl:space-y-8 animate-slide-in-right">
          <div className="relative group cursor-default">
            <div className="absolute inset-0 bg-amber-500/20 blur-[80px] rounded-full group-hover:bg-amber-500/30 transition-all duration-700"></div>
            <div className="relative w-64 h-64 xl:w-80 xl:h-80 transition-transform duration-500 hover:scale-105">
              <div className="w-full h-full rounded-full glass-effect p-6 xl:p-8 flex items-center justify-center">
                <img 
                  src={PeruMarketERPLogo} 
                  alt="Peru Market Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 xl:space-y-4 max-w-lg">
            <h1 className="text-4xl xl:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 animate-shimmer bg-[length:200%_auto]">
              Peru Market
            </h1>
            <p className="text-base xl:text-lg text-gray-400 font-light leading-relaxed">
              Sistema Integral de Gestión Empresarial.<br/>
              <span className="text-amber-500/80">Eficiencia, Control y Crecimiento.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}