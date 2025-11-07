import { GestorImagenes } from './clases/GestorImagenes.js';
import { JuegoPegSolitaire } from './clases/JuegoPegSolitaire.js';
import {
  mostrarModalGuardar,
  ocultarModalGuardar,
  mostrarModalContinuar,
  ocultarModalContinuar,
  volverAlMenu,
} from './utils/modales.js';

// Configuración global del juego
export const configuracionJuego = {
  fondoActual: 0,
  estiloFichas: 0,
};

// Configuración de imágenes
export const CONFIG_IMAGENES = {
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

let juegoGlobal = null;

// Inicializa el juego cuando todas las imágenes están cargadas
async function inicializarJuego() {
  try {
    const gestor = new GestorImagenes();
    const imagenes = await gestor.cargarTodasLasImagenes();

    juegoGlobal = new JuegoPegSolitaire('gameCanvas', imagenes);
    window.imagenesJuego = imagenes;

    console.log('Juego iniciado correctamente');
  } catch (error) {
    console.error( error);
  }
}

// Reinicia el juego
function reiniciarJuego() {
  if (juegoGlobal) {
    juegoGlobal.reiniciar();
  }
}

// PORTADA DEL JUEGO - Transición al juego
function inicializarEventos() {
  const btnJugarAhora = document.getElementById('btn-jugar-ahora');
  const portadaJuego = document.getElementById('portada-juego');
  const gameContainer = document.getElementById('game-container');
  const menuScreen = document.getElementById('menu-screen');
  const gameScreen = document.getElementById('game-screen');

  if (btnJugarAhora) {
    btnJugarAhora.addEventListener('click', function () {
      portadaJuego.style.opacity = '0';
      portadaJuego.style.transform = 'scale(0.95)';
      portadaJuego.style.transition = 'all 0.5s ease';

      setTimeout(() => {
        portadaJuego.style.display = 'none';
        gameContainer.style.display = 'flex';

        menuScreen.classList.add('active');
        gameScreen.classList.remove('active');

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
    btnStart.addEventListener('click', function () {
      configuracionJuego.fondoActual = parseInt(
        document.getElementById('selector-fondo').value
      );
      configuracionJuego.estiloFichas = parseInt(
        document.getElementById('selector-fichas').value
      );

      menuScreen.classList.remove('active');
      gameScreen.classList.add('active');

      if (juegoGlobal) {
        juegoGlobal.cambiarFondo(configuracionJuego.fondoActual);
        juegoGlobal.cambiarEstiloFichas(configuracionJuego.estiloFichas);

        if (juegoGlobal.hayPartidaGuardada()) {
          mostrarModalContinuar(juegoGlobal);
        } else {
          juegoGlobal.reiniciar();
        }
      }
    });
  }

  // Botón "Menú" - Vuelve al menú de configuración
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      if (juegoGlobal && juegoGlobal.juegoActivo) {
        mostrarModalGuardar(juegoGlobal);
      } else {
        volverAlMenu(configuracionJuego);
      }
    });
  }

  // Botón Resetear
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', reiniciarJuego);
  }

  // Botones del modal de guardar partida
  const btnGuardarSi = document.getElementById('btn-guardar-si');
  const btnGuardarNo = document.getElementById('btn-guardar-no');
  const btnCancelar = document.getElementById('btn-cancelar');

  if (btnGuardarSi) {
    btnGuardarSi.addEventListener('click', () => {
      if (juegoGlobal) {
        juegoGlobal.guardarPartida();
      }
      ocultarModalGuardar();
      volverAlMenu(configuracionJuego);
    });
  }

  if (btnGuardarNo) {
    btnGuardarNo.addEventListener('click', () => {
      if (juegoGlobal) {
        juegoGlobal.borrarPartidaGuardada();
      }
      ocultarModalGuardar();
      volverAlMenu(configuracionJuego);
    });
  }

  if (btnCancelar) {
    btnCancelar.addEventListener('click', () => {
      ocultarModalGuardar();
      if (juegoGlobal) {
        juegoGlobal.juegoActivo = true;
        juegoGlobal.iniciarTimer();
      }
    });
  }

  // Botones del modal de continuar partida
  const btnContinuarSi = document.getElementById('btn-continuar-si');
  const btnContinuarNo = document.getElementById('btn-continuar-no');

  if (btnContinuarSi) {
    btnContinuarSi.addEventListener('click', () => {
      if (juegoGlobal) {
        juegoGlobal.cargarPartida();
        juegoGlobal.juegoActivo = true;
        juegoGlobal.iniciarTimer();
      }
      ocultarModalContinuar();
    });
  }

  if (btnContinuarNo) {
    btnContinuarNo.addEventListener('click', () => {
      if (juegoGlobal) {
        juegoGlobal.borrarPartidaGuardada();
        juegoGlobal.reiniciar();
      }
      ocultarModalContinuar();
    });
  }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function () {
  // Primero inicializar los eventos del DOM
  inicializarEventos();

  // Luego inicializar el juego (carga las imágenes)
  await inicializarJuego();
});

// Exportar para uso global
window.reiniciarJuego = reiniciarJuego;
