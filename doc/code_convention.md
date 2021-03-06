# Code Convention

In backend and fronted a module name is singular. For example, the module which manage

* users must be called `user`
* communities must be called `community`

## Backend

### Core

#### Model Mongoose

* Use `creator` to specify the creator or author
* Use `timestamps` to store all dates like:
    * creation
    * finalization
    * expiration
    * adhesion

Skeleton:

    var mongoose = require('mongoose'),
     Schema = mongoose.Schema;
    
    var ModelSchema = new Schema({
      creator: {type: Schema.ObjectId, ref: 'User'},
      timestamps: {
        creation: {type: Date, default: Date.now}
      },
      schemaVersion: {type: Number, default: 1}
    }, {collection: 'models'});
    
    module.exports = mongoose.model('Model', ModelSchema);


#### CRUD in MongoDB

* When error use logger.error.
* When success use logger.debug.

Skeleton:

    var mongoose = require('mongoose'),
      Model = mongoose.model('Model');

    function save(callback) {
      var model = new Model();
      model.save(function (err, saved) {
        if (err) {
          logger.error('Error while trying to provision model in database:', err.message);
          return callback(err);
        }
        logger.debug('Model provisioned in database: ' + saved._id);
        return callback(null, saved);
      });
    }


### Webserver

#### Route

If the route is a REST endpoint, use `/api/...`
Use middleware to validate a route and controller to execute the request.

## Frontend

In factory, use english terms (prefix) to describe what the function does:

* GET request    : get, search, list, download
* POST request   : create, upload
* PUT request    : update, upload
* DELETE request : remove

A factory must manage **one** resource.

* module name is: esn.*moduleName*
* factory name is : *moduleName*API

Skeleton:

    angular.module('esn.module', [
      'restangular'
    ])
      .factory('moduleAPI', ['Restangular', function(Restangular) {
        function get(id) {
          return Restangular.one('module/' + id).get();
        }
        function post(content) {
          return Restangular.one('module').post(content);
        }
        return {
          get: get,
          post: post
        };
      }])
      .directive('moduleDirective', function() {
        return {
          restrict: 'E',
          replace: true,
          templateUrl: '/views/modules/moduleName/module.html'
        };
      })
      .controller('moduleController', ['$scope', 'moduleAPI', function($scope, moduleAPI) {
        
      }]);

### Angular constants

We have a way to make angular constants configurable, by defining an override in the database.  
However, this only applies to constants actually used to define a setting (e.g.: the number of elements displayed in a "page", 
a timeout for HTTP requests, etc.). These constants should be defined in the `esn.constants` angular modules which is 
actually generated by the backend.  
  
To define such a new constant, add a line in the `templates/js/constants.ejs` file. Evey line defines an angular constant.
The syntax is as follows

    .constant('XXX', <%= getConstant('XXX', defaultValue) %>)
    
where:

* `XXX` is the name of the constant, the one you'll depend on in your Angular modules
* `defaultValue` is the default value for the constant, if there's no override in the database
* The `getConstant` function is provided automatically and does the heavy work of looking through the DB

Then in your Angular module, depend on the `esn.constants` module and use your shiny new configurable constant!
  
To override a value, simply define the following configuration (in the `configurations` collection) at any level
of the configuration (system-wide, domain-wide, etc.), in the `core` module:

    {
        "name" : "constants",
        "value" : {
            "XXX" : 10,
            "YYY" : true,
            ...
        }
    }
    
where `XXX` and `YYY` are constant names.

#### What about tests?

There are midway tests covering the generation of the Javascript file from the EJS template in both cases (with or without overrides).  
They work by comparing the results of querying the route against a pre-made Javascript file (in the _fixtures_ folder). The pre-made JS file
is also used by frontend tests so that they have the `esn.constants` module available.

Should you upgrade the EJS template, you should also change these fixtures, but tests will break anyway!

## Documentation

See `REST_skeleton.md`.