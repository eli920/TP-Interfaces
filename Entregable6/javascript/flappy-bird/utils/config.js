// ============================================
// CONFIGURACIÓN DEL JUEGO
// ============================================

export const CONFIG = {
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 500,
  GRAVITY: 0.5,
  JUMP_FORCE: -6,
  GAME_SPEED: 2,
  OBSTACLE_SPAWN_RATE: 160,
  COLLECTIBLE_SPAWN_RATE: 180,
  TIME_LIMIT: 120, // 2 minutos
  INVULNERABLE_DURATION: 180, // 3 segundos
  EXPLOSION_PARTICLES: 30,
};

export const COLLECTIBLE_TYPES = ['moneda', 'escudo', 'estrella'];

export const COLLECTIBLE_VALUES = {
  moneda: { score: 50 },
  escudo: { invulnerability: 180 },
  estrella: { score: 100, timeBonus: 5 },
};

export const OBSTACLE_CONFIG = {
  WIDTH: 60,
  GAP_HEIGHT: 180,
  MIN_TOP_HEIGHT: 50,
  MAX_TOP_HEIGHT_OFFSET: 100,
};