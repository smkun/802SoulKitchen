#!/bin/bash

# Quick Firebase project status check
echo "🔍 Firebase Project Status:"
echo "=========================="

echo "📋 Current Project:"
firebase projects:list | grep "(current)"

echo ""
echo "📊 Firestore Databases:"
firebase firestore:databases:list

echo ""
echo "🏠 Project Console:"
echo "https://console.firebase.google.com/project/soulkitchen-9e6b2/overview"