export class Juego {
  
  constructor(foto, titulo, categoria = null, gratis = null) {
    this.foto = foto;
    this.titulo = titulo;
    this.categoria = categoria;
    this.gratis = gratis;
  }

  obtenerTipo() {
    if (this.gratis === null) return ''; // Para banners sin info
    return this.gratis ? 'Gratis' : 'Pago';
  }
}
