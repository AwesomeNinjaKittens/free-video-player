##Version information
***

* Version 0.9.8 - ALPHA
    * Now the player supports multiple ```periods```  for dashed content. This can be used for playing ads for instance. Only tested with non-muxxed assets. Also the current implementation
    loads the subtitles files (if there are any in the asset) for the whole aggregated period time ( all periods stitched together to for a continous stream). This might be subject to change.

* Version 0.9.7 - ALPHA
    * Added ```API``` call ```unload``` which unloads an asset and aborts buffering of streams and such, also updated and fixed splash image and background of player when unloading or when try calling the ```load``` method with a non valid url value.

* Version 0.9.6 - ALPHA
    * Fixes with documentation a bit and README.

* Version 0.9.5 - ALPHA
    * Minor bug fixes with Subtitle/labels still, now loading internal subtitle/label object per default, added a configuration object property called ```fetchExternalSubtitleLabels``` set to *false* that can be overwritten. Updated path in ```package.json``` in production folder for making npm work.

* Version 0.9.4 - ALPHA
    * Solved minor bugs with ISO fallback path

* Version 0.9.3 - ALPHA
    * Some minor restructuring of folders and build jobs, now bundling ```README``` , ```LICENSE```and a ```package.json``` file in the production folder, this so Free Video Player can be deployed to *npm*. This is my first try lets see how it goes. :)

* Version 0.9.2 - ALPHA
    * Fixed ISO fallback, if we cannot find the ```subs/label``` path, the fvp player will load a fallback object instead

* Version 0.9.1 - ALPHA
    * Fixed ```responseType``` to ```json```. 
    * Included ```xml2json``` within the player, not as an external dependency anymore.
    * Fixed a bug with *subtitles*, the label / subtitles file was not being parsed correctly on load, making the choices become ```undefined``` in FVP when an asset with subs was loaded.
    * Started to add some ```mocha``` tests to test player when ```npm test``` is run. Basically the ```gulp build``` command is run and then the tests are run.

* Version 0.9.0 - ALPHA
    * Ability to play adaptive VOD content in the form of DASH
    * Aswell as regular VOD content with containers such as MP4 and WEBM
    * Modularized player code into modules - for better code separation and enabling for a future module based system
    * Optional configuration object when instantiating Free Video Player, being able to show/hide specific video controls
    * Ability to alter CSS classes and HTML of video controls being generated
    * The video controls being generated includes support for spacebar working as play/pause button, and enter button acting as toggling between fullscreen mode. The user can exit the fullscreen mode by pressing esc
    * Support in Chrome, Safari, Opera and FireFox
    * For adaptive DASH content, support for multiple bitrates exists
    * For adaptive DASH content, built in adaptive bitrate algorithm for multiple bitrates exists. This is currently based on the download times for each segment
    * For adaptive DASH content, support for subtitles exists, for non-segmented subtitle VTT files, added as a separate adaptionSet within the mpd
    * For adaptive DASH content, support for both separated video and audio tracks, aswell as muxxed (video and audio combined) exists
    * The release comes with a fully documented version (free.video.player.full.js) and a minified version (free.video.player.minified.js), a css file for player styles (free.video.player.style.css), aswell as base files for SCSS (for web-designers/developers wanting to just style the player a bit), a documentation folder including JSDOC based documentation more explicitly describing the Free Video Player API and more, a subtitles folder with a parsed JSON file including information for subtitle labels which Free Video Player per default utilizes if subtitles are found within a DASH stream, and finally the release also contains both a README and a LICENSE file
***    
