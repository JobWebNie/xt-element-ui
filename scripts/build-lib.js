const { execSync } = require('child_process')
const path = require('path')

console.log('=== Building main library ===')
execSync(
  'npx vue-cli-service build --target lib --name index --dest lib src/index.js',
  { stdio: 'inherit', cwd: path.join(__dirname, '..') }
)

console.log('\n=== Building individual components ===')
execSync(
  'node scripts/build-components.js',
  { stdio: 'inherit', cwd: path.join(__dirname, '..') }
)

console.log('\n=== Build complete ===')