export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="w-full px-8 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Mapa de Emergencia Venezuela
            </h3>
            
            <p className="text-sm text-text-secondary leading-6">
              Esta es una herramienta ciudadana, independiente y sin fines
              políticos, creada para facilitar el acceso y la difusión de
              información durante situaciones de emergencia.
            </p>

            <p className="text-sm text-text-secondary leading-6">
              Antes de compartir un reporte, verifica la información siempre que
              sea posible. Ante una emergencia médica o de riesgo inminente,
              comunícate con los organismos oficiales de rescate de tu zona.
            </p>

            <p className="text-sm text-text-secondary leading-6">
              Este proyecto fue desarrollado de forma completamente voluntaria
              con el objetivo de ayudar a la comunidad venezolana.
            </p>
          </div>
          <div className="space-y-4 md:text-right">
            <h3 className="text-lg font-semibold text-text-primary">
              Contacto
            </h3>
            <a
              href="mailto:mapaemergenciavenezuela@gmail.com"
              className="block text-blue-600 hover:underline"
            >mapaemergenciavenezuela@gmail.com
            </a>
            <p className="text-xs text-text-secondary">⚠️ Esta plataforma se encuentra en desarrollo activo. Algunas funciones pueden cambiar o mejorar con el tiempo.</p>
            <p className="text-xs text-text-secondary mt-4">
                Si tienes sugerencias, detectas información incorrecta o deseas
                colaborar con el proyecto, no dudes en escribirnos.
            </p>
          </div>

        </div>

      </div>
    </footer>
  )
}