import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { regex: /bg-\[\#03110D\]/g, replacement: 'bg-brand-bgMain' },
  { regex: /bg-\[\#071A15\]/g, replacement: 'bg-brand-bgSecondary' },
  { regex: /bg-\[\#0B211A\]/g, replacement: 'bg-brand-bgCard' },
  { regex: /border-\[\#173B30\]/g, replacement: 'border-brand-border' },
  { regex: /text-\[\#86A99A\]/g, replacement: 'text-brand-textMuted' },
  { regex: /text-\[\#B7D3C7\]/g, replacement: 'text-brand-textSecondary' },
  { regex: /bg-\[\#1F0909\]/g, replacement: 'bg-brand-bgError' },
  { regex: /hover:bg-\[\#071A15\]/g, replacement: 'hover:bg-brand-hoverStrong' },
  { regex: /hover:bg-\[\#0B211A\]/g, replacement: 'hover:bg-brand-hoverSoft' },
  { regex: /hover:bg-\[\#0E2A21\]/g, replacement: 'hover:bg-brand-hoverSoft' },
  // text-white replacements for specific tags if they are standard text
  // Actually, we can leave text-white alone and just target text-white where it's a main heading or paragraph.
  // Or we can manually replace text-white in a safe way.
  // Another trick: let's replace `text-white` with `text-brand-textMain` EXCEPT when it follows bg-[#10B981] or bg-red or similar.
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  // Safe text-white replacement
  // We look for text-white in className strings. 
  // We want to skip replacing it if the same string contains 'bg-[#10B981]' or 'bg-[#EF4444]' or 'bg-transparent' (sometimes used with red border).
  // Actually, it's easier to replace text-white with text-brand-textMain everywhere, THEN fix the buttons.
  // There are only a few buttons.
  content = content.replace(/text-white/g, 'text-brand-textMain');
  // Revert for primary/danger buttons/badges:
  // We can just revert any line that has bg-[#10B981] and text-brand-textMain
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    if (line.includes('bg-[#10B981]') || line.includes('bg-[#EF4444]') || line.includes('bg-red') || line.includes('text-[#EF4444]') || line.includes('text-transparent')) {
      return line.replace(/text-brand-textMain/g, 'text-white');
    }
    return line;
  });
  content = newLines.join('\n');
  
  // Also revert hover:text-white -> hover:text-brand-textMain -> hover:text-brand-textMain
  // wait, hover:text-white was replaced by hover:text-brand-textMain.
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  });
}

walkDir(directoryPath);
