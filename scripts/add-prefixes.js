import fs from 'fs';
import path from 'path';

const API_DIR = './src/shared/api';

console.log('🚀 Running add-prefixes script...');

// Quét tất cả file *Schemas.ts
const schemaFiles = fs
  .readdirSync(API_DIR)
  .filter(file => file.endsWith('Schemas.ts'));

if (schemaFiles.length === 0) {
  console.warn('⚠️ No *Schemas.ts files found in', API_DIR);
  process.exit(0);
}

for (const file of schemaFiles) {
  const absPath = path.resolve(API_DIR, file);
  const prefix = '/' + file.replace('Schemas.ts', '').toLowerCase();

  try {
    let code = fs.readFileSync(absPath, 'utf8');

    // ✅ Regex match cả dấu ', ", `
    const updated = code.replace(
      /url:\s*(['"`])(?!(?:\/auth|\/podcast|\/admin|\/[a-z0-9_-]+\/))([^'"`]+)\1/g,
      (_, quote, urlPath) => `url: \`${prefix}${urlPath}\``,
    );

    if (updated === code) {
      console.log(`✅ No changes needed for ${file}`);
      continue;
    }

    fs.writeFileSync(absPath, updated, 'utf8');
    console.log(`✨ Added prefix "${prefix}" → ${file}`);
  } catch (err) {
    console.error(`❌ Error processing ${file}:`, err);
  }
}

console.log('✅ Prefix injection complete!');
