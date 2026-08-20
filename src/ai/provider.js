'use strict';

function createAiProvider() {
  return {
    name: 'stub',
    async generateAction() {
      return null;
    }
  };
}

module.exports = {
  createAiProvider
};
