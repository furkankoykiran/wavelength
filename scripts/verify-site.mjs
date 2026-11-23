#!/usr/bin/env node

/**
 * Verify the static site before it is deployed. There is no bundler here, so
 * this is the only gate that catches a broken head, a missing discovery file or
 * a local asset that index.html references but the repository does not contain.
 */

import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const CANONICAL = 'https://furkankoykiran.com.tr/wavelength/';
const LOCALES = ['en', 'tr', 'es', 'zh', 'hi', 'pt', 'bn', 'ru', 'ja', 'vi'];

const read = (file) => fs.readFile(resolve(ROOT, file), 'utf8');
const exists = (file) =>
  fs
    .access(resolve(ROOT, file))
    .then(() => true)
    .catch(() => false);

async function main() {
  const html = await read('index.html');
  const problems = [];

  if (!html.includes('<html lang="en"')) problems.push('document language must be English');
  const title = html.match(/<title>([^<]+)<\/title>/);
  if (!title) problems.push('title is missing');
  else if (title[1].length < 10 || title[1].length > 70) {
    problems.push(`title should be 10-70 characters, got ${title[1].length}`);
  }

  const description = html.match(/<meta name="description" content="([^"]+)"/);
  if (!description) problems.push('meta description is missing');
  else if (description[1].length < 50 || description[1].length > 200) {
    problems.push(`meta description should be 50-200 characters, got ${description[1].length}`);
  }

  if (!html.includes(`rel="canonical" href="${CANONICAL}"`)) {
    problems.push('canonical URL is missing or wrong');
  }
  if (!html.includes(`property="og:image" content="${CANONICAL}og-image.png"`)) {
    problems.push('Open Graph image is missing or not absolute');
  }
  if (!html.includes('name="twitter:card"')) problems.push('Twitter card is missing');
  if (!html.includes('application/ld+json')) problems.push('JSON-LD is missing');

  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLd) {
    try {
      const data = JSON.parse(jsonLd[1]);
      const types = (data['@graph'] ?? [data]).map((node) => node['@type']);
      if (!types.includes('WebApplication')) problems.push('WebApplication schema is missing');
      if (!types.includes('Game')) problems.push('Game schema is missing');
    } catch (error) {
      problems.push(`JSON-LD does not parse: ${error.message}`);
    }
  }

  const required = [
    'index.html',
    '.nojekyll',
    'robots.txt',
    'sitemap.xml',
    'llms.txt',
    'ai.txt',
    'manifest.webmanifest',
    '.well-known/security.txt',
    'og-image.png',
    'images/favicon.ico',
    'images/logo-160.png',
  ];
  const checks = await Promise.all(required.map(exists));
  required.forEach((file, index) => {
    if (!checks[index]) problems.push(`${file} is missing`);
  });

  // Every local src/href must resolve inside the repository.
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((ref) => !/^(?:https?:|mailto:|#|data:)/.test(ref))
    .map((ref) => ref.split(/[?#]/)[0]);
  for (const ref of new Set(refs)) {
    if (!(await exists(ref))) problems.push(`referenced file does not exist: ${ref}`);
  }

  // Locale files are fetched at runtime, so they are not in index.html.
  for (const locale of LOCALES) {
    if (!(await exists(`locales/${locale}.json`))) problems.push(`locales/${locale}.json is missing`);
  }

  if (problems.length > 0) {
    throw new Error(`Site verification failed:\n- ${problems.join('\n- ')}`);
  }

  console.log('Verified site: metadata, structured data, discovery files and local assets are present.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
