import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
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

const ADDITIONAL_12_REPOS = [
  'sp500_platform',
  'AP-Study-Guide-Generator',
  'Environmental-Disaster-Classifier',
  'grab-pic',
  'comic-subscription',
  'motorcycle-rideability-index',
  'markov-music',
  'NYC-Property-Scout',
  'nitro-lab',
  'Watch-Engine',
  'ClaimLess',
  'finsim'
];

const ALL_28_REPOS = [...CORE_16_REPOS, ...ADDITIONAL_12_REPOS];

const HTML_PAGES = [
  { route: '/', relPath: 'index.html', canonical: 'https://abdullahazmi.com/' },
  { route: '/lab/', relPath: 'lab/index.html', canonical: 'https://abdullahazmi.com/lab/' },
  { route: '/research/', relPath: 'research/index.html', canonical: 'https://abdullahazmi.com/lab/' }
];

export function extractJsonLdBlocks(htmlContent) {
  if (typeof htmlContent !== 'string' || htmlContent.trim() === '') {
    return [];
  }
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  const typeAttrRegex = /\btype\s*=\s*(?:["']\s*application\/ld\+json(?:\s*;[^"']*)?\s*["']|application\/ld\+json\b)/i;
  const blocks = [];
  let match;
  while ((match = scriptRegex.exec(htmlContent)) !== null) {
    const attrs = match[1] || '';
    if (typeAttrRegex.test(attrs)) {
      const body = match[2].trim();
      if (body) {
        blocks.push(body);
      }
    }
  }
  return blocks;
}

export function extractRelativeAssetRefs(htmlContent) {
  if (typeof htmlContent !== 'string' || htmlContent.trim() === '') {
    return [];
  }
  const regex = /\b(?:src|href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
  const refs = [];
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const rawValue = (match[1] ?? match[2] ?? match[3] ?? '').trim();
    if (!rawValue) {
      continue;
    }
    const lower = rawValue.toLowerCase();
    if (
      lower.startsWith('http://') ||
      lower.startsWith('https://') ||
      lower.startsWith('//') ||
      lower.startsWith('mailto:') ||
      lower.startsWith('tel:') ||
      lower.startsWith('data:') ||
      lower.startsWith('javascript:') ||
      lower.startsWith('blob:') ||
      lower.startsWith('about:') ||
      lower.startsWith('#')
    ) {
      continue;
    }
    const cleanPath = rawValue.split('#')[0].split('?')[0].trim();
    if (cleanPath) {
      refs.push(cleanPath);
    }
  }
  return refs;
}

export function resolveLocalAssetPath(siteRoot, pageDir, ref) {
  if (typeof ref !== 'string' || ref.trim() === '' || ref.startsWith('//')) {
    throw new Error(`Invalid local asset reference: ${ref}`);
  }
  const normalizedSiteRoot = path.resolve(siteRoot);
  const resolved = ref.startsWith('/')
    ? path.resolve(normalizedSiteRoot, '.' + ref)
    : path.resolve(pageDir, ref);

  const relToRoot = path.relative(normalizedSiteRoot, resolved);
  if (relToRoot.startsWith('..') || path.isAbsolute(relToRoot)) {
    throw new Error(`Asset reference escapes site root: ${ref}`);
  }
  return resolved;
}

export function mapSitemapUrlToLocalPath(locUrl) {
  const prefix = 'https://abdullahazmi.com/';
  if (typeof locUrl !== 'string' || !locUrl.startsWith(prefix)) {
    throw new Error(`Invalid domain in sitemap loc: ${locUrl}`);
  }
  const rawSubPath = locUrl.slice(prefix.length).split('#')[0].split('?')[0];
  if (rawSubPath.includes('\\')) {
    throw new Error(`Invalid backslash in sitemap loc: ${locUrl}`);
  }
  const segments = rawSubPath.split('/').filter(Boolean);
  if (segments.includes('..') || segments.includes('.')) {
    throw new Error(`Path traversal not allowed in sitemap loc: ${locUrl}`);
  }
  if (rawSubPath === '' || rawSubPath.endsWith('/')) {
    return path.posix.join(rawSubPath, 'index.html');
  }
  return path.posix.normalize(rawSubPath);
}

export function extractJsRelativeRefs(jsContent) {
  if (typeof jsContent !== 'string' || jsContent.trim() === '') {
    return [];
  }
  const regex = /["'](\.\.?\/(?:assets\/[^"'?#\s]+|lab\/))(?:\?[^"']*|\#[^"']*)?["']/g;
  const refs = new Set();
  let match;
  while ((match = regex.exec(jsContent)) !== null) {
    refs.add(match[1]);
  }
  return [...refs];
}

function collectGraphIds(value, definedIds, referencedIds) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectGraphIds(item, definedIds, referencedIds);
    }
    return;
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (typeof value['@id'] === 'string') {
      if (keys.length > 1) {
        definedIds.add(value['@id']);
      } else {
        referencedIds.add(value['@id']);
      }
    }
    for (const key of keys) {
      if (key !== '@id') {
        collectGraphIds(value[key], definedIds, referencedIds);
      }
    }
  }
}

test('Profile README.md contains all 28 standalone repository links, portal badges, and institutional metadata', () => {
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

  for (const repo of ALL_28_REPOS) {
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
      const resolved = resolveLocalAssetPath(SITE_ROOT, pageDir, ref);
      assert.ok(fs.existsSync(resolved), `Broken relative reference "${ref}" in ${page.relPath}`);
      const stat = fs.statSync(resolved);
      if (stat.isDirectory()) {
        assert.ok(fs.existsSync(path.join(resolved, 'index.html')), `Directory reference "${ref}" in ${page.relPath} missing index.html`);
      } else {
        assert.ok(stat.size > 0, `Referenced file "${ref}" in ${page.relPath} is empty`);
      }
    }
  }

  const labHtml = fs.readFileSync(path.join(SITE_ROOT, 'lab/index.html'), 'utf8').replace(/\r\n/g, '\n');
  const researchHtml = fs.readFileSync(path.join(SITE_ROOT, 'research/index.html'), 'utf8').replace(/\r\n/g, '\n');
  assert.strictEqual(labHtml, researchHtml, '/lab/index.html and /research/index.html mirror must remain in sync');
});

test('JSON-LD structured data is valid Schema.org JSON with resolved @id references across /, /lab/, and /research/', (t) => {
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

      const definedIds = new Set();
      const referencedIds = new Set();
      collectGraphIds(parsed['@graph'], definedIds, referencedIds);
      for (const refId of referencedIds) {
        assert.ok(definedIds.has(refId), `${page.relPath} JSON-LD references undefined @id "${refId}"`);
      }

      const types = new Set(parsed['@graph'].map((node) => node['@type']));
      assert.ok(types.has('ResearchOrganization'));
      if (page.route === '/') {
        assert.ok(types.has('ProfilePage'));
        assert.ok(types.has('Person'));
      } else {
        const codeNodes = parsed['@graph'].filter((node) => node['@type'] === 'SoftwareSourceCode');
        assert.strictEqual(codeNodes.length, 4);
      }
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
    const resolved = path.join(SITE_ROOT, relFile);
    assert.ok(fs.existsSync(resolved), `Missing file for sitemap loc ${loc}`);
    assert.ok(fs.statSync(resolved).size > 0, `Empty file for sitemap loc ${loc}`);
  }
});

test('Static assets and 28 repository links across abdullahazmi.com pass integrity checks', (t) => {
  if (!SITE_ROOT) {
    t.skip('Sibling abdullahazmi.com checkout not present');
    return;
  }

  const pdfPrimary = fs.readFileSync(path.join(SITE_ROOT, 'assets/abdullah-azmi-resume.pdf'));
  const pdfMirror = fs.readFileSync(path.join(SITE_ROOT, 'assets/northwestern-student-resume.pdf'));
  assert.strictEqual(pdfPrimary.subarray(0, 5).toString('ascii'), '%PDF-');
  assert.ok(pdfPrimary.equals(pdfMirror));

  for (const jsRel of ['assets/index-VqgN4zkm.js', 'assets/extension.js']) {
    const jsContent = fs.readFileSync(path.join(SITE_ROOT, jsRel), 'utf8');
    assert.doesNotThrow(() => new vm.Script(jsContent, { filename: jsRel }));
    for (const ref of extractJsRelativeRefs(jsContent)) {
      const resolved = resolveLocalAssetPath(SITE_ROOT, SITE_ROOT, ref);
      assert.ok(fs.existsSync(resolved), `Missing JS asset ref ${ref} in ${jsRel}`);
    }
  }

  const indexHtml = fs.readFileSync(path.join(SITE_ROOT, 'index.html'), 'utf8');
  const bundleJs = fs.readFileSync(path.join(SITE_ROOT, 'assets/index-VqgN4zkm.js'), 'utf8');
  const labHtml = fs.readFileSync(path.join(SITE_ROOT, 'lab/index.html'), 'utf8');
  const researchHtml = fs.readFileSync(path.join(SITE_ROOT, 'research/index.html'), 'utf8');
  const profilePlan = fs.readFileSync(path.join(SITE_ROOT, 'PROFILE_PLAN.md'), 'utf8');
  const siteReadme = fs.readFileSync(path.join(SITE_ROOT, 'README.md'), 'utf8');
  const provenance = fs.readFileSync(path.join(SITE_ROOT, 'provenance.md'), 'utf8');

  assert.ok(!bundleJs.includes('?tab=repositories'));
  assert.ok(!labHtml.includes('?tab=repositories'));
  assert.ok(!researchHtml.includes('?tab=repositories'));

  for (const repo of CORE_16_REPOS) {
    const url = `https://github.com/aazminu/${repo}`;
    assert.ok(bundleJs.includes(url), `Bundle missing ${url}`);
  }
  for (const repo of ALL_28_REPOS) {
    const url = `https://github.com/aazminu/${repo}`;
    assert.ok(indexHtml.includes(url), `index.html missing ${url}`);
    assert.ok(labHtml.includes(url), `lab/index.html missing ${url}`);
    assert.ok(researchHtml.includes(url), `research/index.html missing ${url}`);
    assert.ok(profilePlan.includes(url), `PROFILE_PLAN.md missing ${url}`);
    assert.ok(siteReadme.includes(url), `Site README.md missing ${url}`);
    assert.ok(provenance.includes(url), `provenance.md missing ${url}`);
  }
});

test('Validator helpers handle empty inputs, unquoted/reordered attributes, external schemes, and path traversal safely', () => {
  assert.deepStrictEqual(extractJsonLdBlocks(''), []);
  assert.deepStrictEqual(
    extractJsonLdBlocks('<script id="ld-1" type="application/ld+json; charset=utf-8">{"@context":"https://schema.org"}</script><script type=application/ld+json>{"@type":"Person"}</script>'),
    ['{"@context":"https://schema.org"}', '{"@type":"Person"}']
  );
  assert.deepStrictEqual(
    extractRelativeAssetRefs(
      '<a href="https://abdullahazmi.com/">Home</a>' +
      '<a href="//cdn.example.com/x.js">CDN</a>' +
      '<a href="javascript:void(0)">JS</a>' +
      '<img src="../assets/abdullah-azmi-avatar.svg" />' +
      '<script src=./assets/extension.js></script>' +
      '<link href = "/lab/" />'
    ),
    ['../assets/abdullah-azmi-avatar.svg', './assets/extension.js', '/lab/']
  );
  assert.strictEqual(
    resolveLocalAssetPath(PROFILE_ROOT, PROFILE_ROOT, '/README.md'),
    path.join(PROFILE_ROOT, 'README.md')
  );
  assert.throws(
    () => resolveLocalAssetPath(PROFILE_ROOT, PROFILE_ROOT, '../../outside.txt'),
    /escapes site root/
  );
  assert.strictEqual(mapSitemapUrlToLocalPath('https://abdullahazmi.com/research/?x=1#y'), 'research/index.html');
  assert.throws(() => mapSitemapUrlToLocalPath('https://malicious.example.com/'), /Invalid domain/);
  assert.throws(() => mapSitemapUrlToLocalPath('https://abdullahazmi.com/../../etc/passwd'), /Path traversal/);
});
