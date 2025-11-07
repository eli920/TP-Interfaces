import { CONFIG, OBSTACLE_CONFIG } from '../utils/config.js';

// ============================================
// CLASE OBSTÁCULO - Maneja los obstáculos
// ============================================
export class Obstaculo {
  constructor(x, canvas) {
    this.canvas = canvas;
    this.contexto = canvas.getContext('2d');
    this.x = x;
    this.ancho = OBSTACLE_CONFIG.WIDTH;
    this.alturaHueco = OBSTACLE_CONFIG.GAP_HEIGHT;
    this.alturaSuperior =
      Math.random() *
        (CONFIG.CANVAS_HEIGHT -
          this.alturaHueco -
          OBSTACLE_CONFIG.MAX_TOP_HEIGHT_OFFSET) +
      OBSTACLE_CONFIG.MIN_TOP_HEIGHT;
    this.yInferior = this.alturaSuperior + this.alturaHueco;
    this.pasado = false;

    // Animación de la tubería
    this.desplazamientoAnimacion = 0;
  }

  actualizar() {
    this.x -= CONFIG.GAME_SPEED;
    this.desplazamientoAnimacion += 0.1;
  }

  dibujar() {
    // Tubería superior
    this.dibujarTuberia(this.x, 0, this.ancho, this.alturaSuperior, true);

    // Tubería inferior
    this.dibujarTuberia(
      this.x,
      this.yInferior,
      this.ancho,
      CONFIG.CANVAS_HEIGHT - this.yInferior,
      false
    );
  }

  dibujarTuberia(x, y, ancho, alto, esSuperior) {
    // Cuerpo principal de la tubería
    const gradiente = this.contexto.createLinearGradient(x, 0, x + ancho, 0);
    gradiente.addColorStop(0, '#2d3561');
    gradiente.addColorStop(0.5, '#1a1f3a');
    gradiente.addColorStop(1, '#2d3561');

    this.contexto.fillStyle = gradiente;
    this.contexto.fillRect(x, y, ancho, alto);

    // Borde de la tubería
    this.contexto.fillStyle = '#64b5f6';
    const altoBorde = 30;
    const yBorde = esSuperior ? y + alto - altoBorde : y;
    this.contexto.fillRect(x - 5, yBorde, ancho + 10, altoBorde);

    // Detalles animados
    this.contexto.strokeStyle = '#4a90e2';
    this.contexto.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const yLinea =
        y +
        (alto / 4) * i +
        Math.sin(this.desplazamientoAnimacion + i) * 5;
      this.contexto.beginPath();
      this.contexto.moveTo(x + 5, yLinea);
      this.contexto.lineTo(x + ancho - 5, yLinea);
      this.contexto.stroke();
    }
  }

  estaFueraDePantalla() {
    return this.x + this.ancho < 0;
  }

  colisionaCon(jugador) {
    if (
      jugador.x + jugador.ancho > this.x &&
      jugador.x < this.x + this.ancho
    ) {
      if (
        jugador.y < this.alturaSuperior ||
        jugador.y + jugador.alto > this.yInferior
      ) {
        return true;
      }
    }
    return false;
  }

  haPasadoAlJugador(jugador) {
    if (!this.pasado && jugador.x > this.x + this.ancho) {
      this.pasado = true;
      return true;
    }
    return false;
  }
}