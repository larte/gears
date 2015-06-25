"use strict";
function inches(cogsize, chsize) {
    return 26.216 * (chsize / cogsize);
}

function ratio(cogsize, chsize) {
    return chsize / cogsize;
}

function kmh(cogsize, chsize, cad) {
    var rat = ratio(cogsize, chsize);
    var res = 0.0000254 * (cad * (rat * (26.216 * Math.PI)) * 60.0);
    return res;

}

function tt(cogsize, chsize, cad) {
    var speed = kmh(cogsize, chsize, cad);
    return (200.0 / (speed / 3.6)).toFixed(3);
}

var app = angular.module('gears', ['ui.bootstrap','rzModule']);

app.controller('Main', function ($rootScope, $scope, $modal){

    $scope.chainSlider = 50;
    $scope.cogSlider = 15;
    $scope.cadenceSlider = 100;

    $scope.calculate = function () {
        var cr = parseFloat($scope.chainSlider);
        var cog = parseFloat($scope.cogSlider);
        var cad = parseFloat($scope.cadenceSlider);

        $scope.gearInches = inches(cog, cr).toFixed(2);
        $scope.gearRatio  = ratio(cog, cr).toFixed(2);
        $scope.gearSpeed  = kmh(cog, cr, cad).toFixed(2);
        $scope.gearTt     = tt(cog, cr, cad);

        $scope.$apply();
    };

    $scope.$on("slideEnded", function() {
        $scope.calculate();
    });

    angular.element(document).ready(function () {
        $scope.calculate();
    });

});
