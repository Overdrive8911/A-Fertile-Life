@echo off

set "transpiledJsDir=src/scripts/built_js"
set "compiledCssDir=src/styles/built_css"

:: Remove previously compiled files so duplicated / unnecessary code is gone
if exist "%transpiledJsDir%" (
  echo Transpiled JS Directory found. Deleting...
  rmdir /s /q "%transpiledJsDir%"
  echo Directory deleted. Proceeding to next step...
) else (
  echo Transpiled JS Directory not found. Proceeding to next step...
)
if exist "%compiledCssDir%" (
  echo Transpiled CSS Directory found. Deleting...
  rmdir /s /q "%compiledCssDir%"
  echo Directory deleted. Proceeding to next step...
) else (
  echo Transpiled CSS Directory not found. Proceeding to next step...
)

:: Compile scss and typescript files
sass src/styles/scss:"%compiledCssDir%" --no-source-map --style=compressed & echo CSS files rebuilt & tsc --target es2019 --rootDir src/scripts/ts --outDir "%transpiledJsDir%" & echo JS files rebuilt

exit /b 0