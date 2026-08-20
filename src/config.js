'use strict';

function parseBoolean(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
}

function parseInteger(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function loadConfig(env = process.env) {
  return {
    host: env.MC_HOST || '127.0.0.1',
    port: parseInteger(env.MC_PORT, 19132),
    username: env.MC_USERNAME || 'Kuma',
    offline: parseBoolean(env.MC_OFFLINE, true),
    version: env.MC_VERSION && env.MC_VERSION.trim() ? env.MC_VERSION.trim() : undefined,
    prefix: env.BOT_PREFIX || 'Kuma',
    reconnectDelayMs: parseInteger(env.RECONNECT_DELAY_MS, 5000),
    reconnectMaxDelayMs: parseInteger(env.RECONNECT_MAX_DELAY_MS, 60000),
    stateFile: env.STATE_FILE || 'data/state.json'
  };
}

module.exports = {
  loadConfig,
  parseBoolean,
  parseInteger
};
