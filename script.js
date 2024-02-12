let arrayJuego;
let jugadorActual;
let movimientosRealizados;
let numFichasPartida = 0;
let modoJuegoPartida = 0;
let fichasJugador1;
let fichasJugador2;
let arrayPosicionesLibres;
let arrayPosicionesIA = [];
let anteriorPosicion = "";
let anteriorPosicionIA = "";
let filaRandomIA;
let columnaRandomIA;
let contador = 0;
let intervalo;
let intervaloJugada;
let segundosTurno;
let filaCambiar_IA;
let columnaCambiar_IA;
let filaNoCambiar1;
let columnaNoCambiar1;
let filaNoCambiar2;
let columnaNoCambiar2;
let ganadas1 = 0;
let ganadas2 = 0;
let empatadas1 = 0;
let empatadas2 = 0;
let perdidas1 = 0;
let perdidas2 = 0;
let tabla = "<table class='tablaJuego'><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>";
document.getElementById("tablero").innerHTML = tabla;
tablaContadorVictorias();
/*
Crea la tabla con los botones e inicia el juego con la configuración indicada
*/
function iniciarJuego() {
    if (numFichasPartida == 0) {
        cambiarMensajeJugador("Seleccione número de fichas", "error");
    } else if (modoJuegoPartida == 0) {
        cambiarMensajeJugador("Seleccione un modo de juego", "error");
    } else {
        reiniciarJuego();
        mostrarTabla();
    }
}

function mostrarTabla() {
    tabla = "<table class='tablaJuego'>";

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

/*
Comprueba el número de fichas y llama a la función en consecuencia
*/
function realizarMovimiento(fila, columna) {
    borrarMensaje();
    contadorJugador();
    if (numFichasPartida == 2) {
        realizarMovimiento6fichas(fila, columna);
    } else {
        realizarMovimiento9fichas(fila, columna);
    }
    mostrarStats();
}
/*
La función comprueba si la casilla que ha sido clickada se encuentra libre. Si lo está, suma 1 al contador de movimientos y el jugador actual 
ocupa esa casilla. Luego cambia el botón para mostrar el jugador que tiene esa casilla. Finalmente verifica si hay un ganador, un empate y finalmente 
si no se cumple nada de esto, cambia turno
*/
function realizarMovimiento9fichas(fila, columna) {
    if (arrayJuego[fila][columna] == 0) {
        movimientosRealizados++;
        eliminarPosicionLibre(fila, columna);
        cambiarBoton(fila, columna, jugadorActual);

        if (verificarGanador()) {
            cambiarMensajeJugador("¡Jugador " + jugadorActual + " ha ganado!", "victoria");
            sumarGanador();
            bloquearBotones();
            tablaContadorVictorias();
        } else if (movimientosRealizados == 9) {
            cambiarMensajeJugador("¡Empate!", "empate");
            sumarEmpate();
            bloquearBotones();
            tablaContadorVictorias();
            pararContadores();
        } else {
            cambiarTurno();
            if (jugadorActual == 2) {
                switch (modoJuegoPartida) {
                    case 1:
                        vsAleatorio();
                        break;
                    case 2:
                        vsIA();
                        break;
                    default:
                        break;
                }
            }
        }
    }
}


/*
Comprueba el número de fichas del jugador actual. Si es menor que 3 y no está jugando de nuevo en la misma posición, funciona igual que 
realizarMovimiento9fichas. Si no, avisa de que el jugador tiene 3 fichas y que debe quitar una ficha antes. Si el jugador tiene 3 fichas y 
clicka en una casilla donde está una de sus fichas, la retira devolviendo su valor inicial y resta una ficha de su contador para que la pueda 
jugar a continuación
*/
function realizarMovimiento6fichas(fila, columna) {
    if (arrayJuego[fila][columna] == 0) {
        if (fichasJugadorActual() < 3 && anteriorPosicion != "fila" + fila + "columna" + columna) {
            sumarFichaJugador();
            movimientosRealizados++;
            eliminarPosicionLibre(fila, columna);
            cambiarBoton(fila, columna, jugadorActual);
            anteriorPosicion = "";

            if (verificarGanador()) {
                cambiarMensajeJugador("¡Jugador " + jugadorActual + " ha ganado!", "victoria");
                bloquearBotones();
                sumarGanador();
                tablaContadorVictorias();
            } else {
                cambiarTurno();
                if (jugadorActual == 2) {
                    switch (modoJuegoPartida) {
                        case 1:
                            vsAleatorio();
                            break;
                        case 2:
                            vsIA();
                            break;
                        default:
                            break;
                    }
                }
            }
        } else {
            cambiarMensajeJugador("Tienes 3 fichas o estas jugando la ficha en la misma posición", "error");
        }
    } else if (arrayJuego[fila][columna] == jugadorActual && fichasJugadorActual() == 3) {
        anteriorPosicion = document.getElementById("fila" + fila + "columna" + columna).id;
        restarFichaJugador();
        arrayPosicionesLibres.push([fila, columna]);
        cambiarBoton(fila, columna, 0);
    }
}

/*
Elige una fila y una columna random. Si las fichas son menor que 3 (en 9 fichas siempre va a ser menor) busca una posición hasta que encuentre una
libre y una vez encontrada realiza el movimiento. En caso de jugar en modo de 6 fichas, es igual a 9 fichas hasta que la IA tiene 3 fichas. Entonces
busca una de las posiciones que tiene en su poder, la elimina, se resta una ficha e inicia de manera recursiva la función otra vez. Al tener una ficha menos
ahora buscará una nueva posición distinta de la que acaba de eliminar
*/
function vsAleatorio() {
    if (fichasJugador2 < 3) { // Si puede jugar ficha
        let posicionAleatoria;
        let filaRandom;
        let columnaRandom;
        do {
            let indiceAleatorio = Math.floor(Math.random() * arrayPosicionesLibres.length); // Cogemos una posición de las posiciones libres 
            posicionAleatoria = arrayPosicionesLibres[indiceAleatorio]; // Seleccionamos la posición del indice
            filaRandom = posicionAleatoria[0]; // Seleccionamos su fila
            columnaRandom = posicionAleatoria[1]; // Seleccionamos su columna
        } while ("fila" + filaRandom + "columna" + columnaRandom == anteriorPosicionIA);
        anteriorPosicionIA = "";
        arrayPosicionesIA.push([filaRandom, columnaRandom]); // Agregamos al array de posiciones que tiene ganada la IA la posición
        realizarMovimiento(filaRandom, columnaRandom); // Hacemos el movimiento
    } else { // Si tiene 3 fichas
        let indiceAleatorioIA = Math.floor(Math.random() * arrayPosicionesIA.length); // Buscamos un índice de las posiciones que tiene la IA
        let posicionAleatoriaIA = arrayPosicionesIA[indiceAleatorioIA]; // Seleccionamos la posición del índice

        filaRandomIA = posicionAleatoriaIA[0]; // Seleccionamos la fila
        columnaRandomIA = posicionAleatoriaIA[1]; // Seleccionamos la columna

        restarFichaJugador(); // Le restamos la ficha a la IA
        arrayPosicionesIA.splice(indiceAleatorioIA, 1); // Quitamos del array de posiciones de la IA la que ha salido
        arrayPosicionesLibres.push([filaRandomIA, columnaRandomIA]); // Marcamos que ha quedado libre la posición
        anteriorPosicionIA = document.getElementById("fila" + filaRandomIA + "columna" + columnaRandomIA).id; // Guardamos la posición anterior
        cambiarBoton(filaRandomIA, columnaRandomIA, 0); // Dejamos libre la casilla

        vsAleatorio(); // Ahora que hay una casilla menos, volvemos a jugar para que haga el movimiento
    }
}

function vsIA() {
    if (intentarGanar()) {
        return; // La IA intenta ganar si puede
    } else if (bloquearJugador()) {
        return; // La IA bloquea si el otro jugador puede ganar
    } else {
        vsAleatorio();
    }
}

function intentarGanar() {
    if (comprobarJugadaGanadora(2)) { // Comprueba si la IA tiene jugada ganadora
        if (fichasJugadorActual() < 3) { // Si tiene menos de 3 fichas, hace el movimiento y gana
            realizarMovimiento(filaCambiar_IA, columnaCambiar_IA);
            return true;
        } else if (fichasJugadorActual() == 3) { // Si tiene 3 fichas
            let arrayPosicionesIA_copia = arrayPosicionesIA.map(arr => [...arr]); // Creamos una copia del array de posiciones que tiene la IA
            /* 
            Buscamos los indices de las fichas que NO queremos cambiar. Los eliminamos de la copia para que sólo quede en el
            array la posición que queremos eliminar
            */
            let indice1 = arrayPosicionesIA_copia.findIndex(arr => arr[0] === filaNoCambiar1 && arr[1] === columnaNoCambiar1);
            arrayPosicionesIA_copia.splice(indice1, 1);
            let indice2 = arrayPosicionesIA_copia.findIndex(arr => arr[0] === filaNoCambiar2 && arr[1] === columnaNoCambiar2);
            arrayPosicionesIA_copia.splice(indice2, 1);

            // Asignamos la fila y columna del botón que queremos quitar. Cambiamos su dibujo y su valor
            let fila_casillaQuitarIA = arrayPosicionesIA_copia[0][0];
            let columna_casillaQuitarIA = arrayPosicionesIA_copia[0][1];

            let indiceQuitar = arrayPosicionesIA.findIndex(arr => arr[0] == fila_casillaQuitarIA && arr[1] == columna_casillaQuitarIA);
            arrayPosicionesIA.splice(indiceQuitar, 1);

            cambiarBoton(fila_casillaQuitarIA, columna_casillaQuitarIA, 0);
            arrayPosicionesLibres.push([fila_casillaQuitarIA, columna_casillaQuitarIA]);

            restarFichaJugador(); // Restamos una ficha para que se quede con 2

            intentarGanar();
        }
    }
    // Si no se encuentra ninguna situación para ganar, devuelve false
    return false;
}

function bloquearJugador() {
    if (comprobarJugadaGanadora(1)) { // Comprueba si el jugador humano tiene posibilidad de ganar
        if (fichasJugadorActual() < 3) { // Si tiene fichas para bloquear, bloquea
            arrayPosicionesIA.push([filaCambiar_IA, columnaCambiar_IA]);
            realizarMovimiento(filaCambiar_IA, columnaCambiar_IA);
            return true;
        } else { // Si tiene 3 fichas
            let arrayPosicionesIA_copia = arrayPosicionesIA.map(arr => [...arr]); // Creamos una copia del array de posiciones que tiene la IA

            let indiceAleatorioIA = Math.floor(Math.random() * arrayPosicionesIA_copia.length); //Buscamos una de las 3 posiciones disponibles
            let posicionAleatoriaIA = arrayPosicionesIA_copia[indiceAleatorioIA]; // La seleccionamos

            filaRandomIA = posicionAleatoriaIA[0]; // Asignamos su fila
            columnaRandomIA = posicionAleatoriaIA[1]; // Asignamos su columna

            while (comprobarDescubierto(filaRandomIA, columnaRandomIA)) {
                let indice = arrayPosicionesIA_copia.findIndex(arr => arr[0] === filaRandomIA && arr[1] === columnaRandomIA);
                arrayPosicionesIA_copia.splice(indice, 1);
                indiceAleatorioIA = Math.floor(Math.random() * arrayPosicionesIA_copia.length); //Buscamos una de las 3 posiciones disponibles
                posicionAleatoriaIA = arrayPosicionesIA_copia[indiceAleatorioIA]; // La seleccionamos

                filaRandomIA = posicionAleatoriaIA[0]; // Asignamos su fila
                columnaRandomIA = posicionAleatoriaIA[1]; // Asignamos su columna
            }
            arrayPosicionesIA.splice(indiceAleatorioIA, 1); // Quitamos del array de posiciones de la IA la posición que vamos a eliminar
            arrayPosicionesLibres.push([filaRandomIA, columnaRandomIA]); 
            cambiarBoton(filaRandomIA, columnaRandomIA, 0); // Vaciamos y dejamos libre la casilla
            restarFichaJugador(); // Restamos una ficha para que se quede con 2

            bloquearJugador();
        }
    }
    // Si no se encuentra ninguna situación para bloquear, devuelve false
    return false;
}

function comprobarDescubierto(fila_IA, columna_IA) {
    // Comprobando fila
    for (let fila = 0; fila < 3; fila++) {
        if (columna_IA == 0 && arrayJuego[fila][1] == 1 && arrayJuego[fila][2] == 1) {
            return true;
        } else if (columna_IA == 1 && arrayJuego[fila][0] == 1 && arrayJuego[fila][2] == 1) {
            return true;
        } else if (columna_IA == 2 && arrayJuego[fila][0] == 1 && arrayJuego[fila][1] == 1) {
            return true;
        }
    }
    // Comprobar columna
    for (let columna = 0; columna < 3; columna++) {
        if (fila_IA == 0 && arrayJuego[1][columna] == 1 && arrayJuego[2][columna] == 1) {
            return true;
        } else if (fila_IA == 1 && arrayJuego[0][columna] == 1 && arrayJuego[2][columna] == 1) {
            return true;
        } else if (fila_IA == 2 && arrayJuego[0][columna] == 1 && arrayJuego[1][columna] == 1) {
            return true;
        }
    }
    //Comprobar diagonales
    if ((fila_IA == 1 && columna_IA == 1) && ((arrayJuego[0][0] == 1 && arrayJuego[2][2] == 1) || (arrayJuego[0][2] == 1 && arrayJuego[2][0] == 1))) {
        return true;
    } else if ((fila_IA == 0 && columna_IA == 0) && (arrayJuego[1][1] == 1 && arrayJuego[2][2] == 1)) {
        return true;
    } else if ((fila_IA == 0 && columna_IA == 2) && (arrayJuego[1][1] == 1 && arrayJuego[2][0] == 1)) {
        return true;
    } else if ((fila_IA == 2 && columna_IA == 0) && (arrayJuego[1][1] == 1 && arrayJuego[0][2] == 1)) {
        return true;
    } else if ((fila_IA == 2 && columna_IA == 2) && (arrayJuego[1][1] == 1 && arrayJuego[0][0] == 1)) {
        return true;
    }

    return false;
}



function comprobarJugadaGanadora(jugador) {
    // Comprobación de filas
    for (let fila = 0; fila < 3; fila++) {
        if (arrayJuego[fila][0] === jugador && arrayJuego[fila][1] === jugador && arrayJuego[fila][2] === 0) {
            filaCambiar_IA = fila;
            columnaCambiar_IA = 2;
            filaNoCambiar1 = fila;
            columnaNoCambiar1 = 0;
            filaNoCambiar2 = fila;
            columnaNoCambiar2 = 1;
            return true;
        } else if (arrayJuego[fila][0] === jugador && arrayJuego[fila][1] === 0 && arrayJuego[fila][2] === jugador) {
            filaCambiar_IA = fila;
            columnaCambiar_IA = 1;
            filaNoCambiar1 = fila;
            columnaNoCambiar1 = 0;
            filaNoCambiar2 = fila;
            columnaNoCambiar2 = 2;
            return true;
        } else if (arrayJuego[fila][0] === 0 && arrayJuego[fila][1] === jugador && arrayJuego[fila][2] === jugador) {
            filaCambiar_IA = fila;
            columnaCambiar_IA = 0;
            filaNoCambiar1 = fila;
            columnaNoCambiar1 = 2;
            filaNoCambiar2 = fila;
            columnaNoCambiar2 = 1;
            return true;
        }
    }

    // Comprobación de columnas
    for (let columna = 0; columna < 3; columna++) {
        if (arrayJuego[0][columna] === jugador && arrayJuego[1][columna] === jugador && arrayJuego[2][columna] === 0) {
            filaCambiar_IA = 2;
            columnaCambiar_IA = columna;
            filaNoCambiar1 = 0;
            columnaNoCambiar1 = columna;
            filaNoCambiar2 = 1;
            columnaNoCambiar2 = columna;
            return true;
        } else if (arrayJuego[0][columna] === jugador && arrayJuego[1][columna] === 0 && arrayJuego[2][columna] === jugador) {
            filaCambiar_IA = 1;
            columnaCambiar_IA = columna;
            filaNoCambiar1 = 0;
            columnaNoCambiar1 = columna;
            filaNoCambiar2 = 2;
            columnaNoCambiar2 = columna;
            return true;
        } else if (arrayJuego[0][columna] === 0 && arrayJuego[1][columna] === jugador && arrayJuego[2][columna] === jugador) {
            filaCambiar_IA = 0;
            columnaCambiar_IA = columna;
            filaNoCambiar1 = 1;
            columnaNoCambiar1 = columna;
            filaNoCambiar2 = 2;
            columnaNoCambiar2 = columna;
            return true;
        }
    }

    // Comprobación de diagonales
    if (arrayJuego[0][0] === jugador && arrayJuego[1][1] === jugador && arrayJuego[2][2] === 0) {
        filaCambiar_IA = 2;
        columnaCambiar_IA = 2;
        filaNoCambiar1 = 0;
        columnaNoCambiar1 = 0;
        filaNoCambiar2 = 1;
        columnaNoCambiar2 = 1;
        return true;
    } else if (arrayJuego[0][0] === jugador && arrayJuego[1][1] === 0 && arrayJuego[2][2] === jugador) {
        filaCambiar_IA = 1;
        columnaCambiar_IA = 1;
        filaNoCambiar1 = 0;
        columnaNoCambiar1 = 0;
        filaNoCambiar2 = 2;
        columnaNoCambiar2 = 2;
        return true;
    } else if (arrayJuego[0][0] === 0 && arrayJuego[1][1] === jugador && arrayJuego[2][2] === jugador) {
        filaCambiar_IA = 0;
        columnaCambiar_IA = 0;
        filaNoCambiar1 = 1;
        columnaNoCambiar1 = 1;
        filaNoCambiar2 = 2;
        columnaNoCambiar2 = 2;
        return true;
    } else if (arrayJuego[0][2] === jugador && arrayJuego[1][1] === jugador && arrayJuego[2][0] === 0) {
        filaCambiar_IA = 2;
        columnaCambiar_IA = 0;
        filaNoCambiar1 = 1;
        columnaNoCambiar1 = 1;
        filaNoCambiar2 = 0;
        columnaNoCambiar2 = 2;
        return true;
    } else if (arrayJuego[0][2] === jugador && arrayJuego[1][1] === 0 && arrayJuego[2][0] === jugador) {
        filaCambiar_IA = 1;
        columnaCambiar_IA = 1;
        filaNoCambiar1 = 0;
        columnaNoCambiar1 = 2;
        filaNoCambiar2 = 2;
        columnaNoCambiar2 = 0;
        return true;
    } else if (arrayJuego[0][2] === 0 && arrayJuego[1][1] === jugador && arrayJuego[2][0] === jugador) {
        filaCambiar_IA = 0;
        columnaCambiar_IA = 2;
        filaNoCambiar1 = 1;
        columnaNoCambiar1 = 1;
        filaNoCambiar2 = 2;
        columnaNoCambiar2 = 0;
        return true;
    }

    return false;
}
/*
Recibe los párametros de la posición a cambiar y el jugador que toma la posición y cambia lo que muestra el botón
*/
function cambiarBoton(fila, columna, jugador) {
    let casilla = document.getElementById('fila' + fila + 'columna' + columna);
    arrayJuego[fila][columna] = jugador;

    if (jugador == 1) {
        casilla.innerHTML = "<img src='imagenes/x.png' alt='X' id='imgXO'></img>";
    } else if (jugador == 2) {
        casilla.innerHTML = "<img src='imagenes/o.png' alt='O' id='imgXO'></img>";
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
            pararContadores();
            return true;
        }
    }

    if (
        (arrayJuego[0][0] === jugadorActual && arrayJuego[1][1] === jugadorActual && arrayJuego[2][2] === jugadorActual) ||
        (arrayJuego[0][2] === jugadorActual && arrayJuego[1][1] === jugadorActual && arrayJuego[2][0] === jugadorActual)
    ) {
        pararContadores();
        return true;

    }

    return false;
}

function perderPartida() {
    cambiarMensajeJugador("Jugador " + jugadorActual + " se ha quedado sin tiempo. Partida perdida", "error");
    bloquearBotones();
    pararContadores();
}

/*
Devuelve todos los parámetros a como están al principio e inicia de nuevo la partida
*/
function reiniciarJuego() {
    borrarMensaje();
    iniciarContador();
    contadorJugador();
    mostrarTabla();
    arrayJuego = Array.from({ length: 3 }, () => Array(3).fill(0));
    jugadorActual = 1;
    movimientosRealizados = 0;
    fichasJugador1 = 0;
    fichasJugador2 = 0;
    arrayPosicionesLibres = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
    arrayPosicionesIA = [];
    anteriorPosicion = null;
    anteriorPosicionIA = null;
    filaCambiar_IA = null;
    columnaCambiar_IA = null;
    filaNoCambiar1 = null;
    columnaNoCambiar1 = null;
    filaNoCambiar2 = null;
    columnaNoCambiar2 = null;
}

/*
Cambia el color del botón seleccionado y asigna el número de fichas que indica el botón
*/
function elegirNumFichas(numFichas, id) {
    borrarMensaje();
    cambiarColorBotonFichas(id);
    numFichasPartida = numFichas;
}

/*
Cambia el color del botón seleccionado y asigna modo de juego que indica el botón
*/
function elegirModoJuego(modoJuego, id) {
    borrarMensaje();
    cambiarColorBotonModo(id);
    modoJuegoPartida = modoJuego;
    pararContadores();
    reiniciarStatsPartidas();
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
Elimina el espacio en el array de posiciones libres
*/
function eliminarPosicionLibre(fila, columna) {
    let indice = -1;
    arrayPosicionesLibres.forEach((casilla, indiceCasilla) => {
        if (casilla[0] == fila && casilla[1] == columna) {
            indice = indiceCasilla;
        }
    });

    if (indice !== -1) {
        arrayPosicionesLibres.splice(indice, 1);
    }
}

function sumarGanador() {
    if (jugadorActual == 1) {
        ganadas1++;
        perdidas2++;
    } else {
        ganadas2++;
        perdidas1++;
    }
}

function sumarEmpate() {
    empatadas1++;
    empatadas2++;
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

function cambiarMensajeJugador(texto, tipo) {
    let mensaje = `
    <div class="` + tipo + `">
        <div class="error__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#393a37" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
        </div>
        <div class="error__title">` + texto + `</div>
    </div>`;
    document.getElementById('textoMensaje').innerHTML = mensaje;
}


function borrarMensaje() {
    document.getElementById('textoMensaje').innerHTML = "";
}

function bloquearBotones() {
    let botones = document.querySelectorAll('.botonTablero');
    botones.forEach(boton => {
        boton.disabled = true;
    });
}

function tablaContadorVictorias() {
    let jug2;
    if (modoJuegoPartida == 1) {
        jug2 = "Aleatorio";
    } else if (modoJuegoPartida == 2) {
        jug2 = "IA";
    } else {
        jug2 = "Jugador 2";
    }
    let tablaContador = "<table id='tablaVictorias'><thead><tr><td colspan='3'><b>JUGADOR 1</b></td><td colspan='3'><b>" + jug2.toUpperCase() + "</b></td></tr></thead>";
    tablaContador += "<tr><td>Ganadas</td><td>Empatadas</td><td>Perdidas</td><td>Ganadas</td><td>Empatadas</td><td>Perdidas</td></tr>";
    tablaContador += "<tr><td>" + ganadas1 + "</td><td>" + empatadas1 + "</td><td>" + perdidas1 + "</td><td>" + ganadas2 + "</td><td>" + empatadas2 + "</td><td>" + perdidas2 + "</td></tr>";
    tablaContador += "</table>"

    document.getElementById('contadorVictorias').innerHTML = tablaContador;
}

function iniciarContador() {
    pararContador();
    let segundos = 0;

    document.getElementById('contadorTotal').innerHTML = "Tiempo de juego: " + segundos;
    intervalo = setInterval(() => {
        segundos++;
        let minutos = Math.floor(segundos / 60);
        let segundosRestantes = segundos % 60;
        if (minutos != 0) {
            document.getElementById('contadorTotal').innerHTML = "Tiempo de juego: " + minutos + "min " + segundosRestantes + "s";
        } else {
            document.getElementById('contadorTotal').innerHTML = "Tiempo de juego: " + segundosRestantes + "s";
        }
    }, 1000);
    return intervalo;
}

function contadorJugador() {
    segundosTurno = 30;
    document.getElementById('contadorJugada').innerHTML = "Tiempo restante de jugada: " + segundosTurno + "s";

    clearInterval(intervaloJugada);

    intervaloJugada = setInterval(() => {
        segundosTurno--;
        document.getElementById('contadorJugada').innerHTML = "Tiempo restante de jugada: " + segundosTurno + "s";
        if (segundosTurno == 0) {
            perderPartida();
        }
    }, 1000);
}

function pararContadores() {
    pararContador();
    pararContadorJugador();
}


function pararContador() {
    clearInterval(intervalo);
}

function pararContadorJugador() {
    clearInterval(intervaloJugada);
}

function reiniciarStatsPartidas() {
    ganadas1 = 0;
    ganadas2 = 0;
    empatadas1 = 0;
    empatadas2 = 0;
    perdidas1 = 0;
    perdidas2 = 0;
    tablaContadorVictorias();
}
