// Cas de test en espagnol (index-es.html) : personnes et entreprises fictives
CASES.push(
{
  name: "Almacén (ejemplo de la app)", lang: "es", offer: I18N.offer, cv: I18N.cv,
  ok: ["Preparación de pedidos", "Recepción de mercancías", "Control de calidad", "2 años de experiencia", "Carné de conducir B", "Trabajo en equipo", "Puntualidad", "Horarios por turnos"],
  mid: ["Gestión de stock", "Excel", "Rigor"],
  no: ["Inventarios", "Carné de carretillero", "Inglés"],
  absent: ["Mantenimiento"]
},
{
  name: "Cajero/a de supermercado", lang: "es",
  offer: `Cajero/a reponedor/a – Temporal 6 meses – Valencia
Funciones:
- Cobro en caja y atención al público
- Reposición de lineales y control de fechas
- Atención al cliente y gestión de devoluciones
Requisitos:
- 1 año de experiencia en comercio
- Bachillerato valorable
- Don de gentes y buena presencia
- Disponibilidad para trabajar fines de semana
- Manejo de herramientas informáticas a nivel usuario`,
  cv: `Marta Ejemplo Ruiz · Valencia · marta.ejemplo@correo.es · 611 222 333
Experiencia
Cajera, Supermercados Ejemplo (2019 - 2024): cobro en caja y atención de 250 clientes al día, apertura de la tienda los sábados, gestión de devoluciones.
Camarera, Bar Ejemplo del Puerto (2016 - 2019): servicio en sala, 80 cubiertos.
Competencias
Word, sonrisa, trabajo en equipo
Formación
Graduado en ESO (2016)`,
  ok: ["Cobro en caja", "Atención al público", "Atención al cliente", "1 año de experiencia", "Horarios por turnos"],
  mid: ["Herramientas informáticas", "Don de gentes"],
  no: ["Título: Bachillerato"],
  absent: ["Servicio en sala"]
},
{
  name: "Auxiliar de geriatría", lang: "es",
  offer: `Auxiliar de geriatría (TCAE) – Residencia de mayores – Salamanca
Buscamos auxiliar de enfermería para nuestra residencia.
Funciones:
- Atención a personas mayores y dependientes
- Higiene personal y ayuda en el aseo de los residentes
- Ayuda en las comidas y preparación de comidas sencillas
- Registro de cuidados en la historia clínica
Requisitos:
- Título de TCAE imprescindible
- Empatía, paciencia y discreción
- Turnos rotativos, incluidos fines de semana y festivos
- Formación en primeros auxilios valorable`,
  cv: `Rosa Ejemplo · Salamanca · rosa.ejemplo@correo.es · 622 333 444
Experiencia profesional
Auxiliar de ayuda a domicilio, Ejemplo Cuidados SL (2020 - actualidad): atención a 6 personas mayores cada semana, aseo personal, preparación de comidas.
Cuidadora interna, familia particular (2018 - 2020): acompañamiento de una persona dependiente, con mucha paciencia y escucha.
Formación
Técnico en Cuidados Auxiliares de Enfermería (TCAE), IES Ejemplo (2018)
Competencias
Discreción, turnos de noche, fines de semana`,
  ok: ["Atención a personas mayores", "Higiene personal", "Preparación de comidas", "Título de TCAE (auxiliar de enfermería)", "Escucha y empatía", "Horarios por turnos"],
  mid: ["Discreción"],
  no: ["Primeros auxilios"],
  absent: ["Enfermería"]
},
{
  name: "Camarero/a (anuncio sin viñetas)", lang: "es",
  offer: `Camarero/a de sala para restaurante en Málaga
Funciones
Atender a los clientes y tomar las comandas
Servicio en sala y en terraza
Montar y recoger las mesas
Cobrar las cuentas de los clientes
Perfil
Se valora experiencia en hostelería
Trabajo en fines de semana y festivos`,
  cv: `Javier Ejemplo · Málaga · javier.ejemplo@correo.es · 633 444 555
Experiencia
Camarero, Restaurante Ejemplo (2018-2022): servicio de 60 cubiertos, montaje de la sala, cobro de las cuentas.
Competencias
Carné de manipulador de alimentos, inglés fluido`,
  ok: ["Servicio en sala", "Se valora experiencia en hostelería"], no: ["Horarios por turnos"],
  minPoints: 4
},
{
  name: "Técnico/a de sistemas (anuncio sin viñetas)", lang: "es",
  offer: `En dependencia directa de la Dirección, tus principales funciones serán:

Administrar y mantener los servidores, los equipos y la red de la empresa
Gestionar las copias de seguridad y restaurar los datos cuando haga falta
Dar soporte a los usuarios de nivel 1 y 2
Gestionar las cuentas de usuario y los permisos en el directorio activo
Redactar la documentación técnica de la infraestructura

Requisitos: experiencia mínima de 3 años en administración de sistemas, conocimientos de virtualización (VMware), inglés técnico valorable.`,
  cv: `Daniel Ejemplo · Valladolid · daniel.ejemplo@correo.es · 644 555 666
Experiencia profesional
Técnico de sistemas, Ejemplo Informática SL (2019 - 2025): administración de 40 servidores Windows y Linux, copias de seguridad con Veeam, soporte de nivel 2 a 300 usuarios, cuentas y permisos en Active Directory.
Técnico de soporte, Ejemplo Servicios (2017 - 2019): atención a usuarios, instalación de equipos.
Formación
Técnico superior en Administración de Sistemas Informáticos en Red (2017)
Competencias
VMware, PowerShell, redes TCP/IP`,
  ok: ["Administración de servidores", "Copias de seguridad", "Soporte a usuarios", "Cuentas y permisos de acceso", "3 años de experiencia"],
  mid: ["Virtualización"],
  no: ["Documentación técnica", "Inglés"],
  minPoints: 7
},
{
  name: "Administrativo/a contable", lang: "es",
  offer: `Administrativo/a contable – Jornada completa – Murcia
Funciones:
- Facturación a clientes y control de cobros
- Contabilidad general y conciliación bancaria
- Archivo de la documentación
- Atención telefónica y gestión de la agenda de la dirección
Requisitos:
- Dominio de Excel imprescindible
- Experiencia con software de gestión (A3 o similar)
- Persona organizada y con atención al detalle`,
  cv: `Lucas Ejemplo · Murcia · lucas.ejemplo@correo.es · 655 666 777
Experiencia
Auxiliar administrativo, Ejemplo Asesores (2021 - 2025): emisión de 100 facturas al mes, archivo de expedientes, atención de 50 llamadas al día.
Formación
Técnico superior en Administración y Finanzas (2021)
Competencias
Excel, contabilidad, A3, organización`,
  ok: ["Facturación", "Archivo y clasificación", "Atención telefónica"],
  mid: ["Excel", "Contabilidad", "Software de gestión (ERP)", "Organización"],
  no: ["Gestión de agendas", "Rigor"]
},
{
  name: "Anuncio sospechoso y revisión del CV", lang: "es",
  offer: `Teleoperador/a desde casa – Valencia
Gana hasta 300 € al día sin experiencia. Paga una cuota de inscripción para empezar.
Contacta por WhatsApp y envía una copia de tu DNI y tus datos bancarios a seleccion.ya@gmail.com.`,
  cv: `Alba Ejemplo
Experiencia
Dependienta, Tienda Ejemplo (2020 - 2023): encargada de la caja y la atencion al cliente, tareas varias en la tienda
Competencias
Comunicacion, trabajo en equipo, abilidades sociales`,
  ad: {facts: {place: "Valencia"}, missing: ["contract"], flags: ["pay", "tooGood", "chat", "data", "mail"]},
  review: {typos: [["atencion", "atención"], ["Comunicacion", "Comunicación"], ["abilidades", "habilidades"]], types: ["weak", "nonum"]}
},
{
  name: "Datos del anuncio (salario, contrato, jornada)", lang: "es",
  offer: `Dependiente/a de panadería – Valencia
Contrato indefinido, jornada completa de 40 horas semanales.
Salario: 1.350 € brutos al mes en 14 pagas.
Incorporación inmediata.
Funciones: venta en mostrador, cobro en caja, reposición de lineales.`,
  cv: `Pablo Ejemplo
Experiencia
Dependiente, Panadería Ejemplo (2021 - 2023): venta y cobro de 150 clientes al día`,
  ad: {facts: {contract: "indefinido", salary: "1.350 € brutos al mes", hours: "jornada completa", start: "Incorporación inmediata", place: "Valencia"}, noFlags: true}
},
{
  name: "Anuncio copiado de una web de empleo", lang: "es",
  offer: `Inicio
Iniciar sesión
Mozo/a de almacén – Indefinido – Getafe
Publicada hace 3 días
Inscribirme en esta oferta
Funciones:
- Preparación de pedidos con radiofrecuencia
- Carga y descarga de camiones
Requisitos:
- Carné de carretillero imprescindible
Ofertas similares
Aceptar todas las cookies`,
  cv: `Iván Ejemplo
Experiencia
Mozo de almacén, Ejemplo Logística (2020 - 2024): preparación de 200 pedidos al día, carga y descarga de camiones`,
  clean: {removed: ["Inicio", "Iniciar sesión", "Publicada hace 3 días", "Inscribirme en esta oferta", "Ofertas similares", "Aceptar todas las cookies"], kept: ["Mozo/a de almacén – Indefinido – Getafe", "Preparación de pedidos con radiofrecuencia"]},
  ok: ["Preparación de pedidos", "Manipulación de cargas"], no: ["Carné de carretillero"]
}
);
