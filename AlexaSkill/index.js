exports.handler = function( event, context ) {

    var http = require( 'http' );
 
    var url = 'http://www.reddit.com/r/dota2.json';

    http.get( url, function( response ) {
        
        var data = '';
        
        response.on( 'data', function( x ) { data += x; } );

        response.on( 'end', function() {

            var json = JSON.parse( data );

            var text = 'Here are the top Dota stories! ';

            for ( var i=0 ; i < 5 ; i++ ) {
                var title = json.data.children[i].data.title;
                if ( title ) {
                    b = i + 1
                    text += b + ", " + title + ". ";
                }
            }
        
            output( text, context );
        
        } );
        
    } );
    
};
    
function output( text, context ) {

    var response = {
        outputSpeech: {
            type: "PlainText",
            text: text
        },
        card: {
            type: "Simple",
            title: "Reddit",
            content: text
        },
        shouldEndSession: true
    };
    
    context.succeed( { response: response } );
    
}