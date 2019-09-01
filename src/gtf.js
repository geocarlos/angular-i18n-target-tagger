const fs = require('fs');
const assert = require('assert');

/**
 * Where your source file is located
 * @param {String} filePath 
 */
async function addTargetTags(filePath) {

    try {
        const file = fs.readFileSync(filePath);

        const regTransUnit = new RegExp(/(^(\s+|))<trans-unit ([\S\s]*?)<\/trans-unit>/gm);

        const regSource = new RegExp(/(^(\s+|))<source>([\S\s]*?)<\/source>/gm);

        const transUnits = file.toString().match(regTransUnit);

        let fileContentWithTarget = file.toString();

        for (let tu of transUnits) {
            const sourceTag = tu.match(regSource)[0];
            const targetTu = tu.replace(
                sourceTag,
                `${sourceTag}\n${sourceTag.replace(/source>/g, 'target>')}`
            );
            fileContentWithTarget = fileContentWithTarget.replace(tu, targetTu);
        }

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
        let targetFile = null;
        try {
            targetFile = fs.readFileSync(output);
            process.stdout.write("Target file exists. New content will be merged.\n");
            content = await mergeContent(content, targetFile.toString());
        } catch (error) {
            process.stdout.write("No target file exists. New file will be created.\n");
        }
        fs.writeFileSync(output, content);
    } catch (error) {
        if (!language) {
            throw new Error("Please inform the language to create the file for.")
        }
        throw error;
    }
}

async function mergeContent(newContent, targetFileContent) {

    const regTransUnit = new RegExp(/(^(\s+|))<trans-unit ([\S\s]*?)<\/trans-unit>/gm);

    const regTarget = new RegExp(/(^(\s+|))<target>([\S\s]*?)<\/target>/gm);
    const regSource = new RegExp(/(^(\s+|))<source>([\S\s]*?)<\/source>/gm);

    const transUnitsNew = newContent.match(regTransUnit);
    const transUnitsTarget = targetFileContent.match(regTransUnit);

    const transUnitsNewObj = {};
    const transUnitsTargetObj = {}

    for (let t of transUnitsNew) {
        transUnitsNewObj[t.match(/(?!id=)"\w+"/)[0]] = t;
    }

    for (let t of transUnitsTarget) {
        transUnitsTargetObj[t.match(/(?!id=)"\w+"/)[0]] = t;
    }

    for (let unit in transUnitsNewObj) {
        const sn = transUnitsNewObj[unit].match(regSource)[0];
        const st = transUnitsTargetObj[unit].match(regSource)[0]
        if (sn !== st) {
            transUnitsTargetObj[unit] = transUnitsTargetObj[unit].replace(st, sn);
            const t = transUnitsTargetObj[unit].match(regTarget)[0];
            transUnitsTargetObj[unit] = transUnitsTargetObj[unit].replace(t, t.substring(0, t.indexOf('>') + 1)
                + '--needs-update-- ' + t.substring(t.indexOf('>') + 1))
        }
        newContent = newContent.replace(
            transUnitsNewObj[unit], transUnitsTargetObj[unit]
        );
    }

    return newContent;
}

async function main() {
    const filePath = process.argv[2];
    const language = process.argv[3];
    try {
        const contentWithTargetTags = await addTargetTags(filePath);
        process.stdout.write("Generating translation file...\n");
        await generateTranslationFile(contentWithTargetTags, filePath, language);
        process.stdout.write("Translation file is ready.\n");
    } catch (error) {
        process.stdout.write("An error has occurred.\n", (error || {}).message);
    }
}

if (module === require.main) {
    main();
}

module.exports = { addTargetTags, generateTranslationFile };