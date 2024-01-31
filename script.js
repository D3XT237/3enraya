let arrayJuego = Array.from({ length: 3 }, () => Array(3).fill(0));
let jugadorActual = 1;
let movimientosRealizados = 0;
let numFichasPartida = 0;
let modoJuegoPartida = 0;
let fichasJugador1 = 0;
let fichasJugador2 = 0;

/*
Crea la tabla con los botones e inicia el juego con la configuración indicada
*/
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
                tabla += "<td><button class='botonTablero' id='fila" + fila + "columna" + columna + "' onclick='realizarMovimiento(" + fila + "," + columna + ", event)'></button></td>";
            }
            tabla += "</tr>";
        }

        tabla += "</table>";
        document.getElementById("tablero").innerHTML = tabla;
    }
}

/*
Comprueba el número de fichas y llama a la función en consecuencia
*/

function realizarMovimiento(fila, columna) {
    if (numFichasPartida == 2) {
        realizarMovimiento6fichas(fila, columna);
    } else {
        realizarMovimiento9fichas(fila, columna);
    }
}


function realizarMovimiento6fichas(fila, columna) {
    if (arrayJuego[fila][columna] == 0) {
        if (fichasJugadorActual() < 3) {
            sumarFichaJugador();
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
                cambiarTurno();
            }
        } else {
            alert("Tienes 3 fichas. Debes quitar una antes de colocar una nueva.");
        }
    } else if (arrayJuego[fila][columna] == jugadorActual && fichasJugadorActual() == 3) {
        restarFichaJugador();
        arrayJuego[fila][columna] = 0;
        cambiarBoton(fila, columna, 0);
    }
}

function realizarMovimiento9fichas(fila, columna) {
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

function quitarFicha(fila, columna) {

}

/*
Recibe los párametros de la posición a cambiar y el jugador que toma la posición y cambia lo que muestra el botón
*/
function cambiarBoton(fila, columna, jugadorActual) {
    let casilla = document.getElementById('fila' + fila + 'columna' + columna);

    if (jugadorActual == 1) {
        casilla.innerHTML = 'X';
    } else if (jugadorActual == 2) {
        casilla.innerHTML = 'O';
    } else {
        casilla.innerHTML = '';
    }
}

/*
Comprueba si hay un ganador y devuelve true si lo hay o false si no
*/
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

/*
Devuelve todos los parámetros a como están al principio e inicia de nuevo la partida
*/
function reiniciarJuego() {
    arrayJuego = Array.from({ length: 3 }, () => Array(3).fill(0));
    jugadorActual = 1;
    movimientosRealizados = 0;
    iniciarJuego();
}

/*
Cambia el color del botón seleccionado y asigna el número de fichas que indica el botón
*/
function elegirNumFichas(numFichas, id) {
    cambiarColorBotonFichas(id);
    numFichasPartida = numFichas;
}

/*
Cambia el color del botón seleccionado y asigna modo de juego que indica el botón
*/
function elegirModoJuego(modoJuego, id) {
    cambiarColorBotonModo(id);
    modoJuegoPartida = modoJuego;
}

/*
Cambia el color de los botones de número de fichas y se asegura de que solo pueda haber uno 'pulsado' para que el jugador/es sepan qué
número de fichas está seleccionado
*/
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

/*
Cambia el color de los botones de modo de juego y se asegura de que solo pueda haber uno 'pulsado' para que el jugador/es sepan qué modo está seleccionado
*/
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

/*
Comprueba cual es el jugador actual y devuelve el número de fichas que tiene colocadas
*/
function fichasJugadorActual() {
    if (jugadorActual == 1) {
        return fichasJugador1;
    } else {
        return fichasJugador2;
    }
}

/*
Le resta una ficha al jugador actual
*/
function restarFichaJugador() {
    if (jugadorActual == 1) {
        fichasJugador1--;
    } else {
        fichasJugador2--;
    }
}

/*
Le suma una ficha al jugador actual
*/
function sumarFichaJugador() {
    if (jugadorActual == 1) {
        fichasJugador1++;
    } else {
        fichasJugador2++;
    }
}

/*
Función para cambiar de turno
*/

function cambiarTurno() {
    switch (jugadorActual) {
        case 1:
            jugadorActual = 2;
            break;
        case 2:
            jugadorActual = 1;
            break;
    }
}