#! /bin/bash

set -e # nodelete, important for latex debug output

mkdir -p tmp
touch tmp/texput.tex
echo "$1" > tmp/texput.tex

#timeout 1s latex -interaction=batchmode -halt-on-error --output-directory="$(pwd)/tmp" tmp/texput.tex
latex -interaction=batchmode -halt-on-error -output-directory="$(pwd)/tmp" tmp/texput.tex
if [ $? -ne 0 ]; then
  exit -6;
fi

#pdfcrop tmp/texput.pdf tmp/texput.pdf
#pdf2svg tmp/texput.pdf tmp/$2.svg
dvisvgm --no-fonts -o tmp/$2.svg tmp/texput.dvi
if [ $? -ne 0 ]; then
  exit -7;
fi
