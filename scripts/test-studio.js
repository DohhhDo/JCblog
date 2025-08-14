#!/usr/bin/env node

/**
 * Test script to verify Sanity Studio configuration
 * This helps isolate plugin-related issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Sanity Studio configuration...\n');

// Check if sanity.config.ts exists
const configPath = path.join(process.cwd(), 'sanity.config.ts');
if (!fs.existsSync(configPath)) {
  console.error('❌ sanity.config.ts not found');
  process.exit(1);
}

console.log('✅ sanity.config.ts found');

// Check package.json for dependencies
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log('\n📦 Sanity-related dependencies:');
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  Object.keys(deps)
    .filter(dep => dep.includes('sanity'))
    .forEach(dep => {
      console.log(`   ${dep}: ${deps[dep]}`);
    });
}

// Test plugin loading
console.log('\n🔌 Testing plugin imports...');

const plugins = [
  '@sanity/code-input',
  '@sanity/vision', 
  'sanity-plugin-media',
  'sanity-plugin-markdown'
];

plugins.forEach(plugin => {
  try {
    require.resolve(plugin);
    console.log(`✅ ${plugin} - available`);
  } catch (error) {
    console.log(`❌ ${plugin} - not available: ${error.message}`);
  }
});

// Test markdown plugin specifically
console.log('\n📝 Testing markdown plugin...');
try {
  const markdownPlugin = require('sanity-plugin-markdown');
  console.log('✅ sanity-plugin-markdown loaded');
  
  if (markdownPlugin.markdownSchema) {
    console.log('✅ markdownSchema function available');
    
    // Test if we can call it
    try {
      const schema = markdownPlugin.markdownSchema();
      console.log('✅ markdownSchema() callable');
      console.log('   Plugin name:', schema.name || 'unnamed');
    } catch (err) {
      console.log('❌ markdownSchema() failed:', err.message);
    }
  } else {
    console.log('❌ markdownSchema function not found');
  }
} catch (error) {
  console.log('❌ Failed to load sanity-plugin-markdown:', error.message);
}

console.log('\n🎯 Test completed!');
console.log('\nRecommendations:');
console.log('1. If markdown plugin fails, Studio should work without it');
console.log('2. Check for version compatibility issues');
console.log('3. Consider upgrading to latest compatible versions');
