const fs = require('fs');
const assert = require('assert');

/**
 * Where your source file is located
 * @param {String} filePath 
 */
async function addTargetTags(filePath) {

    try {
        const file = fs.readFileSync(filePath);

        const reg = new RegExp(/<source>.+<\/source>/g);

        const filePartsOtherThanSourceTags = file.toString().split(reg);

        const sourceTags = file.toString().match(reg);

        console.log(sourceTags);

        const targetTags = [];

        const fileContentWithTarget = [];

        for (let l of sourceTags) {
            targetTags.push(l.replace(/<\/?source>/g, '<target>').replace(/<target>$/, '</target>'))
        }

        for (let i = 0; i < filePartsOtherThanSourceTags.length; i++) {
            fileContentWithTarget.push(
                !!sourceTags[i] ? (filePartsOtherThanSourceTags[i] + sourceTags[i]
                     + '\n        ' + targetTags[i]) :
                filePartsOtherThanSourceTags[i]
            );
        }

        console.log(fileContentWithTarget);

        return fileContentWithTarget.join('');
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