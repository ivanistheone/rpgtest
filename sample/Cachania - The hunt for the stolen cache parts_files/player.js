/**
 * CACHANIA - HTML5 RPG Game
 *
 * player.js
 *
 * @author: Christian Nielebock (http://ravetracer.de; me@ravetracer.de)
 */

var PlayerEntity = me.ObjectEntity.extend({

    init: function( x, y, settings ) {
        switch( me.gamestat.getItemValue('gender') ) {
            case 'male' :
                settings.image = 'cacher_new';
                break;

            case 'female' :
                settings.image = 'cacherin_new';
                break;
        }

        settings.spriteheight = 36;
        settings.spritewidth = 24;

        this.parent( x, y, settings );
        this.setVelocity( 2.5, 2.5 );
        this.updateColRect( 0, 24, 20, 16 );
        this.gravity = 0;
        this.friction = 0.5;
        this.animationspeed = me.sys.fps / 20;
        this.collidable = true;

        me.game.viewport.follow( this.pos, me.game.viewport.AXIS.BOTH );

        this.direction = 'down';

        var playerObj = this;
        $.each( spriteAnimationSheetSmall, function( animationName, animationFrames ) {
            playerObj.addAnimation( animationName, animationFrames );
        });

        this.setCurrentAnimation('stand-down');
    },

    update: function() {
        if( me.input.isKeyPressed( 'left' ) ) {
            this.direction = 'left';
            this.vel.x = -this.accel.x * me.timer.tick;
        }
        if( me.input.isKeyPressed( 'right' ) ) {
            this.direction = 'right';
            this.vel.x = this.accel.x * me.timer.tick;
        }
        if( me.input.isKeyPressed( 'down' ) ) {
            this.direction = 'down';
            this.vel.y = this.accel.y * me.timer.tick;
        }
        if( me.input.isKeyPressed( 'up' ) ) {
            this.direction = 'up';
            this.vel.y = -this.accel.y * me.timer.tick;
        }

        if( me.input.isKeyPressed( 'scroll' ) && messageShowing ) {
            scrollMessage();
        }

        this.resetSpeed();
        if( this.vel.x == 0 && this.vel.y == 0 ) {
            this.setCurrentAnimation( 'stand-' + this.direction );
        } else {
            this.setCurrentAnimation( 'run-' + this.direction );
        }
        updated = this.updateMovement();
        var res = me.game.collide(this);

        if( this.vel.x != 0 || this.vel.y != 0 ) {
            this.parent(this);
            return true;
        }
        return false;
    },

    resetSpeed: function() {
        if( this.vel.x < 0 && !me.input.keyStatus('left') ) {
            this.vel.x += this.friction;
        }

        if( this.vel.x > 0 && !me.input.keyStatus('right') ) {
            this.vel.x -= this.friction;
        }

        if( this.vel.y < 0 && !me.input.keyStatus('up') ) {
            this.vel.y += this.friction;
        }

        if( this.vel.y > 0 && !me.input.keyStatus('down') ) {
            this.vel.y -= this.friction;
        }
    }
});