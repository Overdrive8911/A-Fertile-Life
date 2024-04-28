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

if exist src/js set arg1=src/js
if exist src/passages set arg2=src/passages
if exist src/variables set arg3=src/variables
if exist src/css/dist/base set arg4=src/css/dist/base
if exist src/css/dist/ui/base set arg5=src/css/dist/ui/base
if exist src/css/dist/ui/general_selectors set arg6=src/css/dist/ui/general_selectors
if exist src/css/dist/ui/mobile set arg7=src/css/dist/ui/mobile
if exist src/css/dist/game set arg8=src/css/dist/game

call tweego -l -w -t -o "export\A Fertile Life.html" %arg1% %arg2% %arg3% %arg4% %arg5% %arg6% %arg7% %arg8% %arg9% %arg10% 