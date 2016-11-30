var flowshow = angular.module("flowshow", ['ui.router', 'ngMaterial', 'ui.bootstrap']);

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

flowshow.controller("NewsController", function($scope, $mdDialog, FeedService) {
    // Carousel default values
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
    $scope.activeSlide = 0;

    FeedService.getFeed("http://www.dn.se/nyheter/m/rss/")
        .then(function(response) {
            $scope.news = response.data.responseData.feed;

            $scope.topStories = $scope.news.entries.filter(function(item) {
                return item.mediaGroups;
            }).slice(0, 10);
        });

    function getAvatar(entry) {
        try {
            return entry.mediaGroups[0].contents[0].thumbnails[0].url;
        }
        catch (error) {
            return "img/dn.png";
        }
    }

    function getImage(entry) {
        try {
            return entry.mediaGroups[0].contents[0].url;
        }
        catch (error) {
            return "img/dn.png";
        }
    }

    function getAuthor(entry) {
        return entry.author.length > 0 ? entry.author : 'Unknown';
    }

    function viewFullText(ev, entry) {
        $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(true)
                .title(entry.title)
                .textContent(entry.content)
                .ariaLabel('Full text')
                .ok('Close')
                .targetEvent(ev)
        );
    }

    function openLink(entry) {
        window.open(entry.link, '_blank');
    }

    $scope.getAvatar = getAvatar;
    $scope.getImage = getImage;
    $scope.getAuthor = getAuthor;
    $scope.viewFullText = viewFullText;
    $scope.openLink = openLink;
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
