const { join } = require('path');

/**
 * Resolution map for the `@common/*` workspace libraries.
 *
 * These used to be resolved by webpack via the `paths` + `baseUrl` pair in
 * tsconfig.base.json. `baseUrl` is deprecated and stops working in TypeScript 7,
 * and the tsconfig-paths webpack resolver cannot handle `./`-prefixed path
 * targets without it, so bundler-side resolution is declared explicitly here.
 *
 * tsconfig `paths` are still required — they are what typechecking and the
 * editor use. Both lists must stay in sync when a library is added or moved.
 */
const libs = [
  'configuration',
  'constants',
  'decorators',
  'entities',
  'interceptors',
  'interfaces',
  'middlewares',
  'schemas',
  'utils',
];

/**
 * @param {string} appDir absolute path of the app's directory (pass __dirname)
 * @returns {Record<string, string>} webpack `resolve.alias` entries
 */
function commonAliases(appDir) {
  return libs.reduce((aliases, lib) => {
    aliases[`@common/${lib}`] = join(appDir, '../../libs', lib, 'src/lib');
    return aliases;
  }, {});
}

module.exports = { commonAliases };
