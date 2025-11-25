import { CONFIG } from '../utils/config.js';

// ============================================
// CLASE JUGADOR - Maneja el pájaro jugador
// ============================================
export class Jugador {
  constructor(x, y, canvas) {
    this.x = x;
    this.y = y;
    this.ancho = 50;
    this.alto = 50;
    this.velocidad = 0;
    this.canvas = canvas;
    this.contexto = canvas.getContext('2d');

    // Animación de aleteo
    // this.cuadroAleteo = 0;
    // this.velocidadAleteo = 0.15;
    // this.estAleteando = false;
    // this.rotacion = 0;

    // Estados
    this.estaVivo = true;
    this.invulnerable = false;
    this.tiempoInvulnerable = 0;

    // this.particulasExplosion = [];

    //nuevo
    this.crearElementoHTML();
  }

  //Métodos nuevos

  crearElementoHTML() {
    this.elemento = document.createElement('div');
    this.elemento.id = 'pajaro';
    this.elemento.className = 'pajaro';

    const cuerpo = document.createElement('div');
    cuerpo.className = 'cuerpo';
    this.elemento.appendChild(cuerpo);

    this.cuerpo = cuerpo; 

    const wrapper = document.getElementById('game-canvas-wrapper');
    wrapper.appendChild(this.elemento);

    this.actualizarPosicionElemento();
 }
  
  actualizarPosicionElemento() {
    const OFFSET_Y = -15;   

    this.elemento.style.left = `${this.x}px`;
    this.elemento.style.top = `${this.y + OFFSET_Y}px`;
    // this.elemento.style.left = `${this.x}px`;
    // this.elemento.style.top = `${this.y}px`;
  }

  
  actualizarRotacion() {
    const rotacion = Math.min(Math.max(this.velocidad * 2, -30), 90);
    this.cuerpo.style.transform = `rotate(${rotacion}deg)`;
  }

///////////////////////

  actualizar() {
    if (!this.estaVivo) {
      // this.actualizarExplosion();
      return;
    }

    // Física de gravedad
    this.velocidad += CONFIG.GRAVITY;
    this.y += this.velocidad;

    // Rotación basada en velocidad
    // this.rotacion = Math.min(Math.max(this.velocidad * 2, -30), 90);


    // Animación de aleteo
    // if (this.estAleteando) {
    //   this.cuadroAleteo += this.velocidadAleteo;
    //   if (this.cuadroAleteo >= 1) {
    //     this.cuadroAleteo = 0;
    //     this.estAleteando = false;
    //   }
    // }

    // Invulnerabilidad temporal
    if (this.invulnerable) {
      this.tiempoInvulnerable--;
      if (this.tiempoInvulnerable <= 0) {
        this.invulnerable = false;
        //nuevo
        this.elemento.classList.remove('invulnerable');
      }
    }

    // Límites del canvas
    if (this.y < 0) this.y = 0;
    if (this.y > CONFIG.CANVAS_HEIGHT - this.alto) {
      this.y = CONFIG.CANVAS_HEIGHT - this.alto;
      this.velocidad = 0;
    }

    //nuevo
    this.actualizarPosicionElemento();
    this.actualizarRotacion();
  }

  //Ya no dibujamos en canvas, el elemento HTML se muestra automáticamente
  dibujar(){}; 
    // this.contexto.save();
    // this.contexto.translate(
    //   this.x + this.ancho / 2,
    //   this.y + this.alto / 2
    // );
    // this.contexto.rotate((this.rotacion * Math.PI) / 180);

    // if (this.invulnerable && Math.floor(Date.now() / 100) % 2) {
      // Parpadeo durante invulnerabilidad
    //   this.contexto.globalAlpha = 0.5;
    // }

    // if (!this.estaVivo) {
    //   this.dibujarExplosion();
    // } else {
    //   this.dibujarMurciélago();
    // }

    // this.contexto.restore();
  // }

  // dibujarMurciélago() {
    // Cuerpo del murciélago
    // this.contexto.fillStyle = '#1a1a2e';
    // this.contexto.beginPath();
    // this.contexto.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2);
    // this.contexto.fill();

    // Alas con animación
    // const movimientoAlas = Math.sin(this.cuadroAleteo * Math.PI) * 10;
    // this.contexto.fillStyle = '#16213e';

    // Ala izquierda
    // this.contexto.beginPath();
    // this.contexto.moveTo(-5, 0);
    // this.contexto.quadraticCurveTo(-20, -15 - movimientoAlas, -30, -5);
    // this.contexto.quadraticCurveTo(-25, 5, -5, 5);
    // this.contexto.fill();

    // Ala derecha
    // this.contexto.beginPath();
    // this.contexto.moveTo(5, 0);
    // this.contexto.quadraticCurveTo(20, -15 - movimientoAlas, 30, -5);
    // this.contexto.quadraticCurveTo(25, 5, 5, 5);
    // this.contexto.fill();

    // Orejas puntiagudas
    // this.contexto.fillStyle = '#0f0f1e';
    // this.contexto.beginPath();
    // this.contexto.moveTo(-8, -15);
    // this.contexto.lineTo(-5, -25);
    // this.contexto.lineTo(-2, -15);
    // this.contexto.fill();

    // this.contexto.beginPath();
    // this.contexto.moveTo(2, -15);
    // this.contexto.lineTo(5, -25);
    // this.contexto.lineTo(8, -15);
    // this.contexto.fill();

    // Ojos rojos brillantes
    // this.contexto.fillStyle = '#ff0000';
    // this.contexto.beginPath();
    // this.contexto.arc(-5, -5, 3, 0, Math.PI * 2);
    // this.contexto.arc(5, -5, 3, 0, Math.PI * 2);
    // this.contexto.fill();

    // Logo en el pecho
  //   this.contexto.fillStyle = '#ffd700';
  //   this.contexto.font = 'bold 12px Arial';
  //   this.contexto.textAlign = 'center';
  //   this.contexto.fillText('S', 0, 5);
  // }

  // saltar() {
  //   if (this.estaVivo) {
  //     this.velocidad = CONFIG.JUMP_FORCE;
  //     // this.estAleteando = true;
  //     // this.cuadroAleteo = 0;
  //     //nuevo
  //     this.elemento.classList.remove('aletear');
  //     void this.elemento.offsetWidth; // Forzar reflow
  //     this.elemento.classList.add('aletear');

  //     setTimeout(() => {
  //       this.elemento.classList.remove('aletear');
  //     }, 300);
  //   }
  // }

  saltar() {
    if (this.estaVivo) {
      this.velocidad = CONFIG.JUMP_FORCE;

      // ANIMACIÓN DE ALETEO REAL
      // -----------------------------------------
      this.elemento.classList.remove('aletear');  
      void this.elemento.offsetWidth;             // Forzar reflow
      this.elemento.classList.add('aletear');     // ACTIVA animación de las alas

      setTimeout(() => {
        this.elemento.classList.remove('aletear');
      }, 180);  // reduce a 180 ms para que la animación de alas sea visible
    }
  }


  morir() {
    if (this.invulnerable) return;
    this.estaVivo = false;
    // this.crearExplosion();
    this.elemento.classList.add('explotar');
    
    setTimeout(() => {
      this.elemento.style.display = 'none';
    }, 600);
  }

  // crearExplosion() {
  //   for (let i = 0; i < CONFIG.EXPLOSION_PARTICLES; i++) {
  //     const angulo = (Math.PI * 2 * i) / CONFIG.EXPLOSION_PARTICLES;
  //     const velocidad = 2 + Math.random() * 3;
  //     this.particulasExplosion.push({
  //       x: 0,
  //       y: 0,
  //       vx: Math.cos(angulo) * velocidad,
  //       vy: Math.sin(angulo) * velocidad,
  //       vida: 1,
  //       tamaño: 3 + Math.random() * 5,
  //     });
  //   }
  // }

  // actualizarExplosion() {
  //   this.particulasExplosion = this.particulasExplosion.filter((p) => {
  //     p.x += p.vx;
  //     p.y += p.vy;
  //     p.vida -= 0.02;
  //     return p.vida > 0;
  //   });
  // }

  // dibujarExplosion() {
  //   this.particulasExplosion.forEach((p) => {
  //     this.contexto.fillStyle = `rgba(255, ${100 * p.vida}, 0, ${p.vida})`;
  //     this.contexto.beginPath();
  //     this.contexto.arc(p.x, p.y, p.tamaño * p.vida, 0, Math.PI * 2);
  //     this.contexto.fill();
  //   });
  // }

  hacerInvulnerable(duracion) {
    this.invulnerable = true;
    this.tiempoInvulnerable = duracion;
    //nuevo
     this.elemento.classList.add('invulnerable');
  }

  //Método nuevo
   destruir() {
    if (this.elemento && this.elemento.parentElement) {
      this.elemento.parentElement.removeChild(this.elemento);
    }
  }
}