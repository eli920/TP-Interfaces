import { CONFIG } from '../utils/config.js';

// ============================================
// CLASE COLECCIONABLE - Items coleccionables
// ============================================
export class Coleccionable {
  constructor(x, y, tipo, canvas) {
    this.canvas = canvas;
    this.contexto = canvas.getContext('2d');
    this.x = x;
    this.y = y;
    this.ancho = 30;
    this.alto = 30;
    this.tipo = tipo; // 'coin', 'shield', 'star'
    this.recolectado = false;
    this.cuadroAnimacion = 0;
    this.desplazamientoFlotante = 0;
  }

  actualizar() {
    this.x -= CONFIG.GAME_SPEED;
    this.cuadroAnimacion += 0.1;
    this.desplazamientoFlotante = Math.sin(this.cuadroAnimacion) * 5;
  }

  dibujar() {
    this.contexto.save();
    this.contexto.translate(
      this.x + this.ancho / 2,
      this.y + this.alto / 2 + this.desplazamientoFlotante
    );

    // Resplandor
    const gradiente = this.contexto.createRadialGradient(0, 0, 5, 0, 0, 20);
    gradiente.addColorStop(0, this.obtenerColor(0.8));
    gradiente.addColorStop(1, this.obtenerColor(0));
    this.contexto.fillStyle = gradiente;
    this.contexto.beginPath();
    this.contexto.arc(0, 0, 20, 0, Math.PI * 2);
    this.contexto.fill();

    // Item principal
    this.contexto.rotate(this.cuadroAnimacion);
    this.dibujarFormaItem();

    this.contexto.restore();
  }

  dibujarFormaItem() {
    switch (this.tipo) {
      case 'coin':
        this.dibujarMoneda();
        break;
      case 'shield':
        this.dibujarEscudo();
        break;
      case 'star':
        this.dibujarEstrella();
        break;
    }
  }

  dibujarMoneda() {
    // Moneda dorada
    this.contexto.fillStyle = '#ffd700';
    this.contexto.beginPath();
    this.contexto.arc(0, 0, 12, 0, Math.PI * 2);
    this.contexto.fill();
    this.contexto.strokeStyle = '#b39700';
    this.contexto.lineWidth = 3;
    this.contexto.stroke();
    this.contexto.fillStyle = '#b39700';
    this.contexto.font = 'bold 14px Arial';
    this.contexto.textAlign = 'center';
    this.contexto.textBaseline = 'middle';
    this.contexto.fillText('$', 0, 0);
  }

  dibujarEscudo() {
    // Escudo protector
    this.contexto.fillStyle = '#64b5f6';
    this.contexto.beginPath();
    this.contexto.moveTo(0, -15);
    this.contexto.lineTo(10, -10);
    this.contexto.lineTo(10, 5);
    this.contexto.lineTo(0, 15);
    this.contexto.lineTo(-10, 5);
    this.contexto.lineTo(-10, -10);
    this.contexto.closePath();
    this.contexto.fill();
    this.contexto.strokeStyle = '#1e3a8a';
    this.contexto.lineWidth = 2;
    this.contexto.stroke();
  }

  dibujarEstrella() {
    // Estrella de bonus
    this.contexto.fillStyle = '#ff6b9d';
    this.contexto.beginPath();
    for (let i = 0; i < 5; i++) {
      const angulo = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const x = Math.cos(angulo) * 12;
      const y = Math.sin(angulo) * 12;
      if (i === 0) this.contexto.moveTo(x, y);
      else this.contexto.lineTo(x, y);

      const anguloInterno = angulo + Math.PI / 5;
      const xInterno = Math.cos(anguloInterno) * 5;
      const yInterno = Math.sin(anguloInterno) * 5;
      this.contexto.lineTo(xInterno, yInterno);
    }
    this.contexto.closePath();
    this.contexto.fill();
  }

  obtenerColor(alpha) {
    const colores = {
      coin: `rgba(255, 215, 0, ${alpha})`,
      shield: `rgba(100, 181, 246, ${alpha})`,
      star: `rgba(255, 107, 157, ${alpha})`,
    };
    return colores[this.tipo];
  }

  estaFueraDePantalla() {
    return this.x + this.ancho < 0;
  }

  colisionaCon(jugador) {
    return (
      !this.recolectado &&
      jugador.x + jugador.ancho > this.x &&
      jugador.x < this.x + this.ancho &&
      jugador.y + jugador.alto > this.y &&
      jugador.y < this.y + this.alto
    );
  }
}