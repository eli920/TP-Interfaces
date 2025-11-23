export class Parallax {
  constructor() {
    this.scroll = 0;
    this.inicializado = false;
    this.layers = [];
  }

  inicializar() {
    // Buscar las 12 capas del parallax (de layer1 a layer12) con velocidades progresivas
    this.layers = [
      { el: document.querySelector('.layer1'), speed: 0.1 },   // Cielo más lejano
      { el: document.querySelector('.layer2'), speed: 0.2 },   
      { el: document.querySelector('.layer3'), speed: 0.3 },   
      { el: document.querySelector('.layer4'), speed: 0.5 },   
      { el: document.querySelector('.layer5'), speed: 0.7 },   
      { el: document.querySelector('.layer6'), speed: 0.9 },   
      { el: document.querySelector('.layer7'), speed: 1.1 },   
      { el: document.querySelector('.layer8'), speed: 1.3 },   
      { el: document.querySelector('.layer9'), speed: 1.5 },   
      { el: document.querySelector('.layer10'), speed: 1.7 },  
      { el: document.querySelector('.layer11'), speed: 1.9 },  
      { el: document.querySelector('.layer12'), speed: 2.1 },  // Primer plano más cercano
    ];
    
    // Resetear posición y duplicar imágenes para loop infinito
    this.scroll = 0;
    this.layers.forEach(layer => {
      if (layer.el) {
        layer.el.style.transform = 'translateX(0px)';
        
        // Duplicar la imagen para crear efecto infinito
        const clone = layer.el.cloneNode(true);
        clone.classList.add('layer-clone');
        layer.el.parentElement.appendChild(clone);
        layer.clone = clone;
        layer.width = layer.el.offsetWidth;
      }
    });
    
    this.inicializado = true;
  }

  actualizar() {
    if (!this.inicializado) return;
    
    this.scroll -= 2;
    
    this.layers.forEach(layer => {
      if (layer.el && layer.clone) {
        const movement = this.scroll * layer.speed;
        const width = layer.width;
        
        // Calcular posición con loop infinito
        const position = movement % width;
        
        // Mover ambas imágenes (original y clon)
        layer.el.style.transform = `translateX(${position}px)`;
        layer.clone.style.transform = `translateX(${position + width}px)`;
      }
    });
  }
}