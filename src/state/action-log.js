'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

function escapeCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

function normalizeCell(value) {
  return escapeCell(value).trim();
}

function formatDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTimestamp(date = new Date()) {
  return date.toISOString();
}

function createTableHeader(dateKey) {
  return [
    `# Kuma Action Log - ${dateKey}`,
    '',
    '| Time | Kind | Source | Raw Message | Parsed Input | Action | Result | Target | Note |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'
  ].join('\n');
}

function createRow(entry, timestamp) {
  return [
    `| ${normalizeCell(timestamp)} |`,
    ` ${normalizeCell(entry.kind || 'chat')} |`,
    ` ${normalizeCell(entry.sourceName || '')} |`,
    ` ${normalizeCell(entry.rawMessage || '')} |`,
    ` ${normalizeCell(entry.input || '')} |`,
    ` ${normalizeCell(entry.action || '')} |`,
    ` ${normalizeCell(entry.result || '')} |`,
    ` ${normalizeCell(entry.target || '')} |`,
    ` ${normalizeCell(entry.note || '')} |`
  ].join('');
}

function createActionLog(dirPath) {
  async function ensureFile(filePath, dateKey) {
    try {
      await fs.access(filePath);
    } catch (error) {
      if (error && error.code !== 'ENOENT') {
        throw error;
      }

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, `${createTableHeader(dateKey)}\n\n`, 'utf8');
    }
  }

  async function append(entry) {
    const now = new Date();
    const dateKey = formatDateKey(now);
    const filePath = path.join(dirPath, `${dateKey}.md`);
    await ensureFile(filePath, dateKey);
    const row = createRow(entry, formatTimestamp(now));
    await fs.appendFile(filePath, `${row}\n`, 'utf8');
  }

  return {
    append
  };
}

module.exports = {
  createActionLog,
  formatDateKey
};
