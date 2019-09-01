const fs = require('fs');
const assert = require('assert');

/**
 * Where your source file is located
 * @param {String} filePath 
 */
async function addTargetTags(filePath) {

    try {
        const file = fs.readFileSync(filePath);

        const reg = new RegExp(/(^(\s+|))<source>([\S\s]*?)<\/source>/gm);

        const sourceTags = file.toString().match(reg);

        const targetTags = [];

        let fileContentWithTarget = file.toString();

        for (let l of sourceTags) {
            targetTags.push(l.replace(/<\/?source>/g, '<target>').replace(/<target>$/, '</target>'))
        }

        for (let i = 0; i < sourceTags.length; i++) {
            console.log(fileContentWithTarget);
            fileContentWithTarget = fileContentWithTarget.replace(
                sourceTags[i], `${sourceTags[i]}\n${targetTags[i]}`
            );
        }

        console.log(fileContentWithTarget);

        return fileContentWithTarget;
    } catch (error) {
        if (!filePath) {
            throw new Error("Please inform a file to read from.")
        }
    }
}

/**
 * 
 * @param {String} content This returned from addTargetTags 
 * @param {String} filePath 
 * @param {String} language Just the two-character code 
 */
async function generateTranslationFile(content, filePath, language) {
    try {
        assert(typeof (language) === 'string');
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

module.exports = { addTargetTags, generateTranslationFile };