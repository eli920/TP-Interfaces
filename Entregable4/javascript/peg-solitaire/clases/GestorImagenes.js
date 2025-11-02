// Configuración de imágenes (copiada aquí para no depender de main.js)
const CONFIG_IMAGENES = {
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

export class GestorImagenes {
  constructor() {
    this.imagenes = { fondos: [], fichas: [] };
    this.cargaCompleta = false;
  }

  async cargarTodasLasImagenes() {
    const promesas = [];

    for (let i = 0; i < CONFIG_IMAGENES.fondosDisponibles.length; i++) {
      promesas.push(
        this.cargarImagen(CONFIG_IMAGENES.fondosDisponibles[i]).then((img) => {
          this.imagenes.fondos[i] = img;
        })
      );
    }

    for (let i = 0; i < CONFIG_IMAGENES.fichas.length; i++) {
      promesas.push(
        this.cargarImagen(CONFIG_IMAGENES.fichas[i]).then((img) => {
          this.imagenes.fichas[i] = img;
        })
      );
    }

    await Promise.all(promesas);
    this.cargaCompleta = true;
    return this.imagenes;
  }

  cargarImagen(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(this.crearImagenRespaldo());
      img.src = url;
    });
  }

  crearImagenRespaldo() {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#64b5f6';
    ctx.beginPath();
    ctx.arc(50, 50, 40, 0, Math.PI * 2);
    ctx.fill();
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }
}
