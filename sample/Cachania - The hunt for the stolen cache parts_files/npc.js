/**
 * CACHANIA - HTML5 RPG Game
 *
 * npc.js
 *
 * @author: Christian Nielebock (http://ravetracer.de; me@ravetracer.de)
 */

var Npc = me.ObjectEntity.extend({
    init : function( x, y, settings ) {

        if( !settings.spritewidth && !settings.spriteheight ) {
            settings.spritewidth = 24;
            settings.spriteheight = 36;
        }
        settings.collidable = true;

        this.moves = true;
        if( "moves" in settings ) {
            this.moves = settings.moves;
        }
        this.parent( x, y, settings );

        if( this.moves == false ) {
            this.animationspeed = me.sys.fps / 2;
        }

        this.gravity = 0;
        this.friction = 0.5;
        this.accel.x = 1;
        this.accel.y = 1;
        this.stop = false;

        this.minX = x;
        this.minY = y;
        this.maxX = x + settings.width - settings.spritewidth;
        this.maxY = y + settings.height - settings.spriteheight;

        this.destX = randomInt( this.minX, this.maxX );
        this.destY = randomInt( this.minY, this.maxY );

        if( !messages[ this.GUID ] ) {
            var dispText = settings.text,
                face = settings.icon;

            messages[ this.GUID ] = {
                'text' : dispText,
                'face' : face
            }
        }

        if( this.moves ) {
            this.direction = 'right';
            this.setDirection();
        }
    },

    setDirection : function() {
        this.distanceX = Math.abs( this.destX - this.pos.x );
        this.distanceY = Math.abs( this.destY - this.pos.y );

        if( this.distanceX > this.distanceY ) {
            this.direction = this.destX < this.pos.x ? 'left' : 'right' ;
        } else {
            this.direction = this.destY < this.pos.y ? 'up' : 'down';
        }
    },

    setAnimations : function( animationArray ) {
        var curObj = this;
        $.each( animationArray, function( animationName, indexes ) {
            curObj.addAnimation( animationName, indexes );
        });
    },

    update : function() {
        if( this.moves ) {
            this.setCurrentAnimation( 'run-' + this.direction );
        } else {
            this.setCurrentAnimation( 'look-around' );
        }

        this.updateMovement();
        this.parent(this);

        if( !this.stop && this.moves ) {
            if( moveObject( this ) ) {
                this.destX = randomInt( this.minX, this.maxX );
                this.destY = randomInt( this.minY, this.maxY );
                this.setDirection();
            }
        }

        /**
         * show message box
         *
         * @type {*}
         */
        var res = me.game.collide( this );
        if( res ) {
            if( res.obj.name == 'mainplayer' && !messageShowing ) {
                if( this.moves ) {
                    this.setCurrentAnimation( 'stand-' + this.direction );
                } else {
                    this.setCurrentAnimation( 'standing' );
                }
                this.stop = true;
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
                this.stop = false;
                hideMessageLayer();
            }
        }

        return true;
    }
});

/**
 * The "Labyrinth Man"
 *
 * @type {*}
 */
var LabyrinthMan = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'labyrinth_man';
        this.parent( x, y, settings );
        this.updateColRect( -10, 45, -10, 55 );
        this.setAnimations( spriteAnimationSheetSmall );
    }
});

var GrannyWithStick = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'granny_with_stick';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetSmall );
    }
});

var VegetableSaleswoman = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara03_f';
        settings.moves = false;
        this.parent( x, y, settings );
        this.updateColRect( -1, 0, 0, 80 );
        this.setAnimations( spriteAnimationSheetStanding[2] );
    }
});

var TailorWoman = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara01_b';
        settings.moves = false;
        this.parent( x, y, settings );
        this.updateColRect( -1, 0, 0, 80 );
        this.setAnimations( spriteAnimationSheetStanding[7] );
    }
});

var BakerWoman = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara04_b';
        settings.moves = false;
        this.parent( x, y, settings );
        this.updateColRect( -1, 0, 0, 80 );
        this.setAnimations( spriteAnimationSheetStanding[4] );
    }
});

var WeaponSmith = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara04_b';
        settings.moves = false;
        this.parent( x, y, settings );
        this.updateColRect( -1, 0, 0, 80 );
        this.setAnimations( spriteAnimationSheetStanding[6] );
    }
});

var FortuneTeller = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara06_a';
        settings.moves = false;
        this.parent( x, y, settings );
        this.updateColRect( -1, 0, 0, 80 );
        this.setAnimations( spriteAnimationSheetStanding[8] );
    }
});

var Child1 = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara03_b';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[7] );
    }
});

var Child2 = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara03_b';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[8] );
    }
});

var Child3 = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara03_a';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[7] );
    }
});

var Child4 = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara03_a';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[8] );
    }
});

var Child5 = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara03_c';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[7] );
    }
});

var Child6 = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara03_c';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[8] );
    }
});

var Child7 = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara03_e';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[7] );
    }
});

var Child8 = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara03_e';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[8] );
    }
});

var Landlord = Npc.extend({
    init : function( x, y, settings ) {
        settings.image = 'vx_chara03_c';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[3] );
    }
});

/**
 * add all NPCs to the entity pool
 */
function addNpcsToPool()
{
    me.entityPool.add( 'LabyrinthMan', LabyrinthMan );
    me.entityPool.add( 'GrannyWithStick', GrannyWithStick );

    me.entityPool.add( 'Landlord', Landlord );
    me.entityPool.add( 'VegetableSaleswoman', VegetableSaleswoman );
    me.entityPool.add( 'TailorWoman', TailorWoman );
    me.entityPool.add( 'BakerWoman', BakerWoman );
    me.entityPool.add( 'WeaponSmith', WeaponSmith );
    me.entityPool.add( 'FortuneTeller', FortuneTeller );

    me.entityPool.add( 'Child1', Child1 );
    me.entityPool.add( 'Child2', Child2 );
    me.entityPool.add( 'Child3', Child3 );
    me.entityPool.add( 'Child4', Child4 );
    me.entityPool.add( 'Child5', Child5 );
    me.entityPool.add( 'Child6', Child6 );
    me.entityPool.add( 'Child7', Child7 );
    me.entityPool.add( 'Child8', Child8 );
}
