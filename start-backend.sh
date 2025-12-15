#!/bin/bash

cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

echo "🎄 Starting Backend Server..."
source venv/bin/activate
pip install -q -r requirements.txt
uvicorn main:app --reload
