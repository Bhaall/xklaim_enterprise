describe("app module", function () {
    beforeEach(module("okd"));

    describe("homeCtrl", function () {
        var scope,
            controller;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller;
        }));

        it("should assign submitted to false", function () {
            controller("homeCtrl", {$scope: scope});
            expect(scope.submitted).toBe(false);
        });
    });
});