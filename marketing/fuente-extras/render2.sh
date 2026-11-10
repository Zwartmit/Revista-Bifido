#!/bin/bash
SH="C:/TEMPTO~1/claude/8d74d8464298caea/874b6b2b-4c61-4a75-bbf6-2bb87e1b0979/scratchpad/carousel"
C="/c/Program Files/Google/Chrome/Application/chrome.exe"
mkdir -p "$SH/out2"
for n in "$@"; do
  W=$(cygpath -w "$SH/$n.html")
  "$C" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1350 --allow-file-access-from-files --virtual-time-budget=6000 --screenshot="$(cygpath -w "$SH/out2/$n.png")" "file:///$(echo "$W" | sed 's#\#/#g; s# #%20#g')" >/dev/null 2>&1
done
ls out2 | wc -l
