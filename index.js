exports.handler = function( event, context ) {

    var first_url = "http://live.nhl.com/GameData/SeasonSchedule-20162017.json";
    var http = require( 'http' );
    var game_id = null
    var last_game = null
    var request = http.get( first_url, function( response ) {
        var data = '';
        response.on( 'data', function( x ) { data += x; } );
        response.on( 'end', function() {
                var json = JSON.parse( data );
                var past_games = []
                json.forEach(function(element) {
                    var full_date = element['est']
                    var home = element['h']
                    var away = element['a']
                    var year = full_date.substring(0, 4);
                    var month = full_date.substring(4, 6);
                    var day = full_date.substring(6, 8);
                    var hour = Number(full_date.substring(9, 11)) - 4;
                    var minute = full_date.substring(12, 14);
                    var format_date = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + "00"
                    var format_date_final = new Date(format_date)
                    var current_date_final = new Date(Date())
                    if (format_date_final < current_date_final && (home == 'LAK' || away == 'LAK')){
                        past_games.push(element)
                    }
                });
                last_game = past_games[past_games.length - 1]
                game_id = last_game['id']

                var game_plays = []
                second_url = "http://live.nhl.com/GameData/20162017/"+game_id+"/PlayByPlay.json";
                var request2 = http.get( second_url, function( response2 ) {
                    var data2 = '';
                    response2.on( 'data', function( x ) { data2 += x; } );
                    response2.on( 'end', function() {
                            var json2 = JSON.parse( data2 );
                            json2['data']['game']['plays']['play'].forEach(function(element2) {
                                game_plays.push(element2['desc'])
                            })
                        var text = game_plays.slice(Math.max(game_plays.length - 5, 1))
                        output( text, context );
                    } );
                } );
            
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