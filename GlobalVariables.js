const TILE = 64;
const PLAYER_VELOCITY_X = 160;
const PLAYER_VELOCITY_Y = -250;
const BOMB_MAX_VELOCITY = 300;

let player;
let bombBar;
let bombs;

let cursors;
let keyUp;
let keySpace;

let map;
let tileset;
let layer;
let platforms;

let follower;
let path;

let camera;

let capitansGroup;