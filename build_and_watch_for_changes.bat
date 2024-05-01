set arg1 = ""
set arg2 = ""
set arg3 = ""
set arg4 = ""
set arg5 = ""
set arg6 = ""
set arg7 = ""
set arg8 = ""
set arg9 = ""
set arg10 = ""
set arg11 = ""
set arg12 = ""
set arg13 = ""
set arg14 = ""
set arg15 = ""
set arg16 = ""
set arg17 = ""
set arg18 = ""
set arg19 = ""
set arg20 = ""

if exist src/css/dist/base set arg1=src/css/dist/base
if exist src/css/dist/ui/base set arg2=src/css/dist/ui/base
if exist src/css/dist/ui/general_selectors set arg3=src/css/dist/ui/general_selectors
if exist src/css/dist/ui/mobile set arg4=src/css/dist/ui/mobile
if exist src/css/dist/game set arg5=src/css/dist/game

if exist src/js/dist/declarations set arg6=src/js/dist/declarations
if exist src/js/dist/date_and_time set arg7=src/js/dist/date_and_time
if exist src/js/dist/location set arg8=src/js/dist/location
if exist src/js/dist/ui set arg9=src/js/dist/ui

if exist src/js/extensions set arg10=src/js/extensions
if exist src/css/extensions set arg11=src/css/extensions

if exist src/passages set arg12=src/passages

if exist src/variables set arg13=src/variables


call tweego -l -w -t -o "export\A Fertile Life.html" %arg1% %arg2% %arg3% %arg4% %arg5% %arg6% %arg7% %arg8% %arg9% %arg10% %arg11% %arg12% %arg13% %arg14% %arg15% %arg16% %arg17% %arg18% %arg19% %arg20% 