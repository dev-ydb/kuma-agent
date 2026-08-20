'use strict';

const bedrock = require('bedrock-protocol');
const { normalizeChatPacket } = require('./chat');

function createMinecraftBot({ config, onChat, onSpawn, onReady, onClose, onError, logger = console }) {
  let client = null;
  let reconnectTimer = null;
  let reconnectAttempt = 0;
  let stopping = false;

  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function nextReconnectDelay() {
    const base = Math.max(1000, config.reconnectDelayMs);
    const max = Math.max(base, config.reconnectMaxDelayMs);
    const delay = Math.min(max, base * Math.pow(2, reconnectAttempt));
    reconnectAttempt = Math.min(reconnectAttempt + 1, 6);
    return delay;
  }

  function scheduleReconnect(reason) {
    if (stopping) {
      return;
    }

    clearReconnectTimer();

    const delay = nextReconnectDelay();
    logger.warn(`[minecraft] reconnecting in ${delay}ms${reason ? ` (${reason})` : ''}`);

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, delay);
  }

  function bindClientEvents(instance) {
    instance.on('login', () => {
      logger.log('[minecraft] login successful');
    });

    instance.on('join', () => {
      logger.log('[minecraft] joined server');
      reconnectAttempt = 0;
      if (typeof onReady === 'function') {
        onReady(instance);
      }
    });

    instance.on('spawn', () => {
      logger.log('[minecraft] spawn event received');
      if (typeof onSpawn === 'function') {
        onSpawn(instance);
      }
    });

    instance.on('text', (packet) => {
      const chat = normalizeChatPacket(packet, {
        prefix: config.prefix,
        username: config.username
      });

      if (!chat) {
        return;
      }

      if (typeof onChat === 'function') {
        onChat(chat, instance);
      }
    });

    instance.on('error', (error) => {
      logger.error('[minecraft] client error:', error);
      if (typeof onError === 'function') {
        onError(error, instance);
      }
    });

    instance.on('close', (reason) => {
      logger.warn('[minecraft] connection closed:', reason);
      if (typeof onClose === 'function') {
        onClose(reason, instance);
      }
      client = null;
      scheduleReconnect(reason);
    });
  }

  function connect() {
    if (stopping) {
      return null;
    }

    clearReconnectTimer();
    logger.log(`[minecraft] connecting to ${config.host}:${config.port} as ${config.username}`);

    try {
      client = bedrock.createClient({
        host: config.host,
        port: config.port,
        username: config.username,
        offline: config.offline,
        version: config.version
      });

      bindClientEvents(client);
      return client;
    } catch (error) {
      logger.error('[minecraft] failed to create client:', error);
      scheduleReconnect(error && error.message ? error.message : 'client creation failure');
      return null;
    }
  }

  async function stop() {
    stopping = true;
    clearReconnectTimer();

    if (client) {
      try {
        client.close();
      } catch (error) {
        logger.error('[minecraft] error while closing client:', error);
      }
      client = null;
    }
  }

  return {
    connect,
    stop,
    get client() {
      return client;
    }
  };
}

module.exports = {
  createMinecraftBot
};
