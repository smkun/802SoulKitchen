#!/bin/bash

# Quick script to deploy Firestore rules
echo "🚀 Deploying Firestore rules to Firebase..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✅ Firestore rules deployed successfully!"
else
    echo "❌ Failed to deploy Firestore rules"
    exit 1
fi