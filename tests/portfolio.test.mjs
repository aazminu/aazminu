import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROFILE_ROOT = path.resolve(__dirname, '..');

function resolveSiteRoot() {
  const candidates = [
    process.env.PORTFOLIO_SITE_DIR,
    path.resolve(PROFILE_ROOT, 'abdullahazmi.com'),
    path.resolve(PROFILE_ROOT, '../../abdullahazmi.com'),
    path.resolve(PROFILE_ROOT, '../abdullahazmi.com')
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'index.html')) && fs.existsSync(path.join(candidate, 'lab/index.html'))) {
      return candidate;
    }
  }
  return null;
}

const SITE_ROOT = resolveSiteRoot();

const CORE_16_REPOS = [
  'paper-pulse',
  'chrom-alphagenome',
  'bayes-kalman-trace',
  'fold-energetics-xtb',
  'airtight-container',
  'LeadAI',
  'odyssey',
  'mermaid',
  'FarmData2',
  'data-cleaning-hackumass',
  'python-riscv-simulator',
  'dividend-capture-spark',
  'world-model-compression-mpc',
  'adaptive-ml-moderation',
  'agentic-scrape-repair',
  'movie-recc'
];

const ADDITIONAL_6_REPOS = [
  'sp500_platform',
  'AP-Study-Guide-Generator',
  'Environmental-Disaster-Classifier',
  'grab-pic',
  'comic-subscription',
  'motorcycle-rideability-index'
];

const ALL_22_REPOS = [...CORE_16_REPOS, ...ADDITIONAL_6_REPOS];

const HTML_PAGES = [
  { route: '/', relPath: 'index.html', canonical: 'https://abdullahazmi.com/' },
  { route: '/lab/', relPath: 'lab/index.html', canonical: 'https://abdullahazmi.com/lab/' },
  { route: '/research/', relPath: 'research/index.html', canonical: 'https://abdullahazmi.com/lab/' }
];

export function extractJsonLdBlocks(htmlContent) {
  if (typeof htmlContent !== 'string' || htmlContent.trim() === '') {
    return [];
  }
  const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

export function extractRelativeAssetRefs(htmlContent) {
  if (typeof htmlContent !== 'string' || htmlContent.trim() === '') {
    return [];
  }
  const regex = /\b(?:src|href)=["']([^"']+)["']/gi;
  const refs = [];
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const raw = match[1].trim();
    if (
      !raw ||
      raw.startsWith('http://') ||
      raw.startsWith('https://') ||
      raw.startsWith('mailto:') ||
      raw.startsWith('tel:') ||
      raw.startsWith('data:') ||
      raw.startsWith('#')
    ) {
      continue;
    }
    const cleanPath = raw.split('#')[0].split('?')[0];
    if (cleanPath) {
      refs.push(cleanPath);
    }
  }
  return refs;
}

export function mapSitemapUrlToLocalPath(locUrl) {
  const prefix = 'https://abdullahazmi.com/';
  if (typeof locUrl !== 'string' || !locUrl.startsWith(prefix)) {
    throw new Error(`Invalid domain in sitemap loc: ${locUrl}`);
  }
  const subPath = locUrl.slice(prefix.length);
  if (subPath === '' || subPath.endsWith('/')) {
    return path.posix.join(subPath, 'index.html');
  }
  return subPath;
}

test('Profile README.md contains all 22 standalone repository links, portal badges, and institutional metadata', () => {
  const readmePath = path.join(PROFILE_ROOT, 'README.md');
  assert.ok(fs.existsSync(readmePath), 'Profile README.md must exist');
  const readme = fs.readFileSync(readmePath, 'utf8');

  assert.ok(readme.includes('Computational Genomics & Agentic Systems (CGAS) Lab'), 'Must include CGAS Lab heading');
  assert.ok(readme.includes('Northwestern University'), 'Must include Northwestern University affiliation');
  assert.ok(readme.includes('https://abdullahazmi.com/'), 'Must link to main portfolio https://abdullahazmi.com/');
  assert.ok(readme.includes('https://abdullahazmi.com/lab/'), 'Must link to lab portal https://abdullahazmi.com/lab/');
  assert.ok(readme.includes('https://abdullahazmi.com/#workbench'), 'Must link to interactive workbench');
  assert.ok(readme.includes('https://abdullahazmi.com/assets/abdullah-azmi-resume.pdf'), 'Must link to CV PDF');
  assert.ok(readme.includes('https://orcid.org/0009-0004-8172-6394'), 'Must link to ORCID');
  assert.ok(readme.includes('mailto:m4u5t4@u.northwestern.edu'), 'Must include institutional email');
  assert.ok(
    !readme.includes('?tab=repositories'),
    'Profile README.md must link directly to standalone repositories without ?tab=repositories fallbacks'
  );

  for (const repo of ALL_22_REPOS) {
    const url = `https://github.com/aazminu/${repo}`;
    assert.ok(readme.includes(url), `Profile README.md missing standalone repository link ${url}`);
  }
});

test('HTML pages (/, /lab/, /research/) have valid structure, metadata, and resolved local references', (t) => {
  if (!SITE_ROOT) {
    t.skip('Sibling abdullahazmi.com checkout not present');
    return;
  }

  for (const page of HTML_PAGES) {
    const fullPath = path.join(SITE_ROOT, page.relPath);
    assert.ok(fs.existsSync(fullPath), `Expected HTML page for ${page.route} at ${page.relPath}`);
    const html = fs.readFileSync(fullPath, 'utf8');

    assert.match(html, /^<!DOCTYPE html>/i, `${page.relPath} must start with <!DOCTYPE html>`);
    assert.match(html, /<html\s+lang=["']en["']>/i, `${page.relPath} must specify <html lang="en">`);
    assert.match(html, /<meta\s+charset=["']UTF-8["']\s*\/?>/i, `${page.relPath} must specify UTF-8 charset`);
    assert.match(html, /<meta\s+name=["']viewport["']/i, `${page.relPath} must specify viewport meta`);
    assert.match(html, /<meta[\s\S]*?name=["']description["']/i, `${page.relPath} must specify meta description`);
    assert.match(html, /<title>[^<]+<\/title>/i, `${page.relPath} must have a non-empty <title>`);
    assert.ok(
      html.includes(`<link rel="canonical" href="${page.canonical}" />`),
      `${page.relPath} must include canonical link ${page.canonical}`
    );
    assert.match(html, /<div\s+id=["']root["']>/i, `${page.relPath} must contain #root mount container`);

    const refs = extractRelativeAssetRefs(html);
    assert.ok(refs.length > 0, `${page.relPath} should reference local assets`);
    const pageDir = path.dirname(fullPath);
    for (const ref of refs) {
      const resolved = path.resolve(pageDir, ref);
      assert.ok(fs.existsSync(resolved), `Broken relative reference "${ref}" in ${page.relPath}`);
    }
  }

  const labHtml = fs.readFileSync(path.join(SITE_ROOT, 'lab/index.html'), 'utf8').replace(/\r\n/g, '\n');
  const researchHtml = fs.readFileSync(path.join(SITE_ROOT, 'research/index.html'), 'utf8').replace(/\r\n/g, '\n');
  assert.strictEqual(labHtml, researchHtml, '/lab/index.html and /research/index.html mirror must remain in sync');
});

test('JSON-LD structured data is valid Schema.org JSON across /, /lab/, and /research/', (t) => {
  if (!SITE_ROOT) {
    t.skip('Sibling abdullahazmi.com checkout not present');
    return;
  }

  for (const page of HTML_PAGES) {
    const html = fs.readFileSync(path.join(SITE_ROOT, page.relPath), 'utf8');
    const blocks = extractJsonLdBlocks(html);
    assert.ok(blocks.length >= 1, `${page.relPath} must contain at least one application/ld+json block`);

    for (const rawBlock of blocks) {
      const parsed = JSON.parse(rawBlock);
      assert.strictEqual(parsed['@context'], 'https://schema.org');
      assert.ok(Array.isArray(parsed['@graph']) && parsed['@graph'].length > 0);
      const types = new Set(parsed['@graph'].map((node) => node['@type']));
      assert.ok(types.has('ResearchOrganization'));
    }
  }
});

test('Sitemap, robots.txt, CNAME, and .nojekyll are valid and map to existing files', (t) => {
  if (!SITE_ROOT) {
    t.skip('Sibling abdullahazmi.com checkout not present');
    return;
  }

  assert.strictEqual(fs.readFileSync(path.join(SITE_ROOT, 'CNAME'), 'utf8').trim(), 'abdullahazmi.com');
  assert.ok(fs.existsSync(path.join(SITE_ROOT, '.nojekyll')));

  const robots = fs.readFileSync(path.join(SITE_ROOT, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent:\s*\*/i);
  assert.match(robots, /Sitemap:\s*https:\/\/abdullahazmi\.com\/sitemap\.xml/i);

  const sitemap = fs.readFileSync(path.join(SITE_ROOT, 'sitemap.xml'), 'utf8');
  const locMatches = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  for (const expectedLoc of [
    'https://abdullahazmi.com/',
    'https://abdullahazmi.com/lab/',
    'https://abdullahazmi.com/research/',
    'https://abdullahazmi.com/assets/abdullah-azmi-resume.pdf'
  ]) {
    assert.ok(locMatches.includes(expectedLoc), `sitemap.xml missing ${expectedLoc}`);
  }
  for (const loc of locMatches) {
    const relFile = mapSitemapUrlToLocalPath(loc);
    assert.ok(fs.existsSync(path.join(SITE_ROOT, relFile)), `Missing file for sitemap loc ${loc}`);
  }
});

test('Static assets and 22 repository links across abdullahazmi.com pass integrity checks', (t) => {
  if (!SITE_ROOT) {
    t.skip('Sibling abdullahazmi.com checkout not present');
    return;
  }

  const pdfPrimary = fs.readFileSync(path.join(SITE_ROOT, 'assets/abdullah-azmi-resume.pdf'));
  assert.strictEqual(pdfPrimary.subarray(0, 5).toString('ascii'), '%PDF-');

  const bundleJs = fs.readFileSync(path.join(SITE_ROOT, 'assets/index-VqgN4zkm.js'), 'utf8');
  const labHtml = fs.readFileSync(path.join(SITE_ROOT, 'lab/index.html'), 'utf8');
  const siteReadme = fs.readFileSync(path.join(SITE_ROOT, 'README.md'), 'utf8');
  for (const repo of CORE_16_REPOS) {
    const url = `https://github.com/aazminu/${repo}`;
    assert.ok(bundleJs.includes(url), `Bundle missing ${url}`);
    assert.ok(labHtml.includes(url), `lab/index.html missing ${url}`);
  }
  for (const repo of ALL_22_REPOS) {
    const url = `https://github.com/aazminu/${repo}`;
    assert.ok(siteReadme.includes(url), `Site README.md missing ${url}`);
  }
});

test('Validator helpers handle empty inputs, external URLs, and invalid sitemap domains safely', () => {
  assert.deepStrictEqual(extractJsonLdBlocks(''), []);
  assert.deepStrictEqual(extractRelativeAssetRefs('<a href="https://abdullahazmi.com/">Home</a><img src="../assets/abdullah-azmi-avatar.svg" />'), [
    '../assets/abdullah-azmi-avatar.svg'
  ]);
  assert.strictEqual(mapSitemapUrlToLocalPath('https://abdullahazmi.com/research/'), 'research/index.html');
  assert.throws(() => mapSitemapUrlToLocalPath('https://malicious.example.com/'), /Invalid domain/);
});
