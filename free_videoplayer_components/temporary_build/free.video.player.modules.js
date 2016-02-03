/**
 * @title FREE VIDEO PLAYER - MODULE NAMESPACE
 * @authors Johan Wedfelt
 * @license GPLv3, see http://www.gnu.org/licenses/gpl-3.0.en.html
 * @dependencies Requires the xml2json library to work
 * @description Creates a namespace to be used with the FREE VIDEO PLAYER library and its modules
 * @version 0.9.0
 * @web http://www.freevideoplayer.org
 */

/**
 * @description Defines the global namespace where free video player modules can be added to as property objects
 * @type {{}}
 */
var freeVideoPlayerModulesNamespace = {};


/**
 * @title FREE VIDEO PLAYER - MESSAGES MODULE
 * @authors Johan Wedfelt
 * @license GPLv3, see http://www.gnu.org/licenses/gpl-3.0.en.html
 * @description A messages module to use with for example FREE VIDEO PLAYER library.
 * @version 0.9.0
 * @web http://www.freevideoplayer.org
 * @param settingsObject - {object} Contains different settings for the messages
 * @param moduleVersion -  {string} Contains the version string for the module that is calling the messages module
 */
//Add the messages module to the namespace
freeVideoPlayerModulesNamespace.freeVideoPlayerMessages = function(settingsObject, moduleVersion){

    'use strict';

    /**
     * @description Instantiate the variables we need when setting up this messages module
     * @type {{}}
     */
    var that = {},
        moduleName = 'Messages',
        moduleVersion = moduleVersion,
        freeVideoPlayerWebUrl = 'http://freevideoplayer.org',
        version = '0.9.0';

    //Indicate that the returned object is a module
    that._isModule = true;

    //  #########################
    //  #### MESSAGE METHODS ####
    //  #########################
    /**
     * @description A method that generates an error message on the console
     * @param messageObject
     * @param error
     */
    function printOutErrorMessageToConsole(messageObject, error){

        var consoleMessage = '',
            message = messageObject.message,
            methodName = messageObject.methodName,
            moduleName = messageObject.moduleName;

        consoleMessage += '====================================================' + '\n';
        consoleMessage += 'Free Video Player Library - ERROR' + '\n';
        consoleMessage += 'ModuleName: ' + moduleName + '\n';
        consoleMessage += 'ModuleVersion: ' + moduleVersion + '\n';
        consoleMessage += 'See more @: ' + freeVideoPlayerWebUrl + '\n';
        consoleMessage += 'Method: ' + methodName + '\n';
        consoleMessage += 'Message: ' + message + '\n';
        consoleMessage += '====================================================' + '\n';

        if(settingsObject.debugMode) {
            console.log(consoleMessage);
            console.log(error);
        }
    };

    /**
     * @description A method that generates a message on the console
     * @param messageObject
     */
    function printOutMessageToConsole(messageObject){

        var consoleMessage = '',
            message = messageObject.message,
            methodName = messageObject.methodName,
            moduleName = messageObject.moduleName;

        consoleMessage += '====================================================' + '\n';
        consoleMessage += 'Free Video Player Library - MESSAGE' + '\n';
        consoleMessage += 'ModuleName: ' + moduleName + '\n';
        consoleMessage += 'ModuleVersion: ' + moduleVersion + '\n';
        consoleMessage += 'See more @: ' + freeVideoPlayerWebUrl + '\n';
        consoleMessage += 'Method: ' + methodName + '\n';
        consoleMessage += 'Message: ' + message + '\n';
        consoleMessage += '====================================================' + '\n';

        if(settingsObject.debugMode) {
            console.log(consoleMessage);
        }
    };

    //Make methods public
    that.printOutErrorMessageToConsole  = printOutErrorMessageToConsole;
    that.printOutMessageToConsole = printOutMessageToConsole;
    that.moduleName = moduleName;
    that.version = version;

    //Return our class/function object
    return that;
};

/**
 * @title FREE VIDEO PLAYER - VIDEO CONTROLS MODULE
 * @authors Johan Wedfelt
 * @license GPLv3, see http://www.gnu.org/licenses/gpl-3.0.en.html
 * @description A video controls module to use with the FREE VIDEO PLAYER library.
 * @version 0.9.0
 * @web http://www.freevideoplayer.org
 * @param settingsObject {object} - Contains the settings the videoControlsModule needs to utilize
 * certain methods on the instantiated Free Video Player object
 * @param videoPlayerNameCss {string} - Used as name string for the messagesModule that the videoControlsModule utilizes
 */
//Add the video controls to the namespace
freeVideoPlayerModulesNamespace.freeVideoPlayerControls = function(settingsObject, videoPlayerNameCss){
    'use strict';

    /**
     * @description Lets instantiate the different variables we will be needing when we start up this controls module
     * @type {{}}
     */
    var that = {},
        settingsObject = settingsObject,
        version = '0.9.0',
        moduleName = 'VIDEO CONTROLS',
        animationDelayObject = {
          videoOverlayFadeOutDelay:100
        },
        videoPlayerNameCss = videoPlayerNameCss,
        messagesModule = freeVideoPlayerModulesNamespace.freeVideoPlayerMessages(settingsObject, version);

    //Indicate that the returned object is a module
    that._isModule = true;

    /**
     * @description This methods manipulates the DOM and creates object like subtitle tracks within the DOM
     * aswell as the rest of the control structure, like play/pause button, progress-slider, mute button, volume slider,
     * subtitle selector with sub-menu and fullscreen button
     * @param {element} videoWrapper - The DOM element for the videoWrapper
     * @param {element} currentVideoObject - The DOM video element
     * @public
     */
    function _createVideoControls(videoWrapper, currentVideoObject){

        var videoWrapper = videoWrapper,
            currentControls = videoWrapper.getElementsByTagName('div')[0] || null,
            videoElement = videoWrapper.getElementsByTagName('video')[0] || null,
            volumeHighStart = parseInt(settingsObject.videoControlsVolumeTresholdValues.volumeHighStart, 10),
            volumeLowEnd = parseInt(settingsObject.videoControlsVolumeTresholdValues.volumeLowEnd, 10),
            controlsWrapper = document.createElement('div');
        controlsWrapper.setAttribute('data-video-player-control', 'wrapper');
        controlsWrapper.setAttribute('class', settingsObject.videoControlsCssClasses.videoControlsClass);

        //Add the data to the class scoped variables
        that.currentVideoObject = currentVideoObject;
        that.videoElement = videoElement;
        that.currentVideoControlsObject = {
            volumeHighStart: volumeHighStart,
            volumeLowEnd: volumeLowEnd
        };

        //Lets remove the older controls div before adding the new one
        if(currentControls){
            //Remove old control structure
            videoWrapper.removeChild(currentControls);
            //Remove old keyboard listeners
            _removeKeyboardListeners();
            //Reset previous controls
            that.currentVideoControlsObject = {};
        }

        var playButton = document.createElement('div'),
            volumeIcon = document.createElement('div'),
            settingsIcon = document.createElement('div'),
            settingsMenu = document.createElement('div'),
            subtitlesContainer = document.createElement('div'),
            bitrateButton = document.createElement('div'),
            fullScreenButton = document.createElement('div'),
            progressSlider = document.createElement('input'),
            volumeSliderContainer = document.createElement('div'),
            volumeSlider = document.createElement('input'),
            progressTimerContainer = document.createElement('div'),
            progressTimerCurrentTime = document.createElement('span'),
            progressTimerTotalDuration = document.createElement('span'),
            videoOverlayPlayPauseIcon = document.createElement('div'),
            videoOverlaySpinnerIcon = document.createElement('div');


        //Adding the data to class scoped variable
        that.currentVideoControlsObject.playButton = playButton;
        that.currentVideoControlsObject.volumeIcon = volumeIcon;
        that.currentVideoControlsObject.fullScreenButton = fullScreenButton;
        that.currentVideoControlsObject.progressSlider = progressSlider;
        that.currentVideoControlsObject.volumeSliderContainer = volumeSliderContainer;
        that.currentVideoControlsObject.volumeSlider = volumeSlider;
        that.currentVideoControlsObject.progressTimerContainer = progressTimerContainer;
        that.currentVideoControlsObject.progressTimerCurrentTime = progressTimerCurrentTime;
        that.currentVideoControlsObject.progressTimerTotalDuration = progressTimerTotalDuration;
        that.currentVideoControlsObject.videoOverlayPlayPauseIcon = videoOverlayPlayPauseIcon;
        that.currentVideoControlsObject.videoOverlaySpinnerIcon = videoOverlaySpinnerIcon;
        that.currentVideoControlsObject.controlsWrapper = controlsWrapper;
        that.currentVideoControlsObject.settingsIcon = settingsIcon;
        that.currentVideoControlsObject.settingsMenu = settingsMenu;
        that.currentVideoControlsObject.subtitlesContainer = subtitlesContainer;
        that.currentVideoControlsObject.bitrateButton = bitrateButton;

        //DO MORE STUFF WITH PROGRESS TIMER ETC
        //LETS UPDATE THIS ON THE FLY AS THE VIDEO PROGRESSES!

        //Lets add the progressSlider to our currentVideoObject
        currentVideoObject.progressSlider = progressSlider;

        //  ###################################
        //  #### SET ATTRIBUTES/INNER HTML ####
        //  ###################################
        //Lets set classes to the different objects
        playButton.setAttribute('class', settingsObject.videoControlsCssClasses.playpauseContainerClass);
        progressSlider.setAttribute('class', settingsObject.videoControlsCssClasses.progressbarContainerClass);
        volumeSliderContainer.setAttribute('class', settingsObject.videoControlsCssClasses.volumeContainerClass);
        volumeIcon.setAttribute('class', settingsObject.videoControlsCssClasses.volumeIconClass);
        subtitlesContainer.setAttribute('class', settingsObject.videoControlsCssClasses.subtitlesContainerClass);

        fullScreenButton.setAttribute('class', settingsObject.videoControlsCssClasses.fullscreenContainerClass);
        progressTimerContainer.setAttribute('class', settingsObject.videoControlsCssClasses.progressTimerContainerClass);
        videoOverlayPlayPauseIcon.setAttribute('class', settingsObject.videoControlsCssClasses.videoOverlayPlayPauseIconClass);
        videoOverlaySpinnerIcon.setAttribute('class', settingsObject.videoControlsCssClasses.videoOverlaySpinnerIconClass);
        settingsIcon.setAttribute('class', settingsObject.videoControlsCssClasses.settingsIconClass);
        settingsMenu.setAttribute('class', settingsObject.videoControlsCssClasses.settingsMenuClass + ' ' + settingsObject.videoControlsCssClasses.displayNoneClass);;

        //Add some attributes to our sliders
        volumeSlider.setAttribute('type','range');
        volumeSlider.setAttribute('value', 100);
        volumeSlider.setAttribute('orient', 'vertical');
        progressSlider.setAttribute('type','range');
        progressSlider.setAttribute('value', 0);

        //Add the data attribute to the different elements, maybe we should use this for selection in the future
        playButton.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'playpause');
        volumeIcon.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'mute');
        subtitlesContainer.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'subtitles');
        fullScreenButton.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'fullscreen');
        progressTimerContainer.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'progress-timer');
        progressSlider.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'progress');
        volumeSlider.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'volume');
        videoOverlayPlayPauseIcon.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'video-overlay-play-pause');
        videoOverlaySpinnerIcon.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'video-overlay-spinner');
        settingsIcon.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'settings');

        //Paint our DOM with the correct HTML
        playButton.innerHTML = settingsObject.videoControlsInnerHtml.playIconInnerHtml;
        volumeIcon.innerHTML = settingsObject.videoControlsInnerHtml.volumeHighIconInnerHtml;
        fullScreenButton.innerHTML = settingsObject.videoControlsInnerHtml.fullscreenExpandIconInnerHtml;
        subtitlesContainer.innerHTML = settingsObject.videoControlsInnerHtml.subtitlesMenuInnerHtml;
        settingsIcon.innerHTML = settingsObject.videoControlsInnerHtml.settingsIconInnerHtml;
        progressTimerCurrentTime.innerHTML = '0:00';

        //  #############################
        //  #### ADD EVENT LISTENERS ####
        //  #############################

        videoOverlayPlayPauseIcon.addEventListener('click', _playPauseMethod);

        playButton.addEventListener('click', _playPauseMethod);
        fullScreenButton.addEventListener('click', _fullScreenMethod);

        progressSlider.addEventListener('change', _progressShiftMethod);
        progressSlider.addEventListener('mousedown', _pauseMethodFromSlider);
        progressSlider.addEventListener('mouseup', _playMethodFromSlider);

        volumeIcon.addEventListener('click', _volumeMuteUnmuteMethod);
        volumeIcon.addEventListener('mouseover', _showVolumeSlider);
        volumeIcon.addEventListener('mouseout', _hideVolumeSlider);

        volumeSliderContainer.addEventListener('mouseout', _hideVolumeSlider);

        volumeSlider.addEventListener('change', _volumeShiftMethod);

        settingsIcon.addEventListener('click', _changeSettings);

        //Lets add event listeners to the video element so we can update the progress bar when we need it
        videoElement.addEventListener('loadedmetadata', _printMediaTotalDuration);
        videoElement.addEventListener('timeupdate', _progressUpdateMethod);

        //Lets see if we have subtitles and if that is the case lets add the subtitle menu to the player controls
        var subtitlesMenu = _createSubtitlesMenuAndReturnMenu(videoElement);

        if(subtitlesMenu){
            //Lets add the subtitles menu to the subtitles button
            subtitlesContainer.addEventListener('click', function(event){
                subtitlesMenu.style.display = (subtitlesMenu.style.display === 'block' ? 'none' : 'block');
            });
        }

        //  #############################
        //  #### APPEND DOM ELEMENTS ####
        //  #############################

        progressTimerContainer.appendChild(progressTimerCurrentTime);
        progressTimerContainer.appendChild(progressTimerTotalDuration);

        //settingsIcon.appendChild(settingsMenu);

        //Lets add the volume slider to the volume slider container
        volumeSliderContainer.appendChild(volumeSlider);
        //Move this part..?
        currentVideoObject.volumeSliderContainer = volumeSliderContainer;

        //LETS ALSO ADD VERIFICATION FOR LIVE ASSETS HERE, IF LIVE WE SHOULD NOT DISPLAY PROGRESS BAR
        if(settingsObject.videoControlsDisplay.showProgressSlider) {
            //Adds both the progress bar and the progress timer container showing current time and the medias
            controlsWrapper.appendChild(progressSlider);
        }

        if(settingsObject.videoControlsDisplay.showPlayPauseButton){
            controlsWrapper.appendChild(playButton);
        }

        if(settingsObject.videoControlsDisplay.showVolumeIcon){
            volumeIcon.appendChild(volumeSliderContainer);
            controlsWrapper.appendChild(volumeIcon);
        }
        if(settingsObject.videoControlsDisplay.showVolumeSlider){
            //controlsWrapper.appendChild(volumeSliderContainer);
        }
        if(subtitlesMenu && settingsObject.videoControlsDisplay.showSubtitlesMenu){
            subtitlesContainer.appendChild(subtitlesMenu);
            settingsMenu.appendChild(subtitlesContainer);
            console.log('Adding a menu to the video controls..');
        }

        if(settingsObject.videoControlsDisplay.showSettingsIcon){
            controlsWrapper.appendChild(settingsIcon);
        }

        if(settingsObject.videoControlsDisplay.showTimer){
            controlsWrapper.appendChild(progressTimerContainer);
        }

        if(settingsObject.videoControlsDisplay.showFullScreenButton){
            controlsWrapper.appendChild(fullScreenButton);
        }

        //Lets add the settingsIcon to the videoControls
        settingsIcon.appendChild(settingsMenu);

        videoWrapper.appendChild(videoOverlaySpinnerIcon);
        videoWrapper.appendChild(videoOverlayPlayPauseIcon);
        videoWrapper.appendChild(controlsWrapper);

        //Lets now also add keyboard events to
        //the different buttons we want our player to interact with from the keyboard.
        _createKeyboardListeners();
    };

    /**
     * @description A method that in turn will modify the settingsMenu on videoControls to correspond
     * to different choices the user has to decide which quality the video should be streamed at.
     * @param typeOfStream
     * @param bitrateObjectsArray
     * @private
     */
    function _addBitrateMenuToSettingsIcon(typeOfStream, bitrateObjectsArray){
        console.log('Reached the bitrate object method on video controls module');
        console.log('The stream is..' + typeOfStream);
        if(typeOfStream !== 'audio'){
            //Lets print out the bitrateObjectArray and modify the menu
            console.log(bitrateObjectsArray);
            console.log('Should be video or videoAndAudio stream now');

            var bitrateMenu = document.createElement('div');
            bitrateMenu.setAttribute('class','free-video-player-controls-settings-menu');

            that.currentVideoControlsObject.settingsIcon.appendChild(bitrateMenu);
        }
    };

    //  ##########################
    //  #### CONTROL METHODS ####
    //  ##########################
    /**
     * @description This method makes the video play or pause depending on its current state,
     * will also paint out different states in the DOM both for the controls and the videoOverlay
     * @private
     */
    function _playPauseMethod(){
        if(!that.currentVideoObject.playing){
            that.videoElement.play();
            _addPauseIconToControls();
            _addPlayIconToVideoOverlay();
            that.currentVideoObject.playing = true;

        } else {
            that.videoElement.pause();
            _addPlayIconToControls();
            _addPauseIconToVideoOverlay();
            that.currentVideoObject.playing = false;
        }
    };

    /**
     * @description Adds a play icon to the controls
     * @private
     */
    function _addPlayIconToControls(){
        that.currentVideoControlsObject.playButton.innerHTML = settingsObject.videoControlsInnerHtml.playIconInnerHtml;
    };

    /**
     * @description Adds a pause icon to the controls
     * @private
     */
    function _addPauseIconToControls(){
        that.currentVideoControlsObject.playButton.innerHTML = settingsObject.videoControlsInnerHtml.pauseIconInnerHtml;
    };

    /**
     * @description Adds a spinner icon to the video overlay
     * @private
     */
    function _addSpinnerIconToVideoOverlay(){
        that.currentVideoControlsObject.videoOverlaySpinnerIcon.innerHTML = settingsObject.videoControlsInnerHtml.spinnerIconInnerHtml;
    };

    /**
     * @description Removes the spinner icon from the video overlay
     * @private
     */
    function _removeSpinnerIconFromVideoOverlay(){
        that.currentVideoControlsObject.videoOverlaySpinnerIcon.innerHTML = '';
    };

    /**
     * @description A method called when the progress slider is moved, if the current state of the videoElement
     * is playing then the video should continue playing, otherwise the state should be stopped/paused.
     * @private
     */
    function _playMethodFromSlider(){
        if(that.currentVideoObject.playing){
            that.videoElement.play();
            _addPauseIconToControls();
            that.currentVideoObject.playing = true;
        } else {
            _pauseMethodFromSlider();
            that.currentVideoObject.playing = false;
        }
    };

    /**
     * @description A method to pause the videoElement, utilized as a sub-method when the slider is moved
     * @private
     */
    function _pauseMethodFromSlider(){
        that.videoElement.pause();
        //that.currentVideoObject.playing = false;
        _addPlayIconToControls();
    };

    /**
     * @desciption A method to shift the volume up and down
     * @private
     */
    function _volumeShiftMethod(){
        var newVolumeValue = 0;
        if(that.currentVideoControlsObject.volumeSlider.value >= that.currentVideoControlsObject.volumeHighStart){
            that.currentVideoControlsObject.volumeIcon.innerHTML = settingsObject.videoControlsInnerHtml.volumeHighIconInnerHtml;
        } else if(that.currentVideoControlsObject.volumeSlider.value < that.currentVideoControlsObject.volumeHighStart
            && that.currentVideoControlsObject.volumeSlider.value > that.currentVideoControlsObject.volumeLowEnd) {
            that.currentVideoControlsObject.volumeIcon.innerHTML = settingsObject.videoControlsInnerHtml.volumeLowIconInnerHtml;
        } else {
            that.currentVideoControlsObject.volumeIcon.innerHTML = settingsObject.videoControlsInnerHtml.novolumeIconInnerHtml;
        }
        //adding the actual volume slider container after we have made a change
        that.currentVideoControlsObject.volumeIcon.appendChild(that.currentVideoObject.volumeSliderContainer);
        newVolumeValue = that.currentVideoControlsObject.volumeSlider.value/100;
        that.videoElement.volume = newVolumeValue;
        //Lets always set volume to unmute when we are moving the volume slider
        that.currentVideoObject.muted = false;
        that.currentVideoObject.volumeSliderContainer.style.visibility = 'hidden';
    };

    /**
     * @description A method to mute and unmute the volume for the videoElement aswell as modifying the position of the
     * volume slider. Also if the volume is muted the last known volume value will be saved so the volume slider will
     * return to this value once unmuted.
     * @private
     */
    function _volumeMuteUnmuteMethod(){
        if(that.currentVideoObject.muted){
            that.videoElement.volume = that.currentVideoObject.volumeBeforeMute;
            that.currentVideoControlsObject.volumeSlider.value = that.currentVideoObject.volumeBeforeMute*100;
            that.currentVideoObject.muted = false;

            if(that.currentVideoControlsObject.volumeSlider.value >= that.currentVideoControlsObject.volumeHighStart){
                that.currentVideoControlsObject.volumeIcon.innerHTML = settingsObject.videoControlsInnerHtml.volumeHighIconInnerHtml;
                that.currentVideoControlsObject.volumeIcon.appendChild(that.currentVideoObject.volumeSliderContainer);
            }
            else if(that.currentVideoControlsObject.volumeSlider.value > that.currentVideoControlsObject.volumeLowEnd
                && that.currentVideoControlsObject.volumeSlider.value < that.currentVideoControlsObject.volumeHighStart){
                that.currentVideoControlsObject.volumeIcon.innerHTML = settingsObject.videoControlsInnerHtml.volumeLowIconInnerHtml;
                that.currentVideoControlsObject.volumeIcon.appendChild(that.currentVideoObject.volumeSliderContainer);
            } else {
                that.currentVideoControlsObject.volumeIcon.innerHTML = settingsObject.videoControlsInnerHtml.novolumeIconInnerHtml;
                that.currentVideoControlsObject.volumeIcon.appendChild(that.currentVideoObject.volumeSliderContainer);
                //Lets set a lowest value here if we want to unmute the volume slider..?
            }
        } else {
            that.currentVideoObject.volumeBeforeMute = that.currentVideoControlsObject.volumeSlider.value/100;
            that.videoElement.volume = 0;
            that.currentVideoControlsObject.volumeSlider.value = 0;
            that.currentVideoObject.muted = true;
            that.currentVideoControlsObject.volumeIcon.innerHTML = settingsObject.videoControlsInnerHtml.novolumeIconInnerHtml;
        }
    };

    /**
     * @description A method to shift to a new position within the videoElement, basically seeking to a new position and
     * also updating the controls as we do this
     * @private
     */
    function _progressShiftMethod(){
        //First get the total value of the asset.
        var videoDurationInSeconds = that.currentVideoObject.mediaDurationInSeconds,
            newPosition = Math.floor((that.currentVideoControlsObject.progressSlider.value/100)*videoDurationInSeconds);
        //Seek to new position
        that.videoElement.currentTime = newPosition;
        console.log('The current video object playing is...' + that.currentVideoObject.playing);

        if(!that.currentVideoObject.playing){
            _pauseMethodFromSlider();
        }
    };

    /**
     * @description A method that can be called continuasly to update the progress bar of the current video position.
     * @private
     */
    function _progressUpdateMethod(){
        var videoDurationInSeconds = that.currentVideoObject.mediaDurationInSeconds,
            currentPosition = that.videoElement.currentTime,
            progressInPercentage = Math.round((currentPosition/videoDurationInSeconds)*100);

            that.currentVideoControlsObject.progressTimerCurrentTime.innerHTML = _returnHoursMinutesSecondsFromSeconds(currentPosition),
            that.currentVideoControlsObject.progressSlider.value = progressInPercentage;
    };

    /**
     * @description A method that can be called to print the total media duration of an asset
     * @private
     */
    function _printMediaTotalDuration(){
        //Lets update the media total duration span
        that.currentVideoControlsObject.progressTimerTotalDuration.innerHTML = '/' + _returnHoursMinutesSecondsFromSeconds(that.currentVideoObject.mediaDurationInSeconds);
    };

    /**
     * @description A method will make the volume slider visible
     * @private
     */
    function _showVolumeSlider(){
        that.currentVideoControlsObject.volumeSliderContainer.style.visibility="visible";
    };

    /**
     * @description A method that will make the volume slider not visible
     * @private
     */
    function _hideVolumeSlider(){
        that.currentVideoControlsObject.volumeSliderContainer.style.visibility="hidden";
    };

    /**
     * @description A method that will make changes to the settings easy :).
     * @private
     */
    function _changeSettings(){
        console.log('Clicked settings button');
        console.log('Lets try adding css classes here');
        if(_checkIfElementHasCssClassReturnBoolean(that.currentVideoControlsObject.settingsMenu, settingsObject.videoControlsCssClasses.displayNoneClass)){
            _removeCssClassToElementAndReturn(that.currentVideoControlsObject.settingsMenu, settingsObject.videoControlsCssClasses.displayNoneClass)
        } else {
            _addCssClassToElementAndReturn(that.currentVideoControlsObject.settingsMenu, settingsObject.videoControlsCssClasses.displayNoneClass)
        }
    };

    /**
     * @description A method that will enable full screen mode on the Free Video Player
     * @private
     */
    function _fullScreenMethod(){
        if (that.videoElement.requestFullscreen) {
            that.videoElement.requestFullscreen();
        } else if (that.videoElement.mozRequestFullScreen) {
            that.videoElement.mozRequestFullScreen();
        } else if (that.videoElement.webkitRequestFullscreen) {
            that.videoElement.webkitRequestFullscreen();
        } else {
            var messageObject = {};
                messageObject.message = 'Could not enter fullscreen mode, check if browser is compatible';
                messageObject.methodName = '_createVideoControls';
                messageObject.moduleName = moduleName;
            messagesModule.printOutMessageToConsole(messageObject);
        }
    };

    //  ###############################
    //  #### VIDEO OVERLAY METHODS ####
    //  ###############################
    /**
     * @description A method that adds a play icon to the video overlay
     * @private
     */
    function _addPlayIconToVideoOverlay(){
        _removeCssClassToElementAndReturn(that.currentVideoControlsObject.videoOverlayPlayPauseIcon, settingsObject.videoControlsCssClasses.hideVideoOverlayClass);
        that.currentVideoControlsObject.videoOverlayPlayPauseIcon.innerHTML = settingsObject.videoControlsInnerHtml.playIconInnerHtml;
        _addCssClassToElementAndReturn(that.currentVideoControlsObject.videoOverlayPlayPauseIcon, settingsObject.videoControlsCssClasses.hideVideoOverlayClass);
    };

    /**
     * @description A method that adds a pause icon to the video overlay
     * @private
     */
    function _addPauseIconToVideoOverlay(){
        _removeCssClassToElementAndReturn(that.currentVideoControlsObject.videoOverlayPlayPauseIcon, settingsObject.videoControlsCssClasses.hideVideoOverlayClass);
        that.currentVideoControlsObject.videoOverlayPlayPauseIcon.innerHTML = settingsObject.videoControlsInnerHtml.pauseIconInnerHtml;
        _addCssClassToElementAndReturn(that.currentVideoControlsObject.videoOverlayPlayPauseIcon, settingsObject.videoControlsCssClasses.hideVideoOverlayClass);
    };

    /**
     * @description A method that adds a spinner icon to the video overlay
     * @private
     */
    function _addSpinnerIconToVideoOverlay(){
        _removeCssClassToElementAndReturn(that.currentVideoControlsObject.videoOverlayPlayPauseIcon, settingsObject.videoControlsCssClasses.hideVideoOverlayClass);
        that.currentVideoControlsObject.videoOverlayPlayPauseIcon.innerHTML = settingsObject.videoControlsInnerHtml.spinnerIconInnerHtml;
    };

    /**
     * @description A method that removes the spinner icon from the video overlay
     * @private
     */
    function _removeSpinnerIconFromVideoOverlay(){
        _removeCssClassToElementAndReturn(that.currentVideoControlsObject.videoOverlayPlayPauseIcon, settingsObject.videoControlsCssClasses.hideVideoOverlayClass);
        that.currentVideoControlsObject.videoOverlayPlayPauseIcon.innerHTML = settingsObject.videoControlsInnerHtml.spinnerIconInnerHtml;
        _addCssClassToElementAndReturn(that.currentVideoControlsObject.videoOverlayPlayPauseIcon, settingsObject.videoControlsCssClasses.hideVideoOverlayClass);
    };

    //  #####################
    //  #### CSS METHODS ####
    //  #####################
    /**
     * @description A method that adds a css class to an an element
     * @param element
     * @param className
     * @private
     */
    function _addCssClassToElementAndReturn(element, className){
        var classString = element.getAttribute('class');
        classString = classString + ' ' + className;
        try {
            setTimeout(function(){
                element.setAttribute('class', classString);
            }, animationDelayObject.videoOverlayFadeOutDelay);
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not add css class to element and return after small delay';
                messageObject.methodName = '_addCssClassToElementAndReturn';
                messageObject.moduleName = moduleName;
            messagesModule.printOutMessageToConsole(messageObject);
        }
    };

    /**
     * @description A method that removes a css class from an an element
     * @param element
     * @param className
     * @private
     */
    function _removeCssClassToElementAndReturn(element, className){
        var classString = element.getAttribute('class');
        classString = classString.split(className);
        if(classString.length > 0){
            // If we found an instance of the className and split
            // into at least to different parts
            // we should now fetch the first instance
            classString = classString[0].trim();
        } else {
            //Do nothing here since the class name is not here
        }
        element.setAttribute('class', classString);
    };

    /**
     * @description A utility method meant to be able to filter.
     * @param element
     * @param className
     * @returns {boolean}
     * @private
     */
    function _checkIfElementHasCssClassReturnBoolean(element, className){
        var classString = element.getAttribute('class'),
            elementHasClass = false;

        classString = classString.split(className);

        if(classString.length > 1){
            // If we found an instance of the className and split
            // into at least to different parts
            // we should now fetch the first instance
            elementHasClass = true;
        }
        return elementHasClass;
    };

    //  #########################
    //  #### KEYBOARD EVENTS ####
    //  #########################
    /**
     * @description A method that aggregates the methods that will add keyboard eventListeners to the Free Video Player
     * @private
     */
    function _createKeyboardListeners(){
        //Add event listener for space button - play/pause
        _createPlayPauseSpaceBarListener();
        //Lets add more listeners here
    };

    /**
     * @description An overall method to remove eventListeners connected to the keyboard, if say a previous asset was loaded and
     * a new one is loaded.
     * @private
     */
    function _removeKeyboardListeners(){
        //Remove space bar key listener
      _removePlayPauseSpaceBarListener();
    };

    /**
     * @description A method that enables to play/pause from the keyboard spacebar.
     * @private
     */
    function _createPlayPauseSpaceBarListener(){
        document.addEventListener('keypress', _spaceBarKeyPress);
    };

    /**
     * @description The method that removes the play/pause button from the spacebar.
     * @private
     */
    function _removePlayPauseSpaceBarListener(){
        try {
            document.removeEventListener('keypress', _spaceBarKeyPress);
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not remove play/pause spacebar eventlistener';
                messageObject.methodName = '_removePlayPauseSpaceBarListener';
                messageObject.moduleName = moduleName;
            messagesModule.printOutMessageToConsole(messageObject);
        }
    };

    /**
     * @description The actual method that catches the event from the spacebar button
     * @param event
     * @private
     */
    function _spaceBarKeyPress(event){
        var code;
        if (event.keyCode) {
            code = event.keyCode;
        } else if (event.which) {
            code = event.which;
        }
        if (code === 32 || code === 0) {
            event.preventDefault();
            _playPauseMethod();
        }
    };


    //  ################################
    //  #### CALCULATE TIME METHODS ####
    //  ################################
    /**
     * @description A method that calculates and returns a Hours Minutes and Seconds string from Seconds
     * @param seconds
     * @returns {string}
     * @private
     */
    function _returnHoursMinutesSecondsFromSeconds(seconds){
        var returnHourMinutesSeconds = '0:00';
            try {
                var roundedSeconds = Math.round(parseInt(seconds, 10)),
                    minutes = Math.floor(roundedSeconds/60),
                    hours = Math.floor(roundedSeconds/3600),
                    seconds = roundedSeconds - (minutes * 60);

                if(hours == 0){
                    hours = '';
                }

                if(hours < 10
                && hours > 0){
                    hours = '0' + hours + ':';
                }

                if(hours >= 10){
                    hours = hours + ':';
                }

                if(seconds < 10){
                    seconds = '0' + seconds;
                }

                returnHourMinutesSeconds = hours + minutes + ':' + seconds;

            } catch(e){
                var messageObject = {};
                    messageObject.message = 'Could not parse and return hours, minutes, seconds string from seconds';
                    messageObject.methodName = 'returnHoursMinutesSecondsFromSeconds';
                    messageObject.moduleName = moduleName;
                messagesModule.printOutErrorMessageToConsole(messageObject, e);
            }
        return returnHourMinutesSeconds;
    };


    //  ################################
    //  #### BITRATE METHODS / DOM ####
    //  ################################
    /**
     * @description Creates a bitrate menu and returns that menu
     * @private
     * @param bitrateObject
     * @returns {*}
     */
    function _createBitrateMenuAndReturnMenu(bitrateObject){
        var bitrateMenu = null,
            documentFragment,
            createBitrateMenuItemConfigObject = {};
        try {

            if (videoElement.textTracks.length > 0) {
                bitrateMenu = document.createElement('div');
                bitrateMenu.innerHTML = settingsObject.videoControlsInnerHtml.bitrateMenuInnerHtml;
                documentFragment = document.createDocumentFragment();
                bitrateMenu = documentFragment.appendChild(document.createElement('ul'));
                bitrateMenu.className =  settingsObject.videoControlsCssClasses.bitrateMenuClass;
                that.currentVideoObject.bitrateMenu = bitrateMenu;
                //subtitlesMenu.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'subtitles-menu');

                //Since we are setting the language to a value here, this subtitle button will appear
                //as a choice in the menu, with label name set to the subtitlesMenuOffButtonInnerHtml,
                //and this button will act as a deactivator of subtitles
                createBitrateMenuItemConfigObject = {
                    bitrateName: 'auto',
                    bitrateIndex: 0,
                };

                bitrateMenu.appendChild(_createBitrateMenuItem(createBitrateMenuItemConfigObject));

                for (var i = 0; i < bitrateObject.length; i++) {

                    var createBitrateMenuItemConfigObject = {
                        bitrateName: bitrateObject[i].bitrateName,
                        bitrateIndex: bitrateObject[i].bitrateIndex
                    };
                    bitrateMenu.appendChild(_createBitrateMenuItem(createBitrateMenuItemConfigObject));
                }
            }
        } catch(e){

            var messageObject = {};
            messageObject.message = 'Could not create a bitrate menu and return the menu';
            messageObject.methodName = '_createBitrateMenuAndReturnMenu';
            messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return bitrateMenu;
    };



    //  ################################
    //  #### SUBTITLE METHODS / DOM ####
    //  ################################
    /**
     * @description Creates a subtitle menu and returns that menu
     * @private
     * @param videoElement
     * @returns {*}
     */
    function _createSubtitlesMenuAndReturnMenu(videoElement){
        var subtitlesMenu = null,
            documentFragment,
            createSubtitleMenuItemConfigObject = {};
        try {

            if (videoElement.textTracks.length > 0) {
                subtitlesMenu = document.createElement('div');
                subtitlesMenu.innerHTML = settingsObject.videoControlsInnerHtml.subtitlesMenuInnerHtml;
                documentFragment = document.createDocumentFragment();
                subtitlesMenu = documentFragment.appendChild(document.createElement('ul'));
                subtitlesMenu.className =  settingsObject.videoControlsCssClasses.subtitlesMenuClass;
                that.currentVideoObject.subtitlesMenu = subtitlesMenu;
                //subtitlesMenu.setAttribute('data-' + videoPlayerNameCss + '-control-type', 'subtitles-menu');

                //Since we are setting the language to a value here, this subtitle button will appear
                //as a choice in the menu, with label name set to the subtitlesMenuOffButtonInnerHtml,
                //and this button will act as a deactivator of subtitles
                createSubtitleMenuItemConfigObject = {
                    language: settingsObject.videoControlsInnerHtml.subtitlesMenuOffButtonInnerHtml,
                    label: settingsObject.videoControlsInnerHtml.subtitlesMenuOffButtonInnerHtml,
                    videoElement: videoElement
                };


                //Lets also add the CORS configuration on the video element
                videoElement.setAttribute('crossorigin', 'anonymous');

                subtitlesMenu.appendChild(_createSubtitlesMenuItem(createSubtitleMenuItemConfigObject));

                for (var i = 0; i < videoElement.textTracks.length; i++) {

                    var createSubtitleMenuItemConfigObject = {
                        language: videoElement.textTracks[i].language,
                        label:videoElement.textTracks[i].label,
                        videoElement: videoElement
                    };
                    subtitlesMenu.appendChild(_createSubtitlesMenuItem(createSubtitleMenuItemConfigObject));
                }
            }
        } catch(e){

            var messageObject = {};
                messageObject.message = 'Could not create a subtitles menu and return the menu';
                messageObject.methodName = '_createSubtitlesMenuAndReturnMenu';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return subtitlesMenu;
    };

    /**
     * @description Creates a subtitle menu item. This will be added to the subtitle menu
     * @param configObject
     * @returns {Node}
     */
    function _createSubtitlesMenuItem(configObject){

        var language = configObject.language,
            label = configObject.label,
            videoElement = configObject.videoElement,
            textTracks = videoElement.textTracks;

        var listItem = document.createElement('li'),
            button = listItem.appendChild(document.createElement('div'));

        //button.setAttribute('id', id);
        button.className = settingsObject.videoControlsCssClasses.subtitleButtonClass;
        if(language.length > 0){
            //For the empty subtitles track
            button.setAttribute('lang', language);
            button.value = label;
            button.setAttribute('data-' + videoPlayerNameCss + '-state' , 'inactive');
            button.appendChild(document.createTextNode(label));
            //Lets add an eventlistener to the subtitle button item
            button.addEventListener('click', function(event){
                //Set all buttons to inactive
                console.log('Activating the subtitle with label ' + label);

                try {
                    //Lets fetch all buttons within the subtitle menu and set those
                    //data states to inactive
                    var subtitlesMenu = that.currentVideoObject.subtitlesMenu,
                        subtitlesMenuButtonsArray = subtitlesMenu.children;

                    for(var j = 0, subtitleMenuLength = subtitlesMenuButtonsArray.length; j < subtitleMenuLength; j++){
                        subtitlesMenuButtonsArray[j].setAttribute('data-' + videoPlayerNameCss + '-state', 'inactive');
                    }

                    //Lets first deactive all subtitles, setting this on the buttons so they can be styled
                    for(var i = 0, textTracksLength = textTracks.length; i < textTracksLength; i++){
                        if(textTracks[i].label === label){
                            textTracks[i].mode = 'showing';
                            this.setAttribute('data-' + videoPlayerNameCss + '-state', 'active');
                        } else {
                            textTracks[i].mode = 'hidden';
                        }
                    }
                    //Now lets set the style to display none
                    subtitlesMenu.style.display = 'none';
                } catch(e){
                    var messageObject = {};
                        messageObject.message = 'Could not activate subtitle with language';
                        messageObject.methodName = '_createSubtitlesMenuItem';
                        messageObject.moduleName = moduleName;
                    messagesModule.printOutErrorMessageToConsole(messageObject, e);
                }
            });
        }
        return button;
    };

    //Make methods public
    that.createVideoControls = _createVideoControls;
    //Spinner methods
    that.addSpinnerIconToVideoOverlay = _addSpinnerIconToVideoOverlay;
    that.removeSpinnerIconFromVideoOverlay = _removeSpinnerIconFromVideoOverlay;
    //Bitrate method, used by adaptive streaming module/player
    that.addBitrateMenuToSettingsIcon = _addBitrateMenuToSettingsIcon;
    //Return our object
    return that;
};
/**
 * @title FREE VIDEO PLAYER - MPD PARSER MODULE
 * @authors Johan Wedfelt
 * @license GPLv3, see http://www.gnu.org/licenses/gpl-3.0.en.html
 * @dependencies Requires the xml2json library to work
 * @description A cool MPD PARSER MODULE to use with the FREE VIDEO PLAYER library.
 * @version 0.9.0
 * @web http://www.freevideoplayer.org
 * @param initiationObject {object} - An initiation object used to define settings for the mpdParserModule
 */
//Lets add the mpdParser to the global namespace
freeVideoPlayerModulesNamespace.freeVideoPlayerMpdParser = function(initiationObject){

    'use strict';

    //  ################################
    //  #### VARIABLE INSTANTIATION ####
    //  ################################
    /**
     * @description Instantiate the variables we need when setting up this mpdParser module
     * @type {{}}
     */
    var currentVideoObject = {},
        that = {},
        mpdParserVersion = '0.9.0',
        moduleName = 'MPD PARSER',
        defaultObject = {
            debugMode:true
        },
        settingsObject = Object.assign({}, defaultObject, initiationObject),
        messagesModule = freeVideoPlayerModulesNamespace.freeVideoPlayerMessages(settingsObject, mpdParserVersion);

    //Indicate that the returned object is a module
    that._isModule = true;


    //  ############################
    //  #### MPD OBJECT METHODS ####
    //  ############################
    /**
     * @description Returns the max segment duration from the MPD object
     * @public
     * @returns {number}
     */
    function returnMaxSegmentDurationFromMpdObject(){
        var segmentDuration = 0;
        //First lets set that the segment length should not be more than one minute
        //then we should parse the information we get
        try {
            var segmentDurationFull = currentVideoObject.mpdObject._maxSegmentDuration || 'M10.000S',
                segmentDuration = segmentDurationFull.split('M')[1],
                segmentDuration = segmentDuration.split('S')[0];
        } catch(e){

            var messageObject = {};
                messageObject.message = 'Could not generate a max segment duration string from the MPD';
                messageObject.methodName = 'returnMaxSegmentDurationFromMpdObject';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return segmentDuration;
    };

    /**
     * @description Returns the media duration in seconds from the MPD object
     * @public
     * @returns {number}
     */
    function returnMediaDurationInSecondsFromMpdObject(){
        var mediaDurationInSeconds = 0;
        try {
            var mediaDurationFullString = currentVideoObject.mpdObject._mediaPresentationDuration,
                mediaDurationTemporaryFullString = '';

            if(mediaDurationFullString.split('PT').length > 1){
                mediaDurationTemporaryFullString = mediaDurationFullString.split('PT')[1];
            } else {
                mediaDurationTemporaryFullString = mediaDurationFullString.split('P0DT')[1];
            }

            var hoursString = mediaDurationTemporaryFullString.split('H')[0],
                minutesString = mediaDurationTemporaryFullString.split('H')[1].split('M')[0],
                secondsString = mediaDurationTemporaryFullString.split('M')[1].split('S')[0],
                hours = parseInt(hoursString,10),
                minutes = parseInt(minutesString, 10),
                seconds = parseInt(secondsString, 10),
                hoursInSeconds = hours * 3600,
                minutesInSeconds = minutes * 60;

            //Lets add our result to the returning mediaDurationInSeconds we
            //will return
            mediaDurationInSeconds = hoursInSeconds + minutesInSeconds + seconds;

        } catch(e){

            var messageObject = {};
                messageObject.message = 'Could not get media duration string from the MPD';
                messageObject.methodName = 'returnMediaDurationInSecondsFromMpdObject';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return mediaDurationInSeconds;
    };

    /**
     * @description Returns the average segment duration from the mpd object
     * @public
     * @returns {number}
     */
    function returnAverageSegmentDurationFromMpdObject(){
        var segmentDuration = 0;
        //First lets set that the segment length should not be more than one minute
        //then we should parse the information we get
        try {
            var segmentDurationFull = currentVideoObject.mpdObject._maxSegmentDuration || 'M10S',
                segmentDuration = segmentDurationFull.split('M')[1],
                segmentDuration = segmentDuration.split('S')[0];
            segmentDuration = parseInt(segmentDuration, 10);

        } catch(e){

            var messageObject = {};
                messageObject.message = 'Could not generate a max segment duration string from the MPD';
                messageObject.methodName = 'returnAverageSegmentDurationFromMpdObject';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        //First lets set that the segment length should not be more than one minute
        //then we should parse the information we get
        return segmentDuration;
    };

    /**
     * @description Returns an array of adaptionSets from the MPD object
     * @public
     * @returns {Array}
     */
    function returnArrayOfAdaptionSetsFromMpdObject(){
        var returnArray = [],
            adaptionSetTemporary = [],
            mpdObject;

        try {
            mpdObject = currentVideoObject.mpdObject;
            adaptionSetTemporary = mpdObject.Period.AdaptationSet;
            if(Object.prototype.toString.call( adaptionSetTemporary) === '[object Array]' ){
                returnArray = adaptionSetTemporary
            } else {
                returnArray.push(adaptionSetTemporary);
            }

        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not parse mdpObject.Period.AdapationSet';
                messageObject.methodName = 'returnArrayOfAdaptionSetsFromMpdObject';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);

        }
        return returnArray;
    };

    /**
     * @description Returns an array of subtitles from the MPD object
     * @public
     * @returns {Array}
     */
    function returnArrayOfSubtitlesFromMpdObject(){
        //Should utilize low level methods to parse through and get the
        //subtitles that we need

        var arrayOfAdaptionSets = returnArrayOfAdaptionSetsFromMpdObject(currentVideoObject.mpdObject),
            returnArrayOfSubtitles = [],
            firstRepresentation = {},
            mimeType = '',
            subtitleId = 1;

        try {
            arrayOfAdaptionSets.forEach(function(currentAdaptionSet, index, adaptionSetArray){

                var arrayOfRepresentations = returnArrayOfRepresentationSetsFromAdapationSet(currentAdaptionSet);

                firstRepresentation = arrayOfRepresentations[0];
                mimeType = returnMimeTypeFromRepresentation(firstRepresentation);

                if(mimeType.indexOf('vtt') > -1){
                    var subtitleTrackObject = {};
                    //Now its confirmed that the adaptionSet actually contains a webvtt file
                    //Lets build our subtitleTrackObjects
                    subtitleTrackObject.subtitleUrl = returnBaseUrlFromRepresentation(firstRepresentation);
                    subtitleTrackObject.subtitleLanguage = returnSubtitleLanguageFromAdaptionSet(currentAdaptionSet);
                    subtitleTrackObject.subtitleId = subtitleId;
                    //Lets add a tick to our subtitleId counter
                    subtitleId++;
                    returnArrayOfSubtitles.push(subtitleTrackObject);
                }
            });
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not return array of subtitles, check method';
                messageObject.methodName = 'returnArrayOfSubtitlesFromMpdObject';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return returnArrayOfSubtitles;
    };

    //  #############################
    //  #### ADAPTIONSET METHODS ####
    //  #############################
    /**
     * @description Returns the segment template from the adaptionset
     * @public
     * @param AdapationSet
     * @returns {{}}
     */
    function returnSegmentTemplateFromAdapationSet(AdapationSet){
        var segmentTemplate = {};
        try {
            segmentTemplate = AdapationSet.SegmentTemplate;
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not parse SegmentTemplate from AdapationSet';
                messageObject.methodName = 'returnSegmentTemplateFromAdapationSet';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return segmentTemplate;
    };

    /**
     * @description Returns the mimeType from the adaptionSet
     * @public
     * @param AdaptationSet
     * @returns {*}
     */
    function returnMimeTypeFromAdaptionSet(AdaptationSet){
        var mimeType = null;
        try {
            mimeType = (AdaptationSet._mimeType) ? AdaptationSet._mimeType : null;
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not return MimeType from AdaptionSet';
                messageObject.methodName = 'returnMimeTypeFromAdaptionSet';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return mimeType;
    };

    /**
     * @description Returns subtitle language from adaptionSet
     * @public
     * @param AdaptionSet
     * @returns {string}
     */
    function returnSubtitleLanguageFromAdaptionSet(AdaptionSet){
        var subtitleLanguage = '';
        try {
            subtitleLanguage = AdaptionSet._lang;
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not parse Subtitle track url from AdapationSet';
                messageObject.methodName = 'returnSubtitleUrlFromAdapationSet';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return subtitleLanguage;
    };

    /**
     * @description Return array of representations from AdaptionSet
     * @public
     * @param AdaptionSet
     * @returns {Array}
     */
    function returnArrayOfRepresentationSetsFromAdapationSet(AdaptionSet){
        var returnArray = [],
            arrayOfRepresentation = [];
        try {
            arrayOfRepresentation = AdaptionSet.Representation;
            if(Object.prototype.toString.call(arrayOfRepresentation) === '[object Array]'){
                //We have an array of representations and
                returnArray = arrayOfRepresentation;
            } else {
                //Its an object and then lets just push the object to
                //the empty array and return that array
                returnArray.push(arrayOfRepresentation);
            }
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not parse and return an array of Representation from AdapationSet, check input';
                messageObject.methodName = 'returnArrayOfRepresentationFromAdapationSet';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return returnArray;
    };

    function returnArrayOfContentComponentsFromAdaptionSet(AdaptionSet){
        var returnArray = [],
            arrayOfContentComponents = [];
        try {
            arrayOfContentComponents = AdaptionSet.ContentComponent;
            if(Object.prototype.toString.call(arrayOfContentComponents) === '[object Array]'){
                //We have an array of contentComponents
                returnArray = arrayOfContentComponents;
            }
            // else {
            //    //Its an object and then lets just push the object to
            //    //the empty array and return that array
            //    returnArray.push(arrayOfRepresentation);
            //}
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not parse and return an array of ContentComponents from AdapationSet, check input';
                messageObject.methodName = 'returnArrayOfContentComponentsFromAdaptionSet';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return returnArray;
    };

    //  ################################
    //  #### REPRESENTATION METHODS ####
    //  ################################
    function returnBaseUrlFromRepresentation(Representation){
        var baseUrl = '';
        try {
            baseUrl = Representation.BaseURL;
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not parse BaseURL from Representation';
                messageObject.methodName = 'returnBaseUrlFromRepresentation';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return baseUrl;
    };

    function returnMimeTypeFromRepresentation(Representation){
        var mimeType = '';
        try {
            mimeType = Representation._mimeType;
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not return MimeType from Representation';
                messageObject.methodName = 'returnMimeTypeFromRepresentation';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return mimeType;
    };

    function returnCodecsFromRepresentation(Representation){
        var codecs = '';
        try {
            codecs = Representation._codecs;
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not return Codecs from Representation';
                messageObject.methodName = 'returnCodecsFromRepresentation';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return codecs;
    };

    function returnStartNumberFromRepresentation(Representation){
        var startNumber = 0;
        try {
            startNumber = Representation._startWithSAP;
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not parse mpdObject and retrieve Representation._startWithSAP';
                messageObject.methodName = 'returnStartNumberFromRepresentation';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return startNumber;
    };

    function returnArrayOfBaseUrlObjectsFromArrayOfRepresentations(arrayOfRepresentations){
        var arrayOfBaseUrlObjects = [];
        try {
            for(var i = 0, arrayOfRepresentationsLength = arrayOfRepresentations.length; i < arrayOfRepresentationsLength; i++){
                var currentBaseUrlObject = {};
                currentBaseUrlObject.bandwidth = arrayOfRepresentations[i]._bandwidth;
                currentBaseUrlObject.mimeType = arrayOfRepresentations[i]._mimeType;
                currentBaseUrlObject.codecs = arrayOfRepresentations[i]._codecs;
                currentBaseUrlObject.baseUrl = arrayOfRepresentations[i].BaseURL;
                currentBaseUrlObject.index = i;
                arrayOfBaseUrlObjects.push(currentBaseUrlObject);
            }
        } catch (e){
            var messageObject = {};
                messageObject.message = 'Could not parse and extract the array of base urls from the array of representations, checkt input';
                messageObject.methodName = 'returnArrayOfBaseUrlsFromArrayOfRepresentations';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return arrayOfBaseUrlObjects;
    }


    //  ##################################
    //  #### SEGMENT TEMPLATE METHODS ####
    //  ##################################
    function returnDurationFromSegmentTemplate(SegmentTemplate) {
        var duration = 0;
        try {
            duration = SegmentTemplate._duration;
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not parse Duration from SegmentTemplate';
                messageObject.methodName = 'returnDurationFromSegmentTemplate';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return duration;
    };

    function returnInitializationFromSegmentTemplate(SegmentTemplate){
        var initializationFile = '';
        try {
            initializationFile = SegmentTemplate._initialization;
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not parse initializationFile from SegmentTemplate';
                messageObject.methodName = 'returnInitializationFromSegmentTemplate';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return initializationFile;
    };

    function returnMediaStructureAsObjectFromSegmentTemplate(SegmentTemplate){
        var returnObject = {};
        try {
            var mediaStructure = SegmentTemplate._media,
                mediaStructure = mediaStructure.split('$Number$');

            returnObject.segmentPrefix = mediaStructure[0];
            returnObject.segmentEnding = mediaStructure[1];
        } catch (e){
            var messageObject = {};
                messageObject.message = 'Could not return media structure from SegmentTemplate';
                messageObject.methodName = 'returnMediaStructureAsObjectFromSegmentTemplate';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return returnObject;
    };

    //  #########################
    //  #### GENERAL METHODS ####
    //  #########################
    function setMpdObject(mpdObject){
        currentVideoObject.mpdObject = mpdObject;
    };

    function getMpdObject(){
        return currentVideoObject.mpdObject;
    };

    function returnStreamBaseUrlFromMpdUrl(mpdUrl){
        var returnBaseUrl = '',
            temporaryUrl = '',
            mpdName = '';
        try {
            mpdName = mpdUrl.split('/');
            mpdName = mpdName.pop();

            temporaryUrl = mpdUrl.split(mpdName)[0];
            returnBaseUrl = temporaryUrl;
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not generate the streamBaseUrl from the mpdUrl';
                messageObject.methodName = 'returnStreamBaseUrlFromMpdUrl';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return returnBaseUrl;
    };

    function checkIfMultipleAdaptionSets(){
        var multipleAdaptionSetsBoolean = false,
            adaptionSets = {};
        try {
            //Lets add logic here to see if we have multiple adaptionSets.. needed?
            //Do we need this method?

        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not check if stream has multiple adaptionSets';
                messageObject.methodName = 'checkIfMultipleAdaptionSets';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);
        }
        return multipleAdaptionSetsBoolean;
    };

    function checkIfAdapationSetContainSingleRepresentation(AdaptionSet){
        var returnBoolean = true,
            representationAsArray = [];
        try {
            representationAsArray = AdaptionSet.Representation;
            if(Object.prototype.toString.call(representationAsArray) === '[object Array]'){
                returnBoolean = false;
            }
        } catch(e){
            var messageObject = {};
                messageObject.message = 'Could not parse through the AdaptionSet';
                messageObject.methodName = 'checkIfAdapationSetContainSingleRepresentation';
                messageObject.moduleName = moduleName;
            messagesModule.printOutErrorMessageToConsole(messageObject, e);

        }
        return returnBoolean;
    };

    function getVersion(){
        return mpdParserVersion;
    };


    //  #############################
    //  #### MAKE METHODS PUBLIC ####
    //  #############################
    //General
    that.getMpdObject = getMpdObject;
    that.setMpdObject = setMpdObject;
    that.getVersion = getVersion;
    that.checkIfAdapationSetContainSingleRepresentation = checkIfAdapationSetContainSingleRepresentation;
    that.returnStreamBaseUrlFromMpdUrl = returnStreamBaseUrlFromMpdUrl;

    //AdapationSet methods
    that.returnMimeTypeFromAdaptionSet = returnMimeTypeFromAdaptionSet;
    that.returnSegmentTemplateFromAdapationSet = returnSegmentTemplateFromAdapationSet;
    that.returnArrayOfRepresentationSetsFromAdapationSet = returnArrayOfRepresentationSetsFromAdapationSet;
    that.returnSubtitleLanguageFromAdaptionSet = returnSubtitleLanguageFromAdaptionSet;
    that.returnArrayOfContentComponentsFromAdaptionSet = returnArrayOfContentComponentsFromAdaptionSet;

    //MpdObject methods
    that.returnMaxSegmentDurationFromMpdObject = returnMaxSegmentDurationFromMpdObject;
    that.returnAverageSegmentDurationFromMpdObject = returnAverageSegmentDurationFromMpdObject;
    that.returnMediaDurationInSecondsFromMpdObject = returnMediaDurationInSecondsFromMpdObject;
    that.returnArrayOfAdaptionSetsFromMpdObject = returnArrayOfAdaptionSetsFromMpdObject;
    that.returnArrayOfSubtitlesFromMpdObject = returnArrayOfSubtitlesFromMpdObject;

    //SegmentTemplate methods
    that.returnDurationFromSegmentTemplate = returnDurationFromSegmentTemplate;
    that.returnInitializationFromSegmentTemplate = returnInitializationFromSegmentTemplate;
    that.returnMediaStructureAsObjectFromSegmentTemplate = returnMediaStructureAsObjectFromSegmentTemplate;

    //Representation methods
    that.returnBaseUrlFromRepresentation = returnBaseUrlFromRepresentation;
    that.returnCodecsFromRepresentation = returnCodecsFromRepresentation;
    that.returnStartNumberFromRepresentation = returnStartNumberFromRepresentation;
    that.returnMimeTypeFromRepresentation = returnMimeTypeFromRepresentation;
    that.returnArrayOfBaseUrlObjectsFromArrayOfRepresentations = returnArrayOfBaseUrlObjectsFromArrayOfRepresentations;

    //Lets return our object
    return that;
};