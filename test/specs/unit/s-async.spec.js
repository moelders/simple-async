describe('simple-async library', function() {
  var sAsync = require('../../../lib/s-async.js'),
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
      it('should exist the method', function() {
        expect(sAsync.noConflict).to.not.be.null.and.to.not.be.undefined;
        expect(sAsync.noConflict).to.be.a('function');
      });

      it('should return the simple-async class', function() {
        expect(sAsync.noConflict()).to.be.deep.equal(sAsync);
      });
    });

    describe('doSeries', function() {
      it('should exist the method', function() {
        expect(sAsync.doSeries).to.not.be.null.and.to.not.be.undefined;
        expect(sAsync.doSeries).to.be.a('function');
      });

      it('should not return anything', function() {
        expect(sAsync.doSeries([], function() {})).to.be.undefined;
      });

      it('should not do anything without methods and end function', function() {
        expect(sAsync.doSeries()).to.be.undefined;
      });

      it('should not do anything without an array of methods', function() {
        expect(sAsync.doSeries('function1')).to.be.undefined;
      });

      it('should call the end method with false without an array of methods',
        function() {
          var end1 = sinon.spy(),
            end2 = sinon.spy();

          sAsync.doSeries('function1', end1);
          sAsync.doSeries(function() {}, end2);

          expect(end1).to.have.been.calledOnce.and.to.have.been
            .calledWithExactly(false);
          expect(end2).to.have.been.calledOnce.and.to.have.been
            .calledWithExactly(false);
        }
      );

      describe('with a list of correct methods', function() {
        var max = 3,
          timeout = 100,
          methods, spies, async, end, timer, i;

        function testMethod(i) {
          return function(next) {
            spies[i]();
            if (async) {
              setTimeout(function() {
                next();
              }, timeout);
            } else {
              next();
            }
          };
        }

        function doSeriesExpectations(spies, end, max) {
          var i;

          expect(end).to.be.calledOnce.and.to.be.calledWithExactly();
          for (i = 0; i < max - 1; i++) {
            expect(spies[i]).to.have.been.calledOnce.and.to.have.been
              .calledBefore(spies[i + 1]);
          }
          expect(spies[max - 1]).to.have.been.calledOnce.and.to.have.been
            .calledBefore(end);
        }

        beforeEach(function() {
          methods = [];
          spies = [];
          end = sinon.spy();
          timer = sinon.useFakeTimers();

          for (i = 0; i < max; i++) {
            spies[i] = sinon.spy();
            methods[i] = testMethod(i);
          }
        });

        afterEach(function() {
          timer.restore();
        });

        it('should execute all the synchronous methods in the same order in ' +
            'which they have been pushed in the array and call the end ' +
            'method without parameters',
          function() {
            async = false;

            sAsync.doSeries(methods, end);

            doSeriesExpectations(spies, end, max);
          }
        );

        it('should execute all the asynchronous methods in the same order in ' +
            'which they have been pushed in the array and call the end ' +
            'method without parameters',
          function(done) {
            async = true;

            sAsync.doSeries(methods, end);

            timer.tick(timeout * max);

            doSeriesExpectations(spies, end, max);

            done();
          }
        );
      });

      describe('with a list of incorrect methods', function() {
        var max = 5,
          timeout = 100,
          errorIndex = 2,
          errorDesc = 'error description',
          methods, spies, async, end, timer, i;

        function testMethod(i) {
          function _next(i, next) {
            if (i === errorIndex) {
              next(errorDesc);
            } else {
              next();
            }
          }

          return function(next) {
            spies[i]();
            if (async) {
              setTimeout(function(i, next) {
                _next(i, next);
              }, timeout, i, next);
            } else {
              _next(i, next);
            }
          };
        }

        function doSeriesExpectations(spies, end, errorIndex, max) {
          var i;

          expect(end).to.be.calledOnce.and.to.be.calledWithExactly(errorDesc);
          for (i = 0; i < errorIndex; i++) {
            expect(spies[i]).to.have.been.calledOnce.and.to.have.been
              .calledBefore(spies[i + 1]);
          }
          expect(spies[errorIndex]).to.have.been.calledOnce.and.to.have.been
            .calledBefore(end);
          for (i = errorIndex + 1; i < max; i++) {
            expect(spies[i]).to.have.not.been.called;
          }
        }

        beforeEach(function() {
          methods = [];
          spies = [];
          end = sinon.spy();
          timer = sinon.useFakeTimers();

          for (i = 0; i < max; i++) {
            spies[i] = sinon.spy();
            methods[i] = testMethod(i);
          }
        });

        afterEach(function() {
          timer.restore();
        });

        it('should only execute the first two synchronous methods in the ' +
            'same order in which they have been pushed in the array and call ' +
            'the end method with error',
          function() {
            async = false;

            sAsync.doSeries(methods, end);

            doSeriesExpectations(spies, end, errorIndex, max);
          }
        );

        it('should only execute the first two asynchronous methods in the ' +
            'same order in which they have been pushed in the array and call ' +
            'the end method with error',
          function(done) {
            async = true;

            sAsync.doSeries(methods, end);

            timer.tick(timeout * max);

            doSeriesExpectations(spies, end, errorIndex, max);

            done();
          }
        );
      });
    });

    describe('doParallel', function() {
      it('should exist the method', function() {
        expect(sAsync.doParallel).to.not.be.null.and.to.not.be.undefined;
        expect(sAsync.doParallel).to.be.a('function');
      });

      it('should not return anything', function() {
        expect(sAsync.doParallel([], function() {})).to.be.undefined;
      });

      it('should not do anything without methods and end function', function() {
        expect(sAsync.doParallel()).to.be.undefined;
      });

      it('should not do anything without an array of methods', function() {
        expect(sAsync.doParallel('function1')).to.be.undefined;
      });

      it('should call the end method with false without an array of methods',
        function() {
          var end1 = sinon.spy(),
            end2 = sinon.spy();

          sAsync.doParallel('function1', end1);
          sAsync.doParallel(function() {}, end2);

          expect(end1).to.have.been.calledOnce.and.to.have.been
            .calledWithExactly(false);
          expect(end2).to.have.been.calledOnce.and.to.have.been
            .calledWithExactly(false);
        }
      );

      describe('with a list of correct methods', function() {
        var max = 3,
          maxTimeout = 300,
          timeouts = [200, 300, 100],
          order = [2, 0, 1],
          methods, spies, async, end, timer, i;

        function testMethod(i) {
          return function(done) {
            if (async) {
              setTimeout(function(i) {
                spies[i]();
                done();
              }, timeouts[i], i);
            } else {
              spies[i]();
              done();
            }
          };
        }

        beforeEach(function() {
          methods = [];
          spies = [];
          end = sinon.spy();
          timer = sinon.useFakeTimers();

          for (i = 0; i < max; i++) {
            spies[i] = sinon.spy();
            methods[i] = testMethod(i);
          }
        });

        afterEach(function() {
          timer.restore();
        });

        it('should execute all the synchronous methods in the same order in ' +
            'they have been pushed in the arrayand call the end method ' +
            'without parameters',
          function() {
            async = false;

            sAsync.doParallel(methods, end);

            expect(end).to.be.calledOnce.and.to.be.calledWithExactly();
            for (i = 0; i < max - 1; i++) {
              expect(spies[i]).to.have.been.calledOnce.and.to.have.been
                .calledBefore(spies[i + 1]);
            }
            expect(spies[max - 1]).to.have.been.calledBefore(end);
          }
        );

        it('should execute all the asynchronous methods in maximun time of ' +
            'the longer time method and call the end method without parameters',
          function(done) {
            async = true;

            sAsync.doParallel(methods, end);

            timer.tick(maxTimeout);

            expect(end).to.be.calledOnce.and.to.be.calledWithExactly();
            for (i = 0; i < max - 1; i++) {
              expect(spies[order[i]]).to.have.been.calledOnce.and.to.have.been
                .calledBefore(spies[order[i + 1]]);
            }
            expect(spies[order[max - 1]]).to.have.been.calledBefore(end);

            done();
          }
        );
      });

      describe('with a list of incorrect methods', function() {
        var max = 5,
          maxTimeout = 500,
          timeouts = [500, 300, 100, 400, 200],
          order = [2, 4, 1, 3, 0],
          errorIndex = 2,
          errorDesc = 'error description',
          methods, spies, async, end, timer, i;

        function testMethod(i) {
          function _done(i, done) {
            if (i === errorIndex) {
              spies[i](errorDesc);
              done(errorDesc);
            } else {
              spies[i]();
              done();
            }
          }

          return function(done) {
            if (async) {
              setTimeout(function(i, done) {
                _done(i, done);
              }, timeouts[i], i, done);
            } else {
              _done(i, done);
            }
          };
        }

        beforeEach(function() {
          methods = [];
          spies = [];
          end = sinon.spy();
          timer = sinon.useFakeTimers();

          for (i = 0; i < max; i++) {
            spies[i] = sinon.spy();
            methods[i] = testMethod(i);
          }
        });

        afterEach(function() {
          timer.restore();
        });

        it('should only execute the first two synchronous methods in the ' +
            'same order in which they have been pushed in the array and call ' +
            'the end method with error',
          function() {
            async = false;

            sAsync.doParallel(methods, end);

            expect(end).to.be.calledOnce.and.to.be.calledWithExactly(errorDesc)
              .and.to.have.been.calledBefore(spies[errorIndex + 1]);
            for (i = 0; i < max - 1; i++) {
              expect(spies[i]).to.have.been.calledOnce.and.to.have.been
                .calledBefore(spies[i + 1]);

              if (i === errorIndex) {
                expect(spies[i]).to.be.calledWithExactly(errorDesc);
              } else {
                expect(spies[i]).to.be.calledWithExactly();
              }
            }
          }
        );

        it('should only execute the first two asynchronous methods in the ' +
            'same order in which they have been pushed in the array and call ' +
            'the end method with error',
          function(done) {
            async = true;

            sAsync.doParallel(methods, end);

            timer.tick(maxTimeout);

            expect(end).to.be.calledOnce.and.to.be.calledWithExactly(errorDesc)
              .and.to.have.been.calledBefore(spies[errorIndex + 1]);
            for (i = 0; i < max - 1; i++) {
              expect(spies[order[i]]).to.have.been.calledOnce.and.to.have.been
                .calledBefore(spies[order[i + 1]]);

              if (i === errorIndex) {
                expect(spies[i]).to.be.calledWithExactly(errorDesc);
              } else {
                expect(spies[i]).to.be.calledWithExactly();
              }
            }

            done();
          }
        );
      });
    });
  });
});
