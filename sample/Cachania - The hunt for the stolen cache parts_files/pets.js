/**
 * CACHANIA - HTML5 RPG Game
 *
 * pets.js
 *
 * @author: Christian Nielebock (http://ravetracer.de; me@ravetracer.de)
 */

var Pets = me.ObjectEntity.extend({
    init : function( x, y, settings ) {

        if( !settings.spritewidth && !settings.spriteheight ) {
            settings.spritewidth = 32;
            settings.spriteheight = 48;
        }
        settings.collidable = false;

        this.parent( x, y, settings );

        this.gravity = 0;
        this.friction = 0.5;
        this.accel.x = 1;
        this.accel.y = 1;

        this.minX = x;
        this.minY = y;
        this.maxX = x + settings.width - settings.spritewidth;
        this.maxY = y + settings.height - settings.spriteheight;

        this.destX = randomInt( this.minX, this.maxX );
        this.destY = randomInt( this.minY, this.maxY );

        this.direction = 'right';
        this.setDirection();
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
        this.setCurrentAnimation( 'run-' + this.direction );
        this.updateMovement();
        this.parent(this);
        if( moveObject( this ) ) {
            this.destX = randomInt( this.minX, this.maxX );
            this.destY = randomInt( this.minY, this.maxY );
            this.setDirection();

        }
        return true;
    }
});

var BrownDog = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_01';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[1] );
    }
});

var WhiteDog = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_01';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[2] );
    }
});

var Cat = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_01';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[3] );
        this.setCurrentAnimation( 'stand-' + this.direction );
    }
});

var Mouse = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_01';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[4] );
    }
});

var Goat = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_01';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[5] );
    }
});

var SheepOrdinary = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_01';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[6] );
    }
});

var SheepHorns = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_01';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[7] );
    }
});

var SheepBlackHead = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_01';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[8] );
    }
});

var PigeonWalking = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_02';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[1] );
    }
});

var PigeonFlying = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_02';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[2] );
    }
});

var Dove = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_02';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[3] );
    }
});

var Swan = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_02';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[4] );
    }
});

var Chicken = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_02';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[5] );
    }
});

var Eagle = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_02';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[6] );
    }
});

var Bat = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_02';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[7] );
    }
});

var Butterfly = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'pets_02';
        this.parent( x, y, settings );
        this.setAnimations( spriteAnimationSheetBig[8] );
    }
});

var CowSpots = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'cows';
        settings.spritewidth = 64;
        settings.spriteheight = 48;
        this.parent( x, y, settings );
        this.setAnimations({
            'stand-up'      : [28], 'run-up'    : [27,28,29,28],
            'stand-left'    : [10], 'run-left'  : [9,10,11,10],
            'stand-right'   : [19], 'run-right' : [18,19,20,19],
            'stand-down'    : [1],  'run-down'  : [0,1,2,1]
        });
    }
});

var CowWhite = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'cows';
        settings.spritewidth = 64;
        settings.spriteheight = 48;
        this.parent( x, y, settings );
        this.setAnimations({
            'stand-up'      : [31], 'run-up'    : [30,31,32,31],
            'stand-left'    : [13], 'run-left'  : [12,13,14,13],
            'stand-right'   : [22], 'run-right' : [21,22,23,22],
            'stand-down'    : [4],  'run-down'  : [3,4,5,4]
        });
    }
});

var CowBrown = Pets.extend({
    init : function( x, y, settings ) {
        settings.image = 'cows';
        settings.spritewidth = 64;
        settings.spriteheight = 48;
        this.parent( x, y, settings );
        this.setAnimations({
            'stand-up'      : [34], 'run-up'    : [33,34,35,34],
            'stand-left'    : [16], 'run-left'  : [15,16,17,16],
            'stand-right'   : [25], 'run-right' : [24,25,26,25],
            'stand-down'    : [7],  'run-down'  : [6,7,8,7]
        });
    }
});

function addPetsToPool()
{
    me.entityPool.add('BrownDog', BrownDog);
    me.entityPool.add('WhiteDog', WhiteDog);
    me.entityPool.add('Cat', Cat );
    me.entityPool.add('Mouse', Mouse );
    me.entityPool.add('Goat', Goat );
    me.entityPool.add('SheepOrdinary', SheepOrdinary );
    me.entityPool.add('SheepHorns', SheepHorns );
    me.entityPool.add('SheepBlackHead', SheepBlackHead );
    me.entityPool.add('PigeonWalking', PigeonWalking );
    me.entityPool.add('PigeonFlying', PigeonFlying );
    me.entityPool.add('Dove', Dove );
    me.entityPool.add('Swan', Swan );
    me.entityPool.add('Chicken', Chicken );
    me.entityPool.add('Eagle', Eagle );
    me.entityPool.add('Bat', Bat );
    me.entityPool.add('Butterfly', Butterfly );
    me.entityPool.add('CowSpots', CowSpots );
    me.entityPool.add('CowWhite', CowWhite );
    me.entityPool.add('CowBrown', CowBrown );
}