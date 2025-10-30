

// PORTADA DEL JUEGO - Transición al juego
document.addEventListener('DOMContentLoaded', function() {
    const btnJugarAhora = document.getElementById('btn-jugar-ahora');
    const portadaJuego = document.getElementById('portada-juego');
    const gameContainer = document.getElementById('game-container');
    const menuScreen = document.getElementById('menu-screen');
    const gameScreen = document.getElementById('game-screen');
    
    if (btnJugarAhora) {
        btnJugarAhora.addEventListener('click', function() {
            // Ocultar portada con animación
            portadaJuego.style.opacity = '0';
            portadaJuego.style.transform = 'scale(0.95)';
            portadaJuego.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                portadaJuego.style.display = 'none';
                gameContainer.style.display = 'flex';
                
                // Mostrar SOLO la pantalla de menú/configuración
                menuScreen.classList.add('active');
                gameScreen.classList.remove('active');
                
                // Animar entrada del contenedor
                gameContainer.style.opacity = '0';
                gameContainer.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    gameContainer.style.transition = 'all 0.5s ease';
                    gameContainer.style.opacity = '1';
                    gameContainer.style.transform = 'scale(1)';
                }, 50);
            }, 500);
        });
    }

    // Botón "Comenzar" - Inicia el juego
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.addEventListener('click', function() {
            // Ocultar menú y mostrar pantalla de juego
            menuScreen.classList.remove('active');
            gameScreen.classList.add('active');
            
            // Aplicar configuración seleccionada
            const fondoSeleccionado = parseInt(document.getElementById('selector-fondo').value);
            const fichasSeleccionadas = parseInt(document.getElementById('selector-fichas').value);
            
            if (juegoGlobal) {
                juegoGlobal.cambiarFondo(fondoSeleccionado);
                juegoGlobal.cambiarEstiloFichas(fichasSeleccionadas);
            }
        });
    }

    // Botón "Menú" - Vuelve al menú de configuración
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            gameScreen.classList.remove('active');
            menuScreen.classList.add('active');
            
            // Pausar el juego
            if (juegoGlobal) {
                juegoGlobal.juegoActivo = false;
                clearInterval(juegoGlobal.timerInterval);
            }
        });
    }
});


// ============================================
// CONFIGURACIÓN DE IMÁGENES
// ============================================
const CONFIG_IMAGENES = {
    // Array de fondos disponibles para el jugador
    fondosDisponibles: [
        'imagenes/juego/fondo-peg.jpg',
        'imagenes/juego/fondo2-peg.jpg',
        'imagenes/juego/fondo3-peg.jpg'
    ],
    fondoActual: 0, // Índice del fondo actual
    // Array de imágenes para las fichas (pueden ser diferentes tipos)
    fichas: [
        'imagenes/juego/ficha-peg.jpg',
        'imagenes/juego/sofia-avatar.png',
        'imagenes/juego/auroraBoreal.jpg'
    ]
};

// ============================================
// GESTOR DE IMÁGENES
// ============================================
class GestorImagenes {
    constructor() {
        this.imagenes = { fondos: [], fichas: [] };
        this.cargaCompleta = false;
    }

    // Carga todas las imágenes del juego de forma asíncrona
    async cargarTodasLasImagenes() {
        const promesas = [];
        
        // Cargar todos los fondos disponibles
        for (let i = 0; i < CONFIG_IMAGENES.fondosDisponibles.length; i++) {
            promesas.push(
                this.cargarImagen(CONFIG_IMAGENES.fondosDisponibles[i]).then(img => {
                    this.imagenes.fondos[i] = img;
                })
            );
        }

        // Cargar todas las imágenes de fichas
        for (let i = 0; i < CONFIG_IMAGENES.fichas.length; i++) {
            promesas.push(
                this.cargarImagen(CONFIG_IMAGENES.fichas[i]).then(img => {
                    this.imagenes.fichas[i] = img;
                })
            );
        }

        // Esperar a que todas las imágenes se carguen
        await Promise.all(promesas);
        this.cargaCompleta = true;
        return this.imagenes;
    }

    // Carga una imagen y si falla, crea una de respaldo
    cargarImagen(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(this.crearImagenRespaldo());
            img.src = url;
        });
    }

    // Crea una imagen circular azul como respaldo si falla la carga
    crearImagenRespaldo() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#64b5f6';
        ctx.beginPath();
        ctx.arc(50, 50, 40, 0, Math.PI * 2);
        ctx.fill();
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }
}

// ============================================
// CLASE PIEZA
// ============================================
class Pieza {
    constructor(fila, columna, tipo, imagen) {
        this.fila = fila;          // Posición en la matriz del tablero
        this.columna = columna;    // Posición en la matriz del tablero
        this.tipo = tipo;          // Tipo de ficha (para usar diferentes imágenes)
        this.imagen = imagen;      // Imagen a dibujar
        this.radio = 15;           // Radio de la ficha en píxeles
        this.tamanioImagen = 30;   // Tamaño total de la imagen
        this.seleccionada = false; // Si está siendo arrastrada
    }

    // Verifica si un punto (x,y) está dentro de esta pieza circular
    // Usa la fórmula: distancia = √[(puntoX - centroX)² + (puntoY - centroY)²]
    // Si la distancia es menor al radio, el punto está dentro
    isPointInside(x, y, posX, posY) {
        const _x = posX - x;  // Diferencia en X
        const _y = posY - y;  // Diferencia en Y
        // Calcular distancia euclidiana y comparar con el radio
        return Math.sqrt(_x * _x + _y * _y) < this.radio;
    }

    // Dibuja la pieza en el canvas
    dibujar(ctx, x, y) {
        ctx.save();
        
        // Crear un recorte circular para que la imagen sea redonda
        ctx.beginPath();
        ctx.arc(x, y, this.radio, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        // Si está seleccionada, agregar un brillo dorado
        if (this.seleccionada) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FFD700';
        }

        // Dibujar la imagen dentro del círculo recortado
        ctx.drawImage(
            this.imagen,
            x - this.radio,
            y - this.radio,
            this.radio * 2,
            this.radio * 2
        );

        ctx.restore();
        
        // Dibujar borde dorado si está seleccionada
        if (this.seleccionada) {
            ctx.save();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(x, y, this.radio + 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
}

// ============================================
// CLASE TABLERO
// ============================================
class Tablero {
    constructor(imagenes) {
        this.tamanio = 7;
        this.imagenes = imagenes;
        // Matriz que representa el tablero
        // -1 = posición inválida (esquinas)
        //  0 = posición vacía (centro al inicio)
        //  1 = posición con ficha
        this.matriz = [
            [-1, -1,  1,  1,  1, -1, -1],
            [-1, -1,  1,  1,  1, -1, -1],
            [ 1,  1,  1,  1,  1,  1,  1],
            [ 1,  1,  1,  0,  1,  1,  1], // Centro vacío
            [ 1,  1,  1,  1,  1,  1,  1],
            [-1, -1,  1,  1,  1, -1, -1],
            [-1, -1,  1,  1,  1, -1, -1]
        ];
        this.piezas = [];
        this.inicializarPiezas();
    }

    // Crea todas las piezas según la matriz inicial
    inicializarPiezas() {
        this.piezas = [];
        let tipo = 0;
        // Recorrer toda la matriz
        for (let i = 0; i < this.tamanio; i++) {
            for (let j = 0; j < this.tamanio; j++) {
                // Si hay una ficha (valor = 1), crearla
                if (this.matriz[i][j] === 1) {
                    
                    this.piezas.push(new Pieza(i, j, 0, this.imagenes.fichas[0]));
                    tipo++;
                }
            }
        }
    }

    // Verifica si una posición (fila, columna) es válida en el tablero
    // No debe estar fuera del tablero ni en una esquina (-1)
    esPositionValida(fila, col) {
        return fila >= 0 && fila < this.tamanio && 
               col >= 0 && col < this.tamanio && 
               this.matriz[fila][col] !== -1;
    }

    // Busca y retorna la pieza que está en una posición específica
    obtenerPieza(fila, col) {
        return this.piezas.find(p => p.fila === fila && p.columna === col) || null;
    }

    // Verifica si un movimiento es válido según las reglas del Peg Solitaire:
    // - Debe moverse 2 casillas en línea recta (horizontal o vertical)
    // - Debe saltar sobre una ficha
    // - El destino debe estar vacío
    esMovimientoValido(desdeF, desdeC, hastaF, hastaC) {
        // El destino debe ser una posición válida y estar vacío
        if (!this.esPositionValida(hastaF, hastaC)) return false;
        if (this.obtenerPieza(hastaF, hastaC)) return false;

        // Calcular la diferencia de movimiento
        const difF = hastaF - desdeF;
        const difC = hastaC - desdeC;

        // Debe moverse exactamente 2 casillas en una dirección
        if ((Math.abs(difF) === 2 && difC === 0) || (Math.abs(difC) === 2 && difF === 0)) {
            // La casilla del medio debe tener una ficha para saltar
            const medioF = desdeF + difF / 2;
            const medioC = desdeC + difC / 2;
            return this.obtenerPieza(medioF, medioC) !== null;
        }
        return false;
    }

    // Obtiene todos los movimientos válidos para una pieza
    obtenerMovimientosValidos(fila, col) {
        const movimientos = [];
        // Las 4 direcciones posibles: arriba, abajo, izquierda, derecha
        const direcciones = [[-2, 0], [2, 0], [0, -2], [0, 2]];

        // Probar cada dirección
        for (const [difF, difC] of direcciones) {
            const nuevaF = fila + difF;
            const nuevaC = col + difC;
            if (this.esMovimientoValido(fila, col, nuevaF, nuevaC)) {
                movimientos.push({ fila: nuevaF, col: nuevaC });
            }
        }
        return movimientos;
    }

    // Ejecuta un movimiento en el tablero
    // Mueve la pieza y elimina la ficha que se saltó
    realizarMovimiento(desdeF, desdeC, hastaF, hastaC) {
        if (!this.esMovimientoValido(desdeF, desdeC, hastaF, hastaC)) {
            return false;
        }

        // Mover la pieza a la nueva posición
        const pieza = this.obtenerPieza(desdeF, desdeC);
        pieza.fila = hastaF;
        pieza.columna = hastaC;

        // Eliminar la ficha del medio (la que se saltó)
        const medioF = desdeF + (hastaF - desdeF) / 2;
        const medioC = desdeC + (hastaC - desdeC) / 2;
        const idx = this.piezas.findIndex(p => p.fila === medioF && p.columna === medioC);
        if (idx !== -1) {
            this.piezas.splice(idx, 1);
        }
        return true;
    }

    // Verifica si quedan movimientos posibles
    // Recorre todas las piezas y ve si alguna puede moverse
    hayMovimientosPosibles() {
        for (const pieza of this.piezas) {
            if (this.obtenerMovimientosValidos(pieza.fila, pieza.columna).length > 0) {
                return true;
            }
        }
        return false;
    }

    // Verifica la condición de victoria: solo queda 1 ficha en el centro
    verificarVictoria() {
        return this.piezas.length === 1 && 
               this.piezas[0].fila === 3 && 
               this.piezas[0].columna === 3;
    }
}

// ============================================
// CLASE JUEGO
// ============================================
class JuegoPegSolitaire {
    constructor(canvasId, imagenes) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas no encontrado');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.imagenes = imagenes;
        this.tablero = new Tablero(imagenes);
        
        // Configuración del canvas (compatible Full HD 1920x1080)
        this.canvas.width = 350;
        this.canvas.height = 350;
        
        // Configuración de la grilla del tablero
        this.tamanioCelda = 50;  // Tamaño de cada casilla
        this.offsetX = 25;       // Margen izquierdo
        this.offsetY = 25;       // Margen superior
        
        // Estado del juego
        this.piezaSeleccionada = null;  // Pieza que se está arrastrando
        this.arrastrando = false;        // Si se está haciendo drag
        this.mouseX = 0;                 // Posición X del mouse
        this.mouseY = 0;                 // Posición Y del mouse
        this.movimientosValidos = [];    // Lugares donde se puede soltar la pieza
        
        // Índice del fondo actual
        this.fondoActual = CONFIG_IMAGENES.fondoActual;
        
        // Timer y estadísticas
        this.tiempoRestante = 600; // 10 minutos en segundos
        this.juegoActivo = true;
        this.movimientos = 0;
        this.timerInterval = null;
        
        // Variables para la animación de los hints
        this.animacionOffset = 0;
        this.animacionDireccion = 1;
        
        this.inicializarEventos();
        this.inicializarMenuFondos();
        this.iniciarTimer();
        this.actualizarUI();
        this.gameLoop();
    }

    // Configura los event listeners del mouse en el canvas
    inicializarEventos() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.onMouseUp(e));
    }

    // Configura el menú de selección de fondos y fichas
    inicializarMenuFondos() {
        // const menuOpciones = document.querySelector('.menu-opciones');
        // const btnOpciones = document.getElementById('btn-opciones');
        const selectorFondo = document.getElementById('selector-fondo');
        const selectorFichas = document.getElementById('selector-fichas');
        
        // Configurar el selector de fondos
        if (selectorFondo) {
            selectorFondo.value = CONFIG_IMAGENES.fondoActual;
            selectorFondo.addEventListener('change', (e) => {
                const indice = parseInt(e.target.value);
                if (!isNaN(indice) && indice >= 0 && indice < CONFIG_IMAGENES.fondosDisponibles.length) {
                    this.cambiarFondo(indice);
                }
            });
        }

        // Configurar el selector de fichas
        if (selectorFichas) {
            selectorFichas.addEventListener('change', (e) => {
                const indice = parseInt(e.target.value);
                if (!isNaN(indice) && indice >= 0 && indice < CONFIG_IMAGENES.fichas.length) {
                    this.cambiarEstiloFichas(indice);
                }
            });
        }
        
        // Configurar el botón de opciones
        // if (btnOpciones && menuOpciones) {
        //     btnOpciones.addEventListener('click', (e) => {
        //         e.stopPropagation();
        //         menuOpciones.classList.toggle('active');
        //     });
            
        //     // Cerrar el menú al hacer clic fuera de él
        //     document.addEventListener('click', (e) => {
        //         if (!menuOpciones.contains(e.target) && e.target !== btnOpciones) {
        //             menuOpciones.classList.remove('active');
        //         }
        //     });
            
        //     // Evitar que el menú se cierre al hacer clic dentro de él
        //     menuOpciones.addEventListener('click', (e) => {
        //         e.stopPropagation();
        //     });
        // }
    }

    // Cambia el fondo del juego
    cambiarFondo(indice) {
        if (indice >= 0 && indice < this.imagenes.fondos.length) {
            this.fondoActual = indice;
            CONFIG_IMAGENES.fondoActual = indice;
            this.dibujarFondo();
        }
    }

    // Cambia el estilo de las fichas
    cambiarEstiloFichas(indice) {
        if (indice >= 0 && indice < this.imagenes.fichas.length) {
            // Actualizar todas las fichas existentes
            this.tablero.piezas.forEach(pieza => {
                pieza.tipo = indice;
                pieza.imagen = this.imagenes.fichas[indice];
            });
            // Redibujar las fichas
            this.dibujarPiezas();
        }
    }

    // Maneja el click del mouse - selecciona una pieza si se clickea sobre ella
    onMouseDown(e) {
        if (!this.juegoActivo) return;

        // Obtener coordenadas del mouse relativas al canvas
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Buscar si se clickeó alguna pieza
        for (const pieza of this.tablero.piezas) {
            const pos = this.obtenerPosicionPixel(pieza.fila, pieza.columna);
            
            // Usar el método isPointInside para detección precisa
            if (pieza.isPointInside(mouseX, mouseY, pos.x, pos.y)) {
                // Seleccionar esta pieza
                this.piezaSeleccionada = pieza;
                this.arrastrando = true;
                pieza.seleccionada = true;
                this.mouseX = mouseX;
                this.mouseY = mouseY;
                // Obtener los lugares válidos donde se puede mover
                this.movimientosValidos = this.tablero.obtenerMovimientosValidos(
                    pieza.fila, pieza.columna
                );
                break;
            }
        }
    }

    // Maneja el movimiento del mouse - actualiza la posición de la pieza arrastrada
    onMouseMove(e) {
        if (!this.arrastrando || !this.piezaSeleccionada) return;
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    // Maneja soltar el mouse - intenta realizar el movimiento
    onMouseUp(e) {
        if (!this.piezaSeleccionada) return;

        if (this.arrastrando) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Convertir las coordenadas de píxeles a posición de tablero
            const filaDestino = Math.round((mouseY - this.offsetY) / this.tamanioCelda);
            const colDestino = Math.round((mouseX - this.offsetX) / this.tamanioCelda);

            // Intentar hacer el movimiento
            if (this.tablero.realizarMovimiento(
                this.piezaSeleccionada.fila,
                this.piezaSeleccionada.columna,
                filaDestino,
                colDestino
            )) {
                // Movimiento exitoso
                this.movimientos++;
                this.actualizarUI();
                
                // Verificar si ganó o si se acabó el juego
                if (this.tablero.verificarVictoria()) {
                    this.finalizarJuego(true);
                } else if (!this.tablero.hayMovimientosPosibles()) {
                    this.finalizarJuego(false);
                }
            }
        }

        // Limpiar la selección
        if (this.piezaSeleccionada) {
            this.piezaSeleccionada.seleccionada = false;
        }
        this.piezaSeleccionada = null;
        this.arrastrando = false;
        this.movimientosValidos = [];
    }

    // Convierte una posición de tablero (fila, columna) a coordenadas de píxeles
    obtenerPosicionPixel(fila, col) {
        return {
            x: this.offsetX + col * this.tamanioCelda,
            y: this.offsetY + fila * this.tamanioCelda
        };
    }

    // Dibuja la imagen de fondo del tablero
    dibujarFondo() {
        if (this.imagenes.fondos && this.imagenes.fondos[this.fondoActual]) {
            this.ctx.drawImage(
                this.imagenes.fondos[this.fondoActual], 
                0, 0, 
                this.canvas.width, 
                this.canvas.height
            );
        }
        // Capa oscura semitransparente para mejor visibilidad
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Dibuja todas las posiciones válidas del tablero
    dibujarTablero() {
        for (let i = 0; i < this.tablero.tamanio; i++) {
            for (let j = 0; j < this.tablero.tamanio; j++) {
                if (this.tablero.matriz[i][j] !== -1) {
                    const pos = this.obtenerPosicionPixel(i, j);
                    
                    // Círculo de la posición
                    this.ctx.fillStyle = 'rgba(100, 181, 246, 0.15)';
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.strokeStyle = 'rgba(100, 181, 246, 0.4)';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();

                    // Resaltar el centro (objetivo de victoria)
                    if (i === 3 && j === 3) {
                        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
                        this.ctx.lineWidth = 3;
                        this.ctx.stroke();
                    }
                }
            }
        }
    }

    // Dibuja los hints animados que indican dónde se puede mover la pieza
    dibujarHints() {
        if (this.movimientosValidos.length === 0) return;

        for (const mov of this.movimientosValidos) {
            const pos = this.obtenerPosicionPixel(mov.fila, mov.col);
            
            // Calcular escala y transparencia animada
            const escala = 1 + this.animacionOffset * 0.2;
            const alpha = 0.6 + this.animacionOffset * 0.3;

            // Dibujar círculo pulsante dorado
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 15 * escala, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            // Dibujar flecha apuntando en la dirección del movimiento
            const difF = mov.fila - this.piezaSeleccionada.fila;
            const difC = mov.col - this.piezaSeleccionada.columna;
            const angulo = Math.atan2(difF, difC);
            this.dibujarFlecha(pos.x, pos.y, angulo);
        }
    }

    // Dibuja una flecha direccional animada
    dibujarFlecha(x, y, angulo) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angulo);
        
        // La flecha se mueve según la animación
        const offset = this.animacionOffset * 5;
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(10 + offset, 0);
        this.ctx.lineTo(0 + offset, -8);
        this.ctx.lineTo(0 + offset, 8);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
    }

    // Dibuja todas las piezas del tablero
    dibujarPiezas() {
        // Primero dibujar las piezas que están en el tablero
        for (const pieza of this.tablero.piezas) {
            if (this.arrastrando && pieza === this.piezaSeleccionada) {
                continue; // No dibujar la pieza que se está arrastrando aquí
            }
            const pos = this.obtenerPosicionPixel(pieza.fila, pieza.columna);
            pieza.dibujar(this.ctx, pos.x, pos.y);
        }

        // Dibujar la pieza arrastrada al final para que quede encima
        if (this.arrastrando && this.piezaSeleccionada) {
            this.piezaSeleccionada.dibujar(this.ctx, this.mouseX, this.mouseY);
        }
    }

    // Loop principal del juego - se ejecuta 60 veces por segundo
    gameLoop() {
        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Actualizar la animación de los hints (efecto de pulso)
        this.animacionOffset += 0.05 * this.animacionDireccion;
        if (this.animacionOffset > 1 || this.animacionOffset < 0) {
            this.animacionDireccion *= -1; // Invertir dirección
        }

        // Dibujar todo en orden
        this.dibujarFondo();
        this.dibujarTablero();
        this.dibujarHints();
        this.dibujarPiezas();

        // Llamar a este método nuevamente en el próximo frame
        requestAnimationFrame(() => this.gameLoop());
    }

    // Inicia el timer que cuenta regresivamente
    iniciarTimer() {
        // Limpiar cualquier temporizador existente
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (!this.juegoActivo) {
                clearInterval(this.timerInterval);
                return;
            }
            
            if (this.tiempoRestante > 0) {
                this.tiempoRestante--;
                this.actualizarUI();
                
                if (this.tiempoRestante <= 0) {
                    this.tiempoRestante = 0; // Asegurarse de que no sea negativo
                    this.actualizarUI();
                    clearInterval(this.timerInterval);
                    this.finalizarJuego(false);
                }
            }
        }, 1000); // Actualizar cada segundo
        
        // Actualizar la UI inmediatamente
        this.actualizarUI();
    }

    // Actualiza los elementos de la interfaz (tiempo, fichas, movimientos)
    actualizarUI() {
        // Actualizar contador de fichas
        const piecesCount = document.getElementById('piecesCount');
        if (piecesCount) {
            piecesCount.textContent = this.tablero.piezas.length;
        }

        // Actualizar timer en formato MM:SS
        const timer = document.getElementById('timer');
        if (timer) {
            const min = Math.floor(this.tiempoRestante / 60);
            const seg = this.tiempoRestante % 60;
            timer.textContent = `${min}:${seg.toString().padStart(2, '0')}`;
        }

        // Actualizar contador de movimientos
        const movesCount = document.getElementById('movesCount');
        if (movesCount) {
            movesCount.textContent = this.movimientos;
        }
    }

    // Termina el juego y muestra el resultado
    finalizarJuego(victoria) {
        this.juegoActivo = false;
        clearInterval(this.timerInterval);

        const gameOver = document.getElementById('gameOver');
        const title = document.getElementById('gameOverTitle');
        const message = document.getElementById('gameOverMessage');

        if (gameOver && title && message) {
            if (victoria) {
                title.textContent = '🎉 ¡VICTORIA! 🎉';
                message.textContent = `¡Ganaste en ${this.movimientos} movimientos!`;
            } else if (this.tiempoRestante === 0) {
                title.textContent = '⏰ Tiempo Agotado';
                message.textContent = `Quedaron ${this.tablero.piezas.length} fichas`;
            } else {
                title.textContent = '🎮 Fin del Juego';
                message.textContent = `No hay más movimientos. Quedaron ${this.tablero.piezas.length} fichas`;
            }
            gameOver.classList.add('show');
        }
    }


    // Reinicia el juego completamente
    reiniciar() {
        clearInterval(this.timerInterval);
        this.tablero = new Tablero(this.imagenes);
        this.piezaSeleccionada = null;
        this.arrastrando = false;
        this.movimientosValidos = [];
        this.tiempoRestante = 600;
        this.juegoActivo = true;
        this.movimientos = 0;
        
        const gameOver = document.getElementById('gameOver');
        if (gameOver) {
            gameOver.classList.remove('show');
        }
        
        this.actualizarUI();
        this.iniciarTimer();
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================
let juegoGlobal = null;

// Inicializa el juego cuando todas las imágenes están cargadas
async function inicializarJuego() {
    try {
        const gestor = new GestorImagenes();
        const imagenes = await gestor.cargarTodasLasImagenes();
        
        juegoGlobal = new JuegoPegSolitaire('gameCanvas', imagenes);
        window.imagenesJuego = imagenes;
        
        console.log('✅ Juego iniciado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar:', error);
    }
}

// Reinicia el juego
function reiniciarJuego() {
    if (juegoGlobal) {
        juegoGlobal.reiniciar();
    }
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarJuego);
} else {
    inicializarJuego();
}

// Event listeners para los botones
window.addEventListener('load', () => {
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', reiniciarJuego);
    }
});

// Exportar para uso global
window.reiniciarJuego = reiniciarJuego;