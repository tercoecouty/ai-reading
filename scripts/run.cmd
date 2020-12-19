@echo off

if "%1"=="" (
    echo please entry filename
    goto :EXIT
)

call scripts\build.cmd %1
call node dist\%1.js

:EXIT