var five = require('johnny-five');
var positions = {};
var servos = {};
var opts;

// Initialize servo controller module
function init(board, options, callback) {

  // Store options for use with move()
  opts = options;

  // Initialize the servos
  for (var servo in options.servos) {

    // Alias servo config for easy access
    var servoConfig = options.servos[servo];

    // Store start position as the current position
    positions[servo] = servoConfig.startPosition;

    // Create servo instance
    servos[servo] = new five.Servo({
      pin: servoConfig.pin,
      isInverted: servoConfig.isInverted
    });

    // Move servo to starting position
    servos[servo].to(positions[servo]);
  }

  // Wait for servos to move to starting positions
  setTimeout(callback, 1000);
}

// Move the servos
function move(destinations, callback) {

  // Find largest servo angle change
  var largestChange = 0;
  for (var servo in destinations) {
    var delta = Math.abs(destinations[servo] - positions[servo]);
    if (delta > largestChange) {
      largestChange = delta;
    }
  }

  // If none of servos need to move, end here
  if (largestChange === 0) {
    process.nextTick(callback);
    return;
  }

  // Calculate how long we should take to move
  var duration = largestChange / opts.rate;

  // Move servos to destinations
  for (servo in destinations) {
    positions[servo] = destinations[servo];
    servos[servo].to(destinations[servo], duration);
  }

  // Wait until done to and call the callback function
  setTimeout(callback, duration + opts.settleTime);
}

// Export the public methods
module.exports = {
  init: init,
  move: move
}
