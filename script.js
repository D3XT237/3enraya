/* 
VARIABLES GLOBALES
*/
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
Inicia la partida
*/
function iniciarJuego() {
    if (numFichasPartida == 0) { // Comprueba que hay asignada una modalidad de fichas
        cambiarMensajeJugador("Seleccione número de fichas", "error");
    } else if (modoJuegoPartida == 0) { // Comprueba que hay asignada una modalidad de partida
        cambiarMensajeJugador("Seleccione un modo de juego", "error");
    } else {
        reiniciarJuego();
        mostrarTabla();
    }
}

/*
Muestra la tabla en el HTML
*/
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
Realiza un movimiento con la fila y columna que recibe como parámetro
*/
function realizarMovimiento(fila, columna) {
    borrarMensaje(); // Borra mensaje (sirve para eliminar un mensaje en caso de que haya salido un mensaje de un movimiento anterior)
    if (numFichasPartida == 2) { // Dependiendo de la modalidad de fichas, llama a una función u a otra
        realizarMovimiento6fichas(fila, columna);
    } else {
        realizarMovimiento9fichas(fila, columna);
    }
    mostrarStats(); /* Esta función no hace nada. Ni siquiera existe. La usaba para ir probando cosas y ver los resultados,
    pero por algun motivo si la quito, en el modo 6 fichas vsIA, cuando la IA tiene que quitar una ficha y volver a jugar, se 
    vuelve loca, asi que lo dejo*/
}
/*
Hace un movimiento en la casilla con la fila y columna que recibe como parámetros
*/
function realizarMovimiento9fichas(fila, columna) {
    if (arrayJuego[fila][columna] == 0) { // Realiza el movimiento si la casilla no tiene poseedor
        movimientosRealizados++; // Suma un movimiento
        eliminarPosicionLibre(fila, columna); // Borra esa posición del array de posiciones libres
        cambiarBoton(fila, columna, jugadorActual); // Cambia el boton correspondiente a esa fila y columna

        if (verificarGanador()) { // Verifica si hay un ganador
            cambiarMensajeJugador("¡Jugador " + jugadorActual + " ha ganado!", "victoria"); // Si lo hay, indica el ganador
            sumarGanador(); // Suma +1 a ganadas del jugador ganador y +1 a perdidas del otro
            bloquearBotones(); // Bloquea botones para que no pueda modificar nada
            tablaContadorVictorias(); // Muestra la tabla de victorias modificada
        } else if (movimientosRealizados == 9) { // Si se han realizado 9 movimientos (todas las casillas ocupadas)
            cambiarMensajeJugador("¡Empate!", "empate"); // Indica el empate
            sumarEmpate(); // +1 a empate a ambos jugadores
            bloquearBotones(); // Bloquea
            tablaContadorVictorias(); // Muestra tabla victorias modificada
            pararContadores();
        } else {
            cambiarTurno(); // Cambia el turno del jugador
            contadorJugador(); // Reinicia el contador de 30s para jugar ficha
            if (modoJuegoPartida == 3) { // Si es 1vs1, muestra el turno del jugador que le toca
                cambiarMensajeJugador("TURNO JUGADOR " + jugadorActual, 'info');
            }
            if (jugadorActual == 2) { // Si le toca jugar al jugador 2/IA, depende del modo llama a la función correspondiente
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
Hace un movimiento en la casilla con la fila y columna que recibe como parámetros
*/
function realizarMovimiento6fichas(fila, columna) {
    if (arrayJuego[fila][columna] == 0) { // Si la casilla está libre
        // Comprueba que el que juega tiene menos de 3 fichas y no coincide la posición que acaba de quitar
        if (fichasJugadorActual() < 3 && anteriorPosicion != "fila" + fila + "columna" + columna) {
            sumarFichaJugador(); // Suma ficha al jugador que toque
            eliminarPosicionLibre(fila, columna); // Quita la posición del array de posiciones libres
            cambiarBoton(fila, columna, jugadorActual); // Cambia el botón 
            anteriorPosicion = ""; // Elimina la posición anterior ya que se ha comprobado ya y para que no de problemas en el futuro

            if (verificarGanador()) { // Verifica si hay ganador
                cambiarMensajeJugador("¡Jugador " + jugadorActual + " ha ganado!", "victoria"); // Indica quien ha ganado
                bloquearBotones(); // Bloquea botones
                sumarGanador(); // Suma +1 a ganadas del ganador y +1 a derrotas del perdedor
                tablaContadorVictorias(); // Muestra la tabla de victorias
            } else { // Si no hay ganador
                cambiarTurno(); // Cambia turno
                contadorJugador(); // Reinicia el contador de 30s del turno
                if (modoJuegoPartida == 3) { //  Si es 1vs1, muestra el turno del jugador que le toca
                    cambiarMensajeJugador("TURNO JUGADOR " + jugadorActual, 'info');
                }
                if (jugadorActual == 2) { // Si le toca jugar al jugador 2/IA, depende del modo llama a la función correspondiente
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
            // Si tiene 3 fichas o está jugando la misma posición que la vez anterior, lo indica
            cambiarMensajeJugador("Tienes 3 fichas o estas jugando la ficha en la misma posición", "error");
        }
    } else if (arrayJuego[fila][columna] == jugadorActual && fichasJugadorActual() == 3) {
        //Para quitar una ficha, comprueba que esa ficha le pertenece al jugador y que el jugador tiene 3 fichas
        anteriorPosicion = document.getElementById("fila" + fila + "columna" + columna).id; // Guarda la id de la posición que acaba de quitar
        restarFichaJugador(); // Se resta una ficha
        arrayPosicionesLibres.push([fila, columna]); // Vuelve a introducir la posición como libre en el array de posiciones libres
        cambiarBoton(fila, columna, 0); // Cambia el botón a libre
    }
}

/*
Función para que juegue la IA de manera aleatoria
*/
function vsAleatorio() {
    if (fichasJugador2 < 3) { // Si puede jugar ficha
        let posicionAleatoria;
        let filaRandom;
        let columnaRandom;
        // Busca una posición distinta de la que tenia anteriormente para jugar. Elije entre las posiciones libres que hay
        do {
            let indiceAleatorio = Math.floor(Math.random() * arrayPosicionesLibres.length); // Cogemos una posición de las posiciones libres 
            posicionAleatoria = arrayPosicionesLibres[indiceAleatorio]; // Seleccionamos la posición del indice
            filaRandom = posicionAleatoria[0]; // Seleccionamos su fila
            columnaRandom = posicionAleatoria[1]; // Seleccionamos su columna
        } while ("fila" + filaRandom + "columna" + columnaRandom == anteriorPosicionIA);
        anteriorPosicionIA = ""; // Como ya comprobó que no coincidiese la posición anterior, la deja en blanco de nuevo
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
        anteriorPosicionIA = document.getElementById("fila" + filaRandomIA + "columna" + columnaRandomIA).id; // Guardamos la id de la posición que quitamos
        cambiarBoton(filaRandomIA, columnaRandomIA, 0); // Dejamos libre la casilla

        vsAleatorio(); // Ahora que tiene una ficha menos, volvemos a jugar para que haga el movimiento
    }
}

/*
Función para que la IA intente ganar y bloquear
*/
function vsIA() {
    bloquearBotones(); // Primero bloqueamos los botones para que el jugador no pueda manipular mientras pasa el timeout

    setTimeout(function () {
        // Una vez pasa el medio segundo
        desbloquearBotones(); // Desbloquea los botones
        if (intentarGanar()) {
            // La IA intenta ganar si puede
            return;
        } else if (bloquearJugador()) {
            // La IA bloquea si el otro jugador puede ganar
            return;
        } else {
            // Si no hay ninguna jugada estratégica, la IA hace una jugada aleatoria
            vsAleatorio();
            return;
        }
    }, 500); // Esperamos medio segundo antes de ejecutar la lógica de la IA (para que no sea tan frenético)
}

/*
Función que devuelve true o false dependiendo de si hay jugada ganadora para la IA o no
*/
function intentarGanar() {
    if (comprobarJugadaGanadora(2)) { // Comprueba si la IA tiene jugada ganadora
        if (fichasJugadorActual() < 3) { // Si tiene menos de 3 fichas, hace el movimiento y gana
            realizarMovimiento(filaCambiar_IA, columnaCambiar_IA);
            return true;
        } else if (fichasJugadorActual() == 3) { // Si tiene 3 fichas
            let arrayPosicionesIA_copia = [...arrayPosicionesIA]; // Creamos una copia del array de posiciones que tiene la IA
            /* 
            Buscamos los indices de las fichas que NO queremos cambiar. Los eliminamos de la copia para que sólo quede en la
            copia la posición que queremos eliminar
            */

            //Buscamos los indices que cumplen con las condiciones de las que no queremos cambiar y las eliminamos de la copia
            let indice1 = arrayPosicionesIA_copia.findIndex(arr => arr[0] === filaNoCambiar1 && arr[1] === columnaNoCambiar1);
            arrayPosicionesIA_copia.splice(indice1, 1);
            let indice2 = arrayPosicionesIA_copia.findIndex(arr => arr[0] === filaNoCambiar2 && arr[1] === columnaNoCambiar2);
            arrayPosicionesIA_copia.splice(indice2, 1);

            // Asignamos la fila y columna del botón que queremos quitar. Al solo quedar 1, será el indice [0]
            let fila_casillaQuitarIA = arrayPosicionesIA_copia[0][0];
            let columna_casillaQuitarIA = arrayPosicionesIA_copia[0][1];

            // Buscamos en el original la casilla que cumpla con la condición y la eliminamos
            let indiceQuitar = arrayPosicionesIA.findIndex(arr => arr[0] == fila_casillaQuitarIA && arr[1] == columna_casillaQuitarIA);
            arrayPosicionesIA.splice(indiceQuitar, 1);

            cambiarBoton(fila_casillaQuitarIA, columna_casillaQuitarIA, 0); // Dejamos libre la casilla
            arrayPosicionesLibres.push([fila_casillaQuitarIA, columna_casillaQuitarIA]); // Indicamos que está libre en el array de posiciones libres

            restarFichaJugador(); // Restamos una ficha para que se quede con 2

            intentarGanar(); // Se vuelve a llamar para que ahora haga la jugada ganadora
        }
    }
    // Si no se encuentra ninguna situación para ganar, devuelve false
    return false;
}

/*
Función que devuelve true o false dependiendo de si hay jugada ganadora para el jugador humano o no
*/
function bloquearJugador() {
    if (comprobarJugadaGanadora(1)) { // Comprueba si el jugador humano tiene posibilidad de ganar
        if (fichasJugadorActual() < 3) { // Si la IA tiene fichas para bloquear, bloquea
            arrayPosicionesIA.push([filaCambiar_IA, columnaCambiar_IA]); // Indicamos en el array que esa posición es de la IA
            realizarMovimiento(filaCambiar_IA, columnaCambiar_IA);
            return true;
        } else { // Si tiene 3 fichas
            let arrayPosicionesIA_copia = [...arrayPosicionesIA]; // Creamos una copia del array de posiciones que tiene la IA

            let indiceAleatorioIA = Math.floor(Math.random() * arrayPosicionesIA_copia.length); //Buscamos una de las 3 posiciones disponibles
            let posicionAleatoriaIA = arrayPosicionesIA_copia[indiceAleatorioIA]; // La seleccionamos

            filaRandomIA = posicionAleatoriaIA[0]; // Asignamos su fila
            columnaRandomIA = posicionAleatoriaIA[1]; // Asignamos su columna

            /*
            Va a ir comprobando si esa posición aleatoria dejaría un descubierto (jugada ganadora) al quitarse. Si la deja,
            elimina de la copia esa posición y busca otra de las 2 que tiene. En caso de que todas dejen descubierto, deja esa
            última como opción y sale del bucle
            */
            while (comprobarDescubierto(filaRandomIA, columnaRandomIA)) {
                if (arrayPosicionesIA_copia.length == 1) {
                    break;
                }
                let indice = arrayPosicionesIA_copia.findIndex(arr => arr[0] === filaRandomIA && arr[1] === columnaRandomIA);
                arrayPosicionesIA_copia.splice(indice, 1);
                indiceAleatorioIA = Math.floor(Math.random() * arrayPosicionesIA_copia.length); //Buscamos una de las posiciones restantes
                posicionAleatoriaIA = arrayPosicionesIA_copia[indiceAleatorioIA]; // La seleccionamos

                filaRandomIA = posicionAleatoriaIA[0]; // Asignamos su fila
                columnaRandomIA = posicionAleatoriaIA[1]; // Asignamos su columna
            }
            // Buscamos el indice en el array original que cumpla con la casilla seleccionada
            let indiceQuitar = arrayPosicionesIA.findIndex(arr => arr[0] === filaRandomIA && arr[1] === columnaRandomIA);
            arrayPosicionesIA.splice(indiceQuitar, 1); // Quitamos del array de posiciones de la IA la posición que vamos a eliminar
            arrayPosicionesLibres.push([filaRandomIA, columnaRandomIA]); // La indicamos como libre
            cambiarBoton(filaRandomIA, columnaRandomIA, 0); // Vaciamos y dejamos libre la casilla
            restarFichaJugador(); // Restamos una ficha para que se quede con 2

            bloquearJugador(); // Vuelve a llamarse para bloquear esta vez
        }
    }
    // Si no se encuentra ninguna situación para bloquear, devuelve false
    return false;
}

/*
Irá comprobando por filas, columnas y diagonales si esa ficha forma parte de una línea de 3 en la que 2 de ellas son jugador 1
Si lo encuentra, significa que el jugador 1 podría jugar esa posición y por ende ganar. Devuelve true en ese caso
*/
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

    return false; // Si no hay descubierto, devuelve false
}

/*
Comprueba si el jugador que se pasa como parámetro tiene jugada ganadora. Busca por filas, columnas y diagonales y guarda las 
posiciones de la posición libre de esa línea y de las otras dos ocupadas por el jugador. Si encuentra devuelve true y si no, false
*/
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
    let casilla = document.getElementById('fila' + fila + 'columna' + columna); // casilla que cambiamos
    arrayJuego[fila][columna] = jugador; // Asigna el jugador que toma la posición el array del juego (o lo elimina)

    // Dependiendo del jugador, muestra una X o un O. En caso de no ser ninguno, borra la imagen de la casilla
    if (jugador == 1) {
        casilla.innerHTML = "<img src='imagenes/x.png' alt='X' id='imgXO'></img>";
    } else if (jugador == 2) {
        casilla.innerHTML = "<img src='imagenes/o.png' alt='O' id='imgXO'></img>";
    } else {
        casilla.innerHTML = '';
    }
}

/*
Comprueba si hay un ganador y devuelve true si lo hay o false si no. Si lo hay para contadores y devuelve true. Si no, false
*/
function verificarGanador() {
    // Comprueba filas y columnas
    for (let i = 0; i < 3; i++) {
        if (
            (arrayJuego[i][0] === jugadorActual && arrayJuego[i][1] === jugadorActual && arrayJuego[i][2] === jugadorActual) ||
            (arrayJuego[0][i] === jugadorActual && arrayJuego[1][i] === jugadorActual && arrayJuego[2][i] === jugadorActual)
        ) {
            pararContadores();
            return true;
        }
    }
    // Comprueba diagonales
    if (
        (arrayJuego[0][0] === jugadorActual && arrayJuego[1][1] === jugadorActual && arrayJuego[2][2] === jugadorActual) ||
        (arrayJuego[0][2] === jugadorActual && arrayJuego[1][1] === jugadorActual && arrayJuego[2][0] === jugadorActual)
    ) {
        pararContadores();
        return true;

    }

    return false;
}

/*
En caso de quedarse sin tiempo, muestra un mensaje de partida perdida, bloquea botones y para contadores
*/
function perderPartida() {
    cambiarMensajeJugador("Jugador " + jugadorActual + " se ha quedado sin tiempo. Partida perdida", "error");
    bloquearBotones();
    pararContadores();
}

/*
Devuelve todos los parámetros a como están al principio
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
    anteriorPosicion = "";
    anteriorPosicionIA = "";
    filaCambiar_IA = "";
    columnaCambiar_IA = "";
    filaNoCambiar1 = "";
    columnaNoCambiar1 = "";
    filaNoCambiar2 = "";
    columnaNoCambiar2 = "";
    if (modoJuegoPartida == 3) {
        cambiarMensajeJugador("TURNO JUGADOR " + jugadorActual, 'info');
    }
}

/*
Cambia el color del botón seleccionado y asigna el número de fichas que indica el botón
*/
function elegirNumFichas(numFichas, id) {
    borrarMensaje();
    document.getElementById('turnoJugador').innerHTML = "";
    cambiarColorBotonFichas(id);
    numFichasPartida = numFichas;
}

/*
Cambia el color del botón seleccionado y asigna modo de juego que indica el botón
*/
function elegirModoJuego(modoJuego, id) {
    borrarMensaje();
    document.getElementById('turnoJugador').innerHTML = "";
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
Cambia el color de los botones de modo de juego y se asegura de que solo pueda haber uno 'pulsado' para que el jugador/es 
sepan qué modo está seleccionado
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

/*
Suma +1 a ganadas del ganador y +1 a perdidas del otro jugador
*/
function sumarGanador() {
    if (jugadorActual == 1) {
        ganadas1++;
        perdidas2++;
    } else {
        ganadas2++;
        perdidas1++;
    }
}
 /*
 Suma un empate a ambos jugadores
 */
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

/*
Recibe como parametro el texto y el tipo de mensaje que quiere mostrar y lo muestra en el HTML
*/
function cambiarMensajeJugador(texto, tipo) {
    let mensaje = `
    <div class="` + tipo + `">
        <div class="error__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#393a37" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
        </div>
        <div class="error__title">` + texto + `</div>
    </div>`;
    if (tipo == 'info') { // Si es para decir de quien es el turno, el mensaje es en otro lado del HTML
        document.getElementById('turnoJugador').innerHTML = mensaje;
        return;
    }
    document.getElementById('textoMensaje').innerHTML = mensaje;
}

/*
Elimina el mensaje que esté mostrando
*/
function borrarMensaje() {
    document.getElementById('textoMensaje').innerHTML = "";
}
 /*
 Bloquea los botones para que no se pueda interactuar con ellos
 */
function bloquearBotones() {
    let botones = document.querySelectorAll('.botonTablero');
    botones.forEach(boton => {
        boton.disabled = true;
    });
}
 /*
 Desbloquea los botones para que se pueda interactuar con ellos
 */
function desbloquearBotones() {
    let botones = document.querySelectorAll('.botonTablero');
    botones.forEach(boton => {
        boton.disabled = false;
    });
}

/*
Crea las tablas de resultados de los dos jugadores y las muestra
*/
function tablaContadorVictorias() {
    let jug2;
    if (modoJuegoPartida == 1) {
        jug2 = "Aleatorio";
    } else if (modoJuegoPartida == 2) {
        jug2 = "IA";
    } else {
        jug2 = "Jugador 2";
    }
    let tablaContador = "<table id='tablaVictorias'><thead><tr><td colspan='3'><b>JUGADOR 1</b></td></tr></thead>";
    tablaContador += "<tr><td>Ganadas</td><td>Empatadas</td><td>Perdidas</td></tr>";
    tablaContador += "<tr><td>" + ganadas1 + "</td><td>" + empatadas1 + "</td><td>" + perdidas1 + "</td></tr>";
    tablaContador += "</table>";
    tablaContador += "<table id='tablaVictorias'><thead><tr><td colspan='3'><b>" + jug2.toUpperCase() + "</b></td></tr></thead>";
    tablaContador += "<tr><td>Ganadas</td><td>Empatadas</td><td>Perdidas</td></tr>";
    tablaContador += "<tr><td>" + ganadas2 + "</td><td>" + empatadas2 + "</td><td>" + perdidas2 + "</td></tr>";
    tablaContador += "</table>";


    document.getElementById('contadorVictorias').innerHTML = tablaContador;
}

/*
Inicia el contador de la partida. Antes borra el contador por si existia uno anterior y luego lo muestra en el HTML
*/
function iniciarContador() {
    borrarContador();
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

/*
Inicia una cuenta regresiva de 30s a 0s para indicar el tiempo por jugada
*/
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
 /*
 Para ambos contadores
 */
function pararContadores() {
    borrarContador();
    borrarContadorJugador();
}

/*
Borra el intervalo del contador
 */
function borrarContador() {
    clearInterval(intervalo);
}

/*
Borra el intervalo del contador del jugador
*/
function borrarContadorJugador() {
    clearInterval(intervaloJugada);
}

/*
Reincia las estadísticas de la tabla de victorias a 0 y vuelve a mostrar la tabla
*/
function reiniciarStatsPartidas() {
    ganadas1 = 0;
    ganadas2 = 0;
    empatadas1 = 0;
    empatadas2 = 0;
    perdidas1 = 0;
    perdidas2 = 0;
    tablaContadorVictorias();
}