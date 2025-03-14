#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const DOMAINS_DIR = path.join(process.cwd(), 'ws_domains');
const OUTPUT_FILE = path.join(process.cwd(), 'docs/UBIQUITOUS_LANGUAGE.md');

async function findUbiquitousLanguageFiles(dir) {
  const files = [];
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      const domainName = path.basename(fullPath);
      const expectedFileName = `UBIQUITOUS_LANGUAGE-${domainName}.md`;
      const expectedFilePath = path.join(fullPath, expectedFileName);

      if (fs.existsSync(expectedFilePath)) {
        files.push(expectedFilePath);
      }

      // Also search subdirectories in case of nested domains
      files.push(...(await findUbiquitousLanguageFiles(fullPath)));
    }
  }

  return files;
}

async function extractSections(content) {
  const sections = {};
  let currentSection = null;
  let currentContent = [];

  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n');
      }
      currentSection = line.slice(3).trim();
      currentContent = [line];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    sections[currentSection] = currentContent.join('\n');
  }

  return sections;
}

async function aggregateLanguage() {
  const files = await findUbiquitousLanguageFiles(DOMAINS_DIR);
  const domains = {};

  for (const file of files) {
    const domainName = path.basename(path.dirname(file));
    const content = await readFile(file, 'utf8');
    domains[domainName] = await extractSections(content);
  }

  let output = '# Aggregated Ubiquitous Language\n\n';
  output +=
    'This document is automatically generated from individual domain ubiquitous language files.\n\n';

  const sections = new Set();
  for (const domain of Object.values(domains)) {
    for (const section of Object.keys(domain)) {
      sections.add(section);
    }
  }

  for (const section of sections) {
    output += `## ${section}\n\n`;
    for (const [domain, content] of Object.entries(domains)) {
      if (content[section]) {
        output += `### ${domain}\n\n`;
        output += `${content[section].split('\n').slice(1).join('\n').trim()}\n\n`;
      }
    }
  }

  await writeFile(OUTPUT_FILE, output);
  console.log(`Aggregated ubiquitous language written to ${OUTPUT_FILE}`);
}

aggregateLanguage().catch(console.error);
