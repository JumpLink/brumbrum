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

var getOutOfPageWidth = function (width) {
  var page = getPageSize();
  return result = (page.width + width) / 2 ;
}

/**
 * Alle benötigten SVG Dateien laden
 */
var prepare = function (callback) {
  var cars = [], house;
  Snap.load("assets/images/folienhaus_logo.svg", function (svg) {
    house = {
      selector: selector = '#house',
      svg: svg,
      element: svg.select(selector),
      width: 656,
      height: 344
    };
    Snap.load("assets/images/folienhaus_cars-01.svg", function (svg) {
      cars.push({
        selector: selector = '#car',
        svg: svg,
        element: svg.select(selector),
        width: 256,
        height: 112
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
            width: 265,
            height: 109
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

/**
 * Darauf warten, dass die Seite vollständig geladen wurde.
 */
$(document).ready(function() {

  var level0 = Snap("#level0"); // level 0 - Ebene unter dem Haus
  var level1 = Snap("#level1"); // level 1 - auf gleicher Ebene wie das Haus bzw. Ebene für das Haus
  var cars = [];
  var house;
  var driveInTime = 4; // seconds
  var stayTime = 3; // seconds
  var driveOutTime = 2; // seconds

  prepare(function (error, data) {
    house = data.house;
    cars = data.cars;
    
    level1.append(house.svg); // Car wird automatisch mittig in der SVG plaziert, da width: 100%

    level0.append(cars[0].svg); // Car wird automatisch mittig in der SVG plaziert, da width: 100%
    
    // Für die Animation wird move.js verwendet: http://visionmedia.github.io/move.js/

    // Auto startet außerhalb der Seite
    move('#car').x(getOutOfPageWidth(cars[0].width) * -1).duration('0s').end();

    // Auto fährt ins Haus 
    move('#car').ease('out').x(0).duration(driveInTime+'s').end();

    // Auto bleibt 3000 ms stehen
    setTimeout(function(){

      // Auto fährt wieder raus 
      move('#car').ease('in').x(getOutOfPageWidth(cars[0].width)).duration(driveOutTime+'s').end();

    }, (driveInTime * 1000) + (stayTime * 1000));


  });


});