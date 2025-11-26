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

    // Estados
    this.estaVivo = true;
    this.invulnerable = false;
    this.tiempoInvulnerable = 0;

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


    // Invulnerabilidad temporal
    if (this.invulnerable) {
      this.tiempoInvulnerable--;
      if (this.tiempoInvulnerable <= 0) {
        this.invulnerable = false;
        
        this.elemento.classList.remove('invulnerable');
      }
    }

    // Límites del canvas
    if (this.y < 0) this.y = 0;
    if (this.y > CONFIG.CANVAS_HEIGHT - this.alto) {
      this.y = CONFIG.CANVAS_HEIGHT - this.alto;
      this.velocidad = 0;
    }

    
    this.actualizarPosicionElemento();
    this.actualizarRotacion();
  }

  //El elemento HTML se muestra automáticamente
  dibujar(){}; 
    
  saltar() {
    if (this.estaVivo) {
      this.velocidad = CONFIG.JUMP_FORCE;

      // ANIMACIÓN DE ALETEO REAL
      // -----------------------------------------
      this.elemento.classList.remove('aletear');  
      void this.elemento.offsetWidth;            
      this.elemento.classList.add('aletear');     // ACTIVA animación de las alas

      setTimeout(() => {
        this.elemento.classList.remove('aletear');
      }, 180);  
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

  

  hacerInvulnerable(duracion) {
    this.invulnerable = true;
    this.tiempoInvulnerable = duracion;

    this.elemento.classList.add('invulnerable');
  }

  //Método nuevo
   destruir() {
    if (this.elemento && this.elemento.parentElement) {
      this.elemento.parentElement.removeChild(this.elemento);
    }
  }

  getRect() {
    const rect = this.elemento.getBoundingClientRect();
    const wrapper = document.getElementById('game-canvas-wrapper').getBoundingClientRect();

    return {
        x: rect.left - wrapper.left,
        y: rect.top - wrapper.top,
        width: rect.width,
        height: rect.height
    };
}
}