var flowshow = angular.module("flowshow", ['ui.router', 'ngMaterial']);

flowshow.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $stateProvider
        .state('news', {
            url: '/',
            templateUrl: 'templates/news.html',
            controller: 'NewsController'
        });
    $urlRouterProvider.otherwise('/');

    $mdThemingProvider.theme('default')
        .primaryPalette('red');
});

flowshow.controller("NewsController", function($scope, FeedService) {

    FeedService.getFeed("http://www.dn.se/nyheter/m/rss/")
        .then(function(response) {
            $scope.news = response.data.responseData.feed;
            console.log(response);
        });

    function getAvatar(entry) {
        try {
            return entry.mediaGroups[0].contents[0].thumbnails[0].url;
        }
        catch (error) {
            return "img/dn.png";
        }
    }

    $scope.getAvatar = getAvatar;
});

flowshow.controller("FooterController", function($scope) {
    $scope.links = [
        {
            name: "E-mail",
            url: "mailto:martin.walter.swe@gmail.com",
            icon: "mdi-email-outline"
        },
        {
            name: "GitHub",
            url: "https://github.com/marols",
            icon: "mdi-github-circle"
        },
        {
            name: "LinkedIn",
            url: "https://se.linkedin.com/in/mwalter84",
            icon: "mdi-linkedin-box"
        }
    ]
    ;
});

flowshow.factory('FeedService', ['$http', function($http) {
    return {
        getFeed: function(url) {
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
}]);
