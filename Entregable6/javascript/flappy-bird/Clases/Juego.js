import { Jugador } from './Jugador.js';
import { Obstaculo } from './Obstaculo.js';
import { Coleccionable } from './Coleccionable.js';
import { Fondo } from './Fondo.js';
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
    this.lienzo.width = CONFIG.CANVAS_WIDTH;
    this.lienzo.height = CONFIG.CANVAS_HEIGHT;

    // Elementos del juego
    this.jugador = null;
    this.fondo = null;
    this.obstaculos = [];
    this.coleccionables = [];

    // Estado del juego
    this.puntuacion = 0;
    this.tiempoRestante = CONFIG.TIME_LIMIT;
    this.contadorCuadros = 0;
    this.juegoTerminado = false;
    this.juegoGanado = false;
    this.estaEjecutando = false;

    // Timer
    this.ultimoTiempo = Date.now();

    this.configurarEventos();
  }

  configurarEventos() {
    document
      .getElementById('btn-start')
      .addEventListener('click', () => this.iniciarJuego());
    document
      .getElementById('resetBtn')
      .addEventListener('click', () => this.reiniciar());
    document
      .getElementById('menuBtn')
      .addEventListener('click', () => this.volverAlMenu());
    document
      .getElementById('btn-jugar-ahora')
      ?.addEventListener('click', () => this.mostrarMenu());

    this.configurarControles();
  }

  configurarControles() {
    const manejarSalto = () => {
      if (this.estaEjecutando && !this.juegoTerminado) {
        this.jugador.saltar();
      }
    };

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        manejarSalto();
      }
    });

    // Click en canvas
    this.lienzo.addEventListener('click', manejarSalto);

    // Touch para móviles
    this.lienzo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      manejarSalto();
    });
  }

  mostrarPantalla(idPantalla) {
    document
      .querySelectorAll('.screen')
      .forEach((pantalla) => pantalla.classList.remove('active'));
    document.getElementById(idPantalla)?.classList.add('active');
  }

  mostrarMenu() {
    document.getElementById('portada-juego').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    this.mostrarPantalla('menu-screen');
  }

  iniciarJuego() {
    this.mostrarPantalla('game-screen');

    // Crear elementos del juego
    this.jugador = new Jugador(
      100,
      CONFIG.CANVAS_HEIGHT / 2,
      this.lienzo
    );
    this.fondo = new Fondo(this.lienzo);
    this.obstaculos = [];
    this.coleccionables = [];

    // Reiniciar estado
    this.puntuacion = 0;
    this.tiempoRestante = CONFIG.TIME_LIMIT;
    this.contadorCuadros = 0;
    this.juegoTerminado = false;
    this.juegoGanado = false;

    this.iniciar();
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

    requestAnimationFrame(() => this.buclePrincipal());
  }

  actualizar() {
    if (this.juegoTerminado) return;

    this.contadorCuadros++;

    // Actualizar background
    this.fondo.actualizar();

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
      if (
        obstaculo.colisionaCon(this.jugador) &&
        !this.jugador.invulnerable
      ) {
        this.jugador.morir();
        this.terminarJuego();
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
      COLLECTIBLE_TYPES[
        Math.floor(Math.random() * COLLECTIBLE_TYPES.length)
      ];

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
          if (
            y < obstaculo.alturaSuperior ||
            y > obstaculo.yInferior - 30
          ) {
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

    switch (item.tipo) {
      case 'coin':
        this.puntuacion += valor.score;
        break;
      case 'shield':
        this.jugador.hacerInvulnerable(valor.invulnerability);
        break;
      case 'star':
        this.puntuacion += valor.score;
        this.tiempoRestante += valor.timeBonus;
        break;
    }
  }

  renderizar() {
    // Limpiar canvas
    this.contexto.fillStyle = '#08121b';
    this.contexto.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Dibujar background
    this.fondo.dibujar();

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

  dibujarHUD() {
    // Panel superior
    this.contexto.fillStyle = 'rgba(28, 31, 39, 0.8)';
    this.contexto.fillRect(0, 0, CONFIG.CANVAS_WIDTH, 60);

    // Puntuación
    this.contexto.fillStyle = '#ffd700';
    this.contexto.font = 'bold 24px Space Grotesk';
    this.contexto.fillText(`Puntos: ${this.puntuacion}`, 20, 35);

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
      this.contexto.fillText(
        '🛡️ PROTEGIDO',
        CONFIG.CANVAS_WIDTH - 180,
        35
      );
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
      CONFIG.CANVAS_HEIGHT / 2 - 50
    );

    // Puntuación final
    this.contexto.fillStyle = '#ffd700';
    this.contexto.font = 'bold 32px Space Grotesk';
    this.contexto.fillText(
      `Puntuación Final: ${this.puntuacion}`,
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2 + 20
    );

    // Instrucciones
    this.contexto.fillStyle = '#9da6b9';
    this.contexto.font = '20px Plus Jakarta Sans';
    this.contexto.fillText(
      'Presiona el botón Reiniciar para jugar de nuevo',
      CONFIG.CANVAS_WIDTH / 2,
      CONFIG.CANVAS_HEIGHT / 2 + 80
    );
  }

  terminarJuego() {
    this.juegoTerminado = true;
    this.estaEjecutando = false;
  }

  ganar() {
    this.juegoGanado = true;
    this.terminarJuego();
  }

  reiniciar() {
    // Limpiar el canvas
    this.contexto.clearRect(0, 0, this.lienzo.width, this.lienzo.height);
    
    // Restablecer propiedades del contexto
    this.contexto.setTransform(1, 0, 0, 1, 0, 0);
    this.contexto.font = 'bold 24px Space Grotesk';
    
    // Reiniciar el juego
    this.iniciarJuego();
  }

  volverAlMenu() {
    if (this.estaEjecutando) {
      this.estaEjecutando = false;
    }
    this.mostrarPantalla('menu-screen');
  }
}