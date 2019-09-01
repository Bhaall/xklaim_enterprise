describe("app module", function () {
    beforeEach(module("okd"));

    describe("newLocationsCtrl", function () {
        var scope,
            controller;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller;
        }));

        it("should assign currentPage to 0", function () {
            controller("newLocationsCtrl", {$scope: scope});
            expect(scope.currentPage).toBe(0);
        });
    });
});