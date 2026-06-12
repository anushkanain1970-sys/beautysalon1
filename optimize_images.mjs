import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = 'c:/Users/anush/OneDrive/Documents/beautywebsite/public/photos';
const files = fs.readdirSync(dir);

async function optimizeImages() {
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
      const inputPath = path.join(dir, file);
      const outputPath = path.join(dir, file.replace(/\.(jpg|png|jpeg)$/i, '.webp'));
      
      console.log(`Converting ${file} to WebP...`);
      try {
        await sharp(inputPath)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err);
      }
    }
  }
  console.log('Image optimization complete.');
}

optimizeImages();
