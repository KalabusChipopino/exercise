#!/bin/bash

SERVER_URL="http://localhost:3002"
curl -X POST -H "Content-Type: text/plain" -d "$(cat ./dummy_latex.tex)" "$SERVER_URL"
