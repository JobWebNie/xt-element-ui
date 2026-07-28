const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log('=== Building main library ===')
execSync(
  'npx vue-cli-service build --target lib --name index --dest lib src/index.js',
  { stdio: 'inherit', cwd: path.join(__dirname, '..') }
)

// 将 theme CSS 文件复制到 lib 目录，供外部直接引用
console.log('=== Copying theme CSS files ===')
const themeSrc = path.join(__dirname, '..', 'src', 'components', 'theme')
const themeDest = path.join(__dirname, '..', 'lib', 'theme')
if (!fs.existsSync(themeDest)) {
  fs.mkdirSync(themeDest, { recursive: true })
}
const cssFiles = fs.readdirSync(themeSrc).filter(f => f.endsWith('.css'))
cssFiles.forEach(file => {
  fs.copyFileSync(
    path.join(themeSrc, file),
    path.join(themeDest, file)
  )
  console.log(`  Copied: lib/theme/${file}`)
})

console.log('\n=== Building individual components ===')
execSync(
  'node scripts/build-components.js',
  { stdio: 'inherit', cwd: path.join(__dirname, '..') }
)

console.log('\n=== Build complete ===')