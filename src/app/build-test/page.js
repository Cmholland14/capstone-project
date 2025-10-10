// Build diagnostics for Vercel
console.log('=== BUILD DIAGNOSTICS ===');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Working directory:', process.cwd());
console.log('Environment:', process.env.NODE_ENV);

// Test if path resolution works
try {
  console.log('Testing path resolution...');
  const path = require('path');
  console.log('Src path exists:', require('fs').existsSync(path.join(process.cwd(), 'src')));
  console.log('Models path exists:', require('fs').existsSync(path.join(process.cwd(), 'src/lib/models')));
  
  // List model files
  const modelFiles = require('fs').readdirSync(path.join(process.cwd(), 'src/lib/models'));
  console.log('Model files found:', modelFiles);
} catch (e) {
  console.error('Path resolution test failed:', e.message);
}

export default function BuildTest() {
  return <div>Build test page</div>;
}