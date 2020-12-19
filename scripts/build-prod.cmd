@echo off
setlocal
set NODE_ENV=production
call node node_modules\webpack\bin\webpack.js
endlocal