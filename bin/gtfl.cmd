@echo off

set help_message=C:\Users\%username%\Documents\angular-i18n-target-tagger\bin\message.txt

if [%1]==[--help] (
    for /f "Tokens=* Delims=" %%x in (%help_message%) do ( @echo %%x)
    exit 0;
)

if [%1]==[] (
    echo You must inform source file and target language code.
    exit 1
)

if [%2]==[] (
    echo Please inform the target language code.
    exit 1
) 

 if exist %1 (
     node .\src\gtf %1 %2
 ) else (
     echo No file named %1
 )
