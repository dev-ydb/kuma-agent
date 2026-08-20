'use strict';

async function executeFollow({ action, stateStore }) {
  await stateStore.update((state) => ({
    ...state,
    followTarget: action.target || null,
    lastAction: 'follow',
    lastUpdatedAt: new Date().toISOString()
  }));

  return {
    action: 'follow',
    target: action.target || null
  };
}

module.exports = {
  executeFollow
};
