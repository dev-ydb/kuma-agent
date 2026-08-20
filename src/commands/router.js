'use strict';

const { parseLocalCommand } = require('./parser');

function createCommandRouter({ provider, executor, logger = console }) {
  async function route(input, context = {}) {
    const localAction = parseLocalCommand(input, context);

    if (localAction.action !== 'unknown') {
      return executor.execute(localAction, context);
    }

    if (provider && typeof provider.generateAction === 'function') {
      const aiAction = await provider.generateAction({
        input,
        context
      });

      if (aiAction && aiAction.action && aiAction.action !== 'unknown') {
        return executor.execute(aiAction, context);
      }
    }

    logger.log(`[router] unknown command: ${input}`);
    return { action: 'unknown', input };
  }

  return {
    route
  };
}

module.exports = {
  createCommandRouter
};
