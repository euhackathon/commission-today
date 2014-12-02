// THIS FILE SPECIFIES JAVASCRIPT MODULES THAT ARE INCLUDED ON ALL PAGES OF THE
// SITE. TO INCLUDE A MODULE ON ONLY SPECIFIC PAGES (VIEWS) ADD IT TO THE
// DEPENDENCY ARRAY OF A PARTICULAR VIEW MODULE; ALL OF WHICH ARE FOUND IN
// app/assets/javascripts/routes/.
//
require([
  'util/api/Client',
  'mustache',
  'domReady!'
],
function (Client, Mustache) {
  'use strict';
  var _statusHtml = document.querySelector('.loading-status');
  var _view;
  var client = Client.create('http://palcu.ro:8000/api/v1/');
  client.get('meeting');
  client.addEventListener('dataloaded', _initialDataLoaded);

  function _initialDataLoaded(evt) {
    _view = {
      meeting : client.response.meeting.objects
    }

    _renderTemplate();
  }

  function _renderTemplate() {
    var template = document.querySelector('.content');

    // Render mustache template and apply to page.
    var rendered = Mustache.render(template.innerHTML, _view);
    template.innerHTML = rendered;

    // Fade-out loading screen when everything loads.
    $(_statusHtml).fadeOut('slow', function() {
      template.classList.remove('hide');
    });
  }

});
