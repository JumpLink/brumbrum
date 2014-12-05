/**
 * Ermittelt die Webseiten Breite und Höhe.
 * Inspiration: http://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
 */
var getPageSize = function () {
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width = w.innerWidth || e.clientWidth || g.clientWidth,
    height = w.innerHeight || e.clientHeight || g.clientHeight;

  return {width:width, height:height};
}

/**
 * Alle benötigten SVG Dateien angular.identity()
 */
var prepare = function (callback) {
  var cars = [], house;
  Snap.load("assets/images/folienhaus_logo.svg", function (svg) {
    house = {
      selector: selector = '#house',
      svg: svg,
      element: svg.select(selector),
      width: 342,
      height: 150
    };
    Snap.load("assets/images/folienhaus_cars-01.svg", function (svg) {
      cars.push({
        selector: selector = '#car',
        svg: svg,
        element: svg.select(selector),
        width: 256,
        height: 150
      });
      Snap.load("assets/images/folienhaus_cars-02.svg", function (svg) {
        cars.push({
          selector: selector = '#car',
          svg: svg,
          element: svg.select(selector),
          width: 294,
          height: 97
        });
        Snap.load("assets/images/folienhaus_cars-03.svg", function (svg) {
          cars.push({
            selector: selector = '#car',
            svg: svg,
            element: svg.select(selector),
            width: 365,
            height: 150
          });
          Snap.load("assets/images/folienhaus_cars-04.svg", function (svg) {
            cars.push({
              selector: selector = '#car',
              svg: svg,
              element: svg.select(selector),
              width: 292,
              height: 101
            });
            Snap.load("assets/images/folienhaus_cars-05.svg", function (svg) {
              cars.push({
                selector: selector = '#car',
                svg: svg,
                element: svg.select(selector),
                width: 302,
                height: 124
              });
              Snap.load("assets/images/folienhaus_cars-06.svg", function (svg) {
                cars.push({
                  selector: selector = '#car',
                  svg: svg,
                  element: svg.select(selector),
                  width: 295,
                  height: 99
                });
                callback(null, {house:house, cars:cars});
              });
            });
          });
        });
      });
    });
  });
}

// TODO center punkt finden
var wheelAnimation = function (level0) {
  var wheel = level0.select('#wheel1');
  wheel.stop().animate(
    { transform: 'r90,256,256'}, // Basic rotation around a point. No frills.
    1000, // drehgeschwindigkeit
    function() { 
      wheel.attr({ transform: 'rotate(0 256 256)'}); // Reset the position of the wheel.
      wheelAnimation(); // Repeat this animation so it appears infinite.
    }
  );
}

/*
 * Ins Haus fahren, warten und weiter fahren.
 * callback wird am Ende der Animtion aufgerufen.
 */
var driveAnimation = function (level0, car, callback) {
  var driveInTime = 4;    // seconds
  var stayTime = 3;       // seconds
  var driveOutTime = 2;   // seconds
  var x = 0;

  level0.append(car.svg);   // cars[0].svg wird automatisch mittig in der SVG plaziert, da width: 100%

  // wheelAnimation(level0);

  // Auto startet außerhalb der Seite
  x = (((getPageSize().width + car.width) / 2 ) * -1) + 200 // berechnet den linken Außenbereich der Seite + 200px zur Sicherheit (falls das Browserfenster vergrößert wird)
  move('#car').x(x).duration('0s').end(function(){
    // Auto fährt ins Haus 
    x = 0; // Null ist center innerhalt der SVG
    move('#car').ease('out').x(x).duration(driveInTime+'s').end(function () {
      // Auto bleibt 3000 ms stehen
      setTimeout(function(){
        // Auto fährt wieder raus
        x = ((getPageSize().width + car.width) / 2 ) + 200 // berechnet den rechten Außenbereich der Seite + 200px zur Sicherheit (falls das Browserfenster vergrößert wird)
        move('#car').ease('in').x(x).duration(driveOutTime+'s').end(function () {
          callback();
        });
      }, (stayTime * 1000));
    });
  });
}

/*
 * Animationsinterval, ruft immer und immer wieder die Animation auf (rekursiv).
 */
var driveAnimationInterval = function (level0, cars) {
  var duration = 4;       // seconds, Zeit die zwischen den Animationen vergeht
  console.log("neuer Interval");
  driveAnimation(level0, cars[0], function () {
    setTimeout(function(){
      driveAnimationInterval(level0, cars);
    }, (duration * 1000));
  });
}

/**
 * Darauf warten, dass die Seite vollständig geladen wurde.
 * Für das dynamische einbinden und manipulieren von Vektorgrafiken wird Snap.svg verwendet: http://snapsvg.io/
 * Für die Animation wird move.js verwendet: http://visionmedia.github.io/move.js/
 */
$(document).ready(function() {
  var level0 = Snap("#level0"); // level 0 - Ebene unter dem Haus
  var level1 = Snap("#level1"); // level 1 - auf gleicher Ebene wie das Haus bzw. Ebene für das Haus
  var cars = [];
  var house;
  prepare(function (error, data) {
    house = data.house;
    cars = data.cars;
    
    level1.append(house.svg);     // house.svg wird automatisch mittig in der SVG plaziert, da width: 100%

    driveAnimationInterval(level0, cars);

  });


});