#!/usr/bin/env node

/**
 * This script formats commit messages to ensure they comply with commit message conventions,
 * specifically ensuring that body lines don't exceed 100 characters.
 *
 * Usage:
 *   1. Make this script executable: chmod +x ws_tooling/scripts/git/format-commit-msg.js
 *   2. Set it as your commit-msg hook:
 *      ln -s ../../ws_tooling/scripts/git/format-commit-msg.js .git/hooks/commit-msg
 */

const fs = require('fs');

function wrapText(text, maxLength) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    // If adding this word would exceed the limit
    if (currentLine.length + word.length + 1 > maxLength) {
      // If the current line isn't empty, push it
      if (currentLine) {
        lines.push(currentLine.trim());
        currentLine = '';
      }
      // If the word itself is longer than maxLength, split it
      if (word.length > maxLength) {
        const chunks = word.match(new RegExp(`.{1,${maxLength}}`, 'g')) || [];
        lines.push(...chunks.slice(0, -1));
        currentLine = chunks[chunks.length - 1] || '';
      } else {
        currentLine = word;
      }
    } else {
      // Add the word to the current line
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    }
  }

  // Don't forget the last line
  if (currentLine) {
    lines.push(currentLine.trim());
  }

  return lines;
}

function formatCommitMessage(content) {
  const MAX_LINE_LENGTH = 100;

  // Split the commit message into title and body
  const [title, ...bodyLines] = content.split('\n');

  // Keep the title as is (it should be handled by a different rule)
  const formattedLines = [title];

  // Skip empty lines after title until we hit body content
  let hitContent = false;
  for (const line of bodyLines) {
    if (!hitContent && !line.trim()) {
      formattedLines.push(line);
      continue;
    }

    hitContent = true;

    // Don't wrap lines that start with #, space, or are empty
    if (line.startsWith('#') || line.startsWith(' ') || !line.trim()) {
      formattedLines.push(line);
      continue;
    }

    // Wrap the line if it exceeds max length
    if (line.length > MAX_LINE_LENGTH) {
      const wrappedLines = wrapText(line, MAX_LINE_LENGTH);
      formattedLines.push(...wrappedLines);
    } else {
      formattedLines.push(line);
    }
  }

  return formattedLines.join('\n');
}

// Main execution
try {
  const commitMsgFile = process.argv[2];
  if (!commitMsgFile) {
    console.error('Error: No commit message file provided');
    process.exit(1);
  }

  const originalContent = fs.readFileSync(commitMsgFile, 'utf8');
  const formattedContent = formatCommitMessage(originalContent);

  fs.writeFileSync(commitMsgFile, formattedContent);
} catch (error) {
  console.error('Error processing commit message:', error);
  process.exit(1);
}
