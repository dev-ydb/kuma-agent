'use strict';

const { createSayExecutor } = require('./say');
const { executeStop } = require('./stop');
const { executeFollow } = require('./follow');

function createActionExecutor({ getClient, stateStore, config, logger = console }) {
  const executeSay = createSayExecutor({
    getClient,
    username: config.username
  });

  async function execute(action, context = {}) {
    switch (action.action) {
      case 'say':
        return executeSay(action, context);
      case 'stop':
        return executeStop({ action, context, stateStore, logger });
      case 'follow':
        return executeFollow({ action, context, stateStore, logger });
      case 'unknown':
      default:
        return {
          action: 'unknown',
          input: action.input || ''
        };
    }
  }

  return {
    execute
  };
}

module.exports = {
  createActionExecutor
};
