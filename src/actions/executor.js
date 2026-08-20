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
    let result;

    switch (action.action) {
      case 'say':
        result = await executeSay(action, context);
        break;
      case 'stop':
        result = await executeStop({ action, context, stateStore, logger });
        break;
      case 'follow':
        result = await executeFollow({ action, context, stateStore, logger });
        break;
      case 'unknown':
      default:
        result = {
          action: 'unknown',
          input: action.input || ''
        };
        break;
    }

    return result;
  }

  return {
    execute
  };
}

module.exports = {
  createActionExecutor
};
