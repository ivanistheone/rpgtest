/**
 * CACHANIA - HTML5 RPG Game
 *
 * objects.js
 *
 * @author: Christian Nielebock (http://ravetracer.de; me@ravetracer.de)
 */


/**
 * Own defined map exit
 *
 * @type {*}
 */
var MapExit = me.LevelEntity.extend({

    init : function( x, y, settings ) {
        settings.duration = 250;
        settings.fade = '#000000';

        this.parent( x, y, settings );
    }
});

/**
 * Map Spawn Point
 *
 * @type {*}
 */
var SpawnPoint = me.ObjectEntity.extend({
    init : function( x, y, settings ) {
        settings.image = 'meta_tiles';
        settings.spritewidth = 16;
        settings.spriteheight = 16;
        this.fromMap = settings.from;

        this.parent( x, y, settings );

        this.addAnimation( 'empty', [1] );
        this.setCurrentAnimation( 'empty' );
    }
});

/**
 * A chest object, which updates coordination array through AJAX
 *
 * settings for tiled object
 *
 * coord_part: hash of one part of the coordinates
 * image: chests
 * spritewidth: 32
 * spriteheight: 32
 *
 * @type {*}
 */
var Chest = me.CollectableEntity.extend({
    init : function( x, y, settings ) {
        this.chestOpened = false;

        settings.image = 'chests';
        settings.spritewidth = 32;
        settings.spriteheight = 32;

        this.parent( x, y, settings );

        this.addAnimation( 'closed', [0] );
        this.addAnimation( 'openstart', [2,4] );
        this.addAnimation( 'open', [6] );

        this.addAnimation( 'openstart_filled', [3,5] );
        this.addAnimation( 'open_filled', [7] );

        /**
         * check, if chest was already opened
         */
        if( $.inArray( this.GUID, openedChests ) <= -1 ) {
            this.setCurrentAnimation( 'closed' );
        } else {
            this.setCurrentAnimation( 'open' );
            this.chestOpened = true;
        }

        this.updateColRect( 0, 32, 5, 32 );
        this.autodestroy = false;

        this.coord_part = settings.coord_part;
    },

    onCollision : function() {
        var chestObject = this;
        if( !this.chestOpened ) {
            me.audio.play( 'chest-open' );
            updateCoords( this.coord_part, chestObject );

            this.chestOpened = true;
            openedChests.push( this.GUID );
        }
    }
});

/**
 * small fire
 *
 * settings for tiled object
 *
 * image: fire
 * spritewidth: 24
 * spriteheight: 32
 *
 * @type {*}
 */
var Fire = me.ObjectEntity.extend ({
   init : function( x, y, settings ) {

       settings.image = 'fire';
       settings.spritewidth = 24;
       settings.spriteheight = 32;

       this.parent( x, y, settings );

       this.addAnimation( 'burning', [0,1,2,3,4,5,6,7,8,9,10,11] );
       this.autodestroy = false;
   }
});

var messageCollides = {},
    messageShowTimeout = null;

var InfoBoard = me.ObjectEntity.extend({
    init : function( x, y, settings ) {

        settings.image = 'meta_tiles';
        settings.spritewidth = 16;
        settings.spriteheight = 16;

        this.parent( x, y, settings );

        this.addAnimation( 'empty', [1] );
        this.updateColRect( 0, 32, 0, 38 );
        this.setCurrentAnimation( 'empty' );
        this.collidable = true;

        if( !messages[ this.GUID ] ) {
            var dispText = settings.text,
                face = settings.icon;

            messages[ this.GUID ] = {
                'text' : dispText,
                'face' : face
            }
        }
    },

    update : function() {
        var res = me.game.collide( this );
        if( res ) {
            if( res.obj.name == 'mainplayer' ) {
                if( !messageShowing ) {
                    showMessageLayer( this.GUID );
                }
                messageCollides[ this.GUID ] = true;
            }
        } else {
            messageCollides[ this.GUID ] = false;
        }

        if( messageShowing ) {
            var isShowing = false;
            $.each( messageCollides, function( key, showing ) {
                if( showing ) {
                    isShowing = true;
                }
            });
            if( !isShowing ) {
                hideMessageLayer();
            }
        }
    }
});
