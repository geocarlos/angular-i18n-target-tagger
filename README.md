# Angular i18n Target Tagger

This is a simple Node script to add target tags to Angular i18n XLF translation files.

## Reason to write this script

When extracting text for translation for an Angular application, I could not find an option to generate the translation file with `target` tags. If you find a way to do it, then, you don't need this script. Otherwise, it may be helpful. 

I don't know about other translation tools, but on [OmegaT](https://omegat.org/), you may not load your translation file without the `target` tags. To copy, paste and rename the `source` tags manually is so cumbersome!

## How to use this script

You may run the script from the terminal with node, or you may import the functions `addTargetTags` and `generateTranslationFile` into a program of yours and use them from there.

Once you have your translation file with the target tags, you may use an application such as [OmegaT](https://omegat.org/) to translate the text within the target tags.

I have done it so that the text from the source tag is repeated in the target tag.

The script is the file `gtf.js`, in the `src` folder. The file `messages.xlf` is just an example