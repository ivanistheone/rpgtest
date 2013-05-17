/**
 * CACHANIA - HTML5 RPG Game
 *
 * init.js
 *
 * @author: Christian Nielebock (http://ravetracer.de; me@ravetracer.de)
 */

var soundtrack = {
    'CornFields' : [
        'lupo',
        'lupo_int',
        'lupo_cellar',
        'farm',
        'woods_01',
        'woods_02',
        'woods_03'
    ],

    'MeadowOfThePast'    : [
        'church',
        'church_int',
        'catacombs',
        'down_catacombs',
        'down_catacombs2'
    ],

    'lost_mine'  : [
        'lost_mine',
        'lost_mine_2',
        'lost_mine_dungeon_1',
        'lost_mine_dungeon_2',
        'devils_dungeon'
    ],

    'Village'   : [
        'town_market',
        'town',
        'in_taverna',
        'in_taverna_cellar',
        'in_taverna_rooms'
    ]
},

/**
 * sprite animations for a single animation sheet
 */
spriteAnimationSheetSmall = {
    'stand-down'    : [1],  'run-down'  : [0,1,2,1],
    'stand-left'    : [4],  'run-left'  : [3,4,5,4],
    'stand-right'   : [7],  'run-right' : [6,7,8,7],
    'stand-up'      : [10], 'run-up'    : [9,10,11,10]
},

/**
 * sprite animations for standing npcs
 */
spriteAnimationSheetStanding = {
    1   : { 'standing'      : [1],  'look-around'   : [13,1,25,1] },
    2   : { 'standing'      : [4],  'look-around'   : [16,4,28,4] },
    3   : { 'standing'      : [7],  'look-around'   : [19,7,31,7] },
    4   : { 'standing'      : [10], 'look-around'   : [22,10,34,10] },
    5   : { 'standing'      : [49], 'look-around'   : [61,49,73,49] },
    6   : { 'standing'      : [51], 'look-around'   : [64,51,76,51] },
    7   : { 'standing'      : [55], 'look-around'   : [67,55,79,55] },
    8   : { 'standing'      : [58], 'look-around'   : [70,58,82,58] }
},

/**
 * sprite animations for the big animation sheet with 8 different characters
 */
spriteAnimationSheetBig = {
    1   : {
        'stand-down'    : [1],  'run-down'      : [0,1,2,1],
        'stand-left'    : [13], 'run-left'      : [12,13,14,13],
        'stand-right'   : [25], 'run-right'     : [24,25,26,25],
        'stand-up'      : [37], 'run-up'        : [36,37,38,37]
    },

    2   : {
        'stand-down'    : [4],  'run-down'      : [3,4,5,4],
        'stand-left'    : [16], 'run-left'      : [15,16,17,16],
        'stand-right'   : [28], 'run-right'     : [27,28,29,28],
        'stand-up'      : [40], 'run-up'        : [39,40,41,40]
    },

    3   : {
        'stand-down'    : [7],  'run-down'      : [6,7,8,7],
        'stand-left'    : [19], 'run-left'      : [18,19,20,19],
        'stand-right'   : [31], 'run-right'     : [30,31,32,31],
        'stand-up'      : [43], 'run-up'        : [42,43,44,43]
    },

    4   : {
        'stand-down'    : [10], 'run-down'      : [9,10,11,10],
        'stand-left'    : [22], 'run-left'      : [21,22,23,22],
        'stand-right'   : [34], 'run-right'     : [33,34,35,34],
        'stand-up'      : [46], 'run-up'        : [45,46,47,46]
    },

    5   : {
        'stand-down'    : [49], 'run-down'      : [48,49,50,49],
        'stand-left'    : [61], 'run-left'      : [60,61,62,61],
        'stand-right'   : [73], 'run-right'     : [72,73,74,73],
        'stand-up'      : [85], 'run-up'        : [84,85,86,85]
    },

    6   : {
        'stand-down'    : [51], 'run-down'      : [51,52,53,52],
        'stand-left'    : [64], 'run-left'      : [63,64,65,64],
        'stand-right'   : [76], 'run-right'     : [75,76,77,76],
        'stand-up'      : [88], 'run-up'        : [87,88,89,88]
    },

    7   : {
        'stand-down'    : [55], 'run-down'      : [54,55,56,55],
        'stand-left'    : [67], 'run-left'      : [66,67,68,67],
        'stand-right'   : [79], 'run-right'     : [78,79,80,79],
        'stand-up'      : [91], 'run-up'        : [90,91,92,91]
    },

    8   : {
        'stand-down'    : [58], 'run-down'      : [57,58,59,58],
        'stand-left'    : [70], 'run-left'      : [69,70,71,70],
        'stand-right'   : [82], 'run-right'     : [81,82,83,82],
        'stand-up'      : [94], 'run-up'        : [93,94,95,94]
    }
},

openedChests = new Array(),
northCoord = 'N50 ',
eastCoord = 'E008 ',

coords = {
    n : [ 'X', 'X', 'X', 'X', 'X' ],
    e : [ 'X', 'X', 'X', 'X', 'X' ]
},
messages = {};

me.gamestat.add( 'currentMusic', '' );
me.gamestat.add( 'lastmap', 'woods_01' );
me.gamestat.add( 'gender', 'male' );
