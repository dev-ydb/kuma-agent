'use strict';

const path = require('node:path');
const { loadConfig } = require('./config');
const { createStateStore } = require('./state/store');
const { createAiProvider } = require('./ai/provider');
const { createActionExecutor } = require('./actions/executor');
const { createCommandRouter } = require('./commands/router');
const { createMinecraftBot } = require('./minecraft/client');

async function main() {
  const config = loadConfig();
  const stateStore = createStateStore(path.resolve(process.cwd(), config.stateFile), {
    followTarget: null,
    lastAction: null,
    lastUpdatedAt: null
  });

  await stateStore.load();

  const aiProvider = createAiProvider();
  let currentClient = null;
  let bot;

  const executor = createActionExecutor({
    config,
    stateStore,
    getClient: () => currentClient
  });

  const router = createCommandRouter({
    provider: aiProvider,
    executor,
    logger: console
  });

  bot = createMinecraftBot({
    config,
    logger: console,
    onChat: async (chat, client) => {
      currentClient = client;
      await router.route(chat.input, chat);
    },
    onReady: () => {
      console.log('[app] bot is ready');
    },
    onSpawn: () => {
      console.log('[app] spawn confirmed');
    },
    onClose: (reason) => {
      console.log('[app] disconnected:', reason);
    },
    onError: (error) => {
      console.error('[app] error:', error);
    }
  });

  bot.connect();

  async function shutdown(signal) {
    console.log(`[app] received ${signal}, shutting down`);
    await bot.stop();
    await stateStore.save();
    process.exit(0);
  }

  process.once('SIGINT', () => {
    shutdown('SIGINT').catch((error) => {
      console.error('[app] shutdown error:', error);
      process.exit(1);
    });
  });

  process.once('SIGTERM', () => {
    shutdown('SIGTERM').catch((error) => {
      console.error('[app] shutdown error:', error);
      process.exit(1);
    });
  });
}

main().catch((error) => {
  console.error('[app] fatal error:', error);
  process.exit(1);
});
