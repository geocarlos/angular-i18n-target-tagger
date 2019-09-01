# Angular i18n Target Tagger

This is a simple Node script to add target tags to Angular i18n XLF translation files.

Please note that it is for XLF format. If you need/want to use another format, you may have to look for another solution.

## Reason to write this script

When extracting text for translation for an Angular application, I could not find an option to generate the translation file with `target` tags. If you find a way to do it, then, you don't need this script. Otherwise, it may be helpful. 

I don't know about other translation tools, but on [OmegaT](https://omegat.org/), you may not load your translation file without the `target` tags. To copy, paste and rename the `source` tags manually is so cumbersome!

## How to use this script

### With bash

There is a shell script named `gtfl` in the folder `bin`. If you want to put it somewhere (I suggest your home directory) and run it from anywhere, you may add it to your `.bashrc` file, like this (assuming you have it in your home directory):

`export PATH="$HOME/angular_i18n_target_tagger/bin:$PATH"`

Now you may open a terminal and run the command `gtfl -h` from anywhere and see a message of how to use the script.

### Directly with Node

You may run the script from the terminal with node, or you may import the functions `addTargetTags` and `generateTranslationFile` into a program of yours and use them from there.

If you decide to run it as is from the terminal, you will need to inform the source file and the language code. For example, if you are in this project folder using the example file provided in this project, and you want to generate translation file for Portuguese:

`node ./src/gtf.js messages.xlf pt`

This will generated a file named `messages.pt.xlf`.

Once you have your translation file with the target tags, you may use an application such as [OmegaT](https://omegat.org/) to translate the text within the target tags.

## Merging existing translations

In order to merge your existing translations, you must set custom ids for your translated strings, since automatically generated ids will be overwritten when you run `ng xi18n` on your project again.

This script will check if the location already has a file for the language you have informed. If so, then it will merge the existing translations within the target tags.

If you have modified the original text of any translation units (for instance, you decided to change "About" to "About me" or "About us"), the script will keep the existing translations and mark them with `--needs-update`, like this:

`<source>About me</source>`  
`<target>--needs-update-- Sobre</target>`

In this case, the translator could delete `--needs-update--` and update the translation to something like:

`<target>Sobre mim</target>`