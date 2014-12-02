// THIS FILE SPECIFIES JAVASCRIPT MODULES THAT ARE INCLUDED ON ALL PAGES OF THE
// SITE. TO INCLUDE A MODULE ON ONLY SPECIFIC PAGES (VIEWS) ADD IT TO THE
// DEPENDENCY ARRAY OF A PARTICULAR VIEW MODULE; ALL OF WHICH ARE FOUND IN
// app/assets/javascripts/routes/.
//
require([
  'angular', 
  'app/app',
  'app/controllers/app-controller',
  'domReady!'
],
function (angular, app, controller) {
  'use strict';    
  angular.bootstrap(document.getElementById('content'), ['commission-today']);
});
