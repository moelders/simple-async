describe('simple-async library', function() {
  var sAsync = require('../../../app/lib/s-async.js'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

  chai.use(require('sinon-chai'));

  it('should be defined', function() {
    expect(sAsync).to.not.be.null.and.to.not.be.undefined;
    expect(sAsync).to.be.an('object');
  });

  describe('methods:', function() {
    describe('noConflict', function() {
      it('should have the \'noConflict\' method', function() {
        expect(sAsync.noConflict).to.not.be.null.and.to.not.be.undefined;
        expect(sAsync.noConflict).to.be.a('function');
      });

      it('should return the simple-async class', function() {
        expect(sAsync.noConflict()).to.be.deep.equal(sAsync);
      });
    });

    describe('doSeries', function() {
      it('should have the \'doSeries\' method', function() {
        expect(sAsync.doSeries).to.not.be.null.and.to.not.be.undefined;
        expect(sAsync.doSeries).to.be.a('function');
      });

      it('should not return anything', function() {
        expect(sAsync.doSeries([], function() {})).to.be.undefined;
      });
    });

    describe('doParallel', function() {
      it('should have the \'doParallel\' method', function() {
        expect(sAsync.doParallel).to.not.be.null.and.to.not.be.undefined;
        expect(sAsync.doParallel).to.be.a('function');
      });

      it('should not return anything', function() {
        expect(sAsync.doParallel([], function() {})).to.be.undefined;
      });
    });
  });
});
