'use strict';

var React = require('react-native');
var Timers = React.Timers;



var tweenFunctions = require('tween-functions');

var  TweenMixin = {
  _startTime : "",
  _config: {},
  __proto__: Object.prototype,
  componentWillMount()  {

    this._startTime = Date.now();
 
  },

   setConfig(config)  {
    this._config = config;
  },
  getConfig() {
    return this._config;
  },

   start() {
    this._startTime = Date.now();
    this.frameLoop();
  },

 setDestinations(dests) {
  this._config.end[0].x = dests[0];
  this._config.end[1].x = dests[1];
 },

 tweenCompleted() {
   return ((this.raf == null)? true : false);
 },
   frameLoop() {
    if(this._break) {
      if (this.raf) {
        window.cancelAnimationFrame(this.raf);
        this.raf = null;
      }
      return;
     }
    var tweenVals = [];
    var elapsed = (Date.now() - this._startTime);
    var {
      duration,
      start,
      end,
      tween
    } = this._config;

    var maxDuration = Math.max.apply(Math, duration);
    if(elapsed >= maxDuration){
      this._config.frame(end);
      if(this.raf)  {
      window.cancelAnimationFrame(this.raf);
      this.raf = null;
    }
      if(typeof this._config.done === 'function') {
        this._config.done();
      }
      return;
    }
    for (var i=0; i< start.length; i++) {
      var tpVals = {};
    for (var prop in start[i]) {
      if (elapsed >= duration[i]) {
        tpVals[prop] = end[i][prop];
      } else {
        tpVals[prop] = tweenFunctions[tween[i]](
          elapsed, start[i][prop], end[i][prop], duration[i]
        );
      }
    }
    tweenVals.push(tpVals);
    }

    this._config.frame(tweenVals);
    this.raf = window.requestAnimationFrame(this.frameLoop);
  },

  terminate() {
    this._break = true;
  }
};

module.exports = TweenMixin;
