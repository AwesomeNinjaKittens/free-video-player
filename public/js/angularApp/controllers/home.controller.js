angular.module('freeVideoPlayerApp')
    .controller('homeController', ['$scope', function($scope){

        $scope.form = {
            mpdurl:''
        };

        var configObject = {
            //Tested to just display play/pause button
            //        videoControlsDisplay: {
            //            showPlayPauseButton: true
            //        }
        };

        var videoPlayer = freeVideoPlayer(configObject);
        $scope.form.playerVersion = videoPlayer.getVersion();

        $scope.load = function(){
            if($scope.mpdurl !==''){
                console.log('Loading this url' + $scope.form.mpdurl);
                videoPlayer.load($scope.form.mpdurl);
            } else {
                console.log('Did not provide a valid input to load method');
            }
        };

        var ulList = document.getElementById('asset-list'),
            listItemsList = ulList.getElementsByTagName('div');

        var unloadButton = document.getElementById('unload');
        unloadButton.addEventListener('click', function(){
            videoPlayer.unload();
        });

        for(var i = 0; i < listItemsList.length; i++){
            listItemsList[i].addEventListener('click', function(){
                var image = this.querySelector('img'),
                    mediaUrl = image.getAttribute('data-video-url');
                videoPlayer.load(mediaUrl);
            });
        }
        //Lets start the video player by loading an example of Big Buck Bunny when the page is loaded
        videoPlayer.load('/assets/localNonAdaptiveStreams/big_buck_bunny.mp4');
    }]);