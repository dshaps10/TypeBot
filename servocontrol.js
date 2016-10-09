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
function move (destinations, callback) {

}

// Export the public methods
module.exports = {
  init: init,
  move: move
}
