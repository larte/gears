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
        var res = {"up": null, "down": null};

        var check_ratio = function(cog, ch, res) {
            var eq = new Gear(cog, ch);
            var eq_rat = eq.ratio();

            if ((cog < 11) || (cog > 17))
                return;

            if ((ch < 47) || (ch > 60))
                return;

            if ((eq_rat<rat) && (res.down == null || eq_rat > res.down.ratio())) {
                res.down = new Gear(cog, ch);
            }
            else if ((eq_rat > rat) && (res.up == null || eq_rat < res.up.ratio() )) {
                res.up = new Gear(cog, ch);
            }
        }


        var cogs = Array.apply(null, Array(5)).map(function(_,i) {return (self.cog - 2) + i;});
        var chainrings = Array.apply(null, Array(9)).map(function(_,i) {return (self.ch - 4) + i;});

        for (var i = 0; i  < cogs.length; i++) {
            for (var j = 0; j  < chainrings.length; j++) {
                check_ratio(cogs[i], chainrings[j], res);
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
        $scope.equiv_up   = equivs.up;
        $scope.equiv_down = equivs.down;

        $scope.$apply();
    };

    $scope.$on("slideEnded", function() {
        $scope.calculate();
    });

    angular.element(document).ready(function () {
        $scope.calculate();
    });

});
