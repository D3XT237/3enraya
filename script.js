let arrayJuego = Array.from({ length: 3 }, () => Array(3).fill(0));
let jugadorActual = 1;
let movimientosRealizados = 0;
let numFichasPartida = 0;
let modoJuegoPartida = 0;
let fichasJugador1 = 0;
let fichasJugador2 = 0;

function iniciarJuego() {
    if (numFichasPartida == 0) {
        alert("Seleccione número de fichas");
    } else if (modoJuegoPartida == 0) {
        alert("Seleccione un modo de juego");
    } else {
        let tabla = "<table class='tablaJuego'>";

        for (let fila = 0; fila < 3; fila++) {
            tabla += "<tr>";
            for (let columna = 0; columna < 3; columna++) {
                tabla += "<td><button class='botonTablero' id='fila" + fila + "columna" + columna + "' onclick='realizarMovimiento(" + fila + "," + columna + ")'></button></td>";
            }
            tabla += "</tr>";
        }

        tabla += "</table>";
        document.getElementById("tablero").innerHTML = tabla;
    }
}

function realizarMovimiento(fila, columna) {
    if (arrayJuego[fila][columna] == 0) {
        movimientosRealizados++;
        arrayJuego[fila][columna] = jugadorActual;
        cambiarBoton(fila, columna, jugadorActual);

        if (verificarGanador()) {
            alert("¡Jugador " + jugadorActual + " ha ganado!");
            reiniciarJuego();
        } else if (modoJuegoPartida == 1 && movimientosRealizados == 9) {
            alert("¡Empate!");
            reiniciarJuego();
        } else {
            switch (jugadorActual) {
                case 1:
                    jugadorActual = 2;
                    break;
                case 2:
                    jugadorActual = 1;
                    break;
            }
        }
    }
}

function cambiarBoton(fila, columna, jugadorActual) {
    let casilla = document.getElementById('fila' + fila + 'columna' + columna);

    if (jugadorActual == 1) {
        casilla.innerHTML = 'X';
    } else {
        casilla.innerHTML = 'O';
    }
}

function verificarGanador() {
    for (let i = 0; i < 3; i++) {
        if (
            (arrayJuego[i][0] === jugadorActual && arrayJuego[i][1] === jugadorActual && arrayJuego[i][2] === jugadorActual) ||
            (arrayJuego[0][i] === jugadorActual && arrayJuego[1][i] === jugadorActual && arrayJuego[2][i] === jugadorActual)
        ) {
            return true;
        }
    }

    if (
        (arrayJuego[0][0] === jugadorActual && arrayJuego[1][1] === jugadorActual && arrayJuego[2][2] === jugadorActual) ||
        (arrayJuego[0][2] === jugadorActual && arrayJuego[1][1] === jugadorActual && arrayJuego[2][0] === jugadorActual)
    ) {
        return true;
    }

    return false;
}

function reiniciarJuego() {
    arrayJuego = Array.from({ length: 3 }, () => Array(3).fill(0));
    jugadorActual = 1;
    movimientosRealizados = 0;
    iniciarJuego();
}

function elegirNumFichas(numFichas, id) {
    cambiarColorBotonFichas(id);
    numFichasPartida = numFichas;
}

function elegirModoJuego(modoJuego, id) {
    cambiarColorBotonModo(id);
    modoJuegoPartida = modoJuego;
}

function cambiarColorBotonFichas(id) {
    let botonPulsado = document.getElementById(id);
    let otroBoton;

    if (botonPulsado.id == '9fichas') {
        otroBoton = document.getElementById('6fichas');
    } else {
        otroBoton = document.getElementById('9fichas');
    }

    if (botonPulsado.classList.contains('nopulsado') && otroBoton.classList.contains('nopulsado')) {
        botonPulsado.classList.replace('nopulsado', 'pulsado');
    } else {
        botonPulsado.classList.replace('nopulsado', 'pulsado');
        otroBoton.classList.replace('pulsado', 'nopulsado');
    }
}

function cambiarColorBotonModo(id) {
    let botonPulsado = document.getElementById(id);
    let otroBoton1;
    let otroBoton2;

    if (botonPulsado.id == '1vsAleatorio') {
        otroBoton1 = document.getElementById('1vsIA');
        otroBoton2 = document.getElementById('2jugadores');
    } else if (botonPulsado.id == '1vsIA') {
        otroBoton1 = document.getElementById('1vsAleatorio');
        otroBoton2 = document.getElementById('2jugadores');
    } else {
        otroBoton1 = document.getElementById('1vsAleatorio');
        otroBoton2 = document.getElementById('1vsIA');
    }

    if (botonPulsado.classList.contains('nopulsado')) {
        botonPulsado.classList.replace('nopulsado', 'pulsado');
        if (otroBoton1.classList.contains('pulsado')) {
            otroBoton1.classList.replace('pulsado', 'nopulsado');
        } else if (otroBoton2.classList.contains('pulsado')) {
            otroBoton2.classList.replace('pulsado', 'nopulsado');
        }
    }
}
