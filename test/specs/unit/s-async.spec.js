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
              setTimeout(function(i) {
                next();
              }, timeout, i);
            } else {
              next();
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

        it('should execute all the synchronous methods and call the end ' +
            'method with \'true\'',
          function() {
            async = false;

            sAsync.doSeries(methods, end);

            expect(end).to.be.calledOnce.and.to.be.calledWithExactly(true);
            for (i = 0; i < max; i++) {
              expect(spies[i]).to.have.been.calledOnce;
            }
          }
        );

        it('should execute all the asynchronous methods and call the end ' +
            'method with \'true\'',
          function(done) {
            async = true;

            sAsync.doSeries(methods, end);

            timer.tick(timeout * max);

            expect(end).to.be.calledOnce.and.to.be.calledWithExactly(true);
            for (i = 0; i < max; i++) {
              expect(spies[i]).to.have.been.calledOnce;
            }

            done();
          }
        );
      });

      describe('with a list of incorrect methods', function() {
        var max = 3,
          timeout = 100,
          methods, spies, async, end, timer, i;

        function testMethod(i) {
          return function(next) {
            spies[i]();
            if (async) {
              setTimeout(function(i) {
                if (i === 2) {
                  next(false);
                } else {
                  next();
                }
              }, timeout, i);
            } else {
              if (i === 2) {
                next(false);
              } else {
                next();
              }
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

        it('should only execute the first two synchronous methods and call ' +
            'the end method with \'false\'',
          function() {
            async = false;

            sAsync.doSeries(methods, end);

            expect(end).to.be.calledOnce.and.to.be.calledWithExactly(false);
            for (i = 0; i < max; i++) {
              if (i <= 2) {
                expect(spies[i]).to.have.been.calledOnce;
              } else {
                expect(spies[i]).to.have.not.been.called;
              }
            }
          }
        );

        it('should only execute the first two asynchronous methods and call ' +
            'the end method with \'false\'',
          function(done) {
            async = true;

            sAsync.doSeries(methods, end);

            timer.tick(timeout * max);

            expect(end).to.be.calledOnce.and.to.be.calledWithExactly(false);
            for (i = 0; i < max; i++) {
              if (i <= 2) {
                expect(spies[i]).to.have.been.calledOnce;
              } else {
                expect(spies[i]).to.have.not.been.called;
              }
            }

            done();
          }
        );
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
