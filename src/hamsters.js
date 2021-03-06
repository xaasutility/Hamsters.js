/* jshint esversion: 6, curly: true, eqeqeq: true, forin: true */

/***********************************************************************************
* Title: Hamsters.js                                                               *
* Description: 100% Vanilla Javascript Multithreading & Parallel Execution Library *
* Author: Austin K. Smith                                                          *
* Contact: austin@asmithdev.com                                                    *  
* Copyright: 2015 Austin K. Smith - austin@asmithdev.com                           * 
* License: Artistic License 2.0                                                    *
***********************************************************************************/

'use strict';

import hamstersVersion from './core/version';
import hamstersHabitat from './core/habitat';
import hamstersPool from './core/pool';
import hamstersData from './core/data';
import hamstersLogger from './core/logger';
import hamstersMemoizer from './core/memoizer';

class hamstersjs {

  /**
  * @constructor
  * @function constructor - Sets properties for this class
  */
  constructor() {
    this.version = hamstersVersion;
    this.maxThreads = hamstersHabitat.logicalThreads;
    this.habitat = hamstersHabitat;
    this.data = hamstersData;
    this.pool = hamstersPool;
    this.logger = hamstersLogger;
    this.memoizer = hamstersMemoizer;
    this.run = this.hamstersRun;
    this.promise = this.hamstersPromise;
    this.init = this.initializeLibrary;
  }

  /**
  * @function initializeLibrary - Prepares & initializes Hamsters.js library
  * @param {object} startOptions - Provided library functionality options
  */
  initializeLibrary(startOptions) {
    if (typeof startOptions !== 'undefined') {
      this.processStartOptions(startOptions);
    }
    if(!this.habitat.legacy && this.habitat.persistence === true) {
      hamstersPool.spawnHamsters(this.maxThreads);
    }
    this.logger.info(`Initialized using up to ${this.maxThreads} threads.`);
    delete this.init;
  }

  /**
  * @function processStartOptions - Adjusts library functionality based on provided options
  * @param {object} startOptions - Provided library functionality options
  */
  processStartOptions(startOptions) {
    // Add options to override library environment behavior
    let habitatKeys = [
      'worker', 'sharedworker',
      'legacy', 'webworker',
      'reactnative', 'atomics',
      'proxies', 'transferrable',
      'browser', 'shell', 
      'node', 'debug',
      'persistence', 'importscripts'
    ];
    let key = null;
    for (key of Object.keys(startOptions)) {
      if (habitatKeys.indexOf(key.toLowerCase()) !== -1) {
        this.habitat[key] = startOptions[key];
      } else {
        this[key] = startOptions[key];
      }
    }
    // Ensure legacy mode is disabled when we pass a third party worker library
    if(typeof this.habitat.Worker === 'function' && startOptions['legacy'] !== true) {
      this.habitat.legacy = false;
    }
  }



  /**
  * @async
  * @function hamstersPromise - Calls library functionality using async promises
  * @param {object} params - Provided library execution options
  * @param {function} functionToRun - Function to execute
  * @return {array} Results from functionToRun.
  */
  hamstersPromise(params, functionToRun) {
    return new Promise((resolve, reject) => {
      let task = new hamstersPool.task(params, functionToRun, this, resolve, reject);
      hamstersPool.scheduleTask(task, this).then((results) => {
        task.onSuccess(results);
      }).catch((error) => {
        hamstersLogger.error(error.message, task.onError);
      });
    });
  }

  /**
  * @async
  * @function hamstersRun - Calls library functionality using async callbacks
  * @param {object} params - Provided library execution options
  * @param {function} functionToRun - Function to execute
  * @param {function} onSuccess - Function to call upon successful execution
  * @param {function} onError - Function to call upon execution failure
  * @return {array} Results from functionToRun.
  */
  hamstersRun(params, functionToRun, onSuccess, onError) {
    let task = new hamstersPool.task(params, functionToRun, this, onSuccess, onError);
    hamstersPool.scheduleTask(task, this).then((results) => {
      task.onSuccess(results);
    }).catch((error) => {
      hamstersLogger.error(error.message, task.onError);
    });
  }
}

var hamsters = new hamstersjs();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = hamsters;
}