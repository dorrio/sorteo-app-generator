const fs = require('fs');
const path = require('path');

// Simulate localized content (this is a basic check, real verification needs a build)
const es = require('../messages/es.json');
const en = require('../messages/en.json');

console.log("Checking ES Schema content:");
console.log("Feature 1:", es.GlobalSchema.feature_1);
if (es.GlobalSchema.feature_1 !== "Selector de Ganadores Aleatorios") {
    console.error("FAIL: ES feature_1 incorrect");
    process.exit(1);
}

console.log("Checking EN Schema content:");
console.log("Feature 1:", en.GlobalSchema.feature_1);
if (en.GlobalSchema.feature_1 !== "Random Winner Picker") {
    console.error("FAIL: EN feature_1 incorrect");
    process.exit(1);
}

console.log("SUCCESS: Schema messages are present.");
