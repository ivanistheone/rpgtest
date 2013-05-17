/**
 * CACHANIA - HTML5 RPG Game
 *
 * main.js
 *
 * @author: Christian Nielebock (http://ravetracer.de; me@ravetracer.de)
 */

var jsApp = {
    onload: function() {

        // init the video
        if (!me.video.init('cachania', 800, 500, true, 1.0)) {
            alert("Sorry but your browser does not support html 5 canvas.");
            return;
        }

        me.sys.preRender = true;

        // initialize the "audio"
        me.audio.init("mp3,ogg");

        // set all resources to be loaded
        me.loader.onload = this.loaded.bind(this);

        // set own function after map is loaded
        me.game.onLevelLoaded = this.mapSettings.bind(this);

        // set all resources to be loaded
        me.loader.preload(g_resources);

        // define own loading screen
        me.state.set(me.state.LOADING, new LoadingScreen());

        // load everything & display a loading screen
        me.state.change(me.state.LOADING);

    },

    loaded: function() {
        me.input.bindKey( me.input.KEY.A, 'toggle_audio' );

        // define title screen
        me.state.set(me.state.MENU, new TitleScreen());

        // define play screen
        me.state.set(me.state.PLAY, new PlayScreen());

        // define end screen
        me.state.set(me.state.GAME_END, new EndScreen());

        // start the game with the menu screen
        me.state.change(me.state.MENU);
    },

    mapSettings : function() {

        /**
         * Evaluate spawn points and set player to the corresponding position
         *
         * @type {*}
         */
        var spawnPoints = me.game.getEntityByName('SpawnPoint');
        var player = me.game.getEntityByName('mainPlayer');
        $.each( spawnPoints, function( index, obj ) {
            if( obj.fromMap == me.gamestat.getItemValue('lastmap') ) {
                player[0].pos.x = obj.pos.x;
                player[0].pos.y = obj.pos.y;
            }
        });

        me.gamestat.setValue( 'lastmap', me.levelDirector.getCurrentLevelId() );

        /**
         * map assigned soundtrack switch
         */
        $.each( soundtrack, function( musicFile, mapAssignments ) {
            if( $.inArray( me.levelDirector.getCurrentLevelId(), mapAssignments ) > -1 ) {
                if( musicFile != me.gamestat.getItemValue( 'currentMusic' ) ) {
                    if( me.gamestat.getItemValue( 'currentMusic').length > 0 ) {
                        me.audio.stopTrack( me.gamestat.getItemValue( 'currentMusic') );
                    }
                    me.gamestat.setValue( 'currentMusic', musicFile );
                    me.audio.playTrack( musicFile );
                }
            }
        });
    }

};

/**
 * Update coin bag display
 */
function updateCoinBags()
{
    var northHtml = '';
    var eastHtml = '';
    $.each( coords.n, function( index, value ) {
        if( value != 'X' ) {
            northHtml += '<img src="data/graphics/sprites/coinbag.png" alt="coinbag" />';
        }
    });
    $.each( coords.e, function( index, value ) {
        if( value != 'X' ) {
            eastHtml += '<img src="data/graphics/sprites/coinbag.png" alt="coinbag" />';
        }
    });

    $('#coinBagsNorth').html( northHtml );
    $('#coinBagsEast').html( eastHtml );
}

/**
 * get text for end screen
 * @return {Object}
 */
function getCoordText()
{
    var coordText = { n : '', e : '' };

    coordText.n  = northCoord + coords.n[0] + coords.n[1];
    coordText.n += '.' + coords.n[2] + coords.n[3] + coords.n[4];

    coordText.e  = eastCoord + coords.e[0] + coords.e[1];
    coordText.e += '.' + coords.e[2] + coords.e[3] + coords.e[4];

    return coordText;
}

/**
 * update coordinates array
 *
 * @param data
 */
function updateCoordData( data )
{
    switch( data[0] ) {
        case 'n' :
            coords.n[ data[1] ] = data[2];
            break;

        case 'e' :
            coords.e[ data[1] ] = data[2];
            break;
    }
}

/**
 * update coords status display
 */
function updateCoords( coordPart, chestObject )
{
    if( me.state.isCurrent(me.state.PLAY) ) {
        var found = false;
        $.post( 'ajax/get_coords.php', { value : coordPart, coords: coords, do_async : ajax_async }, function( data ) {
            if( data.status == 'success' || data.status == 'complete' ) {
                updateCoordData( data.data );
                updateCoinBags();
                window.setTimeout( function() { me.audio.play( 'coordfound' ); }, 500 );
                chestObject.setCurrentAnimation( 'openstart_filled', 'open_filled' );
                if( data.status == 'complete' ) {
                    me.state.change( me.state.GAME_END );
                    return true;
                }
            } else if( data.status == 'fail' ) {
                window.setTimeout( function() { me.audio.play( 'laugh' ); }, 500 );
                chestObject.setCurrentAnimation( 'openstart', 'open' );
            }
        }, 'json');
    }
}

/**
 * Displays a message from the message object
 * @param npcName
 */
var messageShowing = false;

/**
 * scroll longer messages
 */
function scrollMessage()
{
    if( ($('.npcText').scrollTop() + $('.npcText').height()) <= $('#hiddenText').height() ) {
        $('.npcText').animate({ scrollTop : $('.npcText').scrollTop() + $('.npcText').height() / 2 }, 250 );
    } else {
        $('.npcText').animate({ scrollTop : 0 }, 250 );
    }
}

function showMessageLayer( npcName )
{
    if( !messageShowing ) {
        $('.npcImage').attr({
            'src' : 'data/graphics/faces/' + messages[npcName]['face'],
            'alt' : messages[npcName]['face']
        });
        $('.npcText,#hiddenText').html( messages[npcName]['text'] );

        $('#messageLayer').fadeIn( 250, function() {
            $('.npcText').scrollTop(0);
        });
        messageShowing = true;
    }
}

/**
 * Hide message layer
 */
function hideMessageLayer()
{
    $('.npcText').scrollTop(0);
    $('#messageLayer').fadeOut();
    messageShowing = false;
}

/**
 * move object from current position to destination x, y using Bresenham algorithm
 *
 * Source: http://de.wikipedia.org/wiki/Bresenham-Algorithmus#Kompakte_Variante
 *
 * object should have the attributes destX and destY for the destination coordinate
 *
 * @param object
 * @return bool / check, if object reached it's goal
 */
function moveObject( object )
{

    var dx  =  Math.abs( object.destX - object.pos.x ), sx = object.pos.x < object.destX ? object.accel.x : -object.accel.x,
        dy  = -Math.abs( object.destY - object.pos.y ), sy = object.pos.y < object.destY ? object.accel.y : -object.accel.y,
        err = dx + dy, e2 = 0;

    if( object.pos.x == object.destX && object.pos.y == object.destY ) {
        return true;
    }

    e2 = 2 * err;
    if( e2 > dy ) {
        err += dy;
        object.pos.x += sx;
    }

    if( e2 < dx ) {
        err += dx;
        object.pos.y += sy;
    }

    return false;
}

function randomInt( min, max )
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Loading screen
 */
var LoadingScreen = me.ScreenObject.extend({
    init: function()
    {
        this.parent(true);
        this.logo = new Image();
        this.logo.src = 'data:image/png;base64,' + $('#img_col').html();

        this.logo_bw = new Image();
        this.logo_bw.src = 'data:image/png;base64,' + $('#img_bw').html();

        this.invalidate = false;
        this.loadPercent = 0;
        me.loader.onProgress = this.onProgressUpdate.bind(this);

        $('#img_col,#img_bw').remove();
    },

    onProgressUpdate: function(progress)
    {
        this.loadPercent = progress;
        this.invalidate = true;
    },

    update: function()
    {
        if (this.invalidate === true) {
            this.invalidate = false;
            return true;
        }
        return false;
    },

    onDestroyEvent : function ()
    {
        this.logo = null;
        this.logo_bw = null;
    },

    draw : function(context)
    {
        // clear the screen
        me.video.clearSurface (context, "black");

        // draw cachania logo as progress bar
        var posX = 75,
            posY = 150;
        context.drawImage( this.logo, posX, posY );

        var cropValue = Math.floor( this.logo_bw.width * this.loadPercent );
        context.drawImage(  this.logo_bw,
                            cropValue, 0,
                            this.logo_bw.width - cropValue, this.logo_bw.height,
                            cropValue + posX, posY,
                            this.logo_bw.width - cropValue, this.logo_bw.height );
    }
});

/**
 * Title screen
 */
var TitleScreen = me.ScreenObject.extend({

    init : function() {
        this.parent(true);

        this.title = null;
        this.font = null;
    },

    onResetEvent : function() {

        if( this.title == null ) {
            this.title = me.loader.getImage('title_screen');
        }

        me.input.bindKey( me.input.KEY.F, 'chooseFemale', true );
        me.input.bindKey( me.input.KEY.M, 'chooseMale', true );

        me.audio.playTrack('CloudTopLoops');
    },

    update : function() {
        if( me.input.isKeyPressed( 'chooseFemale' ) ) {
            me.gamestat.setValue('gender', 'female');
            me.state.change( me.state.PLAY );
        }

        if( me.input.isKeyPressed( 'chooseMale' ) ) {
            me.gamestat.setValue( 'gender', 'male' );
            me.state.change( me.state.PLAY );
        }

        if( me.input.isKeyPressed( 'toggle_audio' ) ) {
            if( me.audio.isAudioEnable() ) {
                me.audio.stopTrack();
                me.audio.disable();
            } else {
                me.audio.enable();
            }
        }
    },

    draw : function(context) {
        context.drawImage( this.title, 0, 0 );
    },

    onDestroyEvent : function() {
        me.input.unbindKey( me.input.KEY.F );
        me.input.unbindKey( me.input.KEY.M );
    }
});

/**
 * Play screen
 */
var PlayScreen = me.ScreenObject.extend({

    onResetEvent: function() {
        me.audio.stopTrack();

        me.entityPool.add('MapExit', MapExit );
        me.entityPool.add('SpawnPoint', SpawnPoint );
        me.entityPool.add('Chest', Chest );
        me.entityPool.add('Fire', Fire );
        me.entityPool.add('InfoBoard', InfoBoard );
        me.entityPool.add('mainPlayer', PlayerEntity );

        /**
         * Pets
         */
        addPetsToPool();

        /**
         * NPCs
         */
        addNpcsToPool();

        me.input.bindKey( me.input.KEY.LEFT,    'left' );
        me.input.bindKey( me.input.KEY.RIGHT,   'right' );
        me.input.bindKey( me.input.KEY.DOWN,    'down' );
        me.input.bindKey( me.input.KEY.UP,      'up' );
        me.input.bindKey( me.input.KEY.X,       'action', true );
        me.input.bindKey( me.input.KEY.SPACE,   'scroll', true );

        me.levelDirector.loadLevel('woods_01');

        me.game.sort();
    },

    update : function() {
        if( me.input.isKeyPressed( 'toggle_audio' ) ) {
            if( me.audio.isAudioEnable() ) {
                me.audio.stopTrack();
                me.audio.disable();
            } else {
                me.audio.enable();
            }
        }
    },

    onDestroyEvent: function() {
        me.game.disableHUD();
    }
});

/**
 * End game screen
 */
var EndScreen = me.ScreenObject.extend({

    init : function() {
        this.parent(true);

        this.end = null;
        this.font = null;
    },

    onResetEvent : function() {

        if( this.end == null ) {
            this.end = me.loader.getImage('end_screen');
        }
        this.font = new me.BitmapFont('font_16x16', 16);
        me.audio.stopTrack();
        me.audio.playTrack('CloudTopLoops');
    },

    update : function() {

    },

    draw : function(context) {
        context.drawImage( this.end, 0, 0 );

        coordText = getCoordText();
        this.font.draw( context, coordText.n, 480, 410 );
        this.font.draw( context, coordText.e, 480, 435 );
    },

    onDestroyEvent : function() {
    }
});


/**
 * start JS app
 */
window.onReady(function() {
    //me.debug.renderHitBox = true;
    jsApp.onload();
});

/**
 * Help dialog
 */
$(document).ready( function() {

    $('#help_accordion').accordion({
        collapsible: true,
        active : 'none',
        clearStyle: true
    });

    $('#help_dialog').dialog({
        autoOpen : false,
        modal : true,
        title : 'Hilfe oder Fragen und Antworten',
        width : 600,
        height: 500,
        buttons : {
            'Ok' : function() {
                $('#help_dialog').dialog('close');
            }
        }
    });

    $('.faq_link').click(function(e) {
        $('#help_dialog').dialog('open');
        e.preventDefault();
    });
});