@echo off

if "%1"=="" (
    echo please entry filename
    goto :EXIT
)

call node .\node_modules\esbuild\bin\esbuild src\%1.ts --outfile=dist\%1.js --bundle --platform=node

:EXIT