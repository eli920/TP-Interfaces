import { Pieza } from './Pieza.js';

export class Tablero {
  constructor(imagenes, tipoFicha = 0) {
    this.tamanio = 7;
    this.imagenes = imagenes;
    this.matriz = [
      [-1, -1, 1, 1, 1, -1, -1],
      [-1, -1, 1, 1, 1, -1, -1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [-1, -1, 1, 1, 1, -1, -1],
      [-1, -1, 1, 1, 1, -1, -1],
    ];
    this.piezas = [];
    this.tipoFichaActual = tipoFicha;
    this.inicializarPiezas(tipoFicha);
  }

  inicializarPiezas(tipoFicha = 0) {
    this.piezas = [];
    for (let i = 0; i < this.tamanio; i++) {
      for (let j = 0; j < this.tamanio; j++) {
        if (this.matriz[i][j] === 1) {
          this.piezas.push(
            new Pieza(i, j, tipoFicha, this.imagenes.fichas[tipoFicha])
          );
        }
      }
    }
  }

  esPositionValida(fila, col) {
    return (
      fila >= 0 &&
      fila < this.tamanio &&
      col >= 0 &&
      col < this.tamanio &&
      this.matriz[fila][col] !== -1
    );
  }

  obtenerPieza(fila, col) {
    return (
      this.piezas.find((p) => p.fila === fila && p.columna === col) || null
    );
  }

  esMovimientoValido(desdeF, desdeC, hastaF, hastaC) {
    if (!this.esPositionValida(hastaF, hastaC)) return false;
    if (this.obtenerPieza(hastaF, hastaC)) return false;

    const difF = hastaF - desdeF;
    const difC = hastaC - desdeC;

    if (
      (Math.abs(difF) === 2 && difC === 0) ||
      (Math.abs(difC) === 2 && difF === 0)
    ) {
      const medioF = desdeF + difF / 2;
      const medioC = desdeC + difC / 2;
      return this.obtenerPieza(medioF, medioC) !== null;
    }
    return false;
  }

  obtenerMovimientosValidos(fila, col) {
    const movimientos = [];
    const direcciones = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ];

    for (const [difF, difC] of direcciones) {
      const nuevaF = fila + difF;
      const nuevaC = col + difC;
      if (this.esMovimientoValido(fila, col, nuevaF, nuevaC)) {
        movimientos.push({ fila: nuevaF, col: nuevaC });
      }
    }
    return movimientos;
  }

  realizarMovimiento(desdeF, desdeC, hastaF, hastaC) {
    if (!this.esMovimientoValido(desdeF, desdeC, hastaF, hastaC)) {
      return false;
    }

    const pieza = this.obtenerPieza(desdeF, desdeC);
    pieza.fila = hastaF;
    pieza.columna = hastaC;

    const medioF = desdeF + (hastaF - desdeF) / 2;
    const medioC = desdeC + (hastaC - desdeC) / 2;
    const idx = this.piezas.findIndex(
      (p) => p.fila === medioF && p.columna === medioC
    );
    if (idx !== -1) {
      this.piezas.splice(idx, 1);
    }
    return true;
  }

  hayMovimientosPosibles() {
    for (const pieza of this.piezas) {
      if (
        this.obtenerMovimientosValidos(pieza.fila, pieza.columna).length > 0
      ) {
        return true;
      }
    }
    return false;
  }

  verificarVictoria() {
    return (
      this.piezas.length === 1 &&
      this.piezas[0].fila === 3 &&
      this.piezas[0].columna === 3
    );
  }
}
