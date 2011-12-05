// PLUGIN: ETHERPAD_PLAYBACK


var etherpadcallback;

(function ( Popcorn ) {
  
  /**
   * Etherpad-playback Popcorn plug-in 
   * Displays the contents of an Etherpad document in the target DOM element specified by the user.
   * Etherpad automatically provides continuous version control, and this plugin allows access to any past revision of the document.
   * -start is the point (in seconds) in the video timeline that you want the document contents rendered. 
   * -end is the time that you want the document contents removed. 
   * -target is the id of the target DOM element in which the document contents will be added (must already exist in the DOM)
   * -padId is the document's padId on the host Etherpad Lite server 
   * -hostName (optional, defaults to 'http://beta.etherpad.org') is the Etherpad Lite server accessed (Include port if necessary)
   * -apiKey (optional, defaults to 'EtherpadFTW') is the API key for the specified Etherpad Lite server.
   * -revNum (optional, defaults to most recent revision) is the revision number of the document to display.
   * @param {Object} options
   * 
   * Example:
     var p = Popcorn("#video")
        .etherpad_playback({
          start: 5, // seconds
          end: 15, // seconds
          padId: "popcornjs-test", 
          target: "etherpaddiv"
        } )
   *
   */
   
  Popcorn.plugin( "etherpad_playback" , {
      
    manifest: {
      about:{
        name: "Popcorn Etherpad-Playback Plugin",
        version: "0.1",
        author: "@aribadernatal",
        website: "http://aribadernatal.com"
      },
      options:{
        start: {
          elem: "input", 
          type: "text", 
          label: "In"
        },
        end: {
          elem: "input", 
          type: "text", 
          label: "Out"
        },
        padId: {
          elem: "input", 
          type: "text", 
          label: "Pad Id"
        },
        hostName : {
          elem: "input", 
          type: "url", 
          label: "Host"
        },
        revNum: {
          elem: "input", 
          type: "text", 
          label: "Revision"
        },
        apiKey: {
          elem: "input", 
          type: "text", 
          label: "API Key"
        },
        target: "etherpad-container"
      }
    },
    /**
     * @member etherpad_playback 
     * The setup function will get all of the needed 
     * items in place before the start function is called. 
     * This includes getting data from the Etherpad server. 
     * If the data is not received and processed before 
     * start is called, it will not do anything
     */
    _setup : function( options ) {
      var  _text, _guid = Popcorn.guid(); 
      
      options.hostName = options.hostName || 'beta.etherpad.org';
      options.apiKey = options.apiKey || 'EtherpadFTW';
      options.revNum = options.revNum || null;
            
            
      // global callback function with a unique id
      // function gets the needed information from etherpad
      // and stores it by appending values to the options object
      window[ "etherpadcallback" + _guid ]  = function ( data ) { 

        // add the title of the article to the link
        options._link = document.createElement( "a" );
        options._link.setAttribute( "href", "//" + options.hostName + '/p/' + options.padId + "/timeslider" );
        options._link.setAttribute( "target", "_blank" );
        options._link.setAttribute( "class", "etherpad-link" );
        options._link.innerHTML = options.title || options.padId;

        // get the content of the pad
        options._desc = document.createElement( "p" );
        options._desc.setAttribute( "class", "etherpad-text" );
        
        try {
          if (data.code == 0) {
            var d = data.data;
            options._desc.innerHTML = d.html;
          } else {
            throw new Error(data.message);
          }
        } catch (e) { 
          console.log(e);
        }
        
        options._fired = true;
      };
      
      if ( options.padId ) {
        var optionalRevInfo = (options.revNum) ? "&rev="+options.revNum : "";
        var scriptUrl = "//" + options.hostName + "/api/1/getHTML?apikey=" + options.apiKey + "&padID=" + options.padId + optionalRevInfo +  "&jsonp=etherpadcallback" + _guid;
        Popcorn.getScript(scriptUrl);
      } else if ( Popcorn.plugin.debug ) {
        throw new Error( "Etherpad-playback plugin needs a 'padId'" );
      }

    },
    /**
     * @member etherpad_playback 
     * The start function will be executed when the currentTime 
     * of the video reaches the start time provided by the 
     * options variable
     */
    start: function( event, options ){
      // dont do anything if the information didn't come back from pad
      var isReady = function () {
        
        if ( !options._fired ) {
          setTimeout( function () {
            isReady();
          }, 13);
        } else {
      
          if ( options._link && options._desc ) {
            if ( document.getElementById( options.target ) ) {
              document.getElementById( options.target ).innerHTML = "";
              document.getElementById( options.target ).appendChild( options._link );
              document.getElementById( options.target ).appendChild( options._desc );
              options._added = true;
            }
          }
        }
      };
      
      isReady();
    },
    /**
     * @member etherpad_playback 
     * The end function will be executed when the currentTime 
     * of the video  reaches the end time provided by the 
     * options variable
     */
    end: function( event, options ){
      // ensure that the data was actually added to the 
      // DOM before removal
      if ( options._added ) {
        document.getElementById( options.target ).removeChild( options._link );
        document.getElementById( options.target ).removeChild( options._desc );
      }
    },

    _teardown: function( options ){

      if ( options._added ) {
        options._link.parentNode && document.getElementById( options.target ).removeChild( options._link );
        options._desc.parentNode && document.getElementById( options.target ).removeChild( options._desc );
        delete options.target;
      }
    }
  });

})( Popcorn );
