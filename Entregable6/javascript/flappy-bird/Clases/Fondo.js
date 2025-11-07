import { CONFIG } from '../utils/config.js';

// ============================================
// CLASE FONDO - Parallax scrolling
// ============================================
export class Fondo {
  constructor(canvas) {
    this.canvas = canvas;
    this.contexto = canvas.getContext('2d');
    this.capas = [
      { velocidad: 0.2, desplazamiento: 0, color: '#0a1628' },
      { velocidad: 0.5, desplazamiento: 0, color: '#1a2332' },
      { velocidad: 1, desplazamiento: 0, color: '#2a3342' },
      { velocidad: 1.5, desplazamiento: 0, color: '#3a4352' },
    ];

    // Elementos decorativos animados
    this.nubes = this.crearNubes();
    this.estrellas = this.crearEstrellas();
  }

  crearNubes() {
    const nubes = [];
    for (let i = 0; i < 5; i++) {
      nubes.push({
        x: Math.random() * CONFIG.CANVAS_WIDTH,
        y: Math.random() * 200,
        ancho: 60 + Math.random() * 40,
        velocidad: 0.3 + Math.random() * 0.5,
        opacidad: 0.2 + Math.random() * 0.3,
      });
    }
    return nubes;
  }

  crearEstrellas() {
    const estrellas = [];
    for (let i = 0; i < 50; i++) {
      estrellas.push({
        x: Math.random() * CONFIG.CANVAS_WIDTH,
        y: Math.random() * CONFIG.CANVAS_HEIGHT,
        tamaño: 1 + Math.random() * 2,
        parpadeo: Math.random() * Math.PI * 2,
      });
    }
    return estrellas;
  }

  actualizar() {
    // Actualizar capas de parallax
    this.capas.forEach((capa) => {
      capa.desplazamiento -= capa.velocidad;
      if (capa.desplazamiento <= -CONFIG.CANVAS_WIDTH) {
        capa.desplazamiento = 0;
      }
    });

    // Actualizar nubes
    this.nubes.forEach((nube) => {
      nube.x -= nube.velocidad;
      if (nube.x + nube.ancho < 0) {
        nube.x = CONFIG.CANVAS_WIDTH;
        nube.y = Math.random() * 200;
      }
    });

    // Actualizar parpadeo de estrellas
    this.estrellas.forEach((estrella) => {
      estrella.parpadeo += 0.05;
    });
  }

  dibujar() {
    // Dibujar capas de parallax
    this.capas.forEach((capa, indice) => {
      this.contexto.fillStyle = capa.color;

      // Dibujar montañas/colinas
      this.contexto.beginPath();
      this.contexto.moveTo(capa.desplazamiento, CONFIG.CANVAS_HEIGHT);

      for (let x = 0; x < CONFIG.CANVAS_WIDTH + 100; x += 100) {
        const altura =
          100 +
          indice * 50 +
          Math.sin((x + capa.desplazamiento) / 50) * 20;
        this.contexto.lineTo(
          x + capa.desplazamiento,
          CONFIG.CANVAS_HEIGHT - altura
        );
      }

      this.contexto.lineTo(
        CONFIG.CANVAS_WIDTH + capa.desplazamiento,
        CONFIG.CANVAS_HEIGHT
      );
      this.contexto.lineTo(capa.desplazamiento, CONFIG.CANVAS_HEIGHT);
      this.contexto.closePath();
      this.contexto.fill();

      // Segunda iteración para scrolling continuo
      this.contexto.beginPath();
      this.contexto.moveTo(
        capa.desplazamiento + CONFIG.CANVAS_WIDTH,
        CONFIG.CANVAS_HEIGHT
      );

      for (let x = 0; x < CONFIG.CANVAS_WIDTH + 100; x += 100) {
        const altura =
          100 +
          indice * 50 +
          Math.sin((x + capa.desplazamiento) / 50) * 20;
        this.contexto.lineTo(
          x + capa.desplazamiento + CONFIG.CANVAS_WIDTH,
          CONFIG.CANVAS_HEIGHT - altura
        );
      }

      this.contexto.lineTo(
        CONFIG.CANVAS_WIDTH * 2 + capa.desplazamiento,
        CONFIG.CANVAS_HEIGHT
      );
      this.contexto.lineTo(
        CONFIG.CANVAS_WIDTH + capa.desplazamiento,
        CONFIG.CANVAS_HEIGHT
      );
      this.contexto.closePath();
      this.contexto.fill();
    });

    // Dibujar estrellas parpadeantes
    this.estrellas.forEach((estrella) => {
      const alpha = 0.5 + Math.sin(estrella.parpadeo) * 0.5;
      this.contexto.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.contexto.beginPath();
      this.contexto.arc(
        estrella.x,
        estrella.y,
        estrella.tamaño,
        0,
        Math.PI * 2
      );
      this.contexto.fill();
    });

    // Dibujar nubes
    this.nubes.forEach((nube) => {
      this.contexto.fillStyle = `rgba(255, 255, 255, ${nube.opacidad})`;

      this.contexto.beginPath();
      this.contexto.arc(nube.x, nube.y, nube.ancho / 3, 0, Math.PI * 2);
      this.contexto.arc(
        nube.x + nube.ancho / 3,
        nube.y - 10,
        nube.ancho / 4,
        0,
        Math.PI * 2
      );
      this.contexto.arc(
        nube.x + nube.ancho / 2,
        nube.y,
        nube.ancho / 3,
        0,
        Math.PI * 2
      );
      this.contexto.fill();
    });
  }
}