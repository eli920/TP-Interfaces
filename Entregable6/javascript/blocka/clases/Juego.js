import { Pieza } from './Pieza.js';
import { GeneradorImagenes } from './GeneradorImagenes.js';
import {
  aplicarEscalaGrises,
  aplicarBrillo,
  aplicarNegativo,
} from '../utils/filtros.js';

// Configuración de niveles
const configuracionesNivel = [
  { nivel: 1, filtro: 'brightness', nombre: 'Brillo' },
  { nivel: 2, filtro: 'negative', nombre: 'Negativo' },
  { nivel: 3, filtro: 'grayscale', nombre: 'Escala de Grises' },
  { nivel: 4, filtro: 'mixed', nombre: 'Filtros Mixtos' },
];

const tiposImagenes = [
  'batman',
  'superman',
  'batman-superman',
  'radial',
  'waves',
  'stars',
];

export class Juego {
  constructor() {
    this.lienzo = document.getElementById('game-canvas');
    this.contexto = this.lienzo.getContext('2d');
    this.nivelActual = 1;
    this.filasCuadricula = 2;
    this.columnasCuadricula = 2;
    this.piezas = [];
    this.imagenActual = null;
    this.temporizador = 0;
    this.intervaloTemporizador = null;
    this.tiempoMaximo = 0;
    this.ayudaUsada = false;
    this.imagenesGeneradas = [];
    this.indiceImagenSeleccionada = null;
    this.imagenesCargadas = false;

    this.configurarEventos();
  }

  configurarEventos() {
    document
      .getElementById('btn-start')
      .addEventListener('click', () => this.mostrarSeleccionImagen());
    document
      .getElementById('btn-menu')
      .addEventListener('click', () => this.volverAlMenu());
    document
      .getElementById('btn-menu-victory')
      .addEventListener('click', () => this.volverAlMenu());
    document
      .getElementById('btn-menu-defeat')
      .addEventListener('click', () => this.volverAlMenu());
    document
      .getElementById('btn-next-level')
      .addEventListener('click', () => this.siguienteNivel());
    document
      .getElementById('btn-retry')
      .addEventListener('click', () => this.reintentarNivel());
    document
      .getElementById('btn-help')
      .addEventListener('click', () => this.usarAyuda());
    document
      .getElementById('btn-random-image')
      .addEventListener('click', () => this.seleccionarImagenAleatoria());

    this.lienzo.addEventListener('click', (e) =>
      this.manejarClickLienzo(e, -1)
    );

    this.lienzo.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.manejarClickLienzo(e, 1);
    });

    document.getElementById('grid-size').addEventListener('change', (e) => {
      const valor = e.target.value;
      if (valor.includes('x')) {
        const [filas, columnas] = valor.split('x').map(Number);
        this.filasCuadricula = filas;
        this.columnasCuadricula = columnas;
      } else {
        const tamaño = parseInt(valor);
        this.filasCuadricula = tamaño;
        this.columnasCuadricula = tamaño;
      }
      console.log(
        `Nueva configuración de cuadrícula: ${this.filasCuadricula}x${this.columnasCuadricula}`
      );
    });

    document.getElementById('time-limit').addEventListener('change', (e) => {
      this.tiempoMaximo = parseInt(e.target.value);
    });
  }

  mostrarPantalla(idPantalla) {
    document
      .querySelectorAll('.screen')
      .forEach((pantalla) => pantalla.classList.remove('active'));
    document.getElementById(idPantalla).classList.add('active');
  }

  mostrarSeleccionImagen() {
    this.mostrarPantalla('image-select-screen');
    this.generarImagenes();
  }

  async generarImagenes() {
    if (!this.imagenesCargadas) {
      document.getElementById('loading-text').style.display = 'block';
      document.getElementById('btn-random-image').style.display = 'none';
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    try {
      this.imagenesGeneradas = await Promise.all(
        tiposImagenes.map((tipo) =>
          GeneradorImagenes.generarImagen(600, 600, tipo)
        )
      );
      await this.mostrarMiniaturas();
    } catch (error) {
      console.error(error);
    } finally {
      if (!this.imagenesCargadas) {
        document.getElementById('loading-text').style.display = 'none';
        document.getElementById('btn-random-image').style.display =
          'inline-block';
        this.imagenesCargadas = true;
      }
    }
  }

  async mostrarMiniaturas() {
    const contenedor = document.getElementById('thumbnail-container');
    contenedor.innerHTML = '';

    const imagenesListas = await Promise.all(this.imagenesGeneradas);

    imagenesListas.forEach((lienzoImg, indice) => {
      const miniatura = document.createElement('canvas');
      miniatura.width = 120;
      miniatura.height = 120;
      miniatura.className = 'thumbnail';
      const contextoMiniatura = miniatura.getContext('2d');

      contextoMiniatura.drawImage(lienzoImg, 0, 0, 120, 120);

      miniatura.addEventListener('click', () =>
        this.seleccionarImagen(indice, miniatura)
      );
      contenedor.appendChild(miniatura);
    });
  }

  seleccionarImagen(indice, elementoMiniatura) {
    document
      .querySelectorAll('.thumbnail')
      .forEach((m) => m.classList.remove('selected'));
    elementoMiniatura.classList.add('selected');
    this.indiceImagenSeleccionada = indice;
    setTimeout(() => {
      this.iniciarJuego();
    }, 1000);
  }

  seleccionarImagenAleatoria() {
    const indiceAleatorio = Math.floor(
      Math.random() * this.imagenesGeneradas.length
    );
    const miniaturas = document.querySelectorAll('.thumbnail');
    this.seleccionarImagen(indiceAleatorio, miniaturas[indiceAleatorio]);
  }

  iniciarJuego() {
    this.mostrarPantalla('game-screen');

    if (this.indiceImagenSeleccionada === null) {
      this.indiceImagenSeleccionada = Math.floor(
        Math.random() * this.imagenesGeneradas.length
      );
    }

    this.imagenActual = this.imagenesGeneradas[this.indiceImagenSeleccionada];
    this.ayudaUsada = false;
    document.getElementById('help-status').innerHTML = '';
    document.getElementById('btn-help').disabled = false;

    this.crearPiezas();
    this.aplicarFiltros();
    this.aleatorizarRotaciones();
    this.iniciarTemporizador();
    this.actualizarVisualizacionNivel();
    this.verificarCompletado();
    this.renderizar();
  }

  crearPiezas() {
    this.piezas = [];

    const mayorDimension = Math.max(
      this.filasCuadricula,
      this.columnasCuadricula
    );
    const tamañoPiezaBase = 600 / mayorDimension;
    const anchoCanvas = this.columnasCuadricula * tamañoPiezaBase;
    const altoCanvas = this.filasCuadricula * tamañoPiezaBase;

    this.lienzo.width = anchoCanvas;
    this.lienzo.height = altoCanvas;

    const relacionImagenOriginal =
      this.imagenActual.width / this.imagenActual.height;
    const relacionCanvas = this.columnasCuadricula / this.filasCuadricula;

    let anchoImagenUsada = this.imagenActual.width;
    let altoImagenUsada = this.imagenActual.height;
    let offsetX = 0;
    let offsetY = 0;

    if (relacionImagenOriginal < relacionCanvas) {
      altoImagenUsada = this.imagenActual.width / relacionCanvas;
      offsetY = (this.imagenActual.height - altoImagenUsada) / 2;
    } else if (relacionImagenOriginal > relacionCanvas) {
      anchoImagenUsada = this.imagenActual.height * relacionCanvas;
      offsetX = (this.imagenActual.width - anchoImagenUsada) / 2;
    }

    const anchoPiezaOrigen = anchoImagenUsada / this.columnasCuadricula;
    const altoPiezaOrigen = altoImagenUsada / this.filasCuadricula;
    const tamañoPiezaDestino = tamañoPiezaBase;

    for (let fila = 0; fila < this.filasCuadricula; fila++) {
      for (let columna = 0; columna < this.columnasCuadricula; columna++) {
        const pieza = new Pieza(
          this.imagenActual,
          offsetX + columna * anchoPiezaOrigen,
          offsetY + fila * altoPiezaOrigen,
          anchoPiezaOrigen,
          altoPiezaOrigen,
          columna * tamañoPiezaDestino,
          fila * tamañoPiezaDestino,
          fila,
          columna
        );

        pieza.ancho = tamañoPiezaDestino;
        pieza.alto = tamañoPiezaDestino;

        this.piezas.push(pieza);
      }
    }
  }

  aplicarFiltros() {
    const configuracionNivel =
      configuracionesNivel[
        (this.nivelActual - 1) % configuracionesNivel.length
      ];

    this.piezas.forEach((pieza, indice) => {
      const lienzoTemporal = document.createElement('canvas');
      lienzoTemporal.width = pieza.ancho;
      lienzoTemporal.height = pieza.alto;
      const contextoTemporal = lienzoTemporal.getContext('2d');

      contextoTemporal.drawImage(
        this.imagenActual,
        pieza.origenX,
        pieza.origenY,
        pieza.ancho,
        pieza.alto,
        0,
        0,
        pieza.ancho,
        pieza.alto
      );

      if (configuracionNivel.filtro === 'mixed') {
        const filtros = ['grayscale', 'brightness', 'negative'];
        const filtro = filtros[indice % filtros.length];
        this.aplicarFiltroAContexto(
          contextoTemporal,
          filtro,
          0,
          0,
          pieza.ancho,
          pieza.alto
        );
      } else {
        this.aplicarFiltroAContexto(
          contextoTemporal,
          configuracionNivel.filtro,
          0,
          0,
          pieza.ancho,
          pieza.alto
        );
      }

      pieza.lienzoFiltrado = lienzoTemporal;
    });
  }

  aplicarFiltroAContexto(contexto, nombreFiltro, x, y, ancho, alto) {
    switch (nombreFiltro) {
      case 'grayscale':
        aplicarEscalaGrises(contexto, x, y, ancho, alto);
        break;
      case 'brightness':
        aplicarBrillo(contexto, x, y, ancho, alto);
        break;
      case 'negative':
        aplicarNegativo(contexto, x, y, ancho, alto);
        break;
    }
  }

  aleatorizarRotaciones() {
    const rotaciones = [0, 90, 180, 270];
    this.piezas.forEach((pieza) => {
      pieza.rotacion =
        rotaciones[Math.floor(Math.random() * rotaciones.length)];
    });
  }

  manejarClickLienzo(evento, direccion) {
    const rectangulo = this.lienzo.getBoundingClientRect();
    const x =
      (evento.clientX - rectangulo.left) *
      (this.lienzo.width / rectangulo.width);
    const y =
      (evento.clientY - rectangulo.top) *
      (this.lienzo.height / rectangulo.height);

    for (let pieza of this.piezas) {
      if (pieza.contiene(x, y)) {
        pieza.rotar(direccion);
        this.renderizar();
        this.verificarCompletado();
        break;
      }
    }
  }

  usarAyuda() {
    if (this.ayudaUsada) return;

    const piezasIncorrectas = this.piezas.filter(
      (p) => !p.estaCorrecta() && !p.estaBloqueada
    );
    if (piezasIncorrectas.length === 0) return;

    const piezaAleatoria =
      piezasIncorrectas[Math.floor(Math.random() * piezasIncorrectas.length)];
    piezaAleatoria.rotacion = piezaAleatoria.rotacionCorrecta;
    piezaAleatoria.estaBloqueada = true;

    this.temporizador += 5;
    this.ayudaUsada = true;

    document.getElementById('help-status').innerHTML =
      '<div class="help-used">💡 Ayudita usada: +5 segundos</div>';
    document.getElementById('btn-help').disabled = true;

    this.renderizar();
    this.verificarCompletado();
  }

  verificarCompletado() {
    const todasCorrectas = this.piezas.every((p) => p.estaCorrecta());
    const conteoCorrectas = this.piezas.filter((p) => p.estaCorrecta()).length;
    const progreso = (conteoCorrectas / this.piezas.length) * 100;

    document.getElementById('progress-fill').style.width = progreso + '%';

    if (todasCorrectas) {
      this.detenerTemporizador();
      this.mostrarVictoria();
    }
  }

  mostrarVictoria() {
    this.renderizar(false);

    const mensajeGanaste = document.createElement('div');
    mensajeGanaste.className = 'mensaje-ganaste';
    mensajeGanaste.innerHTML = 'NIVEL COMPLETO!';
    document.getElementById('game-screen').appendChild(mensajeGanaste);

    setTimeout(() => {
      mensajeGanaste.remove();

      this.mostrarPantalla('victory-screen');
      const minutos = Math.floor(this.temporizador / 60);
      const segundos = this.temporizador % 60;

      document.getElementById(
        'victory-time'
      ).textContent = `⏱️ Tiempo: ${minutos
        .toString()
        .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

      document.getElementById('victory-stats').innerHTML = `
        <p>Nivel ${this.nivelActual} - ${
        configuracionesNivel[
          (this.nivelActual - 1) % configuracionesNivel.length
        ].nombre
      }</p>
        <p>Grid: ${this.filasCuadricula}x${this.columnasCuadricula} (${
        this.piezas.length
      } piezas)</p>
        ${
          this.ayudaUsada
            ? '<p>Ayuda utilizada</p>'
            : '<p>Sin ayuda - ¡Perfecto!</p>'
        }
      `;
    }, 2500);
  }

  mostrarDerrota() {
    this.detenerTemporizador();
    this.mostrarPantalla('defeat-screen');
  }

  iniciarTemporizador() {
    this.temporizador = 0;
    this.actualizarVisualizacionTemporizador();

    this.intervaloTemporizador = setInterval(() => {
      this.temporizador++;
      this.actualizarVisualizacionTemporizador();

      if (this.tiempoMaximo > 0 && this.temporizador >= this.tiempoMaximo) {
        this.mostrarDerrota();
      }
    }, 1000);
  }

  detenerTemporizador() {
    if (this.intervaloTemporizador) {
      clearInterval(this.intervaloTemporizador);
      this.intervaloTemporizador = null;
    }
  }

  actualizarVisualizacionTemporizador() {
    const minutos = Math.floor(this.temporizador / 60);
    const segundos = this.temporizador % 60;

    document.getElementById('timer-display').textContent = `⏱️ ${minutos
      .toString()
      .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

    if (this.tiempoMaximo > 0) {
      const restante = this.tiempoMaximo - this.temporizador;
      const minRestantes = Math.floor(restante / 60);
      const segRestantes = restante % 60;

      document.getElementById(
        'max-time-display'
      ).textContent = `⏰ ${minRestantes
        .toString()
        .padStart(2, '0')}:${segRestantes.toString().padStart(2, '0')}`;
    } else {
      document.getElementById('max-time-display').textContent = '';
    }
  }

  actualizarVisualizacionNivel() {
    const configuracionNivel =
      configuracionesNivel[
        (this.nivelActual - 1) % configuracionesNivel.length
      ];
    document.getElementById(
      'level-display'
    ).textContent = `Nivel: ${this.nivelActual} - ${configuracionNivel.nombre}`;
  }

  renderizar(usarFiltros = true) {
    this.contexto.clearRect(0, 0, this.lienzo.width, this.lienzo.height);
    this.piezas.forEach((pieza) => pieza.dibujar(this.contexto, usarFiltros));
  }

  siguienteNivel() {
    this.nivelActual++;
    this.indiceImagenSeleccionada = null;
    this.mostrarSeleccionImagen();
  }

  reintentarNivel() {
    this.indiceImagenSeleccionada = null;
    this.mostrarSeleccionImagen();
  }

  volverAlMenu() {
    this.detenerTemporizador();
    this.nivelActual = 1;
    this.indiceImagenSeleccionada = null;
    this.mostrarPantalla('menu-screen');
  }
}
