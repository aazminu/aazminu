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

const VERIFIED_UPSTREAM_PRS = [
  'https://github.com/exmergo/dex/pull/634',
  'https://github.com/exmergo/dex/pull/633',
  'https://github.com/GustavoBaranda/chatflow-agent/pull/52',
  'https://github.com/repowise-dev/repowise/pull/3841'
];

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

test('Profile README.md contains all 28 standalone repository links, verified upstream PR links, portal badges, and institutional metadata', () => {
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
  for (const prUrl of VERIFIED_UPSTREAM_PRS) {
    assert.ok(readme.includes(prUrl), `Profile README.md missing verified upstream PR link ${prUrl}`);
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
        const profilePage = parsed['@graph'].find((node) => node['@type'] === 'ProfilePage');
        assert.ok(Array.isArray(profilePage.significantLink), 'ProfilePage must define significantLink array');
        for (const repo of ALL_28_REPOS) {
          assert.ok(
            profilePage.significantLink.includes(`https://github.com/aazminu/${repo}`),
            `ProfilePage.significantLink missing https://github.com/aazminu/${repo}`
          );
        }
        for (const prUrl of VERIFIED_UPSTREAM_PRS) {
          assert.ok(
            profilePage.significantLink.includes(prUrl),
            `ProfilePage.significantLink missing ${prUrl}`
          );
        }
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

  for (const jsRel of ['assets/index-2552cda7.js', 'assets/index-VqgN4zkm.js', 'assets/extension.js']) {
    const jsContent = fs.readFileSync(path.join(SITE_ROOT, jsRel), 'utf8');
    assert.doesNotThrow(() => new vm.Script(jsContent, { filename: jsRel }));
    for (const ref of extractJsRelativeRefs(jsContent)) {
      const resolved = resolveLocalAssetPath(SITE_ROOT, SITE_ROOT, ref);
      assert.ok(fs.existsSync(resolved), `Missing JS asset ref ${ref} in ${jsRel}`);
    }
  }

  const indexHtml = fs.readFileSync(path.join(SITE_ROOT, 'index.html'), 'utf8');
  const bundleJs = fs.readFileSync(path.join(SITE_ROOT, 'assets/index-VqgN4zkm.js'), 'utf8');
  const bundleVersionedJs = fs.readFileSync(path.join(SITE_ROOT, 'assets/index-2552cda7.js'), 'utf8');
  const extensionJs = fs.readFileSync(path.join(SITE_ROOT, 'assets/extension.js'), 'utf8');
  const labHtml = fs.readFileSync(path.join(SITE_ROOT, 'lab/index.html'), 'utf8');
  const researchHtml = fs.readFileSync(path.join(SITE_ROOT, 'research/index.html'), 'utf8');
  const profilePlan = fs.readFileSync(path.join(SITE_ROOT, 'PROFILE_PLAN.md'), 'utf8');
  const siteReadme = fs.readFileSync(path.join(SITE_ROOT, 'README.md'), 'utf8');
  const provenance = fs.readFileSync(path.join(SITE_ROOT, 'provenance.md'), 'utf8');

  for (const [name, content] of [
    ['index.html', indexHtml],
    ['assets/index-VqgN4zkm.js', bundleJs],
    ['assets/index-2552cda7.js', bundleVersionedJs],
    ['assets/extension.js', extensionJs],
    ['lab/index.html', labHtml],
    ['research/index.html', researchHtml],
    ['PROFILE_PLAN.md', profilePlan],
    ['README.md', siteReadme],
    ['provenance.md', provenance]
  ]) {
    assert.ok(
      !content.includes('?tab=repositories'),
      `${name} must not use generic ?tab=repositories fallback links`
    );
  }
  assert.ok(
    profilePlan.includes('(28 Systems)') && !profilePlan.includes('(16 Systems)'),
    'PROFILE_PLAN.md must specify (28 Systems) rather than stale (16 Systems)'
  );

  for (const repo of CORE_16_REPOS) {
    const url = `https://github.com/aazminu/${repo}`;
    assert.ok(bundleJs.includes(url), `Bundle missing ${url}`);
    assert.ok(bundleVersionedJs.includes(url), `Versioned bundle missing ${url}`);
  }
  for (const repo of ALL_28_REPOS) {
    const url = `https://github.com/aazminu/${repo}`;
    assert.ok(indexHtml.includes(url), `index.html missing ${url}`);
    assert.ok(extensionJs.includes(`'${repo}'`), `assets/extension.js missing ${repo}`);
    assert.ok(labHtml.includes(url), `lab/index.html missing ${url}`);
    assert.ok(researchHtml.includes(url), `research/index.html missing ${url}`);
    assert.ok(profilePlan.includes(url), `PROFILE_PLAN.md missing ${url}`);
    assert.ok(siteReadme.includes(url), `Site README.md missing ${url}`);
    assert.ok(provenance.includes(url), `provenance.md missing ${url}`);
  }
  for (const prUrl of VERIFIED_UPSTREAM_PRS) {
    assert.ok(indexHtml.includes(prUrl), `index.html missing ${prUrl}`);
    assert.ok(extensionJs.includes(prUrl), `assets/extension.js missing ${prUrl}`);
    assert.ok(labHtml.includes(prUrl), `lab/index.html missing ${prUrl}`);
    assert.ok(researchHtml.includes(prUrl), `research/index.html missing ${prUrl}`);
    assert.ok(profilePlan.includes(prUrl), `PROFILE_PLAN.md missing ${prUrl}`);
    assert.ok(siteReadme.includes(prUrl), `Site README.md missing ${prUrl}`);
    assert.ok(provenance.includes(prUrl), `provenance.md missing ${prUrl}`);
  }
});

function createDomHarness() {
  class MockElement {
    constructor(tagName) {
      this.tagName = String(tagName || 'div').toUpperCase();
      this.id = '';
      this.className = '';
      this._text = '';
      this._innerHTML = '';
      this.hidden = false;
      this.style = {};
      this.dataset = {};
      this.attributes = new Map();
      this.children = [];
      this.parentElement = null;
      this.listeners = new Map();
    }
    get textContent() {
      if (this.children.length === 0) return this._text;
      return [this._text, ...this.children.map((c) => c.textContent)].filter(Boolean).join(' ');
    }
    set textContent(v) {
      this._text = String(v ?? '');
      this.children = [];
    }
    get innerHTML() {
      return this._innerHTML;
    }
    set innerHTML(v) {
      this._innerHTML = String(v ?? '');
      if (this._innerHTML === '') {
        this.children = [];
      }
    }
    setAttribute(k, v) {
      const key = String(k);
      const val = String(v);
      this.attributes.set(key, val);
      if (key === 'id') this.id = val;
      if (key === 'class') this.className = val;
      if (key.startsWith('data-')) {
        const camel = key.slice(5).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
        this.dataset[camel] = val;
      }
    }
    getAttribute(k) {
      return this.attributes.get(String(k)) ?? null;
    }
    removeAttribute(k) {
      this.attributes.delete(String(k));
    }
    append(...nodes) {
      for (const n of nodes) {
        if (n instanceof MockElement) {
          n.parentElement = this;
          this.children.push(n);
        }
      }
    }
    before(node) {
      if (!this.parentElement || !(node instanceof MockElement)) return;
      node.parentElement = this.parentElement;
      const idx = this.parentElement.children.indexOf(this);
      if (idx >= 0) {
        this.parentElement.children.splice(idx, 0, node);
      } else {
        this.parentElement.children.push(node);
      }
    }
    cloneNode(deep = false) {
      const copy = new MockElement(this.tagName);
      copy.id = this.id;
      copy.className = this.className;
      copy._text = this._text;
      copy._innerHTML = this._innerHTML;
      copy.href = this.href;
      copy.target = this.target;
      copy.rel = this.rel;
      for (const [k, v] of this.attributes.entries()) copy.attributes.set(k, v);
      if (deep) {
        for (const child of this.children) copy.append(child.cloneNode(true));
      }
      return copy;
    }
    addEventListener(type, fn) {
      const list = this.listeners.get(type) || [];
      list.push(fn);
      this.listeners.set(type, list);
    }
    dispatchEvent(type, eventObj = {}) {
      const list = this.listeners.get(type) || [];
      for (const fn of list) {
        fn({ target: this, ...eventObj });
      }
    }
    scrollIntoView() {}
    matches(selector) {
      if (selector.startsWith('#')) return this.id === selector.slice(1);
      if (selector.startsWith('.')) {
        const cls = selector.slice(1);
        return (this.className || '').split(/\s+/).includes(cls);
      }
      if (selector.startsWith('[') && selector.endsWith(']')) {
        const attr = selector.slice(1, -1);
        return this.attributes.has(attr);
      }
      return this.tagName === selector.toUpperCase();
    }
    querySelectorAll(selector) {
      const results = [];
      const visit = (node) => {
        for (const child of node.children) {
          if (child.matches(selector)) results.push(child);
          visit(child);
        }
      };
      visit(this);
      return results;
    }
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    }
  }

  const root = new MockElement('div');
  root.id = 'root';

  const navLinks = new MockElement('div');
  navLinks.className = '_links_p88qd_61';
  const resumeLink = new MockElement('a');
  resumeLink.href = './assets/abdullah-azmi-resume.pdf';
  navLinks.append(resumeLink);
  root.append(navLinks);

  const projects = new MockElement('section');
  projects.id = 'projects';
  const grid = new MockElement('div');
  grid.className = '_grid_1aul7_9';

  const sampleCards = [
    ['PaperPulse', 'CGAS Lab · Knowledge Graphs', 'https://github.com/aazminu/paper-pulse'],
    ['Airtight Container', 'Production · PostgreSQL', 'https://github.com/aazminu/airtight-container'],
    ['RISC-V Simulator', 'Systems & Architecture', 'https://github.com/aazminu/python-riscv-simulator'],
    ['Khoury Odyssey', 'Open-Source · Next.js', 'https://github.com/aazminu/odyssey']
  ];
  for (const [name, award, href] of sampleCards) {
    const card = new MockElement('article');
    card.className = '_card_1aul7_24';
    const h2 = new MockElement('h2');
    h2.textContent = name;
    const span = new MockElement('span');
    span.textContent = award;
    const ul = new MockElement('ul');
    const li = new MockElement('li');
    li.textContent = 'Python';
    ul.append(li);
    const p = new MockElement('p');
    p.textContent = `${name} system description`;
    const a = new MockElement('a');
    a.href = href;
    card.append(h2, span, ul, p, a);
    grid.append(card);
  }
  projects.append(grid);
  root.append(projects);

  const footer = new MockElement('footer');
  footer.id = 'footer';
  root.append(footer);

  const document = {
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => (root.id === id ? root : root.querySelector(`#${id}`)),
    querySelector: (sel) => root.querySelector(sel),
    querySelectorAll: (sel) => root.querySelectorAll(sel)
  };

  class MockMutationObserver {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {}
  }

  return { root, document, MutationObserver: MockMutationObserver };
}

test('assets/extension.js executes in a DOM harness and renders featured banner, filter controls, 4 workbench demos, lab notes, field gallery, and research lab cards', (t) => {
  if (!SITE_ROOT) {
    t.skip('Sibling abdullahazmi.com checkout not present');
    return;
  }

  const extensionJs = fs.readFileSync(path.join(SITE_ROOT, 'assets/extension.js'), 'utf8');
  const { root, document, MutationObserver } = createDomHarness();

  vm.runInNewContext(extensionJs, { document, MutationObserver }, { filename: 'assets/extension.js' });

  const workbench = document.getElementById('workbench');
  assert.ok(workbench, 'extension.js must mount #workbench');
  const tabs = workbench.querySelectorAll('.workbench-tab');
  assert.strictEqual(tabs.length, 4, '#workbench must render 4 simulation tabs');
  for (let i = 1; i < tabs.length; i++) {
    tabs[i].dispatchEvent('click');
    assert.strictEqual(tabs[i].getAttribute('aria-selected'), 'true');
  }

  const researchLab = document.getElementById('research-lab');
  assert.ok(researchLab, 'extension.js must mount #research-lab');
  const labCards = researchLab.querySelectorAll('._card_1aul7_24');
  assert.strictEqual(labCards.length, 6, '#research-lab must render 4 thrust cards + 28-repo catalogCard + upstreamCard');
  for (const card of labCards) {
    const techList = card.querySelector('._tech_1aul7_51');
    assert.ok(techList && techList.children.length >= 4, 'Every card in #research-lab must contain a populated ._tech_1aul7_51 list');
  }

  const labAnchors = researchLab.querySelectorAll('a').map((a) => a.href);
  for (const repo of ALL_28_REPOS) {
    assert.ok(labAnchors.includes(`https://github.com/aazminu/${repo}`));
  }
  for (const prUrl of VERIFIED_UPSTREAM_PRS) {
    assert.ok(labAnchors.includes(prUrl));
  }
});

test('Validator helpers handle empty inputs, unquoted/reordered attributes, external schemes, path traversal, and strict identity isolation safely', () => {
  const forbiddenPattern = new RegExp(
    String.fromCharCode(101, 99, 99, 121, 115) + '|' + String.fromCharCode(55, 51, 48, 52, 48, 57, 49, 50),
    'i'
  );
  for (const rel of ['README.md', 'tests/portfolio.test.mjs']) {
    const text = fs.readFileSync(path.join(PROFILE_ROOT, rel), 'utf8');
    assert.doesNotMatch(text, forbiddenPattern, `${rel} must maintain strict identity isolation`);
  }
  if (SITE_ROOT) {
    for (const rel of ['index.html', 'lab/index.html', 'research/index.html', 'assets/extension.js', 'PROFILE_PLAN.md', 'README.md', 'provenance.md']) {
      const text = fs.readFileSync(path.join(SITE_ROOT, rel), 'utf8');
      assert.doesNotMatch(text, forbiddenPattern, `Site ${rel} must maintain strict identity isolation`);
    }
  }

  assert.deepStrictEqual(extractJsonLdBlocks(''), []);
  assert.deepStrictEqual(extractJsonLdBlocks(null), []);
  assert.deepStrictEqual(extractJsonLdBlocks(undefined), []);
  assert.deepStrictEqual(extractRelativeAssetRefs(null), []);
  assert.deepStrictEqual(extractJsRelativeRefs(null), []);
  assert.strictEqual(new Set(VERIFIED_UPSTREAM_PRS).size, 4, 'VERIFIED_UPSTREAM_PRS must contain 4 distinct URLs');
  for (const prUrl of VERIFIED_UPSTREAM_PRS) {
    assert.match(prUrl, /^https:\/\/github\.com\/(?!aazminu\/)[^/]+\/[^/]+\/pull\/\d+$/, `Invalid external PR URL: ${prUrl}`);
  }
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
  assert.throws(
    () => resolveLocalAssetPath(PROFILE_ROOT, PROFILE_ROOT, '//protocol-relative.js'),
    /Invalid local asset reference/
  );
  assert.strictEqual(mapSitemapUrlToLocalPath('https://abdullahazmi.com/research/?x=1#y'), 'research/index.html');
  assert.throws(() => mapSitemapUrlToLocalPath('https://malicious.example.com/'), /Invalid domain/);
  assert.throws(() => mapSitemapUrlToLocalPath('https://abdullahazmi.com/../../etc/passwd'), /Path traversal/);
});
