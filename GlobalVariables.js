const TILE = 64;
const PLAYER_VELOCITY_X = 160;
const PLAYER_VELOCITY_Y = -250;

let player;
let bombBar;
let bombs;
let bombVelocity = 0;
let bombMaxVelocity = 300;

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