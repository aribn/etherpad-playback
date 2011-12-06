Etherpad-playback plugin for Popcorn.js
=============
This is a [Popcorn.js](http://popcornjs.org) plugin that renders the contents of an [Etherpad](http://etherpad.org) document into a specified target DOM element. Note that this isn't setting up an embedded Etherpad Lite editor (that should be a separate plugin), but rather rendering the HTML contents of an existing Etherpad Lite document into the current page. This is interesting primarily because Etherpad provides near-continuous version control, attaching a unique revision number after every few keystrokes. The idea behind the Popcorn plugin was to give access to each of these revisions, allowing you to step through the creation of a document as the timeline of a video progresses.

See it live [here](http://aribn.github.com/etherpad-playback/).
