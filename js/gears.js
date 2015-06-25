function inches(cogsize, chsize) {
    return 26.216 * ( chsize / cogsize);
};

function ratio(cogsize, chsize) {
    return chsize / cogsize;
};

function kmh(cogsize, chsize, cad) {
    var rat = ratio(cogsize, chsize);
    var res = 0.0000254 * (cad * (rat * ( 26.216 * Math.PI)) * 60.0);
    return res;

}

function tt(cogsize, chsize, cad) {
    var speed = kmh(cogsize, chsize, cad);
    return (200.0 / (speed / 3.6)).toFixed(3);
}

var app = angular.module('gears', ['ui.bootstrap','rzModule']);

app.controller('Main', function($rootScope,$scope,$modal){

    $scope.chainSlider = 50;
    $scope.cogSlider = 15;
    $scope.cadenceSlider = 100;

    $scope.calculate = function() {
        var cr = parseFloat($scope.chainSlider);
        var cog = parseFloat($scope.cogSlider);
        var cad = parseFloat($scope.cadenceSlider);

        var inc   = inches(cog, cr).toFixed(2);
        var rat = ratio(cog, cr).toFixed(2);
        var speed = kmh(cog, cr, cad).toFixed(2);
        var tt2   = tt(cog, cr, cad);

        $scope.gearInches = inc;
        $scope.gearRatio = rat;
        $scope.gearSpeed = speed;
        $scope.gearTt = tt2;
        $scope.$apply();
    };

    $scope.$on("slideEnded", function() {
        //alert("Slide ended" + $scope.chainSlider);
        $scope.calculate();
    });

    angular.element(document).ready(function () {
        $scope.calculate();
    });

});
