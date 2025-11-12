import { Tablero } from './Tablero.js';
import { Pieza } from './Pieza.js';

// Configuración de imágenes (copiada aquí)
const CONFIG_IMAGENES = {
  fondosDisponibles: [
    'imagenes/juego/peg-solitaire/fondo-peg.jpg',
    'imagenes/juego/peg-solitaire/fondo2-peg.jpg',
    'imagenes/juego/peg-solitaire/fondo3-peg.jpg',
  ],
  fondoActual: 0,
  fichas: [
    'imagenes/juego/peg-solitaire/ficha-blanca.png',
    'imagenes/juego/peg-solitaire/ficha-oscura.png',
    'imagenes/juego/peg-solitaire/ficha-colorida.png',
  ],
};

export class JuegoPegSolitaire {
  constructor(canvasId, imagenes) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Canvas no encontrado');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.imagenes = imagenes;
    this.tipoFichaActual = 0;
    this.tablero = new Tablero(imagenes);

    this.canvas.width = 600;
    this.canvas.height = 550;

    this.tamanioCelda = 75;
    this.offsetX = 62;
    this.offsetY = 50;

    this.piezaSeleccionada = null;
    this.arrastrando = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.movimientosValidos = [];

    this.fondoActual = CONFIG_IMAGENES.fondoActual;

    this.tiempoRestante = 600;
    this.juegoActivo = true;
    this.movimientos = 0;
    this.timerInterval = null;

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
    const selectorFondo = document.getElementById('selector-fondo');
    const selectorFichas = document.getElementById('selector-fichas');

    // Configurar el selector de fondos
    if (selectorFondo) {
      selectorFondo.value = CONFIG_IMAGENES.fondoActual;
      selectorFondo.addEventListener('change', (e) => {
        const indice = parseInt(e.target.value);
        if (
          !isNaN(indice) &&
          indice >= 0 &&
          indice < CONFIG_IMAGENES.fondosDisponibles.length
        ) {
          this.cambiarFondo(indice);
        }
      });
    }

    // Configurar el selector de fichas
    if (selectorFichas) {
      selectorFichas.addEventListener('change', (e) => {
        const indice = parseInt(e.target.value);
        if (
          !isNaN(indice) &&
          indice >= 0 &&
          indice < CONFIG_IMAGENES.fichas.length
        ) {
          this.cambiarEstiloFichas(indice);
        }
      });
    }
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
      // Guardar el tipo de ficha actual
      this.tipoFichaActual = indice;

      // Actualizar todas las fichas existentes
      this.tablero.piezas.forEach((pieza) => {
        pieza.tipo = indice;
        pieza.imagen = this.imagenes.fichas[indice];
      });

      // Actualizar el tipo de ficha del tablero
      this.tablero.tipoFichaActual = indice;

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
          pieza.fila,
          pieza.columna
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
      const filaDestino = Math.round(
        (mouseY - this.offsetY) / this.tamanioCelda
      );
      const colDestino = Math.round(
        (mouseX - this.offsetX) / this.tamanioCelda
      );

      // Intentar hacer el movimiento
      if (
        this.tablero.realizarMovimiento(
          this.piezaSeleccionada.fila,
          this.piezaSeleccionada.columna,
          filaDestino,
          colDestino
        )
      ) {
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
      y: this.offsetY + fila * this.tamanioCelda,
    };
  }

  // Dibuja la imagen de fondo del tablero
  dibujarFondo() {
    if (this.imagenes.fondos && this.imagenes.fondos[this.fondoActual]) {
      this.ctx.drawImage(
        this.imagenes.fondos[this.fondoActual],
        0,
        0,
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
      const escala = 1 + this.animacionOffset * 0.2;
      const alpha = 0.6 + this.animacionOffset * 0.3;

      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = '#FFD700';
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 15 * escala, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

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
    for (const pieza of this.tablero.piezas) {
      if (this.arrastrando && pieza === this.piezaSeleccionada) {
        continue;
      }
      const pos = this.obtenerPosicionPixel(pieza.fila, pieza.columna);
      pieza.dibujar(this.ctx, pos.x, pos.y);
    }

    if (this.arrastrando && this.piezaSeleccionada) {
      this.piezaSeleccionada.dibujar(this.ctx, this.mouseX, this.mouseY);
    }
  }

  // Loop principal del juego
  gameLoop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.animacionOffset += 0.05 * this.animacionDireccion;
    if (this.animacionOffset > 1 || this.animacionOffset < 0) {
      this.animacionDireccion *= -1;
    }

    this.dibujarFondo();
    this.dibujarTablero();
    this.dibujarHints();
    this.dibujarPiezas();

    requestAnimationFrame(() => this.gameLoop());
  }

  // Inicia el timer
  iniciarTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.actualizarUI();
    setTimeout(() => {
      this.timerInterval = setInterval(() => {
        if (!this.juegoActivo) {
          clearInterval(this.timerInterval);
          return;
        }

        if (this.tiempoRestante > 0) {
          this.tiempoRestante--;
          this.actualizarUI();

          if (this.tiempoRestante <= 0) {
            this.tiempoRestante = 0;
            this.actualizarUI();
            clearInterval(this.timerInterval);
            this.finalizarJuego(false);
          }
        }
      }, 1000);
    }, 500);

    this.actualizarUI();
  }

  // Actualiza la UI
  actualizarUI() {
    const piecesCount = document.getElementById('piecesCount');
    if (piecesCount) {
      piecesCount.textContent = this.tablero.piezas.length;
    }

    const timer = document.getElementById('timer');
    if (timer) {
      const min = Math.floor(this.tiempoRestante / 60);
      const seg = this.tiempoRestante % 60;
      timer.textContent = `${min}:${seg.toString().padStart(2, '0')}`;
    }

    const movesCount = document.getElementById('movesCount');
    if (movesCount) {
      movesCount.textContent = this.movimientos;
    }
  }

  // Finaliza el juego
  finalizarJuego(victoria) {
    this.juegoActivo = false;
    clearInterval(this.timerInterval);

    const gameOver = document.getElementById('gameOver');
    const title = document.getElementById('gameOverTitle');
    const message = document.getElementById('gameOverMessage');

    if (gameOver && title && message) {
      if (victoria) {
        title.textContent = 'VICTORIA!';
        message.textContent = `¡Ganaste en ${this.movimientos} movimientos!`;
      } else if (this.tiempoRestante === 0) {
        title.textContent = '⏰ Tiempo Agotado';
        message.textContent = `Quedaron ${this.tablero.piezas.length} fichas`;
      } else {
        title.textContent = '🎮 Fin del Juego';
        message.textContent = `No hay más movimientos. Quedaron ${this.tablero.piezas.length} fichas`;
      }

      //Agrega las clases según resultado
      if (victoria) {
        gameOver.className = "mensaje-ganaste show";
      } else {
          gameOver.className = "game-over show";
      }

    }
  }

  // Reinicia el juego
  reiniciar() {
    clearInterval(this.timerInterval);
    this.tablero = new Tablero(this.imagenes, this.tipoFichaActual);
    this.piezaSeleccionada = null;
    this.arrastrando = false;
    this.movimientosValidos = [];
    this.tiempoRestante = 600;
    this.juegoActivo = true;
    this.movimientos = 0;

    const gameOver = document.getElementById('gameOver');
    if (gameOver) {
      // Se oculta y vuelve a la clase base
      gameOver.className = "game-over";
      // gameOver.classList.remove('show');
    }

    this.actualizarUI();
    this.iniciarTimer();
  }

  // Guarda la partida
  guardarPartida() {
    const estadoJuego = {
      matriz: this.tablero.matriz,
      piezas: this.tablero.piezas.map((p) => ({
        fila: p.fila,
        columna: p.columna,
        tipo: p.tipo,
      })),
      tiempoRestante: this.tiempoRestante,
      movimientos: this.movimientos,
      fondoActual: this.fondoActual,
      tipoFichaActual: this.tipoFichaActual,
      fechaGuardado: new Date().toISOString(),
    };

    localStorage.setItem('peg-solitaire-guardado', JSON.stringify(estadoJuego));
    console.log('Partida guardada');
  }

  // Carga la partida
  cargarPartida() {
    const guardado = localStorage.getItem('peg-solitaire-guardado');
    if (!guardado) return false;

    try {
      const estado = JSON.parse(guardado);

      this.tablero.matriz = estado.matriz;
      this.tablero.piezas = [];

      estado.piezas.forEach((p) => {
        const imagen = this.imagenes.fichas[p.tipo];
        this.tablero.piezas.push(new Pieza(p.fila, p.columna, p.tipo, imagen));
      });

      this.tiempoRestante = estado.tiempoRestante;
      this.movimientos = estado.movimientos;

      if (estado.tipoFichaActual !== undefined) {
        this.tipoFichaActual = estado.tipoFichaActual;
        this.tablero.tipoFichaActual = estado.tipoFichaActual;
      }

      if (estado.fondoActual !== undefined) {
        this.cambiarFondo(estado.fondoActual);
      }

      this.actualizarUI();
      console.log('Partida cargada');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // Borra la partida guardada
  borrarPartidaGuardada() {
    localStorage.removeItem('peg-solitaire-guardado');
    console.log('Partida guardada eliminada');
  }

  // Verifica si hay partida guardada
  hayPartidaGuardada() {
    return localStorage.getItem('peg-solitaire-guardado') !== null;
  }
}
