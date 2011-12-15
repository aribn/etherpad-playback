test( "Popcorn Etherpad Plugin", function() {

  var popped = Popcorn( "#video" ),
      expects = 13,
      count = 0,
      theArticle = document.getElementById( "etherpaddiv" );

  expect( expects );

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  stop();

  ok( "etherpad_playback" in popped, "etherpad_playback is a method of the popped instance" );
  plus();

  equals( theArticle.innerHTML, "", "initially, there is nothing in the etherpaddiv" );
  plus();

  popped.etherpad_playback({
      start: 1,
      end: 3,
      padId: "popcornjs-test",
      title: "this is the document",
      revNum: 12,
      target: "etherpaddiv"
    });

  popped.etherpad_playback({
      start: 4,
      end: 5,
      padId: "popcornjs-test",
      target: "etherpaddiv",
      revNum: 25,
      numberofwords: 43
    })

  popped.volume( 0 ).play();

  popped.exec( 2, function() {
    notEqual( theArticle.innerHTML, "", "etherpaddiv now contains information" );
    plus();
    equals( theArticle.children[ 0 ].innerHTML, "this is the document", "etherpaddiv has the right title" );
    plus();
    notEqual( theArticle.children[ 1 ].innerHTML, "", "etherpaddiv has some content" );
    plus();
    // subtract 1 from length for the  '...' added in by the plugin
    equals( theArticle.children[ 1 ].innerHTML.split( " " ).length -1, 4, "etherpaddiv contains 4 words" );
    plus();
  });

  popped.exec( 3, function() {
    equals( theArticle.innerHTML, "", "etherpaddiv was cleared properly" );
    plus();
  });

  popped.exec( 4, function() {
    notEqual( theArticle.innerHTML, "", "etherpaddiv now contains information" );
    plus();
    equals( theArticle.childElementCount, 2, "etherpaddiv now contains two child elements" );
    plus();
    notEqual( theArticle.children[ 1 ].innerHTML, "", "etherpaddiv has the right content" );
    plus();
    // subtract 1 from length for the  '...' added in by the plugin
    equals( theArticle.children[ 1 ].innerHTML.split(" ").length - 1, 7, "etherpaddiv contains 7 words" );
    plus();
  });

  popped.exec( 6, function() {
    popped.pause().removeTrackEvent( popped.data.trackEvents.byStart[ 4 ]._id );
    equals( theArticle.innerHTML, "", "etherpaddiv is now empty" );
    plus();
  });

  // empty track events should be safe
  popped.etherpad_playback({});

  // debug should log errors on empty track events
  Popcorn.plugin.debug = true;
  try {
    popped.etherpad_playback({});
  } catch( e ) {
    ok( true, "empty event was caught by debug" );
    plus();
  }
});
