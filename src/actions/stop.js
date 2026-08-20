'use strict';

async function executeStop({ stateStore }) {
  await stateStore.update((state) => ({
    ...state,
    followTarget: null,
    lastAction: 'stop',
    lastUpdatedAt: new Date().toISOString()
  }));

  return {
    action: 'stop'
  };
}

module.exports = {
  executeStop
};
