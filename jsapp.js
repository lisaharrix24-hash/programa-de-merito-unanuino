/* =====================================
   PROGRAMA DE MÉRITO UNANUINO
   PARTE 1
   CONFIGURACIÓN GENERAL
===================================== */

/* CANTIDAD DE ESTUDIANTES */
const CANTIDAD_FILAS = 27;

/* AUTOGUARDADO CADA 10 SEGUNDOS */
const TIEMPO_AUTO_GUARDADO = 10000;

/* VARIABLES GLOBALES */
let intervaloGuardado = null;
let usuarioActual = null;
let gradoActual = null;

/* FIREBASE */
const firebaseConfig = {
  apiKey: "AIzaSyAPGuaA4HSnaaoKP1SDkQ8YLfVo0Z_m-hg",
  authDomain: "programa-de-merito-unanuino.firebaseapp.com",
  projectId: "programa-de-merito-unanuino",
  storageBucket: "programa-de-merito-unanuino.firebasestorage.app",
  messagingSenderId: "1721316487",
  appId: "1:1721316487:web:d6787a7e5c300f9d13f422"
};

/* INICIALIZAR SOLO UNA VEZ */
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

/* INSTANCIAS */
const auth = firebase.auth();
const db = firebase.firestore();

/* =====================================
   CERRAR SESIÓN
===================================== */
function cerrarSesion() {
  auth.signOut();
}

/* =====================================
   LOGIN
===================================== */
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((credencial) => {
      usuarioActual = credencial.user;
      const errorBox = document.getElementById("loginError");
      if (errorBox) errorBox.textContent = "";
    })
    .catch((error) => {
      const errorBox = document.getElementById("loginError");
      if (errorBox) errorBox.textContent = "Error: " + error.message;
    });
}

/* =====================================
   CONTROL DE SESIÓN
===================================== */
auth.onAuthStateChanged((user) => {
  const loginBox = document.getElementById("loginBox");
  const ficha = document.querySelector(".ficha");

  if (user) {
    usuarioActual = user;

    if (loginBox) loginBox.style.display = "none";
    if (ficha) ficha.style.display = "block";
  } else {
    usuarioActual = null;

    if (loginBox) loginBox.style.display = "flex";
    if (ficha) ficha.style.display = "none";
  }
});
/* =====================================
   GENERAR FILAS
===================================== */

function generarFilas() {

    const cuerpoBasicos = document.querySelector("#tablaBasicos tbody");
    const cuerpoDestacados = document.querySelector("#tablaDestacados tbody");

    if (!cuerpoBasicos || !cuerpoDestacados) return;

    cuerpoBasicos.innerHTML = "";
    cuerpoDestacados.innerHTML = "";

    for (let i = 1; i <= CANTIDAD_FILAS; i++) {

        const filaBasicos = document.createElement("tr");

        filaBasicos.innerHTML = `
            <td>${i}</td>
            <td>
                <input
                    type="text"
                    id="nomB${i}"
                    class="nombreAlumno"
                    data-fila="${i}"
                    placeholder="Nombre del estudiante">
            </td>
            <td><input type="checkbox" class="basico" data-fila="${i}" data-valor="1"></td>
            <td><input type="checkbox" class="basico" data-fila="${i}" data-valor="1"></td>
            <td><input type="checkbox" class="basico" data-fila="${i}" data-valor="1"></td>
            <td><input type="checkbox" class="basico" data-fila="${i}" data-valor="1"></td>
            <td>
<input
type="text"
id="resB${i}"
value="0"
readonly>
</td>
            </td>
        `;

        cuerpoBasicos.appendChild(filaBasicos);

        const filaDestacados = document.createElement("tr");

        filaDestacados.innerHTML = `
            <td>${i}</td>
            <td>
                <input
                    type="text"
                    id="nomD${i}"
                    readonly>
                    
            </td>
            <td><input type="checkbox" class="destacado" data-fila="${i}" data-valor="2"></td>
            <td><input type="checkbox" class="destacado" data-fila="${i}" data-valor="2"></td>
            <td><input type="checkbox" class="destacado" data-fila="${i}" data-valor="2"></td>
            <td><input type="checkbox" class="destacado" data-fila="${i}" data-valor="3"></td>
            <td><input type="checkbox" class="destacado" data-fila="${i}" data-valor="3"></td>
            <td><input type="checkbox" class="destacado" data-fila="${i}" data-valor="3"></td>
            <td>
                <input
                    type="text"
                    id="resD${i}"
                    value="0"
                    readonly>
            </td>
        `;

        cuerpoDestacados.appendChild(filaDestacados);
    }

    document.querySelectorAll(".basico, .destacado").forEach(check => {
        check.addEventListener("change", calcular);
    });

    document.querySelectorAll(".nombreAlumno").forEach(input => {
        input.addEventListener("input", function () {
            const fila = this.dataset.fila;
            const nombreDestacado = document.getElementById(`nomD${fila}`);
            if (nombreDestacado) {
                nombreDestacado.value = this.value;
            }
        });
    });
}
/* =====================================
   CALCULAR PUNTAJES
===================================== */

function calcular() {
    let totalBasicos = 0;
    let totalDestacados = 0;

    for (let i = 1; i <= CANTIDAD_FILAS; i++) {

        let sumaBasicos = 0;
        const checksBasicos = document.querySelectorAll(`.basico[data-fila="${i}"]`);

        checksBasicos.forEach(check => {
            if (check.checked) {
                sumaBasicos += parseInt(check.dataset.valor, 10);
            }
        });

        const resB = document.getElementById(`resB${i}`);
        if (resB) resB.value = sumaBasicos;

        totalBasicos += sumaBasicos;

        let sumaDestacados = 0;
        const checksDestacados = document.querySelectorAll(`.destacado[data-fila="${i}"]`);

        checksDestacados.forEach(check => {
            if (check.checked) {
                sumaDestacados += parseInt(check.dataset.valor, 10);
            }
        });

        const resD = document.getElementById(`resD${i}`);
        if (resD) resD.value = sumaDestacados;

        totalDestacados += sumaDestacados;
    }

    const totalBasicosInput = document.getElementById("totalBasicos");
    const totalDestacadosInput = document.getElementById("totalDestacados");
    const totalSemanaInput = document.getElementById("totalSemana");

    if (totalBasicosInput) totalBasicosInput.value = totalBasicos;
    if (totalDestacadosInput) totalDestacadosInput.value = totalDestacados;
    if (totalSemanaInput) totalSemanaInput.value = totalBasicos + totalDestacados;
}

/* =====================================
   MENSAJE DE GUARDADO
===================================== */

function mostrarAvisoGuardado() {
    const aviso = document.getElementById("avisoGuardado");
    if (!aviso) return;

    aviso.textContent = "Datos guardados correctamente";

    setTimeout(() => {
        aviso.textContent = "";
    }, 2500);
}
/* =====================================
   GUARDAR DATOS EN FIRESTORE
===================================== */

async function guardarDatos() {
    if (!usuarioActual || !db) return;

    const grado = document.getElementById("gradoSeccion")?.value;
    if (!grado) return;

    gradoActual = grado;

    const datos = {
        docente: usuarioActual.email || "",
        tutor: document.getElementById("tutor")?.value || "",
        semana: document.getElementById("semana")?.value || "",
        fechaInicio: document.getElementById("fechaInicio")?.value || "",
        fechaFin: document.getElementById("fechaFin")?.value || "",
        observaciones: document.getElementById("observaciones")?.value || "",
        totalBasicos: document.getElementById("totalBasicos")?.value || "0",
        totalDestacados: document.getElementById("totalDestacados")?.value || "0",
        totalSemana: document.getElementById("totalSemana")?.value || "0",
        fechaGuardado: new Date().toISOString(),
        alumnos: []
    };

    for (let i = 1; i <= CANTIDAD_FILAS; i++) {
        const basicos = document.querySelectorAll(`.basico[data-fila="${i}"]`);
        const destacados = document.querySelectorAll(`.destacado[data-fila="${i}"]`);

        datos.alumnos.push({
            nombre: document.getElementById(`nomB${i}`)?.value || "",
            basicos: [
                basicos[0]?.checked || false,
                basicos[1]?.checked || false,
                basicos[2]?.checked || false,
                basicos[3]?.checked || false
            ],
            destacados: [
                destacados[0]?.checked || false,
                destacados[1]?.checked || false,
                destacados[2]?.checked || false,
                destacados[3]?.checked || false,
                destacados[4]?.checked || false,
                destacados[5]?.checked || false
            ]
        });
    }

    try {
        await db
            .collection("docentes")
            .doc(usuarioActual.uid)
            .collection("aulas")
            .doc(grado)
            .set(datos, { merge: true });

        mostrarAvisoGuardado();
    } catch (error) {
        console.error(error);
        alert("Error al guardar.");
    }
}

/* =====================================
   CARGAR DATOS DESDE FIRESTORE
===================================== */

async function cargarDatos(grado) {
    if (!usuarioActual || !db || !grado) return;

    generarFilas();

    try {
        const documento = await db
            .collection("docentes")
            .doc(usuarioActual.uid)
            .collection("aulas")
            .doc(grado)
            .get();

        if (!documento.exists) {
            calcular();
            return;
        }

        const datos = documento.data();

        const tutor = document.getElementById("tutor");
        const semana = document.getElementById("semana");
        const fechaInicio = document.getElementById("fechaInicio");
        const fechaFin = document.getElementById("fechaFin");
        const observaciones = document.getElementById("observaciones");

        if (tutor) tutor.value = datos.tutor || "";
        if (semana) semana.value = datos.semana || "";
        if (fechaInicio) fechaInicio.value = datos.fechaInicio || "";
        if (fechaFin) fechaFin.value = datos.fechaFin || "";
        if (observaciones) observaciones.value = datos.observaciones || "";

        (datos.alumnos || []).forEach((alumno, index) => {
            const fila = index + 1;
            const nomB = document.getElementById(`nomB${fila}`);
            const nomD = document.getElementById(`nomD${fila}`);

            if (nomB) nomB.value = alumno.nombre || "";
            if (nomD) nomD.value = alumno.nombre || "";

            const basicos = document.querySelectorAll(`.basico[data-fila="${fila}"]`);
            const destacados = document.querySelectorAll(`.destacado[data-fila="${fila}"]`);

            (alumno.basicos || []).forEach((valor, i) => {
                if (basicos[i]) basicos[i].checked = valor;
            });

            (alumno.destacados || []).forEach((valor, i) => {
                if (destacados[i]) destacados[i].checked = valor;
            });
        });

        calcular();
    } catch (error) {
        console.error(error);
    }
}
/* =====================================
   CAMBIAR DE AULA
===================================== */

function cambiarGrado() {
    const grado = document.getElementById("gradoSeccion")?.value;

    if (!grado) {
        return;
    }

    gradoActual = grado;

    if (intervaloGuardado) {
        clearInterval(intervaloGuardado);
        intervaloGuardado = null;
    }

    cargarDatos(grado);

    intervaloGuardado = setInterval(() => {
        guardarDatos();
    }, TIEMPO_AUTO_GUARDADO);
}

/* =====================================
   INICIALIZAR SISTEMA
===================================== */

function iniciarSistema() {
    generarFilas();
    calcular();
}

/* =====================================
   EVENTOS GENERALES
===================================== */

document.addEventListener("DOMContentLoaded", () => {
    iniciarSistema();

    const botonGuardar = document.querySelector(".btn-guardar");
    if (botonGuardar) {
        botonGuardar.addEventListener("click", guardarDatos);
    }
});

/* =====================================
   RECALCULAR AL ESCRIBIR
===================================== */

document.addEventListener("input", (evento) => {
    const elemento = evento.target;

    if (elemento.matches("input, textarea")) {
        calcular();
    }
});

/* =====================================
   RECALCULAR AL MARCAR CHECKS
===================================== */

document.addEventListener("change", (evento) => {
    const elemento = evento.target;

    if (
        elemento.classList.contains("basico") ||
        elemento.classList.contains("destacado")
    ) {
        calcular();
    }
});
/* =====================================
   AJUSTES FINALES
===================================== */

window.addEventListener("beforeunload", () => {
    if (intervaloGuardado) {
        clearInterval(intervaloGuardado);
        intervaloGuardado = null;
    }
});

/* =====================================
   FIN DEL SISTEMA
===================================== */
/* =====================================
   MEJORAS VISUALES SUAVES
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const campos = document.querySelectorAll(
        "input, textarea, select"
    );

    campos.forEach(campo => {

        campo.addEventListener("focus", () => {
            campo.style.transform = "translateY(-1px)";
        });

        campo.addEventListener("blur", () => {
            campo.style.transform = "translateY(0)";
        });

    });

    const tarjetas = document.querySelectorAll(
        ".cuadro, .accion-card"
    );

    tarjetas.forEach(tarjeta => {

        tarjeta.addEventListener("mouseenter", () => {
            tarjeta.style.transition = "0.3s ease";
        });

    });

    const tablaCeldas = document.querySelectorAll(
        ".tabla td, .tabla th"
    );

    tablaCeldas.forEach(celda => {
        celda.style.transition = "0.25s ease";
    });

});

/* =====================================
   PEQUEÑO EFECTO AL CAMBIAR CHECKBOX
===================================== */

document.addEventListener("change", (evento) => {

    const elemento = evento.target;

    if (
        elemento.classList.contains("basico") ||
        elemento.classList.contains("destacado")
    ) {

        elemento.closest("td").style.transform = "scale(1.04)";

        setTimeout(() => {
            const celda = elemento.closest("td");
            if (celda) {
                celda.style.transform = "scale(1)";
            }
        }, 120);

    }

});

/* =====================================
   FIN DE MEJORAS VISUALES
===================================== */