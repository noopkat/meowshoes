  /*
  Analog input, serial output
 
  MEOW
 
 */


void setup() {
  
  // flag for user standing
  bool leftStand  = true;
  bool rightStand = true;

  // a foot tap is pending but not confirmed
  int pendingTapLeft  = -1;
  int pendingTapRight = -1;

  // setting up whether a pending foot tap times out or not
  int tapTimeoutLeftToe   = 0;
  int tapTimeoutRightToe  = 0;
  int tapTimeoutLeftHeel  = 0;
  int tapTimeoutRightHeel = 0;

  // these will store the analog values received from the pressure sensors
  int leftToeVal   = 0;
  int leftHeelVal  = 0;
  int rightToeVal  = 0;
  int rightHeelVal = 0;

  // constants defining the ardiuno analog pins used
  const int leftToePin   = 0;
  const int leftHeelPin  = 1;  
  const int rightToePin  = 2;  
  const int rightHeelPin = 3;  

  // how long the threshold is for a tap to timeout and not be confirmed
  // this number is the milliseconds divisible by 10 as we delay for 10ms between each read later
  const int tapTimeoutThresh = 30;
  
  // initialize serial communications at 9600 bps:
  Serial.begin(9600); 
}

void loop() {
  
  monitorFeet();
  
}

// this is the guts of it, the filter of the analog data into actual foot taps to be sent over serial
void monitorFeet() {
  
    // read *all* of the pins!
    leftToeVal   = analogRead(leftToePin);
    leftHeelVal  = analogRead(leftHeelPin);
    rightToeVal  = analogRead(rightToePin);
    rightHeelVal = analogRead(rightHeelPin);
    
    /* 
     * maybe I can make each foot an object and just check the left & right foot on loop 
     * like one function to check each foot to see what's being pressed and whether to send a tap
     * this is probably going to have to write to a custom low energy bluetooth service hmm
     * maybe for example:
     * 
     * {
     *   'pins'  :  [0,1],
     *   'parts' :  ['toe', 'heel']
     * } 
     * 
     * this should then be all that's required:
     * Foot leftFoot  = new Foot([0,1]); 
     * Foot rightFoot = new Foot([2,3]);
     * 
     * uint leftTap  = leftFoot.checkTap();
     * uint rightTap = rightFoot.checkTap();
     * 
     * if (leftTap > -1)
     *   sendTap(leftTap);
     * 
     * if (rightTap > -1)
     *   sendTap(rightTap);
     * 
     * this might just work ya know
     * wait wait, this is gonna be split up by feet anyway, one sketch per foot. 
     * do I need to send a different pin no per sensor, or just 0 & 1 and then
     * filter by which serial channel node is receiving values from?
     * this is something I should really think about
     * of course making this sketch be simple to add multiple new feet all the time is still useful
     * 
     */
    
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
    if (isPressed(leftToeVal) && !isPressed(leftHeelVal)) {
        pendingTapLeft = leftToePin;
        tapTimeoutLeftToe++;
      
    // if left heel is pressed, set pending tap and increment time tapped for
    // make sure to check that toe is not also down, otherwise the user is standing/pausing
     } else if (isPressed(leftHeelVal) && !isPressed(leftToeVal)) {
        pendingTapLeft = leftHeelPin;
        tapTimeoutLeftHeel++;
      
    // if right heel is pressed, set pending tap and increment time tapped for
    // make sure to check that toe is not also down, otherwise the user is standing/pausing
     } else if (isPressed(rightHeelVal) && !isPressed(rightToeVal)) {
        pendingTapRight = rightHeelPin;
        tapTimeoutRightHeel++;
    
    // if right toe is pressed, set pending tap and increment time tapped for
    // make sure to check that heel is not also down, otherwise the user is standing/pausing
     } else if (isPressed(rightToeVal) && !isPressed(rightHeelVal)) {
        pendingTapRight = rightToePin;
        tapTimeoutRightToe++;
     
     } else {
      // their foot came back up 
       pendingTapLeft = -1;
       tapTimeoutLeftToe = 0; 
       delay(10);
    }
    
  // wait 10 milliseconds before the next loop
  // for the analog-to-digital converter to settle
  // after the last reading:
  delay(10);
}

// checks the sensor value to see if it's at a value suggesting pressure on it
bool isPressed(int val) {
      
  // this 30 val below will need to change when you solder the pins properly :P
  // it'll most likely be like 995 or something similar
  // that number is calibrated to my weight, tap strength and particular sensors
  if (val < 30) 
    return true else return false;

}

// prints the pin number to serial for javascript to pick up and use to play and sequence sounds
void sendTap(int pinNo) {
    // print the pin number to serial, node can recognise it and go from there
     Serial.println(pinNo);
     
     // not sure why this delay is in here, I think it was a desparate hackathon move
     delay(10);
}
