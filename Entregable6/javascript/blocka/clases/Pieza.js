export class Pieza {
  constructor(
    imagen,
    origenX,
    origenY,
    ancho,
    alto,
    destinoX,
    destinoY,
    fila,
    columna
  ) {
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

  rotar(direccion) {
    if (this.estaBloqueada) return;
    this.rotacion += direccion * 90;
    this.rotacion = ((this.rotacion % 360) + 360) % 360;
  }

  estaCorrecta() {
    return this.rotacion === this.rotacionCorrecta;
  }

  contiene(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.ancho &&
      y >= this.y &&
      y <= this.y + this.alto
    );
  }

  dibujar(contexto, usarFiltro = true) {
    contexto.save();
    contexto.translate(this.x + this.ancho / 2, this.y + this.alto / 2);
    contexto.rotate((this.rotacion * Math.PI) / 180);

    if (usarFiltro && this.lienzoFiltrado) {
      contexto.drawImage(
        this.lienzoFiltrado,
        -this.ancho / 2,
        -this.alto / 2,
        this.ancho,
        this.alto
      );
    } else {
      contexto.drawImage(
        this.imagen,
        this.origenX,
        this.origenY,
        this.ancho,
        this.alto,
        -this.ancho / 2,
        -this.alto / 2,
        this.ancho,
        this.alto
      );
    }

    if (this.estaBloqueada) {
      contexto.strokeStyle = '#4caf50';
      contexto.lineWidth = 4;
      contexto.strokeRect(
        -this.ancho / 2,
        -this.alto / 2,
        this.ancho,
        this.alto
      );
    }

    contexto.restore();
  }
}
