import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
const context = { window: {} };
vm.runInNewContext(readFileSync(new URL('../assets/js/gallery-data.js', import.meta.url), 'utf8'), context);
const photos = context.window.GALLERY.flatMap(post => post.images || (post.image ? [post.image] : []));
writeFileSync(new URL('./photos.json', import.meta.url), JSON.stringify([...new Set(photos)], null, 2) + '\n');
console.log(`Registered ${photos.length} gallery photos`);
