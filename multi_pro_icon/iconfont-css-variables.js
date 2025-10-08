/**
 * Web Component CSS Variable Builder - Node.js Version
 * 
 * This script processes iconfont.css to extract .multi-pro-icon-xxx:before rules
 * and converts them to CSS variables in the :root selector.
 * The script is idempotent - it can be run multiple times with the same result.
 */

const fs = require('fs');
const path = require('path');

class CSSVarBuilder {
    constructor() {
        this.cssFile = 'iconfont.css';
        this.outputFile = 'iconfont.css';
        this.variablePrefix = 'multi-pro-icon';
    }

    /**
     * Main function to process the CSS file
     */
    process() {
        try {
            console.log('Starting CSS variable extraction...');
            
            // Read the CSS file
            const cssContent = fs.readFileSync(this.cssFile, 'utf8');
            
            // Parse and transform the CSS
            const transformedCSS = this.transformCSS(cssContent);
            
            // Write the transformed CSS back
            fs.writeFileSync(this.outputFile, transformedCSS, 'utf8');
            
            const variableCount = this.countVariables(transformedCSS);
            console.log('✅ CSS variables successfully extracted and added to :root');
            console.log('✅ Total variables created:', variableCount);
            console.log('✅ File updated:', this.outputFile);
            
        } catch (error) {
            console.error('❌ Error processing CSS file:', error.message);
            process.exit(1);
        }
    }

    /**
     * Transform CSS content by extracting icon rules to CSS variables
     */
    transformCSS(cssContent) {
        // First, remove any existing CSS variables
        const cleanedCSS = this.removeExistingVariables(cssContent);
        
        // Split CSS into lines for easier processing
        const lines = cleanedCSS.split('\n');
        const resultLines = [];
        const cssVariables = [];
        let firstIconIndex = -1;
        let foundFirstIcon = false;

        // First pass: collect icon rules and find the first icon position
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Extract icon rules
            if (line.startsWith('.multi-pro-icon-') && line.includes(':before')) {
                const iconName = this.extractIconName(line);
                const contentValue = this.extractContentValue(lines, i);
                
                if (iconName && contentValue) {
                    cssVariables.push(`  --${this.variablePrefix}-${iconName}: ${contentValue};`);
                    
                    // Record the position of the first icon
                    if (!foundFirstIcon) {
                        firstIconIndex = i;
                        foundFirstIcon = true;
                    }
                }
            }
        }

        // Remove duplicates from cssVariables
        const uniqueVariables = [...new Set(cssVariables)];

        // If no icons found, return original CSS
        if (uniqueVariables.length === 0) {
            return cleanedCSS;
        }

        // Second pass: build the transformed CSS
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Insert CSS variables before the first icon
            if (i === firstIconIndex) {
                // Add CSS variables block with proper spacing
                resultLines.push('/* CSS Variables for Web Components - Auto-generated */');
                resultLines.push(':root {');
                resultLines.push(...uniqueVariables);
                resultLines.push('}');
                resultLines.push('');
                resultLines.push(line);
            } else {
                resultLines.push(line);
            }
        }

        return resultLines.join('\n');
    }

    /**
     * Remove existing CSS variables from the CSS content
     */
    removeExistingVariables(cssContent) {
        const lines = cssContent.split('\n');
        const resultLines = [];
        let skipBlock = false;
        let previousLineWasEmpty = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Check if we're entering our auto-generated block
            if (trimmedLine.includes('CSS Variables for Web Components')) {
                skipBlock = true;
                continue; // Skip the comment line
            }
            
            // Check if we're in a :root block that's part of our auto-generated content
            if (skipBlock && trimmedLine.startsWith(':root {')) {
                continue; // Skip the :root { line
            }
            
            // Check if we're leaving the :root block
            if (skipBlock && trimmedLine === '}') {
                skipBlock = false;
                continue; // Skip the } line
            }
            
            // Skip lines in auto-generated block
            if (skipBlock) {
                continue;
            }
            
            // Handle empty lines - only add if previous line wasn't empty
            if (trimmedLine === '') {
                if (!previousLineWasEmpty) {
                    resultLines.push(line);
                    previousLineWasEmpty = true;
                }
            } else {
                resultLines.push(line);
                previousLineWasEmpty = false;
            }
        }

        // Remove trailing empty lines
        while (resultLines.length > 0 && resultLines[resultLines.length - 1].trim() === '') {
            resultLines.pop();
        }

        return resultLines.join('\n');
    }

    /**
     * Extract icon name from CSS rule line
     */
    extractIconName(line) {
        const match = line.match(/\.multi-pro-icon-([^:]+):before/);
        return match ? match[1] : null;
    }

    /**
     * Extract content value from CSS rule
     */
    extractContentValue(lines, currentIndex) {
        // Look ahead for the content property
        for (let i = currentIndex; i < Math.min(currentIndex + 5, lines.length); i++) {
            const contentMatch = lines[i].match(/content:\s*"([^"]+)"/);
            if (contentMatch) {
                return contentMatch[1];
            }
        }
        return null;
    }

    /**
     * Count the number of CSS variables created
     */
    countVariables(cssContent) {
        const variableRegex = /--multi-pro-icon-[^:]+:/g;
        const matches = cssContent.match(variableRegex);
        return matches ? matches.length : 0;
    }

    /**
     * List all generated CSS variables
     */
    listVariables() {
        try {
            const cssContent = fs.readFileSync(this.outputFile, 'utf8');
            const variableRegex = /--multi-pro-icon-([^:]+):\s*"([^"]+)"/g;
            const variables = {};
            let match;
            
            while ((match = variableRegex.exec(cssContent)) !== null) {
                variables[match[1]] = match[2];
            }
            
            return variables;
        } catch (error) {
            console.error('Error reading CSS file:', error.message);
            return {};
        }
    }
}

// Run the processor if this file is executed directly
if (require.main === module) {
    const builder = new CSSVarBuilder();
    builder.process();
    
    // List the generated variables
    const variables = builder.listVariables();
    console.log('\n📋 Generated CSS Variables:');
    Object.entries(variables).forEach(([name, value]) => {
        console.log(`  --multi-pro-icon-${name}: ${value}`);
    });
}

module.exports = CSSVarBuilder;
