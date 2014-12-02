

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the discussStorage service
 * - exposes the model to the template and provides event handlers
 */

define(['app/app'], function (app)
{
  'use strict';

  var AppController = function ($scope, $http, $sce)
  {

    console.log($scope);

    $scope.url = 'http://palcu.ro:8000/api/v1/meeting/?format=json';

    // retrieve json
    $http.get($scope.url).then(function(response)
    {
      console.log(response.data);
      // format json as nested structure
      /*
      var topics = response.data.topics;
      var comments = {};
      for (var t in topics)
      {
        var responses = topics[t].responses;
        topics[t].count = responses.length; // create a count of the total responses
        topics[t].countDesc = topics[t].count === 1 ? "comment" : "comments";

        var indexed = [],
        newResponses = [],
        idField = 'id',
        parentIdField = 'parentid',
        childNodesField = 'responses';

        // first pass of nesting data structure
        var item;
        for (var row in responses)
        {

          item = responses[row][idField];
          indexed[item] = responses[row];
          indexed[item][childNodesField] = [];


          var parentAuthor = null;
          if (indexed[item][parentIdField] !== 0)
            parentAuthor = indexed[indexed[item][parentIdField]].authorHtml;

          // replace IP address with "Anonymous", place IP in title attribute.
          // add microdata.
          var ipAddress = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g;
          var author = indexed[item].author;
          var newAuthor = "<span itemprop='creator' itemscope itemtype='http://schema.org/Person'>";
              newAuthor += "<span itemprop='alternateName'>";
              newAuthor += author.replace(ipAddress,"<b title='"+author+"' class='anonymous'>Anonymous</b>" );
              newAuthor += "</span>";
              newAuthor += "</span>";

          indexed[item].authorHtml = newAuthor;
          if (parentAuthor)
              newAuthor += " in response to <span class='replyto'>"+parentAuthor+"</span>";

          indexed[item].authorHtmlFull = $sce.trustAsHtml( "By "+newAuthor );

          // replace smiley with icon
          indexed[item].posttext = indexed[item].posttext.replace(/:-\)/g,"<i class='fa fa-smile-o'></i>");

          // sanitize html
          indexed[item].posthtml = $sce.trustAsHtml(indexed[item].posttext);

          // calculate posted time
          var age = indexed[item].age;

          // get date stamp for datetime attribute
          var now = new Date();
          var diff = now.getTime()-(age*1000);
          var diffDate = new Date(diff);

          // calculate days, hours, seconds of post
          var days = Math.floor(age / (60 * 60 * 24));

          var divisor_for_hours = age % (60 * 60 * 24);
          var hours = Math.floor(divisor_for_hours / (60 * 60));

          var divisor_for_minutes = divisor_for_hours % (60 * 60);
          var minutes = Math.floor(divisor_for_minutes / 60);

          var divisor_for_seconds = divisor_for_minutes % 60;
          var seconds = Math.ceil(divisor_for_seconds);

          // generate display string
          var str = "ago";
          if (days > 0)
            str = days+" days "+str;
          else if (hours > 0)
            str = hours+" hours "+str;
          else if (minutes > 0)
            str = minutes+" minutes "+str;
          else if (seconds > 0)
            str = seconds+" seconds "+str;


          indexed[item].posted = $sce.trustAsHtml("Posted <time itemprop='commentTime' datetime='"+diffDate+"'>"+str+"</time>");
        }

        // second pass of nesting data structure
        for ( var id in indexed)
        {
          var parent = indexed[indexed[id][parentIdField]];
          if (parent)
          {
            parent[childNodesField].push(indexed[id]);
          }
          else
          {
            newResponses.push(indexed[id]);
          }
        }

        topics[t].responses = newResponses;
      }
      */

      $scope.topics = topics;
    });

    // handling toggling of threads
    $scope.select = function(item)
    {
      $scope.selected = item;
    };
    $scope.unselect = function(item)
    {
      $scope.selected = null;
    };
    $scope.isSelected = function(item)
    {
      return $scope.selected === item;
    };

  };

  return app.controller('AppController',
    ['$scope', '$http', '$sce', AppController ]);
});
