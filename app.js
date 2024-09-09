const generarArbol = () => {
    let expresion = document.getElementById('expresion').value.trim();
    let advertenciaElem = document.getElementById('advertencia');
    advertenciaElem.style.display = 'none';

    if (!esExpresionValida(expresion)) {
        mostrarAdvertencia("Solo puedes ingresar números y operadores (+, -, *, /).");
        return;
    }

    if (expresionRegNegativos(expresion)) {
        mostrarAdvertencia("No puedes ingresar números negativos al inicio.");
        return;
    }

    document.getElementById('grafo').innerHTML = '';
    document.getElementById('lineas').innerHTML = '';

    let arbol = construirArbol(expresion);

    dibujarGrafo(arbol, 300, 50, 150);
}

const construirArbol = (expresion) => {
    expresion = expresion.trim();
    
    const operadores = ['+', '-', '*', '/'];
    let nivelParentesis = 0;
    let operadorPrincipal = -1;
    let menorPrioridad = Infinity;
    
    const prioridades = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    for (let i = expresion.length - 1; i >= 0; i--) {
        let caracter = expresion[i];

        if (caracter === ')') {
            nivelParentesis++;
        } else if (caracter === '(') {
            nivelParentesis--;
        } else if (operadores.includes(caracter) && nivelParentesis === 0) {
            let prioridadActual = prioridades[caracter];

            if (prioridadActual <= menorPrioridad) {
                menorPrioridad = prioridadActual;
                operadorPrincipal = i;
            }
        }
    }

    if (operadorPrincipal !== -1) {
        let izquierda = expresion.substring(0, operadorPrincipal).trim();
        let derecha = expresion.substring(operadorPrincipal + 1).trim();
        let operador = expresion[operadorPrincipal];

        return {
            valor: operador,
            izquierda: construirArbol(izquierda),
            derecha: construirArbol(derecha)
        };
    }

    if (expresion[0] === '(' && expresion[expresion.length - 1] === ')') {
        return construirArbol(expresion.substring(1, expresion.length - 1));
    }

    return { valor: expresion };
}


const esExpresionValida = (expresion) => {
    let regex = /^[\d+\-*/().]+$/;
    return regex.test(expresion);
}

const expresionRegNegativos = (expresion) => {
    let regex = /^-\d/;
    return regex.test(expresion);
}

const mostrarAdvertencia = (mensaje) => {
    let advertenciaElem = document.getElementById('advertencia');
    advertenciaElem.textContent = mensaje; 
    advertenciaElem.style.display = 'block';
}

const dibujarGrafo = (nodo, x, y, offset) => {
    let contenedor = document.getElementById('grafo');
    let lineasContenedor = document.getElementById('lineas');

    let nodoElemento = document.createElement('div');
    nodoElemento.className = 'grafo-nodo';
    nodoElemento.textContent = nodo.valor;  
    nodoElemento.style.left = x + 'px';     
    nodoElemento.style.top = y + 'px';      
    contenedor.appendChild(nodoElemento);

    if (nodo.izquierda) {
        let nuevaX = x - offset;
        let nuevaY = y + 100;
        dibujarLinea(x + 20, y + 20, nuevaX + 20, nuevaY + 20, lineasContenedor); 
        dibujarGrafo(nodo.izquierda, nuevaX, nuevaY, offset / 1.5);
    }

    if (nodo.derecha) {
        let nuevaX = x + offset;
        let nuevaY = y + 100;
        dibujarLinea(x + 20, y + 20, nuevaX + 20, nuevaY + 20, lineasContenedor); 
        dibujarGrafo(nodo.derecha, nuevaX, nuevaY, offset / 1.5);
    }
}

const dibujarLinea = (x1, y1, x2, y2, contenedor) => {
    let linea = document.createElement('div');
    linea.className = 'linea';
    let angulo = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI); 
    let longitud = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); 

    linea.style.width = longitud + 'px'; 
    linea.style.transform = `rotate(${angulo}deg)`; 
    linea.style.left = x1 + 'px';
    linea.style.top = y1 + 'px'; 

    contenedor.appendChild(linea);
}

const limpiarArbol = () => {
    document.getElementById('expresion').value = ''; 
    document.getElementById('grafo').innerHTML = ''; 
    document.getElementById('lineas').innerHTML = '';
    document.getElementById('advertencia').style.display = 'none'; 
}