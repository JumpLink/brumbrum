var driveInTime = 4;    // seconds
var stayTime = 3;       // seconds
var driveOutTime = 2;   // seconds
var x = 0;
var duration = 4;       // seconds, Zeit die zwischen den Animationen vergeht
var level1 = null;
var level0 = null;
var cars = []
var house;

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
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 * Quelle: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var moveToStartPosition = function (car, callback) {
  $(car.selector).hide();
  x = (car.width + 200) * -1;
  move(car.selector).x(x).duration('0s').end(function () {
    $(car.selector).show();
    callback();
  });
}

var moveToCenterPosition = function (car, callback) {
  x = (getPageSize().width - car.width) / 2;
  move(car.selector).ease('out').x(x).duration(driveInTime+'s').end(callback);
}

var waitOnPosition = function (callback) {
  setTimeout(callback, (stayTime * 1000));
}

var moveToEndPosition = function (car, callback) {
  x = getPageSize().width + car.width;
  move(car.selector).ease('in').x(x).duration(driveOutTime+'s').end(function () {
    callback();
  });
}

/**
 * Alle benötigten SVG Dateien angular.identity()
 */
var prepare = function (callback) {
  
  Snap.load("assets/images/folienhaus_logo.svg", function (svg) {
    house = {
      selector: selector = '#house',
      svg: svg,
      element: svg.select(selector),
      width: 342,
      height: 150
    };

    level1.append(house.svg);     // house.svg wird automatisch mittig in der SVG plaziert, da width: 100%

    Snap.load("assets/images/folienhaus_cars-00.svg", function (svg) {
      var car = {
        selector: selector = '#car',
        svg: svg,
        element: svg.select(selector),
        width: 256,
        height: 150
      };

      // Ändere ID um sie eindeutig zu machen (es dürfen nicht alle autos die selbe id haben)
      level0.append(car.element);   // cars[0].svg wird automatisch mittig in der SVG plaziert, da width: 100%
      moveToStartPosition(car, function() {

      });
      $(car.selector).attr('id', 'car0');
      car.selector = '#car0';
      cars.push(car);

      Snap.load("assets/images/folienhaus_cars-01.svg", function (svg) {
        var car = {
          selector: selector = '#car',
          svg: svg,
          element: svg.select(selector),
          width: 294,
          height: 97
        };

        level0.append(car.element);
        moveToStartPosition(car, function() {

        });
        $(car.selector).attr('id', 'car1');
        car.selector = '#car1';
        cars.push(car);

        Snap.load("assets/images/folienhaus_cars-02.svg", function (svg) {
          var car = {
            selector: selector = '#car',
            svg: svg,
            element: svg.select(selector),
            width: 365,
            height: 150
          };

          level0.append(car.element);
          moveToStartPosition(car, function(){

          });
          $(car.selector).attr('id', 'car2');
          car.selector = '#car2';
          cars.push(car);

          Snap.load("assets/images/folienhaus_cars-03.svg", function (svg) {
            var car = {
              selector: selector = '#car',
              svg: svg,
              element: svg.select(selector),
              width: 292,
              height: 101
            };

            level0.append(car.element);
            moveToStartPosition(car, function(){

            });
            $(car.selector).attr('id', 'car3');
            car.selector = '#car3';
            cars.push(car);

            Snap.load("assets/images/folienhaus_cars-04.svg", function (svg) {
              var car = {
                selector: selector = '#car',
                svg: svg,
                element: svg.select(selector),
                width: 302,
                height: 124
              };

              level0.append(car.element);
              moveToStartPosition(car, function(){

              });
              $(car.selector).attr('id', 'car4');
              car.selector = '#car4';
              cars.push(car);

              Snap.load("assets/images/folienhaus_cars-05.svg", function (svg) {
                var car = {
                  selector: selector = '#car',
                  svg: svg,
                  element: svg.select(selector),
                  width: 295,
                  height: 99
                };

                level0.append(car.element);
                moveToStartPosition(car, function(){

                });
                $(car.selector).attr('id', 'car5');
                car.selector = '#car5';
                cars.push(car);

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
// var wheelAnimation = function () {
//   var wheel = level0.select('#wheel1');
//   wheel.stop().animate(
//     { transform: 'r90,256,256'}, // Basic rotation around a point. No frills.
//     1000, // drehgeschwindigkeit
//     function() { 
//       wheel.attr({ transform: 'rotate(0 256 256)'}); // Reset the position of the wheel.
//       wheelAnimation(); // Repeat this animation so it appears infinite.
//     }
//   );
// }

/*
 * Ins Haus fahren, warten und weiter fahren.
 * callback wird am Ende der Animtion aufgerufen.
 */
var driveAnimation = function (car, callback) {
  // Auto fährt ins Haus 
  moveToCenterPosition(car, function () {
    // Auto bleibt stehen
    waitOnPosition(function () {
      // Auto fährt wieder raus
      moveToEndPosition(car, function () {
        // Auto startet außerhalb der Seite
        moveToStartPosition(car, callback);
      });
    });
  });
}

/*
 * Animationsinterval, ruft immer und immer wieder die Animation auf (rekursiv).
 */
var driveAnimationInterval = function (count) {
  var carIndex = getRandomInt(0, cars.length-1);
  console.log(count+": neuer Interval mit car index: "+carIndex);
  driveAnimation(cars[carIndex], function () {
    setTimeout(function() {
      driveAnimationInterval(++count);
    }, (duration * 1000));
  });
}

/**
 * Darauf warten, dass die Seite vollständig geladen wurde.
 * Für das dynamische einbinden und manipulieren von Vektorgrafiken wird Snap.svg verwendet: http://snapsvg.io/
 * Für die Animation wird move.js verwendet: http://visionmedia.github.io/move.js/
 */
$(document).ready(function() {
  level0 = Snap('#level0'); // level 0 - Ebene unter dem Haus
  level1 = Snap("#level1");     // level 1 - auf gleicher Ebene wie das Haus bzw. Ebene für das Haus

  prepare(function (error, data) {
    driveAnimationInterval(0);
  });


});