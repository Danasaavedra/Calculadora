const operadores = document.getElementsByClassName('operador')
const numeros = document.getElementsByClassName('numero')
const panel = document.getElementById('resultado')
panel.value = "0"
let bloqueado = false;
/* Aparatado de numeros */

function verifyNumber(num) {
    if (bloqueado) {return false}

    const parteActual = panel.value.split(/[\+\-\×\/]/).pop(); /*  NOTA IMPORTANTE: expresion regular, conjunto de expresiones y el ultimo elemento */
    const posibilidades = ["+", "-", "×", "/"]
    if (num === ".") {
        if (posibilidades.includes(panel.value[panel.value.length -1])) {
            return false
        }
        if (panel.value === "0") {
            panel.value += num
            return false
        }

        if (parteActual.includes(".") ) {
            return false
        }
    }
    if (parteActual.includes("%")) {
        panel.value += "×"
    }
}

function addNumber (num) {
    const verificacion = verifyNumber(num)
    if (verificacion === false) {
        return
    }   
    if (panel.value === "0") {
        panel.value = ""
        
    }
    panel.value += num
}

/* Apartado de operadores */

function verifyOperator(op) {
    if (bloqueado) {return false}

    if (op === "C") {
            removeAll()
            return false
        }
    else if (op === "←") {
        removeLastCharacter()
        return false
        }
    else if (op === "=") {
        const final = verifyResult()
        if (final === "Error") {
            panel.value = "Error"
            bloqueado = true
            setTimeout(() => {
                panel.value = "0";
                bloqueado = false
            }, 2000);
            
            return false
        }
        else {
            showResult(final)
            return false
        }
    }

    const posibilidades = ["+", "-", "×", "/"]

    if (posibilidades.includes(panel.value[panel.value.length -1])) {
        return false
    }

    else if (posibilidades.includes(op)) {
        if (posibilidades.includes(panel.value[panel.value.length - 1])) {
            return false
        }
    }   
}

function removeAll() {
    panel.value = "0"
}

function removeLastCharacter() {
    panel.value = panel.value.slice(0, -1)
    if (panel.value === "") {
        panel.value = 0
    }
}

function verifyResult() {
    let operacionFinal = panel.value
    const expresion = panel.value.split(/[\+\-\×\/]/);

    for (let i = 0; i < expresion.length; i++) {
        if(expresion[i].includes("%")) {
            let operacion = expresion[i].slice(0, -1) + "/100"
            
            try {
                let total = eval(operacion)
                operacionFinal = operacionFinal.replace(expresion[i], total)
            }
            catch {
                return "Error"
            }
        }
    }
    operacionFinal = operacionFinal.replaceAll("×", "*");
    return operacionFinal
}

function showResult(operacionFinal) {
    try {
        const resultado = eval(operacionFinal);
        if (!isFinite(resultado)) {
            panel.value = "Error";
        } else {
            panel.value = resultado;
        }
        bloqueado = true
        setTimeout(() => {
            panel.value = "0";
            bloqueado = false
        }, 2000);

    } catch {
        panel.value = "Error";
    }
}

function addOperator(op) {
    const verificacion = verifyOperator(op)
    if (verificacion === false) {
        return
    }
    panel.value += op
}

/* Apartado de recorredores de clases */

for (let i = 0; i < numeros.length; i++) {
    numeros[i].addEventListener('click', () => {
        addNumber(numeros[i].innerText)
    })
}

for (let i = 0; i< operadores.length; i++) {
    operadores[i].addEventListener('click', () => {
        addOperator(operadores[i].innerText)
    })
}