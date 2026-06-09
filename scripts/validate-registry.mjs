#!/usr/bin/env node
/**
 * Validates patterns/registry.yaml against registry.schema.json
 * and ensures file/registry alignment.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const CADENCE_RE = /^[0-9]+[mhd](-[0-9]+[mhd])?$/;
const ID_RE = /^[a-z][a-z0-9-]*$/;
const FILE_RE = /^[A-Za-z0-9-]+\.md$/;
const VALID_TOOLS = new Set(['grok', 'claude-code', 'codex', 'github-actions', 'cursor', 'windsurf', 'aider']);
const VALID_RISK = new Set(['low', 'medium', 'high']);
const VALID_MODES = new Set(['L1', 'L2', 'L3']);
const VALID_COST = new Set(['low', 'medium', 'high', 'very-high']);

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

function validatePattern(p, index) {
  const prefix = `patterns[${index}]`;
  const required = ['id', 'name', 'file', 'goal', 'cadence', 'risk', 'tools', 'skills', 'state', 'phases', 'human_gates'];
  for (const key of required) {
    if (!(key in p)) fail(`${prefix} missing required field: ${key}`);
  }
  if (!ID_RE.test(p.id)) fail(`${prefix}.id invalid: ${p.id}`);
  if (!FILE_RE.test(p.file)) fail(`${prefix}.file invalid: ${p.file}`);
  if (!CADENCE_RE.test(p.cadence)) fail(`${prefix}.cadence invalid: ${p.cadence}`);
  if (!VALID_RISK.has(p.risk)) fail(`${prefix}.risk invalid: ${p.risk}`);
  if (!Array.isArray(p.tools) || p.tools.length === 0) fail(`${prefix}.tools must be non-empty array`);
  for (const t of p.tools) {
    if (!VALID_TOOLS.has(t)) fail(`${prefix}.tools unknown tool: ${t}`);
  }
  if (!Array.isArray(p.skills) || p.skills.length === 0) fail(`${prefix}.skills must be non-empty array`);
  if (!FILE_RE.test(p.state)) fail(`${prefix}.state invalid: ${p.state}`);
  if (!Array.isArray(p.phases) || p.phases.length < 2) fail(`${prefix}.phases must have ≥2 entries`);
  if (!Array.isArray(p.human_gates) || p.human_gates.length === 0) fail(`${prefix}.human_gates must be non-empty`);
  if (p.week_one_mode && !VALID_MODES.has(p.week_one_mode)) fail(`${prefix}.week_one_mode invalid`);
  if (p.token_cost && !VALID_COST.has(p.token_cost)) fail(`${prefix}.token_cost invalid`);
}

async function main() {
  const registryPath = path.join(ROOT, 'patterns', 'registry.yaml');
  const raw = await readFile(registryPath, 'utf8');
  const doc = yaml.parse(raw);

  if (!doc?.patterns?.length) fail('registry.yaml must have patterns array');

  doc.patterns.forEach(validatePattern);

  const ids = new Set();
  for (const p of doc.patterns) {
    if (ids.has(p.id)) fail(`duplicate pattern id: ${p.id}`);
    ids.add(p.id);
    const mdPath = path.join(ROOT, 'patterns', p.file);
    try {
      await readFile(mdPath, 'utf8');
    } catch {
      fail(`registry entry ${p.id} references missing file: patterns/${p.file}`);
    }
  }

  const mdFiles = (await readdir(path.join(ROOT, 'patterns')))
    .filter((f) => f.endsWith('.md') && f !== 'README.md');
  const registeredFiles = new Set(doc.patterns.map((p) => p.file.replace(/\.md$/, '')));

  for (const f of mdFiles) {
    const base = f.replace(/\.md$/, '');
    if (!registeredFiles.has(base)) fail(`pattern file not in registry: ${f}`);
  }

  console.log(`Registry valid: ${doc.patterns.length} patterns ✓`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});