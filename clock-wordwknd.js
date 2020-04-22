/* Weekend Word Clock - A. Blanton
A remix of word clock
https://github.com/espruino/BangleApps/tree/master/apps/wclock
by Gordon Williams https://github.com/gfwilliams
-Changes the representation of time on weekends to be more casual and less accurate
-Shows accurate digital time only when button 1 is pressed.)
- Changes the color used to display time words based on night / day time.
*/
/* jshint esversion: 6 */
const allWordsWorkDay = [
    "ATWENTYD",
    "QUARTERY",
    "FIVEHALF",
    "DPASTORO",
    "FIVEIGHT",
    "SIXTHREE",
    "TWELEVEN",
    "FOURNINE"
];

const allWordsWeekend = [
    "AEARLYDN",
    "LATEYRZO",
    "MORNINGO",
    "KMIDDLEN",
    "AFTERDAY",
    "OFDZTHEC",
    "EVENINGR",
    "ORMNIGHT"
];


const hoursWeekend = {
    0: ["", 0, 0],
    1: ["EARLYMORNING", 10, 11, 12, 13, 14, 02, 12, 22, 32, 42, 52, 62],
    2: ["MORNING", 02, 12, 22, 32, 42, 52, 62],
    3: ["LATEMORNING", 01, 11, 21, 31, 02, 12, 22, 32, 42, 52, 62],
    4: ["MIDDAY", 13, 23, 33, 54, 64, 74],
    5: ["EARLYAFTERNOON", 10, 20, 30, 40, 50, 04, 14, 24, 34, 44, 70, 71, 72, 73],
    6: ["AFTERNOON", 04, 14, 24, 34, 44, 70, 71, 72, 73],
    7: ["LATEAFTERNOON", 01, 11, 21, 31, 04, 14, 24, 34, 44, 70, 71, 72, 73],
    8: ["EARLYEVENING", 10, 20, 30, 40, 50, 06, 16, 26, 36, 46, 56, 66],
    9: ["EVENING", 06, 16, 26, 36, 46, 56, 66],
    10: ["NIGHT", 37, 47, 57, 67, 77],
    11: ["MIDDLEOFTHENIGHT", 32, 33, 34, 35, 36, 37, 50, 51, 54, 55, 56, 73,74,75,76,77 ],
};



const hoursWorkDay = {
    0: ["", 0, 0],
    1: ["ONE", 17, 47, 77],
    2: ["TWO", 06, 16, 17],
    3: ["THREE", 35, 45, 55, 65, 75],
    4: ["FOUR", 07, 17, 27, 37],
    5: ["FIVE", 04, 14, 24, 34],
    6: ["SIX", 05, 15, 25],
    7: ["SEVEN", 05, 46, 56, 66, 67],
    8: ["EIGHT", 34, 44, 54, 64, 74],
    9: ["NINE", 47, 57, 67, 77],
    10: ["TEN", 74, 75, 76],
    11: ["ELEVEN", 26, 36, 46, 56, 66, 76],
    12: ["TWELVE", 06, 16, 26, 36, 56, 66]
};


const mins = {
    0: ["A", 0, 0],
    1: ["FIVE", 02, 12, 22, 32],
    2: ["TEN", 10, 30, 40],
    3: ["QUARTER", 01, 11, 21, 31, 41, 51, 61],
    4: ["TWENTY", 10, 20, 30, 40, 50, 60],
    5: ["HALF", 42, 52, 62, 72],
    6: ["PAST", 13, 23, 33, 43],
    7: ["TO", 43, 53]
};

// offsets and increments
const xs = 35;
const ys = 31;
const dy = 22;
const dx = 25;

// font size and color
const fontSize = 3;  // "6x8"
const passivColor = 0x3186 /*grey*/ ;
const activeColorNight = 0xF800 /*red*/ ;
const activeColorDay = 0xFFFF /* white */;

function drawWordClock() {


    // get time
    var t = new Date();
    var h = t.getHours();
    var m = t.getMinutes();
    var time = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);
    var day = t.getDay();
    var isWeekend = (day === 6) || (day === 0);

    var hidx;
    var midx = 0;
    var midxA = [];

    var activeColor = activeColorDay;
    if(h < 6 || h > 20) {activeColor = activeColorNight;}

    var allWords = allWordsWorkDay;
    var hours = hoursWorkDay;

    if(isWeekend) {
      allWords = allWordsWeekend;
      hours = hoursWeekend;
      showDigitalTime = false;
    }


    g.setFont("6x8",fontSize);
    g.setColor(passivColor);
    g.setFontAlign(0, -1, 0);

    // draw allWords
    var c;
    var y = ys;
    var x = xs;
    allWords.forEach((line) => {
        x = xs;
        for (c in line) {
            g.drawString(line[c], x, y);
            x += dx;
        }
        y += dy;
    });


    // calc indexes
    if (isWeekend)
    {

      // Switch case isn't good for this in Js apparently so...

      if(h < 3){
      // Middle of the Night
        hidx = 11;
      }
      else if (h < 7){
      // Early Morning
        hidx = 1;
      }
      else if (h < 10){
      // Morning
        hidx = 2;
      }
      else if (h < 12){
      // Late Morning
        hidx = 3;
      }
      else if (h < 13){
      // Midday
        hidx = 4;
      }
      else if (h < 14){
      // Early afternoon
        hidx = 5;
      }
      else if (h < 16){
      // Afternoon
        hidx = 6;
      }
      else if (h < 17){
      // Late Afternoon
        hidx = 7;
      }
      else if (h < 19){
      // Early evening
        hidx = 8;
      }
      else if (h < 21){
      // evening
        hidx = 9;
      }
      else if (h < 24){
      // Night
        hidx = 10;
      }


    }
    else{
      midx = Math.round(m / 5);
      hidx = h % 12;
      if (hidx === 0) { hidx = 12; }
      if (midx > 6) {
          if (midx == 12) { midx = 0; }
          hidx++;
      }
      if (midx !== 0) {
          if (midx <= 6) {
              midxA = [midx, 6];
          } else {
              midxA = [12 - midx, 7];
          }
      }
    }
  
      // write hour in active color
      g.setColor(activeColor);
      hours[hidx][0].split('').forEach((c, pos) => {
          x = xs + (hours[hidx][pos + 1] / 10 | 0) * dx;
          y = ys + (hours[hidx][pos + 1] % 10) * dy;

          g.drawString(c, x, y);
      });

  
      // write min words in active color
      midxA.forEach(idx => {
          mins[idx][0].split('').forEach((c, pos) => {
              x = xs + (mins[idx][pos + 1] / 10 | 0) * dx;
              y = ys + (mins[idx][pos + 1] % 10) * dy;
              g.drawString(c, x, y);
          });
      });

    // display digital time
    if (BTN1.read()){
        g.setColor(activeColor);
        g.clearRect(0, 215, 240, 240);
        g.drawString(time, 120, 215);
    } else { g.clearRect(0, 215, 240, 240); }
}

Bangle.on('lcdPower', function(on) {
  if (on) drawWordClock();
});

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
setInterval(drawWordClock, 1E4);
drawWordClock();

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});


// Show accurate time on weekends when button 3 is pressed.
setWatch(() => {
  g.clear();
  drawWordClock();
}, BTN1, {repeat:true, debounce:50, edge:"both" });

