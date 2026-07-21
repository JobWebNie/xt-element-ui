const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const components = [
  'xt-button',
  'xt-input',
  'xt-flex-box',
  'xt-card',
  'xt-card-item',
  'xt-config-provider',
  'xt-text',
  'xt-time',
  'xt-step-price',
  'xt-step-price-item',
  'xt-map',
  'xt-map-provider',
  'xt-grid-box',
  'xt-grid-item',
  'xt-progress',
  'xt-tab-pane',
  'xt-tabs',
  'xt-badge',
  'xt-date-picker',
  'xt-chart',
  'xt-icon',
  'xt-table',
  'xt-list',
  'xt-scroll-arrow',
  'xt-page',
  'xt-select-tree',
  'xt-upload',
  'xt-transfer-tree',
  'xt-form-schema'
]

const libDir = path.join(__dirname, '../lib')

if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true })
}

let successCount = 0
let failCount = 0

components.forEach(name => {
  const entry = `./src/components/${name}/index.js`
  
  if (!fs.existsSync(entry)) {
    console.log(`Skipping ${name} - entry not found`)
    return
  }
  
  console.log(`Building ${name}...`)
  
  try {
    const output = execSync(
      `npx vue-cli-service build --target lib --name ${name} --dest lib/${name} ${entry}`,
      { stdio: ['pipe', 'pipe', 'pipe'], cwd: path.join(__dirname, '..') }
    )
    
    const indexContent = `module.exports = require('./${name}.common.js');`
    fs.writeFileSync(path.join(libDir, name, 'index.js'), indexContent, 'utf-8')
    
    successCount++
    console.log(`✓ ${name} built successfully`)
  } catch (e) {
    failCount++
    console.log(`✗ Failed to build ${name}`)
    console.log(`  Error: ${e.message.substring(0, 200)}`)
  }
})

console.log(`\nBuild completed: ${successCount} success, ${failCount} failed`)