"use strict"

// Importa TODO lo exportado de carrusel."
import * as Carrusel from './carrusel.js';

//Se usa todo lo que exportó el otro archivo:
Carrusel.Juego;
Carrusel.misJuegosCarrusel();
Carrusel.cargarJuegosRelacionados();

// ====== GENERADOR DE IMÁGENES ======
// Función que genera imágenes con diferentes patrones visuales
function generarImagen(ancho, alto, tipo) {
    // Crea un nuevo elemento canvas en memoria (no visible en el DOM)
    const lienzo = document.createElement('canvas');
    // Define el ancho del canvas
    lienzo.width = ancho;
    // Define el alto del canvas
    lienzo.height = alto;
    // Obtiene el contexto 2D para poder dibujar en el canvas
    const contexto = lienzo.getContext('2d');
    
    // Evalúa el tipo de imagen a generar
    switch(tipo) {
        // Caso: crear un degradado lineal
        case 'domino':
            // Crear un objeto Image
            const imagen = new Image();
            // Establecer el evento que se ejecuta cuando la imagen se carga
            imagen.onload = function() {
                // Dibujar la imagen en el canvas
                // drawImage(imagen, x, y, ancho, alto)
                contexto.drawImage(imagen, 0, 0, ancho, alto);
            };
            // Manejar errores de carga
            imagen.onerror = function() {
                console.error('Error al cargar la imagen');
                //  dibujar algo por defecto si falla
                contexto.fillStyle = '#cccccc';
                contexto.fillRect(0, 0, ancho, alto);
            };
            imagen.src = 'imagenes/juego/domino.png'; 
            break;
            
        // Caso: cargar imagen de rompecabezas
        case 'rompecabezas':
            const imagenrompecabezas = new Image();
            imagenrompecabezas.onload = function() {
                contexto.drawImage(imagenrompecabezas, 0, 0, ancho, alto);
            };
            imagenrompecabezas.onerror = function() {
                console.error('Error al cargar la imagen circles');
                contexto.fillStyle = '#2C3E50';
                contexto.fillRect(0, 0, ancho, alto);
            };
            imagenrompecabezas.src = 'imagenes/juego/rompecabeza.png'; // Tu imagen de circles
            break;
            
        // Caso: cargar imagen de tetris
        case 'tetris':
            const imagentetris = new Image();
            imagentetris.onload = function() {
                contexto.drawImage(imagentetris, 0, 0, ancho, alto);
            };
            imagentetris.onerror = function() {
                console.error('Error al cargar la imagen tetris');
                contexto.fillStyle = '#1ABC9C';
                contexto.fillRect(0, 0, ancho, alto);
            };
            imagentetris.src = 'imagenes/juego/tetris.png'; 
            break;
            
        // Caso: crear un degradado radial desde el centro
        case 'radial':
            // Crea un degradado radial desde el centro (ancho/2, alto/2) con radio 0 hasta radio ancho/2
            const degradadoRadial = contexto.createRadialGradient(ancho/2, alto/2, 0, ancho/2, alto/2, ancho/2);
            // Añade color magenta en el centro (0%)
            degradadoRadial.addColorStop(0, '#FF00FF');
            // Añade color cian en el medio (50%)
            degradadoRadial.addColorStop(0.5, '#00FFFF');
            // Añade color amarillo en el exterior (100%)
            degradadoRadial.addColorStop(1, '#FFFF00');
            // Establece el degradado radial como estilo de relleno
            contexto.fillStyle = degradadoRadial;
            // Dibuja un rectángulo que cubre todo el canvas con el degradado
            contexto.fillRect(0, 0, ancho, alto);
            // Sale del case
            break;
            
        // Caso: crear ondas sinusoidales
        case 'waves':
            // Establece un color de fondo verde azulado
            contexto.fillStyle = '#16a085';
            // Dibuja el fondo
            contexto.fillRect(0, 0, ancho, alto);
            // Establece el color de las líneas como blanco humo
            contexto.strokeStyle = '#ecf0f1';
            // Establece el grosor de las líneas en 5 píxeles
            contexto.lineWidth = 5;
            // Bucle para dibujar 10 ondas
            for (let i = 0; i < 10; i++) {
                // Inicia un nuevo trazo para cada onda
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
                // Dibuja la línea completa de la onda
                contexto.stroke();
            }
            // Sale del case
            break;
            
        // Caso: crear un cielo estrellado
        case 'stars':
            // Establece un color de fondo azul medianoche
            contexto.fillStyle = '#191970';
            // Dibuja el fondo oscuro
            contexto.fillRect(0, 0, ancho, alto);
            // Establece el color dorado para las estrellas
            contexto.fillStyle = '#FFD700';
            // Bucle para dibujar 50 estrellas
            for (let i = 0; i < 50; i++) {
                // Calcula una posición X aleatoria
                const x = Math.random() * ancho;
                // Calcula una posición Y aleatoria
                const y = Math.random() * alto;
                // Calcula un tamaño aleatorio entre 2 y 6 píxeles
                const tamaño = 2 + Math.random() * 4;
                // Inicia un nuevo trazo
                contexto.beginPath();
                // Dibuja un círculo pequeño (estrella)
                contexto.arc(x, y, tamaño, 0, Math.PI * 2);
                // Rellena la estrella
                contexto.fill();
            }
            // Sale del case
            break;
    }
    
    // Añade un texto identificador en el centro de la imagen
    // Establece el color del texto como blanco semi-transparente
    contexto.fillStyle = 'rgba(255, 255, 255, 0.8)';
    // Define la fuente como Arial negrita de 40px
    contexto.font = 'bold 40px Arial';
    // Alinea el texto al centro horizontalmente
    contexto.textAlign = 'center';
    // Alinea el texto al centro verticalmente
    contexto.textBaseline = 'middle';
    // Dibuja el texto en el centro del canvas
    contexto.fillText(`Imagen ${tipo}`, ancho/2, alto/2);
    
    // Retorna el canvas completo con la imagen generada
    return lienzo;
}

// ====== CONFIGURACIÓN DE NIVELES ======
// Array que define las características de cada nivel del juego
const configuracionesNivel = [
    // Nivel 1: aplica filtro de brillo aumentado
    { nivel: 1, filtro: 'brightness', nombre: 'Brillo' },
    // Nivel 2: aplica filtro negativo (colores invertidos)
    { nivel: 2, filtro: 'negative', nombre: 'Negativo' },
    // Nivel 3: aplica filtro de escala de grises
    { nivel: 3, filtro: 'grayscale', nombre: 'Escala de Grises' },
    // Nivel 4: aplica una mezcla de diferentes filtros
    { nivel: 4, filtro: 'mixed', nombre: 'Filtros Mixtos' }
];

// Array con los tipos de imágenes que se pueden generar
const tiposImagenes = ['domino', 'rompecabezas', 'tetris', 'radial', 'waves', 'stars'];

// ====== CLASE PIEZA ======
// Clase que representa cada pieza individual del rompecabezas
class Pieza {
    // Constructor que inicializa una nueva pieza
    constructor(imagen, origenX, origenY, ancho, alto, destinoX, destinoY, fila, columna) {
        // Guarda referencia al canvas de la imagen original completa
        this.imagen = imagen;
        // Coordenada X del origen de esta pieza en la imagen original
        this.origenX = origenX;
        // Coordenada Y del origen de esta pieza en la imagen original
        this.origenY = origenY;
        // Ancho de la pieza en píxeles
        this.ancho = ancho;
        // Alto de la pieza en píxeles
        this.alto = alto;
        // Posición X actual donde se dibuja la pieza en el canvas del juego
        this.x = destinoX;
        // Posición Y actual donde se dibuja la pieza en el canvas del juego
        this.y = destinoY;
        // Número de fila en la cuadrícula (usado para identificación)
        this.fila = fila;
        // Número de columna en la cuadrícula (usado para identificación)
        this.columna = columna;
        // Ángulo de rotación actual de la pieza en grados
        this.rotacion = 0;
        // Ángulo de rotación correcto (siempre 0 grados para este juego)
        this.rotacionCorrecta = 0;
        // Indica si la pieza está bloqueada (ya colocada correctamente)
        this.estaBloqueada = false;
        // Canvas que contiene la pieza con el filtro aplicado
        this.lienzoFiltrado = null;
    }
    
    // Método que rota la pieza 90 grados en la dirección especificada
    rotar(direccion) {
        // Si la pieza está bloqueada, no permite rotarla
        if (this.estaBloqueada) return;
        // Incrementa o decrementa la rotación en 90 grados según la dirección (1 o -1)
        this.rotacion += direccion * 90;
        // Normaliza el ángulo para mantenerlo entre 0 y 359 grados
        this.rotacion = ((this.rotacion % 360) + 360) % 360;
    }
    
    // Método que verifica si la pieza está en la orientación correcta
    estaCorrecta() {
        // Retorna true si la rotación actual coincide con la rotación correcta
        return this.rotacion === this.rotacionCorrecta;
    }
    
    // Método que verifica si un punto (x, y) está dentro de los límites de esta pieza
    contiene(x, y) {
        // Verifica si x está entre el borde izquierdo y derecho de la pieza
        // Y si y está entre el borde superior e inferior de la pieza
        return x >= this.x && x <= this.x + this.ancho &&
               y >= this.y && y <= this.y + this.alto;
    }
    
    // Método que dibuja la pieza en el canvas
    dibujar(contexto, usarFiltro = true) {
        // Guarda el estado actual del contexto (transformaciones, estilos, etc.)
        contexto.save();
        // Traslada el origen de coordenadas al centro de la pieza
        contexto.translate(this.x + this.ancho/2, this.y + this.alto/2);
        // Aplica la rotación alrededor del nuevo origen (centro de la pieza)
        contexto.rotate(this.rotacion * Math.PI / 180);
        
        // Decide si dibujar la versión con filtro o sin filtro
        if (usarFiltro && this.lienzoFiltrado) {
            // Dibuja la imagen con filtro, centrada respecto al punto de rotación
            contexto.drawImage(this.lienzoFiltrado, -this.ancho/2, -this.alto/2, this.ancho, this.alto);
        } else {
            // Dibuja la porción correspondiente de la imagen original sin filtro
            contexto.drawImage(
                this.imagen, // Imagen fuente
                this.origenX, this.origenY, this.ancho, this.alto, // Rectángulo de recorte en la fuente
                -this.ancho/2, -this.alto/2, this.ancho, this.alto // Posición y tamaño de destino
            );
        }
        
        // Si la pieza está bloqueada, dibuja un borde verde
        if (this.estaBloqueada) {
            // Establece el color del borde como verde
            contexto.strokeStyle = '#4caf50';
            // Establece el grosor del borde en 4 píxeles
            contexto.lineWidth = 4;
            // Dibuja un rectángulo bordeado alrededor de la pieza
            contexto.strokeRect(-this.ancho/2, -this.alto/2, this.ancho, this.alto);
        }
        
        // Restaura el estado anterior del contexto (deshace las transformaciones)
        contexto.restore();
    }
}

// ====== FILTROS DE IMAGEN ======
// Función que aplica un filtro de escala de grises a una región del canvas
function aplicarEscalaGrises(contexto, x, y, ancho, alto) {
    // Obtiene los datos de píxeles de la región especificada
    const datosImagen = contexto.getImageData(x, y, ancho, alto);
    // Accede al array de datos RGBA (cada píxel tiene 4 valores: R, G, B, A)
    const datos = datosImagen.data;
    
    // Recorre todos los píxeles (de 4 en 4 porque cada píxel tiene 4 valores)
    for (let i = 0; i < datos.length; i += 4) {
      // usa los coeficientes BT.601
      const luminosidad = Math.round(datos[i] * 0.299 + datos[i + 1] * 0.587 + datos[i + 2] * 0.114);
      
      // Asigna la luminosidad a los tres canales para crear gris
      datos[i] = datos[i + 1] = datos[i + 2] = luminosidad;
      // El canal alfa (i+3) no se modifica
    }
    
    // Coloca los datos modificados de vuelta en el canvas
    contexto.putImageData(datosImagen, x, y);
  }

// Función que aplica un filtro de brillo aumentado
function aplicarBrillo(contexto, x, y, ancho, alto) {
    // Obtiene los datos de píxeles de la región
    const datosImagen = contexto.getImageData(x, y, ancho, alto);
    // Accede al array de datos de píxeles
    const datos = datosImagen.data;
    
    // Recorre todos los píxeles
    for (let i = 0; i < datos.length; i += 4) {
        // Multiplica el canal Rojo por 1.3 (aumenta 30%), sin exceder 255
        datos[i] = Math.min(255, datos[i] * 1.3);
        // Multiplica el canal Verde por 1.3
        datos[i + 1] = Math.min(255, datos[i + 1] * 1.3);
        // Multiplica el canal Azul por 1.3
        datos[i + 2] = Math.min(255, datos[i + 2] * 1.3);
        // El canal alfa no se modifica
    }
    
    // Coloca los datos modificados de vuelta en el canvas
    contexto.putImageData(datosImagen, x, y);
}

// Función que aplica un filtro negativo (invierte los colores)
function aplicarNegativo(contexto, x, y, ancho, alto) {
    // Obtiene los datos de píxeles
    const datosImagen = contexto.getImageData(x, y, ancho, alto);
    // Accede al array de datos
    const datos = datosImagen.data;
    
    // Recorre todos los píxeles
    for (let i = 0; i < datos.length; i += 4) {
        // Invierte el canal Rojo (255 - valor actual)
        datos[i] = 255 - datos[i];
        // Invierte el canal Verde
        datos[i + 1] = 255 - datos[i + 1];
        // Invierte el canal Azul
        datos[i + 2] = 255 - datos[i + 2];
        // El canal alfa no se modifica
    }
    
    // Coloca los datos modificados de vuelta en el canvas
    contexto.putImageData(datosImagen, x, y);
}

// ====== CLASE JUEGO ======
// Clase principal que controla toda la lógica del juego
class Juego {
    // Constructor que inicializa el juego
    constructor() {
        // Obtiene referencia al elemento canvas del HTML por su ID
        this.lienzo = document.getElementById('game-canvas');
        // Obtiene el contexto 2D del canvas para poder dibujar
        this.contexto = this.lienzo.getContext('2d');
        
        // Inicializa el nivel actual en 1
        this.nivelActual = 1;
        // Define las dimensiones de la cuadrícula por defecto (2 filas x 2 columnas = 4 piezas)
        this.filasCuadricula = 2;
        this.columnasCuadricula = 2;
        // Array que contendrá todas las piezas del rompecabezas
        this.piezas = [];
        // Referencia a la imagen actual que se está usando
        this.imagenActual = null;
        // Contador de segundos transcurridos
        this.temporizador = 0;
        // Referencia al intervalo del temporizador
        this.intervaloTemporizador = null;
        // Tiempo máximo permitido (0 = sin límite)
        this.tiempoMaximo = 0;
        // Indica si el jugador usó la ayuda en este nivel
        this.ayudaUsada = false;
        // Array que almacenará todas las imágenes generadas
        this.imagenesGeneradas = [];
        // Índice de la imagen seleccionada por el usuario
        this.indiceImagenSeleccionada = null;
        
        // Configura todos los event listeners
        this.configurarEventos();
    }
    
    // Método que configura todos los manejadores de eventos
    configurarEventos() {
        // Botón para iniciar el juego - muestra la selección de imágenes
        document.getElementById('btn-start').addEventListener('click', () => this.mostrarSeleccionImagen());
        // Botón para volver al menú desde la pantalla de juego
        document.getElementById('btn-menu').addEventListener('click', () => this.volverAlMenu());
        // Botón para volver al menú desde la pantalla de victoria
        document.getElementById('btn-menu-victory').addEventListener('click', () => this.volverAlMenu());
        // Botón para volver al menú desde la pantalla de derrota
        document.getElementById('btn-menu-defeat').addEventListener('click', () => this.volverAlMenu());
        // Botón para avanzar al siguiente nivel
        document.getElementById('btn-next-level').addEventListener('click', () => this.siguienteNivel());
        // Botón para reintentar el nivel actual
        document.getElementById('btn-retry').addEventListener('click', () => this.reintentarNivel());
        // Botón para usar la ayuda
        document.getElementById('btn-help').addEventListener('click', () => this.usarAyuda());
        // Botón para seleccionar una imagen al azar
        document.getElementById('btn-random-image').addEventListener('click', () => this.seleccionarImagenAleatoria());
        
        // Click izquierdo en el canvas: rota pieza en sentido antihorario (dirección = -1)
        this.lienzo.addEventListener('click', (e) => this.manejarClickLienzo(e, -1));
        
        // Click derecho en el canvas: rota pieza en sentido horario (dirección = 1)
        this.lienzo.addEventListener('contextmenu', (e) => {
            // Previene que aparezca el menú contextual del navegador
            e.preventDefault();
            // Llama al manejador con dirección 1
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
            // Convierte el valor del selector a número entero
            this.tiempoMaximo = parseInt(e.target.value);
        });
    }
    
    // Método que muestra una pantalla específica y oculta las demás
    mostrarPantalla(idPantalla) {
        // Selecciona todas las pantallas y les quita la clase 'active'
        document.querySelectorAll('.screen').forEach(pantalla => pantalla.classList.remove('active'));
        // Añade la clase 'active' a la pantalla especificada
        document.getElementById(idPantalla).classList.add('active');
    }
    
    // Método que muestra la pantalla de selección de imagen
    mostrarSeleccionImagen() {
        // Cambia a la pantalla de selección de imágenes
        this.mostrarPantalla('image-select-screen');
        // Genera las imágenes para que el usuario elija
        this.generarImagenes();
    }
    
    // Método que genera todas las imágenes disponibles
    generarImagenes() {
        // Muestra el texto de "Generando imágenes..."
        document.getElementById('loading-text').style.display = 'block';
        // Oculta el botón de imagen aleatoria mientras se generan
        document.getElementById('btn-random-image').style.display = 'none';
        
        // Usa setTimeout para permitir que el DOM se actualice antes de generar las imágenes
        setTimeout(() => {
            // Genera una imagen de cada tipo usando map
            this.imagenesGeneradas = tiposImagenes.map(tipo => generarImagen(600, 600, tipo));
            // Muestra las miniaturas de las imágenes generadas
            this.mostrarMiniaturas();
            // Oculta el texto de carga
            document.getElementById('loading-text').style.display = 'none';
            // Muestra el botón de imagen aleatoria
            document.getElementById('btn-random-image').style.display = 'inline-block';
        }, 100); // Espera 100 milisegundos
    }
    
   // Método que muestra las miniaturas de las imágenes generadas
mostrarMiniaturas() {
    // Obtiene el contenedor de miniaturas
    const contenedor = document.getElementById('thumbnail-container');
    // Limpia el contenido anterior del contenedor
    contenedor.innerHTML = '';
    
    // Recorre cada imagen generada
    this.imagenesGeneradas.forEach((lienzoImg, indice) => {
        // Crea un nuevo canvas para la miniatura
        const miniatura = document.createElement('canvas');
        // Define el ancho de la miniatura en 120px
        miniatura.width = 120;
        // Define el alto de la miniatura en 120px
        miniatura.height = 120;
        // Añade la clase CSS 'thumbnail' para el estilo
        miniatura.className = 'thumbnail';
        // Obtiene el contexto 2D de la miniatura
        const contextoMiniatura = miniatura.getContext('2d');
        
        // Espera un poco para que la imagen del dominó termine de cargar
        setTimeout(() => {
            // Dibuja la imagen original escalada a 120x120
            contextoMiniatura.drawImage(lienzoImg, 0, 0, 120, 120);
        }, indice === 0 ? 200 : 0); // Solo espera para la primera imagen (gradient/dominó)
        
        // Añade un event listener para cuando se haga click en la miniatura
        miniatura.addEventListener('click', () => this.seleccionarImagen(indice, miniatura));
        // Añade la miniatura al contenedor
        contenedor.appendChild(miniatura);
    });
}
    
    // Método que maneja la selección de una imagen
    seleccionarImagen(indice, elementoMiniatura) {
        // Quita la clase 'selected' de todas las miniaturas
        document.querySelectorAll('.thumbnail').forEach(m => m.classList.remove('selected'));
        // Añade la clase 'selected' a la miniatura clickeada
        elementoMiniatura.classList.add('selected');
        // Guarda el índice de la imagen seleccionada
        this.indiceImagenSeleccionada = indice;
        
        // Espera 800ms antes de iniciar el juego (para que el usuario vea la selección)
        setTimeout(() => {
            // Inicia el juego
            this.iniciarJuego();
        }, 800);
    }
    
    // Método que selecciona una imagen aleatoriamente
    seleccionarImagenAleatoria() {
        // Calcula un índice aleatorio entre 0 y el número de imágenes
        const indiceAleatorio = Math.floor(Math.random() * this.imagenesGeneradas.length);
        // Obtiene todas las miniaturas
        const miniaturas = document.querySelectorAll('.thumbnail');
        // Selecciona la imagen aleatoria
        this.seleccionarImagen(indiceAleatorio, miniaturas[indiceAleatorio]);
    }
    
    // Método que inicia el juego
    iniciarJuego() {
        // Cambia a la pantalla de juego
        this.mostrarPantalla('game-screen');
        
        // Si no hay imagen seleccionada, elige una aleatoria
        if (this.indiceImagenSeleccionada === null) {
            // Selecciona un índice aleatorio
            this.indiceImagenSeleccionada = Math.floor(Math.random() * this.imagenesGeneradas.length);
        }
        
        // Guarda la imagen seleccionada como imagen actual
        this.imagenActual = this.imagenesGeneradas[this.indiceImagenSeleccionada];
        // Resetea el estado de ayuda usada
        this.ayudaUsada = false;
        // Limpia el mensaje de estado de ayuda
        document.getElementById('help-status').innerHTML = '';
        // Habilita el botón de ayuda
        document.getElementById('btn-help').disabled = false;
        
        // Crea las piezas del rompecabezas
        this.crearPiezas();
        // Aplica los filtros correspondientes al nivel
        this.aplicarFiltros();
        // Aleatoriza las rotaciones de las piezas
        this.aleatorizarRotaciones();
        // Inicia el temporizador
        this.iniciarTemporizador();
        // Actualiza la visualización del nivel
        this.actualizarVisualizacionNivel();
        // Renderiza el juego en el canvas
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
    
    // Dimensiones de ORIGEN (imagen original) - piezas cuadradas
    const tamañoPiezaOrigen = this.imagenActual.width / mayorDimension;
    
    // Dimensiones de DESTINO (canvas) - piezas cuadradas
    const tamañoPiezaDestino = tamañoPiezaBase;
    
    // Bucle que recorre las filas
    for (let fila = 0; fila < this.filasCuadricula; fila++) {
        // Bucle que recorre las columnas
        for (let columna = 0; columna < this.columnasCuadricula; columna++) {
            // Crea una nueva pieza con sus parámetros
            const pieza = new Pieza(
                this.imagenActual,                    // Imagen original
                columna * tamañoPiezaOrigen,          // X de origen en la imagen
                fila * tamañoPiezaOrigen,             // Y de origen en la imagen
                tamañoPiezaOrigen,                    // Ancho de origen (cuadrado)
                tamañoPiezaOrigen,                    // Alto de origen (cuadrado)
                columna * tamañoPiezaDestino,         // X de destino en el canvas
                fila * tamañoPiezaDestino,            // Y de destino en el canvas
                fila,                                 // Número de fila
                columna                               // Número de columna
            );
            // Añade la pieza al array
            this.piezas.push(pieza);
        }
    }
}
    
    // Método que aplica los filtros a las piezas según el nivel
    aplicarFiltros() {
        // Obtiene la configuración del nivel actual usando módulo para ciclar los niveles
        const configuracionNivel = configuracionesNivel[(this.nivelActual - 1) % configuracionesNivel.length];
        
        // Recorre cada pieza
        this.piezas.forEach((pieza, indice) => {
            // Crea un canvas temporal para procesar la pieza
            const lienzoTemporal = document.createElement('canvas');
            // Define el ancho del canvas temporal igual al de la pieza
            lienzoTemporal.width = pieza.ancho;
            // Define el alto del canvas temporal
            lienzoTemporal.height = pieza.alto;
            // Obtiene el contexto del canvas temporal
            const contextoTemporal = lienzoTemporal.getContext('2d');
            
            // Dibuja la porción correspondiente de la imagen original en el canvas temporal
            contextoTemporal.drawImage(
                this.imagenActual, // Imagen fuente
                pieza.origenX, pieza.origenY, pieza.ancho, pieza.alto, // Área de recorte
                0, 0, pieza.ancho, pieza.alto // Posición de destino
            );
            
            // Verifica si el nivel usa filtros mixtos
            if (configuracionNivel.filtro === 'mixed') {
                // Array con los tres tipos de filtros
                const filtros = ['grayscale', 'brightness', 'negative'];
                // Selecciona un filtro diferente para cada pieza usando módulo
                const filtro = filtros[indice % filtros.length];
                // Aplica el filtro seleccionado
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
            // Si es escala de grises
            case 'grayscale':
                // Llama a la función de escala de grises
                aplicarEscalaGrises(contexto, x, y, ancho, alto);
                // Sale del switch
                break;
            // Si es brillo
            case 'brightness':
                // Llama a la función de brillo
                aplicarBrillo(contexto, x, y, ancho, alto);
                // Sale del switch
                break;
            // Si es negativo
            case 'negative':
                // Llama a la función de negativo
                aplicarNegativo(contexto, x, y, ancho, alto);
                // Sale del switch
                break;
        }
    }
    
    // Método que asigna rotaciones aleatorias a todas las piezas
    aleatorizarRotaciones() {
        // Array con las 4 posibles rotaciones
        const rotaciones = [0, 90, 180, 270];
        // Recorre cada pieza
        this.piezas.forEach(pieza => {
            // Asigna una rotación aleatoria del array
            pieza.rotacion = rotaciones[Math.floor(Math.random() * rotaciones.length)];
        });
    }
    
    // Método que maneja los clicks en el canvas
    manejarClickLienzo(evento, direccion) {
        // Obtiene las dimensiones y posición del canvas en la ventana
        const rectangulo = this.lienzo.getBoundingClientRect();
        // Calcula la coordenada X del click dentro del canvas (ajustando por escala)
        const x = (evento.clientX - rectangulo.left) * (this.lienzo.width / rectangulo.width);
        // Calcula la coordenada Y del click dentro del canvas
        const y = (evento.clientY - rectangulo.top) * (this.lienzo.height / rectangulo.height);
        
        // Recorre todas las piezas para encontrar cuál fue clickeada
        for (let pieza of this.piezas) {
            // Verifica si el click está dentro de esta pieza
            if (pieza.contiene(x, y)) {
                // Rota la pieza en la dirección indicada
                pieza.rotar(direccion);
                // Re-renderiza el juego
                this.renderizar();
                // Verifica si el rompecabezas está completo
                this.verificarCompletado();
                // Sale del bucle (solo rota una pieza)
                break;
            }
        }
    }
    
    // Método que usa la ayuda para colocar una pieza correctamente
    usarAyuda() {
        // Si ya se usó la ayuda, no hace nada
        if (this.ayudaUsada) return;
        
        // Filtra las piezas que no están correctas ni bloqueadas
        const piezasIncorrectas = this.piezas.filter(p => !p.estaCorrecta() && !p.estaBloqueada);
        // Si no hay piezas incorrectas, no hace nada
        if (piezasIncorrectas.length === 0) return;
        
        // Selecciona una pieza aleatoria del array de piezas incorrectas
        const piezaAleatoria = piezasIncorrectas[Math.floor(Math.random() * piezasIncorrectas.length)];
        // Coloca la pieza en la rotación correcta
        piezaAleatoria.rotacion = piezaAleatoria.rotacionCorrecta;
        // Bloquea la pieza para que no se pueda rotar más
        piezaAleatoria.estaBloqueada = true;
        
        // Añade 5 segundos de penalización al temporizador
        this.temporizador += 5;
        // Marca que la ayuda fue usada
        this.ayudaUsada = true;
        
        // Muestra un mensaje indicando que se usó la ayuda
        document.getElementById('help-status').innerHTML =
            '<div class="help-used">💡 Ayudita usada: +5 segundos</div>';
        // Deshabilita el botón de ayuda
        document.getElementById('btn-help').disabled = true;
        
        // Re-renderiza el juego
        this.renderizar();
        // Verifica si el rompecabezas está completo
        this.verificarCompletado();
    }
    
    // Método que verifica si todas las piezas están correctamente colocadas
    verificarCompletado() {
        // Verifica si todas las piezas están correctas usando every
        const todasCorrectas = this.piezas.every(p => p.estaCorrecta());
        // Cuenta cuántas piezas están correctas
        const conteoCorrectas = this.piezas.filter(p => p.estaCorrecta()).length;
        // Calcula el porcentaje de progreso
        const progreso = (conteoCorrectas / this.piezas.length) * 100;
        
        // Actualiza el ancho de la barra de progreso
        document.getElementById('progress-fill').style.width = progreso + '%';
        
        // Si todas están correctas
        if (todasCorrectas) {
            // Detiene el temporizador
            this.detenerTemporizador();
            // Muestra la pantalla de victoria
            this.mostrarVictoria();
        }
    }
    
    // Método que muestra la pantalla de victoria
    mostrarVictoria() {
        // Renderiza el juego sin filtros para mostrar la imagen completa
        this.renderizar(false);
        
        // Espera 500ms antes de mostrar la pantalla de victoria
        setTimeout(() => {
            // Cambia a la pantalla de victoria
            this.mostrarPantalla('victory-screen');
            // Calcula los minutos transcurridos
            const minutos = Math.floor(this.temporizador / 60);
            // Calcula los segundos restantes
            const segundos = this.temporizador % 60;
            
            // Muestra el tiempo formateado con ceros a la izquierda si es necesario
            document.getElementById('victory-time').textContent =
                `⏱️ Tiempo: ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            
            // Muestra las estadísticas del nivel completado
            document.getElementById('victory-stats').innerHTML = `
                <p>Nivel ${this.nivelActual} - ${configuracionesNivel[(this.nivelActual - 1) % configuracionesNivel.length].nombre}</p>
                <p>Grid: ${this.filasCuadricula}x${this.columnasCuadricula} (${this.piezas.length} piezas)</p>
                ${this.ayudaUsada ? '<p>⚠️ Ayuda utilizada</p>' : '<p>✨ Sin ayuda - ¡Perfecto!</p>'}
            `;
        }, 500);
    }
    
    // Método que muestra la pantalla de derrota
    mostrarDerrota() {
        // Detiene el temporizador
        this.detenerTemporizador();
        // Cambia a la pantalla de derrota
        this.mostrarPantalla('defeat-screen');
    }
    
    // Método que inicia el temporizador del juego
    iniciarTemporizador() {
        // Resetea el temporizador a 0
        this.temporizador = 0;
        // Actualiza la visualización inicial del temporizador
        this.actualizarVisualizacionTemporizador();
        
        // Crea un intervalo que se ejecuta cada 1000ms (1 segundo)
        this.intervaloTemporizador = setInterval(() => {
            // Incrementa el temporizador en 1 segundo
            this.temporizador++;
            // Actualiza la visualización
            this.actualizarVisualizacionTemporizador();
            
            // Si hay tiempo máximo y se ha alcanzado
            if (this.tiempoMaximo > 0 && this.temporizador >= this.tiempoMaximo) {
                // Muestra la pantalla de derrota
                this.mostrarDerrota();
            }
        }, 1000);
    }
    
    // Método que detiene el temporizador
    detenerTemporizador() {
        // Si existe un intervalo activo
        if (this.intervaloTemporizador) {
            // Limpia el intervalo
            clearInterval(this.intervaloTemporizador);
            // Resetea la referencia a null
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
        
        // Si hay un tiempo máximo configurado
        if (this.tiempoMaximo > 0) {
            // Calcula el tiempo restante
            const restante = this.tiempoMaximo - this.temporizador;
            // Calcula los minutos restantes
            const minRestantes = Math.floor(restante / 60);
            // Calcula los segundos restantes
            const segRestantes = restante % 60;
            
            // Muestra el tiempo restante
            document.getElementById('max-time-display').textContent =
                `⏰ ${minRestantes.toString().padStart(2, '0')}:${segRestantes.toString().padStart(2, '0')}`;
        } else {
            // Si no hay límite, limpia el display de tiempo máximo
            document.getElementById('max-time-display').textContent = '';
        }
    }
    
    // Método que actualiza la visualización del nivel actual
    actualizarVisualizacionNivel() {
        // Obtiene la configuración del nivel actual
        const configuracionNivel = configuracionesNivel[(this.nivelActual - 1) % configuracionesNivel.length];
        // Actualiza el texto mostrando el nivel y su nombre
        document.getElementById('level-display').textContent =
            `Nivel: ${this.nivelActual} - ${configuracionNivel.nombre}`;
    }
    
    // Método que renderiza todas las piezas en el canvas
    renderizar(usarFiltros = true) {
        // Limpia todo el canvas
        this.contexto.clearRect(0, 0, this.lienzo.width, this.lienzo.height);
        // Dibuja cada pieza en el canvas
        this.piezas.forEach(pieza => pieza.dibujar(this.contexto, usarFiltros));
    }
    
    // Método que avanza al siguiente nivel
    siguienteNivel() {
        // Incrementa el nivel actual
        this.nivelActual++;
        // Resetea la selección de imagen
        this.indiceImagenSeleccionada = null;
        // Muestra la pantalla de selección de imagen
        this.mostrarSeleccionImagen();
    }
    
    // Método que permite reintentar el nivel actual
    reintentarNivel() {
        // Resetea la selección de imagen
        this.indiceImagenSeleccionada = null;
        // Muestra la pantalla de selección de imagen
        this.mostrarSeleccionImagen();
    }
    
    // Método que vuelve al menú principal
    volverAlMenu() {
        // Detiene el temporizador si está corriendo
        this.detenerTemporizador();
        // Resetea el nivel a 1
        this.nivelActual = 1;
        // Resetea la selección de imagen
        this.indiceImagenSeleccionada = null;
        // Muestra la pantalla del menú principal
        this.mostrarPantalla('menu-screen');
    }

}
// ====== INICIALIZAR JUEGO ======
// Crea una instancia de la clase Juego cuando se carga el script
const juego = new Juego();