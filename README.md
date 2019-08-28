# Angular i18n Taget Tagger

This is a simple Node script to add target tags to Angular i18n XLF translation files.

## How to use this script

You may run the script from the terminal with node, or you may import the functions `addTargetTags` and `generateTranslationFile` into a program of yours and use them from there.

Once you have your translation file with the target tags, you may use an application such as [OmegaT](https://omegat.org/) to translate the text within the target tags.

I have done it so that the text from the source tag is repeated in the target tag.

The script is the file `gtf.js`, in the `src` folder. The file `messages.xlf` is just an example