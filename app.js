document.addEventListener("DOMContentLoaded", () => {
  // PASO 1: Selección de elementos  DOM
  const btnToggle = document.getElementById("btn-toggle-formulario");
  const desplegable = document.getElementById("desplegable-wrapper");
  const form = document.getElementById("formulario-contacto");
  const nombreInput = document.getElementById("nombre");
  const mailInput = document.getElementById("mail");
  const mensajeInput = document.getElementById("mensaje");
  const estadoBox = document.getElementById("mensaje-estado");
  const btnEnviar = document.getElementById("btn-enviar");
  const grillaServicios = document.getElementById("grilla-servicios");
  const apiEstado = document.getElementById("api-estado");
  const grillaCotizaciones = document.getElementById("grilla-cotizaciones");

  // Botones de seguridad del Footer
  const btnRevelarMail = document.getElementById("btn-revelar-mail");
  const textoMail = document.getElementById("texto-mail");
  const btnRevelarTel = document.getElementById("btn-revelar-tel");
  const textoTel = document.getElementById("texto-tel");

  // PASO 2: Protección de datos de contacto mediante ofuscación en JS
  if (btnRevelarMail && textoMail) {
    let mailMostrado = false;
    btnRevelarMail.addEventListener("click", () => {
      const usuario = "contacto";
      const dominio = "asistentevirtualcontable.com";
      const direccionCompleta = `${usuario}@${dominio}`;

      if (!mailMostrado) {
        textoMail.textContent = direccionCompleta;
        btnRevelarMail.classList.add("revelado");
        mailMostrado = true;
      } else {
        window.location.href = `mailto:${direccionCompleta}`;
      }
    });
  }

  if (btnRevelarTel && textoTel) {
    let telMostrado = false;
    btnRevelarTel.addEventListener("click", () => {
      const codigoPais = "+54 9 11";
      const numero = "2345-6789";
      const telVisible = `${codigoPais} ${numero}`;
      const telLimpio = "+5491123456789";

      if (!telMostrado) {
        textoTel.textContent = telVisible;
        btnRevelarTel.classList.add("revelado");
        telMostrado = true;
      } else {
        window.location.href = `tel:${telLimpio}`;
      }
    });
  }

  // PASO 3: Renderizado dinámico de tarjetas de servicios (Requisito PDF)
  const servicios = [
    {
      id: 1,
      icono: "📋",
      titulo: "Monotributo",
      descripcion:
        "Inscripciones y altas, recategorizaciones semestrales, facturación electrónica y seguimiento mensual de límites para evitar exclusiones.",
      detalles: [
        "Alta y baja de actividades",
        "Control mensual de facturación",
        "Generación de VEPs de pago"
      ]
    },
    {
      id: 2,
      icono: "👥",
      titulo: "Liquidación de Sueldos",
      descripcion:
        "Confección de recibos de sueldo, aplicación de convenios colectivos vigentes, cargas sociales (F. 931) y asesoramiento laboral integral.",
      detalles: [
        "Recibos digitales y libro de sueldos",
        "Declaraciones Juradas",
        "Asesoramiento Laboral"
      ]
    },
    {
      id: 3,
      icono: "📑",
      titulo: "Impuestos",
      descripcion:
        "Presentación de declaraciones juradas de Ingresos Brutos (locales y Convenio Multilateral), IVA, planes de pago.",
      detalles: [
        "Ingresos Brutos y Convenio Multilateral",
        "Regímenes de retención y percepción",
        "Moratorias y regularización fiscal"
      ]
    }
  ];

  function renderizarServicios(lista) {
    if (!grillaServicios) return;
    grillaServicios.innerHTML = "";
    for (let i = 0; i < lista.length; i++) {
      const item = lista[i];
      const itemsLista = item.detalles.map((d) => `<li>${d}</li>`).join("");
      grillaServicios.innerHTML += `
        <article class="card">
          <div class="card-icono">${item.icono}</div>
          <h3 class="card-titulo">${item.titulo}</h3>
          <p class="card-texto">${item.descripcion}</p>
          <ul class="card-lista">
            ${itemsLista}
          </ul>
        </article>
      `;
    }
  }

  renderizarServicios(servicios);

  // PASO 4: Recuperación de localStorage al iniciar sesión
  const nombreGuardado = localStorage.getItem("asistente_ultimo_nombre");
  const mailGuardado = localStorage.getItem("asistente_ultimo_mail");
  if (nombreGuardado && nombreInput) nombreInput.value = nombreGuardado;
  if (mailGuardado && mailInput) mailInput.value = mailGuardado;

  // PASO 5: Alternar apertura y cierre del formulario desplegable
  if (btnToggle && desplegable) {
    const cerrarFormulario = () => {
      desplegable.classList.remove("abierto");
      btnToggle.classList.remove("activo");
      btnToggle.setAttribute("aria-expanded", "false");
      btnToggle.textContent = "Consulta";
      if (estadoBox) {
        estadoBox.textContent = "";
        estadoBox.className = "mensaje-estado";
      }
    };

    const abrirFormulario = () => {
      desplegable.classList.add("abierto");
      btnToggle.classList.add("activo");
      btnToggle.setAttribute("aria-expanded", "true");
      btnToggle.textContent = "Cerrar formulario";
      if (nombreInput) setTimeout(() => nombreInput.focus(), 300);
    };

    btnToggle.addEventListener("click", () => {
      const estaAbierto = desplegable.classList.contains("abierto");
      estaAbierto ? cerrarFormulario() : abrirFormulario();
    });
  }

  // PASO 6: Funciones de notificación y validación
  const mostrarMensaje = (texto, tipo) => {
    if (!estadoBox) return;
    estadoBox.textContent = texto;
    estadoBox.className = `mensaje-estado ${tipo}`;
  };

  const esMailValido = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
  };

  // PASO 7: Envío del formulario y persistencia en localStorage
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = nombreInput.value.trim();
      const mail = mailInput.value.trim();
      const mensaje = mensajeInput.value.trim();

      if (!nombre || !mail || !mensaje) {
        mostrarMensaje("Por favor, completá todos los campos requeridos.", "error");
        return;
      }

      if (!esMailValido(mail)) {
        mostrarMensaje("Por favor, ingresá un formato de mail válido.", "error");
        mailInput.focus();
        return;
      }

      btnEnviar.disabled = true;
      const textoOriginal = btnEnviar.textContent;
      btnEnviar.textContent = "Enviando...";

      setTimeout(() => {
        const nuevaConsulta = {
          nombre,
          mail,
          mensaje,
          fecha: new Date().toISOString()
        };

        const consultasPrevias = JSON.parse(
          localStorage.getItem("asistente_consultas") || "[]"
        );
        consultasPrevias.push(nuevaConsulta);

        localStorage.setItem("asistente_consultas", JSON.stringify(consultasPrevias));
        localStorage.setItem("asistente_ultimo_nombre", nombre);
        localStorage.setItem("asistente_ultimo_mail", mail);

        mostrarMensaje("¡Mensaje enviado con éxito! Te responderemos a la brevedad.", "exito");
        mensajeInput.value = "";
        btnEnviar.disabled = false;
        btnEnviar.textContent = textoOriginal;

        setTimeout(() => {
          if (desplegable && btnToggle) {
            desplegable.classList.remove("abierto");
            btnToggle.classList.remove("activo");
            btnToggle.setAttribute("aria-expanded", "false");
            btnToggle.textContent = "Consulta";
            if (estadoBox) {
              estadoBox.textContent = "";
              estadoBox.className = "mensaje-estado";
            }
          }
        }, 2000);
      }, 800);
    });
  }

  // PASO 8: Consumo asincrónico de API con Fetch
  const obtenerCotizaciones = async () => {
    if (!apiEstado || !grillaCotizaciones) return;

    try {
      apiEstado.textContent = "Consultando cotizaciones oficiales...";
      const respuesta = await fetch("https://dolarapi.com/v1/dolares");

      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }

      const cotizaciones = await respuesta.json();
      const tiposFiltro = ["oficial", "blue", "bolsa"];
      const datosFiltrados = cotizaciones.filter((item) =>
        tiposFiltro.includes(item.casa)
      );

      apiEstado.style.display = "none";
      grillaCotizaciones.innerHTML = "";

      datosFiltrados.forEach((item) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-moneda";
        tarjeta.innerHTML = `
          <h4>Dólar ${item.nombre}</h4>
          <p><strong>Compra:</strong> $${item.compra}</p>
          <p><strong>Venta:</strong> $${item.venta}</p>
        `;
        grillaCotizaciones.appendChild(tarjeta);
      });
    } catch (error) {
      console.error("Error al consumir API:", error);
      apiEstado.textContent = "No se pudieron cargar las cotizaciones en este momento.";
      apiEstado.style.color = "var(--color-error)";
    }
  };

  obtenerCotizaciones();
});