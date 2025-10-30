"use strict";

import * as Carrusel from './carrusel.js';


// PORTADA DEL JUEGO - Transición al juego


document.addEventListener('DOMContentLoaded', function() {
    const btnJugarAhora = document.getElementById('btn-jugar-ahora');
    const portadaJuego = document.getElementById('portada-juego');
    const gameContainer = document.getElementById('game-container');
    
    if (btnJugarAhora) {
        btnJugarAhora.addEventListener('click', function() {
            // Ocultar portada con animación
            portadaJuego.style.opacity = '0';
            portadaJuego.style.transform = 'scale(0.95)';
            portadaJuego.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                portadaJuego.style.display = 'none';
                gameContainer.style.display = 'flex';
                
                // Animar entrada del juego
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
});

// ====== GENERADOR DE IMÁGENES ============================================================================================
// Función que genera imágenes con diferentes patrones visuales
function generarImagen(ancho, alto, tipo) {
     // Retorna una promesa que se resuelve cuando la imagen está lista
    return new Promise((resolve, reject) => {

        const lienzo = document.createElement('canvas');
        lienzo.width = ancho;
        lienzo.height = alto;
        const contexto = lienzo.getContext('2d');

         // Función auxiliar para dibujar imagen y resolver la promesa
        function dibujarImagen(imagen) {
            contexto.drawImage(imagen, 0, 0, ancho, alto);
            resolve(lienzo); // Devuelve el canvas completo
        }
    
        // Evalúa el tipo de imagen a generar
        switch(tipo) {
            // Caso: cargar imagen batman
            case 'batman':
                // Crear un objeto Image (ubicacion del recurso)
                const imagenBatman = new Image();
                imagenBatman.src = 'imagenes/juego/batman.png'; 
                // Establecer el evento que se ejecuta cuando la imagen se carga
                imagenBatman.onload = function() {
                    // Lllamo al metodo dibujar la imagen en el canvas
                    dibujarImagen(this);      
                };

                // Manejar errores de carga
                imagenBatman.onerror = function() {
                    console.error('Error al cargar la imagen');
                    //  dibujar algo por defecto si falla
                    contexto.fillStyle = '#cccccc';
                    contexto.fillRect(0, 0, ancho, alto);
                    resolve(lienzo);
                };
                
                break;
                
            // Caso: cargar imagen de superman
            case 'superman':
                const imagenSuperman = new Image();
                imagenSuperman.src = 'imagenes/juego/superman.jpg';

                imagenSuperman.onload = function() {
                    dibujarImagen(this); 
                };

                imagenSuperman.onerror = () => {
                    console.error('Error al cargar la imagen');
                    contexto.fillStyle = '#cccccc';
                    contexto.fillRect(0, 0, ancho, alto);
                    resolve(lienzo);
                };

                break;
                
            // Caso: cargar imagen de batman-superman
            case 'batman-superman':
                const imagenBatmanSuperman = new Image();
                imagenBatmanSuperman.src = 'imagenes/juego/batman-superman.jpg';

                imagenBatmanSuperman.onload = function() {
                    dibujarImagen(this); 
                };

                imagenBatmanSuperman.onerror = () => {
                    console.error('Error al cargar la imagen');
                    contexto.fillStyle = '#cccccc';
                    contexto.fillRect(0, 0, ancho, alto);
                    resolve(lienzo);
                };
                
                break;
            
                
            // Caso: crear un degradado radial desde el centro
            case 'radial':
                // Crea un degradado radial desde el centro (ancho/2, alto/2) con radio 0 hasta radio ancho/2
                const degradadoRadial = contexto.createRadialGradient(ancho/2, alto/2, 0, ancho/2, alto/2, ancho/2);
               
                degradadoRadial.addColorStop(0, '#F2C335');
                degradadoRadial.addColorStop(0.5, '#b92020ff');
                degradadoRadial.addColorStop(1, '#263385ff');
                // Establece el degradado radial como estilo de relleno
                contexto.fillStyle = degradadoRadial;
                // Dibuja un rectángulo que cubre todo el canvas con el degradado
                contexto.fillRect(0, 0, ancho, alto);
                resolve(lienzo);
                // Sale del case
                break;
                
            // Caso: crear ondas sinusoidales
            case 'waves':
                contexto.fillStyle = '#F2C335';
                // Dibuja el fondo
                contexto.fillRect(0, 0, ancho, alto);
                contexto.strokeStyle = '#1B1F2B'
                contexto.lineWidth = 5;
                // Bucle para dibujar 10 ondas
                for (let i = 0; i < 10; i++) {
                    contexto.beginPath();
                    // Recorre el canvas horizontalmente en pasos de 10 píxeles
                    for (let x = 0; x <= ancho; x += 10) {
                        // Calcula la posición Y usando función seno para crear la onda
                        const y = alto/2 + Math.sin((x + i * 30) * 0.02) * 50;
                        // Si es el primer punto, mueve el "lápiz" a esa posición
                        if (x === 0) contexto.moveTo(x, y);
                        // Si no es el primer punto, dibuja una línea hasta esa posición
                        else contexto.lineTo(x, y);
                    }
                   
                    contexto.stroke();
                }
                resolve(lienzo);
                
                break;
                
            // Caso: crear un cielo estrellado
            case 'stars':
                contexto.fillStyle = '#191970';
                contexto.fillRect(0, 0, ancho, alto);
                contexto.fillStyle = '#FFD700';
                // Bucle para dibujar 50 estrellas
                for (let i = 0; i < 50; i++) {
                   
                    const x = Math.random() * ancho;
                    const y = Math.random() * alto;
                    const tamaño = 2 + Math.random() * 4;
                    contexto.beginPath();
                    contexto.arc(x, y, tamaño, 0, Math.PI * 2);
                    contexto.fill();
                }
                resolve(lienzo);
                break;
        }
        
        // Añade un texto identificador en el centro de la imagen
        
        contexto.fillStyle = 'rgba(255, 255, 255, 0.8)';
        contexto.font = 'bold 40px Arial';
        contexto.textAlign = 'center';
        contexto.textBaseline = 'middle';
        contexto.fillText(`GameHub- Blocka- ${tipo}`, ancho/2, alto/2);
        
        return lienzo;
     });
}

// ====== CONFIGURACIÓN DE NIVELES ==================================================================================
// Array que define las características de cada nivel del juego
const configuracionesNivel = [
    { nivel: 1, filtro: 'brightness', nombre: 'Brillo' },
    { nivel: 2, filtro: 'negative', nombre: 'Negativo' },
    { nivel: 3, filtro: 'grayscale', nombre: 'Escala de Grises' },
    { nivel: 4, filtro: 'mixed', nombre: 'Filtros Mixtos' }
];

// Array con los tipos de imágenes que se pueden generar
const tiposImagenes = ['batman', 'superman', 'batman-superman', 'radial', 'waves', 'stars'];

// ====== CLASE PIEZA ================================================================================================
// Clase que representa cada pieza individual del rompecabezas
class Pieza {
    // Constructor que inicializa una nueva pieza
    constructor(imagen, origenX, origenY, ancho, alto, destinoX, destinoY, fila, columna) {
       
        this.imagen = imagen;
        this.origenX = origenX;
        this.origenY = origenY;
        this.ancho = ancho;
        this.alto = alto;
        this.x = destinoX;
        this.y = destinoY;
        this.fila = fila;
        this.columna = columna;
        this.rotacion = 0;
        this.rotacionCorrecta = 0;
        this.estaBloqueada = false;
        this.lienzoFiltrado = null;
    }
    
    // Método que rota la pieza 90 grados en la dirección especificada
    rotar(direccion) {
        // Si la pieza está bloqueada, no permite rotarla
        if (this.estaBloqueada) return;
        this.rotacion += direccion * 90;
       
        this.rotacion = ((this.rotacion % 360) + 360) % 360;
    }
    
    // Método que verifica si la pieza está en la orientación correcta
    estaCorrecta() {
       
        return this.rotacion === this.rotacionCorrecta;
    }
    
    // Método que verifica si un punto (x, y) está dentro de los límites de esta pieza
    contiene(x, y) {
        return x >= this.x && x <= this.x + this.ancho &&
               y >= this.y && y <= this.y + this.alto;
    }
    
    // Método que dibuja la pieza en el canvas
    dibujar(contexto, usarFiltro = true) {
       
        contexto.save();
        contexto.translate(this.x + this.ancho/2, this.y + this.alto/2);
        contexto.rotate(this.rotacion * Math.PI / 180);
        
        // Decide si dibujar la versión con filtro o sin filtro
        if (usarFiltro && this.lienzoFiltrado) {
            contexto.drawImage(this.lienzoFiltrado, -this.ancho/2, -this.alto/2, this.ancho, this.alto);
        } else {
            contexto.drawImage(
                this.imagen, // Imagen fuente
                this.origenX, this.origenY, this.ancho, this.alto, // Rectángulo de recorte en la fuente
                -this.ancho/2, -this.alto/2, this.ancho, this.alto // Posición y tamaño de destino
            );
        }
        
        // Si la pieza está bloqueada, dibuja un borde verde
        if (this.estaBloqueada) {
        
            contexto.strokeStyle = '#4caf50';
            contexto.lineWidth = 4;
            contexto.strokeRect(-this.ancho/2, -this.alto/2, this.ancho, this.alto);
        }
        
        // Restaura el estado anterior del contexto (deshace las transformaciones)
        contexto.restore();
    }
}

// ====== FILTROS DE IMAGEN ==================================================================================0======
// Función que aplica un filtro de escala de grises a una región del canvas
function aplicarEscalaGrises(contexto, x, y, ancho, alto) {
   
    const datosImagen = contexto.getImageData(x, y, ancho, alto);
    const datos = datosImagen.data;
    
    for (let i = 0; i < datos.length; i += 4) {
      // usa los coeficientes BT.601
      const luminosidad = Math.round(datos[i] * 0.299 + datos[i + 1] * 0.587 + datos[i + 2] * 0.114);
      datos[i] = datos[i + 1] = datos[i + 2] = luminosidad;

    }
    
    contexto.putImageData(datosImagen, x, y);
  }

// Función que aplica un filtro de brillo aumentado
function aplicarBrillo(contexto, x, y, ancho, alto) {

    const datosImagen = contexto.getImageData(x, y, ancho, alto);
    const datos = datosImagen.data;
    
    // Recorre todos los píxeles
    for (let i = 0; i < datos.length; i += 4) {
       
        datos[i] = Math.min(255, datos[i] * 1.3);
        datos[i + 1] = Math.min(255, datos[i + 1] * 1.3);
        datos[i + 2] = Math.min(255, datos[i + 2] * 1.3);  
    }
    
    contexto.putImageData(datosImagen, x, y);
}

// Función que aplica un filtro negativo (invierte los colores)
function aplicarNegativo(contexto, x, y, ancho, alto) {
   
    const datosImagen = contexto.getImageData(x, y, ancho, alto);
    const datos = datosImagen.data;
    
    // Recorre todos los píxeles
    for (let i = 0; i < datos.length; i += 4) {
        datos[i] = 255 - datos[i];
        datos[i + 1] = 255 - datos[i + 1];
        datos[i + 2] = 255 - datos[i + 2];
    }

    contexto.putImageData(datosImagen, x, y);
}

// ====== CLASE JUEGO =========================================================================================================
// Clase principal que controla toda la lógica del juego
class Juego {
    
    constructor() {
       
        this.lienzo = document.getElementById('game-canvas');
        this.contexto = this.lienzo.getContext('2d');
        // Inicializa el nivel actual en 1
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
        
        this.configurarEventos();
    }
    
    // Método que configura todos los manejadores de eventos
    configurarEventos() {
        document.getElementById('btn-start').addEventListener('click', () => this.mostrarSeleccionImagen());
        document.getElementById('btn-menu').addEventListener('click', () => this.volverAlMenu());
        document.getElementById('btn-menu-victory').addEventListener('click', () => this.volverAlMenu());
        document.getElementById('btn-menu-defeat').addEventListener('click', () => this.volverAlMenu());
        document.getElementById('btn-next-level').addEventListener('click', () => this.siguienteNivel());
        document.getElementById('btn-retry').addEventListener('click', () => this.reintentarNivel());
        document.getElementById('btn-help').addEventListener('click', () => this.usarAyuda());
        document.getElementById('btn-random-image').addEventListener('click', () => this.seleccionarImagenAleatoria());
        
        // Click izquierdo en el canvas: rota pieza en sentido antihorario (dirección = -1)
        this.lienzo.addEventListener('click', (e) => this.manejarClickLienzo(e, -1));
        
        // Click derecho en el canvas: rota pieza en sentido horario (dirección = 1)
        this.lienzo.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.manejarClickLienzo(e, 1);
        });
        
        // Selector de tamaño de cuadrícula: actualiza el tamaño cuando cambia
        document.getElementById('grid-size').addEventListener('change', (e) => {
            const valor = e.target.value;
            // Si el valor contiene 'x', es un formato personalizado (ej: 2x3)
            if (valor.includes('x')) {
                const [filas, columnas] = valor.split('x').map(Number);
                this.filasCuadricula = filas;
                this.columnasCuadricula = columnas;
            } else {
                // Para compatibilidad con versiones anteriores (por si acaso)
                const tamaño = parseInt(valor);
                this.filasCuadricula = tamaño;
                this.columnasCuadricula = tamaño;
            }
            console.log(`Nueva configuración de cuadrícula: ${this.filasCuadricula}x${this.columnasCuadricula}`);
        });
        
        // Selector de límite de tiempo: actualiza el tiempo máximo cuando cambia
        document.getElementById('time-limit').addEventListener('change', (e) => {
            this.tiempoMaximo = parseInt(e.target.value);
        });
    }
    
    // Método que muestra una pantalla específica y oculta las demás
    mostrarPantalla(idPantalla) {
        document.querySelectorAll('.screen').forEach(pantalla => pantalla.classList.remove('active'));
        document.getElementById(idPantalla).classList.add('active');
    }
    
    // Método que muestra la pantalla de selección de imagen
    mostrarSeleccionImagen() {
        this.mostrarPantalla('image-select-screen');
        this.generarImagenes();
    }
    
  // Método que genera todas las imágenes disponibles
    async generarImagenes() {
        if (!this.imagenesCargadas) {
            document.getElementById('loading-text').style.display = 'block';

            document.getElementById('btn-random-image').style.display = 'none';

            // Permite que el DOM se actualice para que el usuario vea el mensaje
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        try {
            // Genera una imagen de cada tipo y espera a que todas estén listas
            this.imagenesGeneradas = await Promise.all(
                tiposImagenes.map(tipo => generarImagen(600, 600, tipo))
            );
            await this.mostrarMiniaturas();
        } catch (error) {
            console.error('Error generando imágenes:', error);
        } finally {
            // Oculta el texto de carga solo la primera vez
            if (!this.imagenesCargadas) {
                document.getElementById('loading-text').style.display = 'none';
                document.getElementById('btn-random-image').style.display = 'inline-block';
                this.imagenesCargadas = true; 
            }
        }
    }
    
   // Método que muestra las miniaturas de las imágenes generadas
    async mostrarMiniaturas() {

        const contenedor = document.getElementById('thumbnail-container');
        contenedor.innerHTML = '';

        // Espera a que todas las imágenes se generen (Promise.all)
        const imagenesListas = await Promise.all(this.imagenesGeneradas);

         // Crea las miniaturas
            imagenesListas.forEach((lienzoImg, indice) => {
               
                const miniatura = document.createElement('canvas');
                miniatura.width = 120;
                miniatura.height = 120;
                miniatura.className = 'thumbnail';
                const contextoMiniatura = miniatura.getContext('2d');
                
                contextoMiniatura.drawImage(lienzoImg, 0, 0, 120, 120);

                miniatura.addEventListener('click', () => this.seleccionarImagen(indice, miniatura));
                contenedor.appendChild(miniatura);
        });    
    }
        
        
    // Método que maneja la selección de una imagen
   seleccionarImagen(indice, elementoMiniatura) { 
       
        document.querySelectorAll('.thumbnail').forEach(m => m.classList.remove('selected')); 
        elementoMiniatura.classList.add('selected');
        this.indiceImagenSeleccionada = indice;
        setTimeout(() => {
       
        this.iniciarJuego(); }, 1000);
    }
    
    // Método que selecciona una imagen aleatoriamente
    seleccionarImagenAleatoria() {
       
        const indiceAleatorio = Math.floor(Math.random() * this.imagenesGeneradas.length);
        const miniaturas = document.querySelectorAll('.thumbnail');
        this.seleccionarImagen(indiceAleatorio, miniaturas[indiceAleatorio]);
    }
    
    // Método que inicia el juego
    iniciarJuego() {
       
        this.mostrarPantalla('game-screen');
        
        // Si no hay imagen seleccionada, elige una aleatoria
        if (this.indiceImagenSeleccionada === null) {
            this.indiceImagenSeleccionada = Math.floor(Math.random() * this.imagenesGeneradas.length);
        }
        
        // Guarda la imagen seleccionada como imagen actual
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

    // Método que crea todas las piezas del rompecabezas
    crearPiezas() {
        // Limpia el array de piezas
        this.piezas = [];
        
        // Usa el lado más grande para calcular el tamaño de pieza cuadrada
        const mayorDimension = Math.max(this.filasCuadricula, this.columnasCuadricula);
        
        // Calcula el tamaño del canvas basado en las piezas que realmente se usan
        const tamañoPiezaBase = 600 / mayorDimension;
        const anchoCanvas = this.columnasCuadricula * tamañoPiezaBase;
        const altoCanvas = this.filasCuadricula * tamañoPiezaBase;
        
        // Ajusta el canvas al tamaño necesario
        this.lienzo.width = anchoCanvas;
        this.lienzo.height = altoCanvas;
        
        // Calcula la relación de aspecto de la imagen y del canvas
        const relacionImagenOriginal = this.imagenActual.width / this.imagenActual.height;
        const relacionCanvas = this.columnasCuadricula / this.filasCuadricula;
        
        // Variables para el área de la imagen que vamos a usar
        let anchoImagenUsada = this.imagenActual.width;
        let altoImagenUsada = this.imagenActual.height;
        let offsetX = 0;
        let offsetY = 0;
        
        // Si la imagen es más alta proporcionalmente que el canvas, recortamos arriba/abajo
        if (relacionImagenOriginal < relacionCanvas) {
            // La imagen es más "vertical" - recortamos arriba y abajo
            altoImagenUsada = this.imagenActual.width / relacionCanvas;
            offsetY = (this.imagenActual.height - altoImagenUsada) / 2; // Centrado vertical
        } 
        // Si la imagen es más ancha proporcionalmente que el canvas, recortamos izquierda/derecha
        else if (relacionImagenOriginal > relacionCanvas) {
            // La imagen es más "horizontal" - recortamos los lados
            anchoImagenUsada = this.imagenActual.height * relacionCanvas;
            offsetX = (this.imagenActual.width - anchoImagenUsada) / 2; // Centrado horizontal
        }
        
        // Dimensiones de ORIGEN (área recortada de la imagen original)
        const anchoPiezaOrigen = anchoImagenUsada / this.columnasCuadricula;
        const altoPiezaOrigen = altoImagenUsada / this.filasCuadricula;
        
        // Dimensiones de DESTINO (canvas) - piezas cuadradas
        const tamañoPiezaDestino = tamañoPiezaBase;
        
        // Bucle que recorre las filas
        for (let fila = 0; fila < this.filasCuadricula; fila++) {
            // Bucle que recorre las columnas
            for (let columna = 0; columna < this.columnasCuadricula; columna++) {
                // Crea una nueva pieza con sus parámetros
                const pieza = new Pieza(
                    this.imagenActual, // Imagen original
                    offsetX + columna * anchoPiezaOrigen, // X de origen con offset
                    offsetY + fila * altoPiezaOrigen, // Y de origen con offset
                    anchoPiezaOrigen, // Ancho de origen
                    altoPiezaOrigen, // Alto de origen
                    columna * tamañoPiezaDestino, // X de destino en el canvas
                    fila * tamañoPiezaDestino, // Y de destino en el canvas
                    fila, // Número de fila
                    columna // Número de columna
                );
                
                // Establece las dimensiones cuadradas para el destino
                pieza.ancho = tamañoPiezaDestino;
                pieza.alto = tamañoPiezaDestino;
                
                // Añade la pieza al array
                this.piezas.push(pieza);
            }
        }
    }
        
    // Método que aplica los filtros a las piezas según el nivel
    aplicarFiltros() {
       
        const configuracionNivel = configuracionesNivel[(this.nivelActual - 1) % configuracionesNivel.length];
        
        // Recorre cada pieza
        this.piezas.forEach((pieza, indice) => {
           
            const lienzoTemporal = document.createElement('canvas');
            lienzoTemporal.width = pieza.ancho;
            lienzoTemporal.height = pieza.alto;
            const contextoTemporal = lienzoTemporal.getContext('2d');
            
            // Dibuja la porción correspondiente de la imagen original en el canvas temporal
            contextoTemporal.drawImage(
                this.imagenActual, // Imagen fuente
                pieza.origenX, pieza.origenY, pieza.ancho, pieza.alto, // Área de recorte
                0, 0, pieza.ancho, pieza.alto // Posición de destino
            );
            
            // Verifica si el nivel usa filtros mixtos
            if (configuracionNivel.filtro === 'mixed') {
               
                const filtros = ['grayscale', 'brightness', 'negative'];
                const filtro = filtros[indice % filtros.length];
                this.aplicarFiltroAContexto(contextoTemporal, filtro, 0, 0, pieza.ancho, pieza.alto);
            } else {
                // Aplica el filtro único del nivel a todas las piezas
                this.aplicarFiltroAContexto(contextoTemporal, configuracionNivel.filtro, 0, 0, pieza.ancho, pieza.alto);
            }
            
            // Guarda el canvas con el filtro aplicado en la pieza
            pieza.lienzoFiltrado = lienzoTemporal;
        });
    }
    
    // Método que aplica un filtro específico a un contexto
    aplicarFiltroAContexto(contexto, nombreFiltro, x, y, ancho, alto) {
        // Evalúa qué filtro aplicar
        switch(nombreFiltro) {
           
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
    
    // Método que asigna rotaciones aleatorias a todas las piezas
    aleatorizarRotaciones() {
        const rotaciones = [0, 90, 180, 270];

        this.piezas.forEach(pieza => {
            pieza.rotacion = rotaciones[Math.floor(Math.random() * rotaciones.length)];
        });
    }
    
    // Método que maneja los clicks en el canvas
    manejarClickLienzo(evento, direccion) {
        
        const rectangulo = this.lienzo.getBoundingClientRect();
        const x = (evento.clientX - rectangulo.left) * (this.lienzo.width / rectangulo.width);
        const y = (evento.clientY - rectangulo.top) * (this.lienzo.height / rectangulo.height);
        
        // Recorre todas las piezas para encontrar cuál fue clickeada
        for (let pieza of this.piezas) {
            // Verifica si el click está dentro de esta pieza
            if (pieza.contiene(x, y)) {
                pieza.rotar(direccion);
                this.renderizar();
                this.verificarCompletado();
                break;
            }
        }
    }
    
    // Método que usa la ayuda para colocar una pieza correctamente
    usarAyuda() {

        if (this.ayudaUsada) return;
    
        const piezasIncorrectas = this.piezas.filter(p => !p.estaCorrecta() && !p.estaBloqueada);
       
        if (piezasIncorrectas.length === 0) return;
        
        const piezaAleatoria = piezasIncorrectas[Math.floor(Math.random() * piezasIncorrectas.length)];
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
    
    // Método que verifica si todas las piezas están correctamente colocadas
    verificarCompletado() {
    
        const todasCorrectas = this.piezas.every(p => p.estaCorrecta());
        // Cuenta cuántas piezas están correctas
        const conteoCorrectas = this.piezas.filter(p => p.estaCorrecta()).length;
        // Calcula el porcentaje de progreso
        const progreso = (conteoCorrectas / this.piezas.length) * 100;
        
        // Actualiza el ancho de la barra de progreso
        document.getElementById('progress-fill').style.width = progreso + '%';
        
        // Si todas están correctas
        if (todasCorrectas) {
            this.detenerTemporizador();
            
            this.mostrarVictoria();
        }
    }
    
   // Método que muestra la pantalla de victoria
    mostrarVictoria() {
        // Renderiza el juego sin filtros para mostrar la imagen completa
        this.renderizar(false);
        
        // Crea y muestra el mensaje de "¡GANASTE!" superpuesto
        const mensajeGanaste = document.createElement('div');
        mensajeGanaste.className = 'mensaje-ganaste';
        mensajeGanaste.innerHTML = 'NIVEL COMPLETO!';
        document.getElementById('game-screen').appendChild(mensajeGanaste);
        
        // Espera 2500ms (2.5 segundos) para que el jugador vea la imagen completa y el mensaje
        setTimeout(() => {
            // Remueve el mensaje antes de cambiar de pantalla
            mensajeGanaste.remove();
            
            this.mostrarPantalla('victory-screen');
            const minutos = Math.floor(this.temporizador / 60);
            const segundos = this.temporizador % 60;
            
            document.getElementById('victory-time').textContent =
                `⏱️ Tiempo: ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            
            // Muestra las estadísticas del nivel completado
            document.getElementById('victory-stats').innerHTML = `
                <p>Nivel ${this.nivelActual} - ${configuracionesNivel[(this.nivelActual - 1) % configuracionesNivel.length].nombre}</p>
                <p>Grid: ${this.filasCuadricula}x${this.columnasCuadricula} (${this.piezas.length} piezas)</p>
                ${this.ayudaUsada ? '<p>Ayuda utilizada</p>' : '<p>Sin ayuda - ¡Perfecto!</p>'}
            `;
        }, 2500);
    }
    
    // Método que muestra la pantalla de derrota
    mostrarDerrota() {
        this.detenerTemporizador();
        this.mostrarPantalla('defeat-screen');
    }
    
    // Método que inicia el temporizador del juego
    iniciarTemporizador() {
        // Resetea el temporizador a 0
        this.temporizador = 0;
        this.actualizarVisualizacionTemporizador();
        
        // Crea un intervalo que se ejecuta cada 1000ms (1 segundo)
        this.intervaloTemporizador = setInterval(() => {
          
            this.temporizador++;
            this.actualizarVisualizacionTemporizador();
            
            if (this.tiempoMaximo > 0 && this.temporizador >= this.tiempoMaximo) {
                this.mostrarDerrota();
            }
        }, 1000);
    }
    
    // Método que detiene el temporizador
    detenerTemporizador() {
            if (this.intervaloTemporizador) {
            clearInterval(this.intervaloTemporizador);
            this.intervaloTemporizador = null;
        }
    }
    
    // Método que actualiza la visualización del temporizador en pantalla
    actualizarVisualizacionTemporizador() {
        // Calcula los minutos transcurridos
        const minutos = Math.floor(this.temporizador / 60);
        // Calcula los segundos restantes
        const segundos = this.temporizador % 60;
        
        // Actualiza el texto del temporizador con formato MM:SS
        document.getElementById('timer-display').textContent =
            `⏱️ ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        if (this.tiempoMaximo > 0) {
           
            const restante = this.tiempoMaximo - this.temporizador;
            const minRestantes = Math.floor(restante / 60);
            const segRestantes = restante % 60;
            
            document.getElementById('max-time-display').textContent =
                `⏰ ${minRestantes.toString().padStart(2, '0')}:${segRestantes.toString().padStart(2, '0')}`;
        } else {
            // Si no hay límite, limpia el display de tiempo máximo
            document.getElementById('max-time-display').textContent = '';
        }
    }
    
    // Método que actualiza la visualización del nivel actual
    actualizarVisualizacionNivel() {
        const configuracionNivel = configuracionesNivel[(this.nivelActual - 1) % configuracionesNivel.length];
        document.getElementById('level-display').textContent =
            `Nivel: ${this.nivelActual} - ${configuracionNivel.nombre}`;
    }
    
    // Método que renderiza todas las piezas en el canvas
    renderizar(usarFiltros = true) {
        this.contexto.clearRect(0, 0, this.lienzo.width, this.lienzo.height);
        this.piezas.forEach(pieza => pieza.dibujar(this.contexto, usarFiltros));
    }
    
    // Método que avanza al siguiente nivel
    siguienteNivel() {
       
        this.nivelActual++;
        this.indiceImagenSeleccionada = null;
        this.mostrarSeleccionImagen();
    }
    
    // Método que permite reintentar el nivel actual
    reintentarNivel() {
        this.indiceImagenSeleccionada = null;
        this.mostrarSeleccionImagen();
    }
    
    // Método que vuelve al menú principal
    volverAlMenu() {
        this.detenerTemporizador();
        this.nivelActual = 1;
        this.indiceImagenSeleccionada = null;
        this.mostrarPantalla('menu-screen');
    }

}
// ====== INICIALIZAR JUEGO====================================================================================================
// Crea una instancia de la clase Juego cuando se carga el script
const juego = new Juego();


//-============ Lista de juegos relacionados específicos de Blocka===========================================================
const misJuegos = [
  new Carrusel.Juego("imagenes/juego/Pokemon.jpg", "Pokemon", "Puzzle", true),
  new Carrusel.Juego("imagenes/juego/Guardian.jpg", "Guardian", "Puzzle", false),
  new Carrusel.Juego("imagenes/juego/Sokoban.jpg", "Sokoban", "Puzzle", false),
];

// Esperar a que el DOM esté completamente cargado
window.addEventListener('DOMContentLoaded', () => {
  console.log('Iniciando carrusel con juegos:', misJuegos);
  Carrusel.misJuegosCarrusel(misJuegos);
  Carrusel.cargarJuegosRelacionados();
});