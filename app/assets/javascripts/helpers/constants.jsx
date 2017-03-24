/*
Constants for pathing & g-code generation
Recommended feeds & speeds from https://othermachine.co/support/materials/wood/
Everything currently in inches or inches/minute
*/

// NEED TO CHANGE THESE TO REFLECT CHANGES IN G-CODE (mm vs inches)
const bit = 0.1250;             // Our bit is 1/8th inch
const offset = 0.58579 * bit;   // We offset for the 90 degree angles ((2 - sqrt(2))x)
const cutFeed = 24;             // feed rate
const plungeFeed = 1.5;
const plunge = 1.6;             // plunge rate
const spindle = 12000;          // RPM
const passDepth = 0.010;        // Maximum pass depth
const zHeight = 0.5;            // Height above actual 0 (to change cuts)
const discStep = 0.005;         // Discretization step of 5 mil

// These should not change, so we define them here
const setWCS = "G55 (set work coordinate system)\n"
const setUnits = "G20 (set unit to inches)\n"; // G21 if we switch to mm
const setAbs = "G90 (set to absolute distance mode)\n";

// G-code we'll use often
const zUp = "G0 Z" + zHeight + "\n"; // Full speed!
const home = "G28 X Y\n";
const spindleOn = "M3 S" + spindle + " (spindle on)\n";
const spindleOff = "M5 (spindle off)";
