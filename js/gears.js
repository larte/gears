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


var Gear = function(cogsize, chainringsize){
    var self = this;
    this.cog = cogsize;
    this.ch  = chainringsize;

    self.inches = function() {
        return 26.216 * (self.ch / self.cog);
    }

    self.ratio = function() {
        return (self.ch / self.cog);
    }

    self.speed_at = function(cad) {
        return (0.0000254 * (cad * ( self.ratio() * (26.216 * Math.PI)) * 60.0));
    }


    self.time = function(cad, dist) {
        var sec = (dist / (self.speed_at(cad) / 3.6)).toFixed(3);
        if (sec >= 60.0)
            return sec.toMMSS();
        return sec;
    }


    self.equivalent = function(cogsize, chsize) {
        var rat = self.ratio();
        var res = {"up":   {"ratio":rat + 1.0, "cog": 0, "chainring": 0},
                   "down": {"ratio":rat - 1.0, "cog": 0, "chainring": 0}};

        var erat = 0.0;
        for (var cog = 11; cog  < 17; cog++){
            for (var ch = 47; ch < 60; ch++) {
                var eg = new Gear(cog,ch);
                erat = eg.ratio();
                if ( (erat < rat) && ( erat > res["down"]["ratio"] ) ){
                    res["down"] = {"ratio": erat, inches: eg.inches().toFixed(2),
                                   "cog": cog, "chainring": ch}
                }
                else if ( (erat > rat) && (erat < res["up"]["ratio"]) ){
                    res["up"] = {"ratio": erat, inches: eg.inches().toFixed(2),
                                 "cog": cog, "chainring": ch}
                }

            }
        }
        return res;
    }

    return self;
};



var app = angular.module('gears', ['ui.bootstrap','rzModule']);

app.controller('Main', function ($rootScope, $scope, $modal){

    $scope.chainSlider = 50;
    $scope.cogSlider = 13;
    $scope.cadenceSlider = 100;

    $scope.calculate = function () {
        var cr = parseFloat($scope.chainSlider);
        var cog = parseFloat($scope.cogSlider);
        var cad = parseFloat($scope.cadenceSlider);

        var g = new Gear(cog, cr);

        $scope.gearInches = g.inches().toFixed(2);
        $scope.gearRatio  = g.ratio().toFixed(2);
        $scope.gearSpeed  = g.speed_at(cad).toFixed(2);
        $scope.gearTt     = g.time(cad, 200.0);
        var equivs        = g.equivalent();
        $scope.equiv_up   = equivs["up"];
        $scope.equiv_down = equivs["down"];

        $scope.$apply();
    };

    $scope.$on("slideEnded", function() {
        $scope.calculate();
    });

    angular.element(document).ready(function () {
        $scope.calculate();
    });

});
