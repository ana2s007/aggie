'use strict';

var expect = chai.expect;

describe('LoginController', function () {
  var scope, controller, httpBackend;

  beforeEach(module('Aggie'));
  beforeEach(module('aggie.templates'));

  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    scope.user = { username: 'bob', password: 'secret' };
    httpBackend = $httpBackend;

    controller = $controller('LoginController', { 
      $scope: scope
    });

    // TODO: these should not execute before user is login
    httpBackend.when('GET', '/api/v1/report?page=0').respond(200, {});
    httpBackend.when('GET', '/api/v1/source').respond(200, []);
    httpBackend.when('GET', '/api/v1/incident').respond(200, {});
    httpBackend.when('GET', '/session').respond(200, {});
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should set currentUser', function () {
    httpBackend.when('POST', '/login', scope.user).respond(200, { id: 1 });
    scope.login();
    httpBackend.flush();
    expect(scope.currentUser).to.deep.equal({ id: 1 });
  });

  it('should navigate to reports after login', inject(function($state) {
    httpBackend.when('POST', '/login', scope.user).respond(200, { id: 1 });
    scope.login();
    httpBackend.flush();
 
    expect($state.current.name).to.equal('reports');
    
  }));
});