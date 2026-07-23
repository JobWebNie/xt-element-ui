const fs = require('fs')
const path = require('path')

const scssToCssVarMap = {
  '$xt-color-primary': 'var(--xt-color-primary)',
  '$xt-color-primary-light-3': 'var(--xt-color-primary-light-3)',
  '$xt-color-primary-light-5': 'var(--xt-color-primary-light-5)',
  '$xt-color-primary-light-7': 'var(--xt-color-primary-light-7)',
  '$xt-color-primary-light-8': 'var(--xt-color-primary-light-8)',
  '$xt-color-primary-light-9': 'var(--xt-color-primary-light-9)',
  '$xt-color-primary-dark-2': 'var(--xt-color-primary-dark-2)',
  '$xt-color-success': 'var(--xt-color-success)',
  '$xt-color-success-light-3': 'var(--xt-color-success-light-3)',
  '$xt-color-success-light-5': 'var(--xt-color-success-light-5)',
  '$xt-color-success-light-7': 'var(--xt-color-success-light-7)',
  '$xt-color-success-light-8': 'var(--xt-color-success-light-8)',
  '$xt-color-success-light-9': 'var(--xt-color-success-light-9)',
  '$xt-color-success-dark-2': 'var(--xt-color-success-dark-2)',
  '$xt-color-warning': 'var(--xt-color-warning)',
  '$xt-color-warning-light-3': 'var(--xt-color-warning-light-3)',
  '$xt-color-warning-light-5': 'var(--xt-color-warning-light-5)',
  '$xt-color-warning-light-7': 'var(--xt-color-warning-light-7)',
  '$xt-color-warning-light-8': 'var(--xt-color-warning-light-8)',
  '$xt-color-warning-light-9': 'var(--xt-color-warning-light-9)',
  '$xt-color-warning-dark-2': 'var(--xt-color-warning-dark-2)',
  '$xt-color-danger': 'var(--xt-color-danger)',
  '$xt-color-danger-light-3': 'var(--xt-color-danger-light-3)',
  '$xt-color-danger-light-5': 'var(--xt-color-danger-light-5)',
  '$xt-color-danger-light-7': 'var(--xt-color-danger-light-7)',
  '$xt-color-danger-light-8': 'var(--xt-color-danger-light-8)',
  '$xt-color-danger-light-9': 'var(--xt-color-danger-light-9)',
  '$xt-color-danger-dark-2': 'var(--xt-color-danger-dark-2)',
  '$xt-color-info': 'var(--xt-color-info)',
  '$xt-color-info-light-3': 'var(--xt-color-info-light-3)',
  '$xt-color-info-light-5': 'var(--xt-color-info-light-5)',
  '$xt-color-info-light-7': 'var(--xt-color-info-light-7)',
  '$xt-color-info-light-8': 'var(--xt-color-info-light-8)',
  '$xt-color-info-light-9': 'var(--xt-color-info-light-9)',
  '$xt-color-info-dark-2': 'var(--xt-color-info-dark-2)',
  '$xt-bg-color': 'var(--xt-bg-color)',
  '$xt-bg-color-page': 'var(--xt-bg-color-page)',
  '$xt-bg-color-overlay': 'var(--xt-bg-color-overlay)',
  '$xt-bg-color-block': 'var(--xt-bg-color-block)',
  '$xt-text-color-primary': 'var(--xt-text-color-primary)',
  '$xt-text-color-regular': 'var(--xt-text-color-regular)',
  '$xt-text-color-secondary': 'var(--xt-text-color-secondary)',
  '$xt-text-color-placeholder': 'var(--xt-text-color-placeholder)',
  '$xt-text-color-disabled': 'var(--xt-text-color-disabled)',
  '$xt-border-color': 'var(--xt-border-color)',
  '$xt-border-color-light': 'var(--xt-border-color-light)',
  '$xt-border-color-lighter': 'var(--xt-border-color-lighter)',
  '$xt-fill-color': 'var(--xt-fill-color)',
  '$xt-fill-color-light': 'var(--xt-fill-color-light)'
}

const componentsDir = path.join(__dirname, '../src/components')

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let changed = false
  
  for (const [scssVar, cssVar] of Object.entries(scssToCssVarMap)) {
    if (content.includes(scssVar)) {
      content = content.split(scssVar).join(cssVar)
      changed = true
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`Converted: ${filePath}`)
  }
}

function traverseDir(dir) {
  const entries = fs.readdirSync(dir)
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      traverseDir(fullPath)
    } else if (entry.endsWith('.scss')) {
      convertFile(fullPath)
    }
  }
}

traverseDir(componentsDir)
console.log('\nConversion complete!')