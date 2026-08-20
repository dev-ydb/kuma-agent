'use strict';

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripBotPrefix(message, prefix) {
  const text = String(message || '').trim();
  const botPrefix = String(prefix || '').trim();

  if (!text || !botPrefix) {
    return null;
  }

  const pattern = new RegExp(`^${escapeRegExp(botPrefix)}(?:\\s+|$)`);
  if (!pattern.test(text)) {
    return null;
  }

  return text.replace(pattern, '').trim();
}

function normalizeChatPacket(packet, { prefix, username }) {
  if (!packet || typeof packet.message !== 'string') {
    return null;
  }

  if (packet.source_name && username && packet.source_name === username) {
    return null;
  }

  const input = stripBotPrefix(packet.message, prefix);
  if (input === null) {
    return null;
  }

  if (!input) {
    return null;
  }

  return {
    sourceName: packet.source_name || '',
    input,
    rawMessage: packet.message,
    packet
  };
}

module.exports = {
  stripBotPrefix,
  normalizeChatPacket
};
