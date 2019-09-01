describe('okdService tests', function (){
  var okdService;
  
  // excuted before each "it" is run.
  beforeEach(function (){
    
    // load the module.
    module('okd');
    
    // inject your service for testing.
    // The _underscores_ are a convenience thing
    // so you can have your variable name be the
    // same as your injected service.
    inject(function(_okdService_) {
      okdService = _okdService_;
    });
  });
     
  // check to see if it has the expected function
  it('should have a getAllAccounts function', function () { 
    expect(angular.isFunction(okdService.getAllAccounts)).toBe(true);
  });
  

});