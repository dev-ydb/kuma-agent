'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

function createStateStore(filePath, initialState = {}) {
  let state = { ...initialState };

  async function load() {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      state = { ...initialState, ...parsed };
    } catch (error) {
      if (error && error.code !== 'ENOENT') {
        throw error;
      }

      state = { ...initialState };
      await save();
    }

    return state;
  }

  async function save(nextState = state) {
    state = { ...nextState };
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
    return state;
  }

  function get() {
    return { ...state };
  }

  async function set(patch) {
    state = { ...state, ...patch };
    return save(state);
  }

  async function update(updater) {
    const nextState = updater({ ...state });
    return save(nextState);
  }

  return {
    load,
    save,
    get,
    set,
    update
  };
}

module.exports = {
  createStateStore
};
