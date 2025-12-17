// Obtención de elementos del DOM
const operadores = document.getElementsByClassName('operador'); // Botones de operadores (+, -, ×, /, =, M+, M-, etc.)
const numeros = document.getElementsByClassName('numero'); // Botones de números (0-9 y .)
const panel = document.getElementById('resultado'); // Panel principal 
const pantalla = document.getElementById('respuesta'); // Panel de memoria 

// Valores iniciales
panel.value = "0"; // Inicia el panel principal en 0
pantalla.value = "0"; // Inicia la pantalla de memoria en 0
let memoria = 0; // Variable para almacenar la memoria de la calculadora
let bloqueado = false; // Controla si la calculadora está bloqueada tras un error
const posibilidades = ["+", "-", "×", "/"]; // Operadores permitidos

// Obtiene el valor NUMÉRICO actual del panel
function getValorPanel() {
    const expresion = verifyResult(); // Obtiene la expresión válida lista para evaluar
    if (expresion === "Error") return null; // Retorna null si hay error en la expresión

    try {
        const resultado = eval(expresion); // Evalúa la expresión
        return isFinite(resultado) ? resultado : null; // Retorna el número si es finito, sino null
    } catch {
        return null; // Si ocurre cualquier error en eval, retorna null
    }
}

// Numeros //

// Verifica si se puede agregar un número o un punto decimal
function verifyNumber(num) {
    if (bloqueado) return false; // No permite ingresar nada si está bloqueado

    const parteActual = panel.value.split(/[\+\-\×\/]/).pop(); // Obtiene la parte actual después del último operador

    if (num === ".") { // Control para punto decimal
        if (posibilidades.includes(panel.value.slice(-1))) return false;
        if (parteActual.includes(".")) return false;
    }

    if (parteActual.includes("%")) panel.value += "×";

    return true; // Si todo está bien, permite agregar el número
}

// Agrega un número al panel
function addNumber(num) {
    if (!verifyNumber(num)) return; 
    if (panel.value === "0") panel.value = ""; // Si el panel estaba en 0, lo reemplaza
    panel.value += num;
}

// Operadores //

function verifyOperator(op) {
    if (bloqueado) return false;
    op = op.trim(); // Elimina espacios en blanco

    // Evita operadores consecutivos (+ - × /)
    if (posibilidades.includes(panel.value.slice(-1)) && posibilidades.includes(op)) {
        return false;
    }

    // Memoria //

    if (op === "MC") { // Limpia la memoria
        memoria = 0;
        pantalla.value = "0";
        panel.value = "0";
        return false;
    }

    if (op === "MR") { // muestra lo de memoria en panel principal
        panel.value = memoria.toString();
        return false;
    }

    if (op === "M+") { // Suma el valor en memoria
        const valor = getValorPanel();
        if (valor !== null) {
            memoria += valor;
            pantalla.value = memoria.toString();
        }
        return false;
    }

    if (op === "M-") { // Resta el valor en memoria
        const valor = getValorPanel();
        if (valor !== null) {
            memoria -= valor;
            pantalla.value = memoria.toString();
        }
        return false;
    }

    // Otros operadores //

    if (op === "%") { // símbolo de porcentaje
        panel.value += "%";
        return false;
    }

    if (op === "C") { // Limpiar el panel principal
        removeAll();
        return false;
    }

    if (op === "x²") { // Elevar al cuadrado el valor actual
        const valor = getValorPanel();
        if (valor !== null) {
            panel.value = (valor ** 2).toString();
        }
        return false;
    }

    if (op === "=") { // Ejecutar la operación y mostrar resultado
        const final = verifyResult(); // Verifica expresión final
        if (final === "Error") {
            mostrarError(); // Muestra error si no es evaluable
        } else {
            showResult(final); // Muestra resultado
        }
        return false;
    }

    return true; // Permite operadores estándar (+, -, ×, /)
}

// Remueve solo dígitos del panel principal //
function removeAll() {
    panel.value = "0";
    bloqueado = false;
}

// Resultado //

// Convierte la expresión del panel en algo evaluable por javascript
function verifyResult() {
    let operacionFinal = panel.value;

    if (posibilidades.includes(operacionFinal.slice(-1))) { // Elimina operador final si existe
        operacionFinal = operacionFinal.slice(0, -1);
    }

    const partes = operacionFinal.split(/[\+\-\×\/]/); // Separa por operadores

    for (let parte of partes) { // Convierte porcentajes a valores decimales
        if (parte.includes("%")) {
            const reemplazo = eval(parte.replace("%", "/100"));
            operacionFinal = operacionFinal.replace(parte, reemplazo);
        }
    }

    return operacionFinal.replaceAll("×", "*"); // Reemplaza × por *
}

// Resultado Final //
function showResult(operacionFinal) {
    try {
        const resultado = eval(operacionFinal); // Evalúa la expresión
        if (!isFinite(resultado)) {
            mostrarError();
        } else {
            panel.value = resultado;
        }
    } catch {
        mostrarError();
    }
}

// Muestra error temporalmente y bloquea entradas
function mostrarError() {
    panel.value = "Error";
    bloqueado = true;
    setTimeout(() => {
        panel.value = "0"; // Reinicia panel
        bloqueado = false; // Desbloquea
    }, 2000);
}

// Agrega operador al panel
function addOperator(op) {
    if (!verifyOperator(op)) return;
    panel.value += op;
}

// Escuchadores (Event listener) para números
for (let i = 0; i < numeros.length; i++) {
    numeros[i].addEventListener('click', () => addNumber(numeros[i].innerText));
}

// Escuchadores (Event listener) para operadores
for (let i = 0; i < operadores.length; i++) {
    operadores[i].addEventListener('click', () => addOperator(operadores[i].innerText.trim()));
}
