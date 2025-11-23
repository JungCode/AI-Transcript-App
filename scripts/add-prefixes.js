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

    // ✅ Regex match URLs including template literals with ${}
    let updated = code.replace(
      /url:\s*`(\/(?!auth\/|podcast\/|admin\/)([^`]+))`/g,
      (_, urlPath) => `url: \`${prefix}${urlPath}\``,
    );

    // ✅ Update query keys: [`/feeds...`] → [`/podcast/feeds...`]
    updated = updated.replace(
      /return\s*\[\s*`(\/(?!auth\/|podcast\/|admin\/)([^`]+))`/g,
      (_, urlPath) => `return [\`${prefix}${urlPath}\``,
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
