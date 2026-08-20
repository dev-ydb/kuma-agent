'use strict';

function createSayExecutor({ getClient, username, logger = console }) {
  return async function executeSay(action) {
    const message = String(action.message || '').trim();

    if (!message) {
      return { action: 'say', skipped: true };
    }

    const client = typeof getClient === 'function' ? getClient() : null;
    if (!client) {
      logger.warn('[actions] cannot say without an active Minecraft client');
      return { action: 'say', skipped: true };
    }

    client.queue('text', {
      type: 'chat',
      needs_translation: false,
      source_name: username,
      xuid: '',
      platform_chat_id: '',
      filtered_message: '',
      message
    });

    return {
      action: 'say',
      message
    };
  };
}

module.exports = {
  createSayExecutor
};
