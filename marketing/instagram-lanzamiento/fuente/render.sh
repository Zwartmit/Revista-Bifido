#!/bin/bash
SH="C:/TEMPTO~1/claude/8d74d8464298caea/874b6b2b-4c61-4a75-bbf6-2bb87e1b0979/scratchpad/carousel"
C="/c/Program Files/Google/Chrome/Application/chrome.exe"
mkdir -p "$SH/out"
for n in ${@:-01 02 03 04 05 06 07}; do
  W=$(cygpath -w "$SH/slide_$n.html" 2>/dev/null || echo "$SH/slide_$n.html")
  "$C" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1350 --allow-file-access-from-files --virtual-time-budget=6000 --screenshot="$(cygpath -w "$SH/out/slide_$n.png" 2>/dev/null || echo "$SH/out/slide_$n.png")" "file:///$(echo "$W" | sed 's#\#/#g; s# #%20#g')" >/dev/null 2>&1
  ffprobe -v error -show_entries stream=width,height -of csv=p=0 "$SH/out/slide_$n.png" | sed "s/^/slide_$n /"
done
