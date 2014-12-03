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
  var MONTH_NAMES = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  var _lastDateSelected;
  var _statusHtml = document.querySelector('.loading-status');
  var _view;
  var _client = Client.create('http://palcu.ro:8000/api/v1/');
  _client.get('meeting', {'order_by':'date'});
  _client.addEventListener('dataloaded', _meetingDataLoaded);

  function _meetingDataLoaded(evt) {
    _view = {
      meeting : _client.response.meeting.objects
    }

    // Remove photos that are subsequent to each other.
    var origPhoto, lastPhoto;
    for (var p = 0; p < _view.meeting.length; p++) {
      _formatDate(_view.meeting[p]);
      origPhoto = _view.meeting[p].member.photoUrl;
      if (_view.meeting[p].member.photoUrl === lastPhoto) {
        _view.meeting[p].member.photoUrl = '';
      }
      lastPhoto = origPhoto;
    }

    _renderTemplate();
  }

  function _formatDate(meeting) {
    var d = new Date(meeting.date*1000);
    meeting.date_formatted = "<span class='day'>" + d.getDate() + "</span> " +
                             "<span class='month'>" + MONTH_NAMES[d.getMonth()] + "</span>" +
                             "<span class='year'>" + d.getFullYear() + "</span>";
    meeting.date = d.getFullYear() + '-' + Number(d.getMonth()+1) + '-' + d.getDate();
  }

  function _renderTemplate() {
    var template = document.querySelector('.template');
    var target = document.querySelector('.content')

    // Render mustache template and apply to page.
    var rendered = Mustache.render(template.innerHTML, _view);
    target.innerHTML = rendered;

    // Set up links for dates.
    var dates = target.querySelectorAll('.date');
    for (var d = 1; d < dates.length; d++) {
      dates[d].addEventListener('click', _dateClicked, false);
    }

    // Set up links for members.
    var members = target.querySelectorAll('.member');
    for (var m = 0; m < members.length; m++) {
      members[m].addEventListener('click', _memberClicked, false);
    }

    // Set up date range links.
    target.querySelector('.all').addEventListener('click', _allDateClicked, false);
    target.querySelector('.today').addEventListener('click', _todayDateClicked, false);
    target.querySelector('.past').addEventListener('click', _pastDateClicked, false);
    target.querySelector('.future').addEventListener('click', _futureDateClicked, false);

    // Fade-out loading screen when everything loads.
    $(_statusHtml).fadeOut('slow', function() {
      target.classList.remove('hide');
    });
  }

  function _dateClicked(evt) {
    _client.flush();
    _client.get('meeting', {'date':evt.currentTarget.getAttribute('data-date'), 'order_by':'date'});
  }

  function _allDateClicked(evt) {
    _client.flush();
    _client.get('meeting', {'order_by':'date'});
  }

  function _todayDateClicked(evt) {
    var today = new Date();
    var d =  today.getFullYear() + '-' + Number(today.getMonth()+1) + '-' + today.getDate();
    _client.flush();
    _client.get('meeting', {'date':d, 'order_by':'date'});
  }

  function _pastDateClicked(evt) {
    var today = new Date();
    var d =  today.getFullYear() + '-' + Number(today.getMonth()+1) + '-' + today.getDate();
    _client.flush();
    _client.get('meeting', {'date__lt':d, 'order_by':'date'});
  }

  function _futureDateClicked(evt) {
    var today = new Date();
    var d =  today.getFullYear() + '-' + Number(today.getMonth()+1) + '-' + today.getDate();
    _client.flush();
    _client.get('meeting', {'date__gt':d, 'order_by':'date'});
  }

  function _memberClicked(evt) {
    _client.flush();
    _client.get('meeting', {'member':evt.currentTarget.getAttribute('data-member'), 'order_by':'date'})
  }
});
