'use strict';

function normalizeInput(input) {
  return String(input || '').trim();
}

function parseLocalCommand(input, context = {}) {
  const text = normalizeInput(input);

  if (!text) {
    return {
      action: 'unknown',
      input: ''
    };
  }

  const lower = text.toLowerCase();
  const sourceName = context.sourceName || '';

  if (/^(안녕|hello|hi|hey|こんにちは)([!?.,~]*)$/i.test(text)) {
    if (lower.startsWith('こんにちは')) {
      return { action: 'say', message: 'こんにちは!' };
    }

    if (lower.startsWith('hello') || lower.startsWith('hi') || lower.startsWith('hey')) {
      return { action: 'say', message: 'Hello!' };
    }

    return { action: 'say', message: '안녕!' };
  }

  if (/^(멈춰|stop|halt|정지)([!?.,~]*)$/i.test(text)) {
    return { action: 'stop' };
  }

  if (/^(따라와|follow me)([!?.,~]*)$/i.test(text)) {
    return {
      action: 'follow',
      target: sourceName || null
    };
  }

  const followMatch = text.match(/^follow\s+(.+)$/i);
  if (followMatch) {
    return {
      action: 'follow',
      target: followMatch[1].trim()
    };
  }

  return {
    action: 'unknown',
    input: text
  };
}

module.exports = {
  parseLocalCommand
};
