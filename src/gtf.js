const fs = require('fs');
const assert = require('assert');

async function addTargetTags(filePath) {

    try {
        const file = fs.readFileSync(filePath);

        const fileLines = file.toString().split('\n');

        const fileLinesWithTarget = [];

        const reg = new RegExp(/<source>.+<\/source>/);

        for (let l of fileLines) {

            fileLinesWithTarget.push(l);

            if (reg.test(l)) {
                fileLinesWithTarget.push(l.replace(/<\/?source>/g, '<target>').replace(/<target>$/, '</target>'))
            }
        }
        return fileLinesWithTarget.join('\n');
    } catch (error) {
        if (!filePath) {
            throw new Error("Please inform a file to read from.")
        }
    }
}

async function generateTranslationFile(content, filePath, language) {
    try {
        assert(typeof(language) === 'string');
        const output = filePath.replace(/\./, `.${language}.`);
        fs.writeFileSync(output, content);
    } catch (error) {
        if (!language) {
            throw new Error("Please inform the language to create the file for.")
        }
        throw error;
    }
}

async function main() {
    const filePath = process.argv[2];
    const language = process.argv[3];
    try {
        const contentWithTargetTags = await addTargetTags(filePath);
        process.stdout.write("Generating translation file...\n");
        await generateTranslationFile(contentWithTargetTags, filePath, language);
        process.stdout.write("Translation file generated\n");
    } catch (error) {
        process.stdout.write("An error has occurred\n", (error || {}).message);
    }
}

if (module === require.main) {
    main();
}

module.exports = {generateTranslationFile, };