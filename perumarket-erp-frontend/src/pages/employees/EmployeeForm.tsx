import { useRef, type FormEvent, useState } from "react";
import type { Departament, Employee } from "../../types/Employee";
import { LuUpload, LuImage, LuFileText, LuTrash2, LuX, LuUsers } from "react-icons/lu";

interface Props {
  state: Employee;
  setField: (field: string, value: any) => void;
  onCancel: () => void;
  onSave: (emp: Employee) => void;
  departamentos: Departament[];
}

export default function EmployeeForm({
  state,
  setField,
  onCancel,
  onSave,
  departamentos,
}: Props) {
  const fotoFileRef = useRef<HTMLInputElement>(null);
  const cvFileRef = useRef<HTMLInputElement>(null);
  const currentFotoBlobUrl = useRef<string | null>(null);
  const [selectedFotoFile, setSelectedFotoFile] = useState<File | null>(null);
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null);

  const cleanupPreviousFotoBlob = () => {
    if (currentFotoBlobUrl.current?.startsWith('blob:')) {
      URL.revokeObjectURL(currentFotoBlobUrl.current);
      currentFotoBlobUrl.current = null;
    }
  };

  function submit(e: FormEvent) {
    e.preventDefault();
    
    // Validaciones básicas
    if (!state.persona.nombres.trim()) return alert("El nombre es obligatorio");
    if (!state.persona.apellidoPaterno.trim()) return alert("El apellido paterno es obligatorio");
    if (!state.persona.numeroDocumento.trim()) return alert("El documento es obligatorio");
    if (!state.departamento?.id) return alert("Debe seleccionar un departamento");
    
    // Crear copia del empleado con los archivos
    const employeeToSave = {
      ...state,
      fotoFile: selectedFotoFile,  // Agregar el archivo de foto
      cvFile: selectedCvFile,      // Agregar el archivo de CV
    };
    
    onSave(employeeToSave);
  }

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) return alert('Archivo no válido');
      if (file.size > 5 * 1024 * 1024) return alert('Máximo 5MB');
      
      // Guardar el archivo
      setSelectedFotoFile(file);
      
      // Crear preview temporal
      cleanupPreviousFotoBlob();
      const imageUrl = URL.createObjectURL(file);
      currentFotoBlobUrl.current = imageUrl;
      setField("foto", imageUrl); // Temporal para preview
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') return alert('Solo PDF');
      if (file.size > 10 * 1024 * 1024) return alert('Máximo 10MB');
      
      // Guardar el archivo
      setSelectedCvFile(file);
      setField("cv", file.name);
    }
  };

  const handleRemoveFoto = () => {
    cleanupPreviousFotoBlob();
    setSelectedFotoFile(null);
    setField("foto", "");
    if (fotoFileRef.current) fotoFileRef.current.value = "";
  };

  const handleRemoveCv = () => {
    setSelectedCvFile(null);
    setField("cv", "");
    if (cvFileRef.current) cvFileRef.current.value = "";
  };

  const shouldShowFotoPreview = state.foto && (state.foto.startsWith('blob:') || state.foto.startsWith('http') || state.foto.startsWith('data:'));
  const hasExistingFoto = state.foto && !state.foto.startsWith('blob:');

  // --- Clases Reutilizables ---
  const sectionTitleClass = "text-lg font-bold text-slate-800 pb-2 border-b border-slate-100 mb-6";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
  const inputClass = "block w-full rounded-lg border-slate-300 bg-slate-50 focus:bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 transition-colors border";

  return (
    <>
      {/* 1. HEADER FIJO */}
      <div className="flex-none px-6 py-5 border-b border-slate-200 bg-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {state.empleadoId ? "Editar Empleado" : "Nuevo Empleado"}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Diligencie la información requerida</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100">
          <LuX className="w-6 h-6" />
        </button>
      </div>

      {/* 2. BODY SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/50">
        <form id="employee-form" onSubmit={submit} className="space-y-10">
          
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <section>
            <h3 className={sectionTitleClass}>Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className={labelClass}>Nombres *</label>
                <input 
                  type="text" 
                  value={state.persona.nombres}
                  onChange={(e) => setField('persona.nombres', e.target.value)}
                  className={inputClass} 
                  required
                />
              </div>
              
              <div>
                <label className={labelClass}>Apellido Paterno *</label>
                <input 
                  type="text" 
                  value={state.persona.apellidoPaterno}
                  onChange={(e) => setField('persona.apellidoPaterno', e.target.value)}
                  className={inputClass} 
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Apellido Materno</label>
                <input 
                  type="text" 
                  value={state.persona.apellidoMaterno}
                  onChange={(e) => setField('persona.apellidoMaterno', e.target.value)}
                  className={inputClass} 
                />
              </div>

              <div>
                <label className={labelClass}>Documento de Identidad *</label>
                <input 
                  type="text" 
                  className={inputClass} 
                  value={state.persona.numeroDocumento}
                  onChange={(e) => setField('persona.numeroDocumento', e.target.value)}
                  required
                />
              </div>

              <div>
                 <label className={labelClass}>Fecha de Nacimiento</label>
                 <input 
                   type="date"
                   className={inputClass}
                   value={state.persona.fechaNacimiento || ""}
                   onChange={(e) => setField('persona.fechaNacimiento', e.target.value)}
                 />
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: CONTACTO */}
          <section>
            <h3 className={sectionTitleClass}>Datos de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className={labelClass}>Correo Electrónico</label>
                   <input 
                     type="email"
                     className={inputClass}
                     value={state.persona.correo}
                     onChange={(e) => setField('persona.correo', e.target.value)}
                     placeholder="ejemplo@empresa.com"
                   />
                </div>

                <div>
                   <label className={labelClass}>Teléfono / Celular</label>
                   <input 
                     type="tel"
                     className={inputClass}
                     value={state.persona.telefono}
                     onChange={(e) => setField('persona.telefono', e.target.value)}
                     placeholder="+51 999 999 999"
                   />
                </div>

                <div className="md:col-span-2">
                   <label className={labelClass}>Dirección Domiciliaria</label>
                   <input 
                     type="text"
                     className={inputClass}
                     value={state.persona.direccion}
                     onChange={(e) => setField('persona.direccion', e.target.value)}
                   />
                </div>
            </div>
          </section>

          {/* SECCIÓN 3: DATOS LABORALES */}
          <section>
            <h3 className={sectionTitleClass}>Información Laboral</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               <div>
                 <label className={labelClass}>Departamento *</label>
                 <select 
                   className={inputClass}
                   value={state.departamento?.id || ""} 
                   onChange={(e) => {
                      const id = Number(e.target.value);
                      setField('departamento', id ? { id } : null);
                   }}
                   required
                 >
                   <option value="">Seleccione...</option>
                   {departamentos.map(d => (
                     <option key={d.id} value={d.id}>{d.nombre}</option>
                   ))}
                 </select>
               </div>

               <div>
                 <label className={labelClass}>Cargo / Puesto</label>
                 <input 
                   type="text"
                   className={inputClass}
                   value={state.puesto}
                   onChange={(e) => setField('puesto', e.target.value)}
                 />
               </div>

               <div>
                 <label className={labelClass}>Sueldo (S/.)</label>
                 <input 
                   type="number"
                   step="0.01"
                   className={inputClass}
                   value={state.sueldo}
                   onChange={(e) => setField('sueldo', Number(e.target.value))}
                 />
               </div>

               <div>
                 <label className={labelClass}>Fecha de Contratación</label>
                 <input 
                   type="date"
                   className={inputClass}
                   value={state.fechaContratacion}
                   onChange={(e) => setField('fechaContratacion', e.target.value)}
                 />
               </div>

               <div>
                  <label className={labelClass}>Estado</label>
                  <select
                    className={inputClass}
                    value={state.estado}
                    onChange={(e) => setField('estado', e.target.value)}
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                    <option value="VACACIONES">VACACIONES</option>
                    <option value="LICENCIA">LICENCIA</option>
                  </select>
               </div>
            </div>
          </section>

          {/* SECCIÓN 4: DOCUMENTOS */}
          <section>
            <h3 className={sectionTitleClass}>Documentación Adjunta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Foto Upload */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <LuImage className="text-indigo-500" /> Fotografía
                </label>
                
                <div className="flex gap-4 items-start">
                   <div className="shrink-0 h-20 w-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                      {shouldShowFotoPreview || hasExistingFoto ? (
                        <img 
                          src={hasExistingFoto ? `/uploads/fotos/${state.foto}` : state.foto} 
                          alt="Preview" 
                          className="h-full w-full object-cover" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            // Mostrar placeholder si hay error
                            const placeholder = e.currentTarget.parentElement?.querySelector('.foto-placeholder');
                            if (placeholder) {
                              (placeholder as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className={`foto-placeholder ${shouldShowFotoPreview || hasExistingFoto ? 'hidden' : 'flex'} items-center justify-center h-full w-full`}>
                        <LuUsers className="h-8 w-8 text-slate-300" />
                      </div>
                   </div>
                   
                   <div className="flex-1">
                      <input 
                        ref={fotoFileRef}
                        type="file" 
                        accept="image/*"
                        onChange={handleFotoChange}
                        className="hidden" 
                        id="foto-upload"
                      />
                      <label 
                        htmlFor="foto-upload"
                        className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-xs font-medium rounded text-slate-700 bg-white hover:bg-slate-50 mb-2"
                      >
                        <LuUpload className="mr-1.5 h-3.5 w-3.5" /> Subir Imagen
                      </label>
                      <p className="text-xs text-slate-400">JPG, PNG. Máx 5MB.</p>
                      
                      {(shouldShowFotoPreview || hasExistingFoto) && (
                        <button 
                          type="button" 
                          onClick={handleRemoveFoto} 
                          className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center"
                        >
                          <LuTrash2 className="mr-1 h-3 w-3" /> Quitar
                        </button>
                      )}
                      
                      {selectedFotoFile && (
                        <p className="mt-1 text-xs text-emerald-600">
                          Nueva foto: {selectedFotoFile.name}
                        </p>
                      )}
                      
                      {hasExistingFoto && !shouldShowFotoPreview && (
                        <p className="mt-1 text-xs text-slate-500">
                          Foto actual: {state.foto}
                        </p>
                      )}
                   </div>
                </div>
              </div>

              {/* CV Upload */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <LuFileText className="text-indigo-500" /> Curriculum Vitae
                </label>
                
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors">
                  <input 
                    ref={cvFileRef}
                    type="file" 
                    accept="application/pdf"
                    onChange={handleCvChange}
                    className="hidden"
                    id="cv-upload"
                  />
                  
                  {!state.cv && !selectedCvFile ? (
                    <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center">
                      <LuUpload className="h-8 w-8 text-slate-300 mb-2" />
                      <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Subir PDF</span>
                      <span className="text-xs text-slate-400 mt-1">Máx 10MB</span>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between bg-indigo-50 p-2 rounded border border-indigo-100">
                      <div className="flex items-center overflow-hidden">
                        <LuFileText className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                        <div className="text-left">
                          <span className="text-sm text-indigo-900 truncate block">
                            {selectedCvFile ? selectedCvFile.name : state.cv}
                          </span>
                          {selectedCvFile && (
                            <span className="text-xs text-emerald-600">(nuevo archivo)</span>
                          )}
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={handleRemoveCv}
                        className="ml-2 text-slate-400 hover:text-red-500"
                      >
                        <LuX className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>

      {/* 3. FOOTER FIJO */}
      <div className="flex-none bg-white px-6 py-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
        <button
          type="button"
          onClick={() => { cleanupPreviousFotoBlob(); onCancel(); }}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="employee-form"
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          Guardar Información
        </button>
      </div>
    </>
  );
}