  /*
  Analog input, serial output
 
  MEOW
 
 */
 
bool leftStand = true;
bool rightStand = true;

int pendingTapLeft = -1;
int pendingTapRight = -1;
int tapTimeoutLeftToe = 0;
int tapTimeoutRightToe = 0;
int tapTimeoutLeftHeel = 0;
int tapTimeoutRightHeel = 0;

int leftToeVal = 0;
int leftHeelVal = 0;
int rightToeVal = 0;
int rightHeelVal = 0;

// These constants won't change.  They're used to give names
// to the pins used:
const int leftToePin = 0;
const int leftHeelPin = 1;  
const int rightToePin = 2;  
const int rightHeelPin = 3;  
const int tapTimeoutThresh = 30;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600); 
}

void loop() {
     
    // read *all* of the pins!
    leftToeVal = analogRead(leftToePin);
    leftHeelVal = analogRead(leftHeelPin);
    rightToeVal = analogRead(rightToePin);
    rightHeelVal = analogRead(rightHeelPin);
    
    // if tap is already pending, and the tap lasted for at least 300 milliseconds
    if ((pendingTapLeft != -1) && (tapTimeoutLeftToe >= tapTimeoutThresh)) {
      // send tap
      sendTap(pendingTapLeft);
      pendingTapLeft = -1;
      tapTimeoutLeftToe = 0;
    } 
    
    // if tap is already pending, and the tap lasted for at least 300 milliseconds
    if ((pendingTapLeft != -1) && (tapTimeoutLeftHeel >= tapTimeoutThresh)) {
      // send tap
      sendTap(pendingTapLeft);
      pendingTapLeft = -1;
      tapTimeoutLeftHeel = 0;
    } 
    
     // if tap is already pending, and the tap lasted for at least 300 milliseconds
    if ((pendingTapRight != -1) && (tapTimeoutRightToe >= tapTimeoutThresh)) {
      // send tap
      sendTap(pendingTapRight);
      pendingTapRight = -1;
      tapTimeoutRightToe = 0;
    } 
    
    // if tap is already pending, and the tap lasted for at least 300 milliseconds
    if ((pendingTapRight != -1) && (tapTimeoutRightHeel >= tapTimeoutThresh)) {
      // send tap
      sendTap(pendingTapRight);
      pendingTapRight = -1;
      tapTimeoutRightHeel = 0;
    } 
    
    // if left toe is pressed, set pending tap and increment time tapped for
    // make sure to check that heel is not also down, otherwise the user is standing/pausing
    if (isPressed(leftToeVal) == true && isPressed(leftHeelVal) == false) {
        pendingTapLeft = leftToePin;
        tapTimeoutLeftToe++;
      
     } else if (isPressed(leftHeelVal) == true && isPressed(leftToeVal) == false) {
        pendingTapLeft = leftHeelPin;
        tapTimeoutLeftHeel++;
      
     } else if (isPressed(rightHeelVal) == true && isPressed(rightToeVal) == false) {
        pendingTapRight = rightHeelPin;
        tapTimeoutRightHeel++;
      
     } else if (isPressed(rightToeVal) == true && isPressed(rightHeelVal) == false) {
        pendingTapRight = rightToePin;
        tapTimeoutRightToe++;
     
     
     } else {
      // their toe came back up
       pendingTapLeft = -1;
       tapTimeoutLeftToe = 0; 
       delay(10);
    }
    
  // wait 10 milliseconds before the next loop
  // for the analog-to-digital converter to settle
  // after the last reading:
  delay(10);                     
}

// checks the sensor value
bool isPressed(int val) {
      if (val < 30) {
        return true;
      } else {
        return false;
      }
}

// prints the pin number to serial for javascript to pick up and use to play and sequence sounds
void sendTap(int pinNo) {
     Serial.println(pinNo);
     delay(10);
}
