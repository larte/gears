"use strict";

String.prototype.toMMSS = function () {
    var sec_num = parseFloat(this);
    var hours   = Math.floor(sec_num / 3600.0);
    var minutes = Math.floor(((sec_num - (hours * 3600.0)) / 60.0 + (hours * 60.0)));
    var seconds = sec_num - (hours * 3600.0) - (minutes * 60.0);


    seconds = parseFloat(seconds).toFixed(3);
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = minutes+':'+ seconds;
    return time;
};

var app = angular.module('gears', ['ui.bootstrap','rzModule']);

app.controller('Main', function ($rootScope, $scope, $modal){

    $scope.chainSlider = 50;
    $scope.cogSlider = 15;
    $scope.cadenceSlider = 100;


    $scope.inches = function(cogsize, chsize) {
        return 26.216 * (chsize / cogsize);
    };

    $scope.ratio = function(cogsize, chsize) {
        return chsize / cogsize;
    };

    $scope.kmh = function(cogsize, chsize,cad) {
        var rat = $scope.ratio(cogsize, chsize);
        var res = 0.0000254 * (cad * (rat * (26.216 * Math.PI)) * 60.0);
        return res;
    };


    $scope.tt = function(dist, cogsize, chsize, cad) {
        var speed = $scope.kmh(cogsize, chsize, cad);
        var sec = (dist / (speed / 3.6)).toFixed(3);
        if (sec >= 60.0)
            return sec.toMMSS();
        return sec;
    };


    $scope.calculate = function () {
        var cr = parseFloat($scope.chainSlider);
        var cog = parseFloat($scope.cogSlider);
        var cad = parseFloat($scope.cadenceSlider);

        $scope.gearInches = $scope.inches(cog, cr).toFixed(2);
        $scope.gearRatio  = $scope.ratio(cog, cr).toFixed(2);
        $scope.gearSpeed  = $scope.kmh(cog, cr, cad).toFixed(2);
        $scope.gearTt     = $scope.tt(200.0, cog, cr, cad);
        $scope.gear400    = $scope.tt(400.0, cog, cr, cad);
        $scope.gear500    = $scope.tt(500.0, cog, cr, cad);
        $scope.gear1000   = $scope.tt(1000.0, cog, cr, cad);

        $scope.$apply();
    };

    $scope.$on("slideEnded", function() {
        $scope.calculate();
    });

    angular.element(document).ready(function () {
        $scope.calculate();
    });

});
