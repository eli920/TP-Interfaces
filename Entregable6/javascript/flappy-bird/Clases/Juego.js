import { Jugador } from './Jugador.js';
import { Obstaculo } from './Obstaculo.js';
import { Coleccionable } from './Coleccionable.js';
import {
  CONFIG,
  COLLECTIBLE_TYPES,
  COLLECTIBLE_VALUES,
  OBSTACLE_CONFIG,
} from '../utils/config.js'

// ============================================
// CLASE JUEGO - Controlador principal
// ============================================
export class Juego {
  constructor() {
    this.lienzo = document.getElementById('gameCanvas');
    this.contexto = this.lienzo.getContext('2d');

    // Elementos del juego
    this.jugador = null;
    this.obstaculos = [];
    this.coleccionables = [];

    // Estado del juego
    this.puntuacion = 0;
    this.tiempoRestante = CONFIG.TIME_LIMIT;
    this.contadorCuadros = 0;
    this.juegoTerminado = false;
    this.juegoGanado = false;
    this.estaEjecutando = false;

    this.loopId = null; //Id que identifica si se esta ejecutando el loop del parallax
    // Timer
    this.ultimoTiempo = Date.now();

    this.configurarControles();
  }

  configurarControles() {
    this.saltarTeclado = (e) => {
      /*Se evita que al finalizar el juego se haga scroll con alguna de las teclas*/
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
      }

      if (
        (e.code === 'Space' || e.code === 'ArrowUp') &&
        this.estaEjecutando &&
        !this.juegoTerminado
      ) {
        e.preventDefault();
        this.jugador.saltar();
      }
    };

    this.saltarClick = (e) => {
      if (this.estaEjecutando && !this.juegoTerminado) {
        this.jugador.saltar();
      }
    };

    // Touch para móviles
    this.saltarTouch = (e) => {
      e.preventDefault();
      if (this.estaEjecutando && !this.juegoTerminado) {
        this.jugador.saltar();
      }
    };

    document.addEventListener('keydown', this.saltarTeclado);
    this.lienzo.addEventListener('click', this.saltarClick);
    this.lienzo.addEventListener('touchstart', this.saltarTouch);
  }

  mostrarPantalla(idPantalla) {
    document
      .querySelectorAll('.screen')
      .forEach((pantalla) => pantalla.classList.remove('active'));
    document.getElementById(idPantalla)?.classList.add('active');
  }

 
  iniciarJuego() {
    this.mostrarPantalla('game-screen');

    // Crear elementos del juego
    this.jugador = new Jugador(100, CONFIG.CANVAS_HEIGHT / 2, this.lienzo);

    this.obstaculos = [];
    this.coleccionables = [];

    // Reiniciar estado
    this.puntuacion = 0;
    this.tiempoRestante = CONFIG.TIME_LIMIT;
    this.contadorCuadros = 0;
    this.juegoTerminado = false;
    this.juegoGanado = false;

    /*Se crea un obstaculo para que aparezca más cerca a la hora de iniciar el juego*/
    this.obstaculos.push(new Obstaculo(CONFIG.CANVAS_WIDTH - 200, this.lienzo));

    this.activarParallax();

    this.iniciar();
  }

  activarParallax() {
    const parallaxContainer = document.querySelector(".parallax-bg");
    parallaxContainer.classList.add("activo");
  }

  detenerParallax() {
    const parallaxContainer = document.querySelector(".parallax-bg");
    parallaxContainer.classList.remove("activo");
  }

  iniciar() {
    this.estaEjecutando = true;
    this.ultimoTiempo = Date.now();
    this.buclePrincipal();
  }

  buclePrincipal() {
    if (!this.estaEjecutando) return;

    // Actualizar timer
    const tiempoActual = Date.now();
    if (tiempoActual - this.ultimoTiempo >= 1000) {
      this.tiempoRestante--;
      this.ultimoTiempo = tiempoActual;

      if (this.tiempoRestante <= 0 && !this.juegoTerminado) {
        this.ganar();
      }
    }

    this.actualizar();
    this.renderizar();

    this.loopId = requestAnimationFrame(() => this.buclePrincipal());
  }

  actualizar() {
    if (this.juegoTerminado) return;

    this.contadorCuadros++;

    // Actualizar jugador
    this.jugador.actualizar();

    // Generar obstáculos
    if (this.contadorCuadros % CONFIG.OBSTACLE_SPAWN_RATE === 0) {
      this.obstaculos.push(new Obstaculo(CONFIG.CANVAS_WIDTH, this.lienzo));
    }

    // Generar coleccionables
    if (this.contadorCuadros % CONFIG.COLLECTIBLE_SPAWN_RATE === 0) {
      this.generarColeccionable();
    }

    // Actualizar obstáculos
    this.obstaculos = this.obstaculos.filter((obstaculo) => {
      obstaculo.actualizar();

      // Verificar colisión
      if (obstaculo.colisionaCon(this.jugador) && !this.jugador.invulnerable) {
          // Activar animación de explosión
          this.jugador.morir();

          // Esperar a que termine la animación ANTES de terminar el juego
          setTimeout(() => {
              this.terminarJuego();
          }, 900); // mismo tiempo que tu animación CSS

          // NO seguir procesando este obstáculo
          return false;
      }

      // Verificar si pasó el obstáculo
      if (obstaculo.haPasadoAlJugador(this.jugador)) {
        this.puntuacion += 10;
      }

      return !obstaculo.estaFueraDePantalla();
    });

    // Actualizar coleccionables
    this.coleccionables = this.coleccionables.filter((item) => {
      item.actualizar();

      // Verificar colisión
      if (item.colisionaCon(this.jugador)) {
        item.recolectado = true;
        this.manejarColeccionable(item);
        return false;
      }

      return !item.estaFueraDePantalla();
    });
  }

  generarColeccionable() {
    const tipo =
      COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)];

    // Encontrar una posición Y segura (evitar obstáculos)
    let y = 100 + Math.random() * (CONFIG.CANVAS_HEIGHT - 200);
    let esSegura = false;
    let intentos = 0;

    while (!esSegura && intentos < 10) {
      esSegura = true;
      // Verificar contra todos los obstáculos cercanos
      for (let obstaculo of this.obstaculos) {
        if (obstaculo.x > CONFIG.CANVAS_WIDTH - 200) {
          // Si el coleccionable estaría en la zona del obstáculo
          if (y < obstaculo.alturaSuperior || y > obstaculo.yInferior - 30) {
            esSegura = false;
            y =
              obstaculo.alturaSuperior +
              50 +
              Math.random() * (obstaculo.alturaHueco - 100);
            break;
          }
        }
      }
      intentos++;
    }

    if (esSegura) {
      this.coleccionables.push(
        new Coleccionable(CONFIG.CANVAS_WIDTH, y, tipo, this.lienzo)
      );
    }
  }

  manejarColeccionable(item) {
    const valor = COLLECTIBLE_VALUES[item.tipo];

      // nuevo
    this.jugador.elemento.classList.add('recolectar');
    setTimeout(() => {
      this.jugador.elemento.classList.remove('recolectar');
    }, 300);


    switch (item.tipo) {
      case 'moneda':
        this.puntuacion += valor.score;
        break;
      case 'escudo':
        this.jugador.hacerInvulnerable(valor.invulnerability);
        break;
      case 'estrella':
        this.puntuacion += valor.score;
        this.tiempoRestante += valor.timeBonus;
        break;
    }
  }

  renderizar() {
    // Limpiar canvas
    this.contexto.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Dibujar obstáculos
    this.obstaculos.forEach((obstaculo) => obstaculo.dibujar());

    // Dibujar coleccionables
    this.coleccionables.forEach((item) => item.dibujar());

    // Dibujar jugador
    this.jugador.dibujar();

    // Dibujar HUD
    this.dibujarHUD();

    // Dibujar pantalla de game over
    if (this.juegoTerminado) {
      this.dibujarGameOver();
    }
  }

  /*VER REINICIO*/
  dibujarHUD() {
    // Panel superior
    this.contexto.fillStyle = 'rgba(28, 31, 39, 0.8)';
    this.contexto.fillRect(0, 0, CONFIG.CANVAS_WIDTH, 60);

    // Puntuación
    this.contexto.fillStyle = '#ffd700';
    this.contexto.font = 'bold 24px Space Grotesk';
    this.contexto.fillText(`Puntos: ${this.puntuacion}`, 30, 30);

    // Tiempo
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    const colorTiempo = this.tiempoRestante < 30 ? '#ff4444' : '#64b5f6';
    this.contexto.fillStyle = colorTiempo;
    this.contexto.fillText(
      `Tiempo: ${minutos}:${segundos.toString().padStart(2, '0')}`,
      CONFIG.CANVAS_WIDTH / 2 - 80,
      35
    );

    // Estado de invulnerabilidad
    if (this.jugador.invulnerable) {
      this.contexto.fillStyle = '#64b5f6';
      this.contexto.fillText('🛡️ PROTEGIDO', CONFIG.CANVAS_WIDTH - 200, 30);
    }
  }

  dibujarGameOver() {
    // Overlay oscuro
    this.contexto.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.contexto.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Mensaje principal
    this.contexto.fillStyle = this.juegoGanado ? '#4caf50' : '#ff4444';
    this.contexto.font = 'bold 48px Plus Jakarta Sans';
    this.contexto.textAlign = 'center';
    const mensaje = this.juegoGanado ? '¡VICTORIA!' : 'GAME OVER';
    this.contexto.fillText(
      mensaje,
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2 - 40
    );

    // Puntuación final
    this.contexto.fillStyle = '#ffd700';
    this.contexto.font = 'bold 32px Space Grotesk';
    this.contexto.fillText(
      `Puntuación Final: ${this.puntuacion}`,
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2 + 10
    );

    // Instrucciones
    this.contexto.fillStyle = '#9da6b9';
    this.contexto.font = '20px Plus Jakarta Sans';
    this.contexto.fillText(
      'Presiona el botón Reiniciar para jugar de nuevo',
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2 + 60
    );

    //Detener el loop luego de dibujar el Game Over
    this.estaEjecutando = false;
  }

  terminarJuego() {
    this.juegoTerminado = true;
    this.detenerParallax();
  }

  ganar() {
    this.juegoGanado = true;
    this.terminarJuego();
  }

  reiniciar() {
    this.estaEjecutando = false;

  //nuevo 
  if (this.jugador) {
    this.jugador.destruir();
  }

    if (this.loopId != null) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }

    // Reiniciar el juego
    this.iniciarJuego();
  }

  volverAlMenu() {
    this.detener();
    this.mostrarPantalla('menu-screen');
  }

  detener() {
    this.estaEjecutando = false;

    //nuevo
    if (this.jugador) {
      this.jugador.destruir();
    }

    if (this.loopId !== null) {
      cancelAnimationFrame(this.loopId);
      this.loopId = null;
    }

    this.detenerParallax();
  }
}