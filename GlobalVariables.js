const TILE = 64;

let player;

let cursors;
let map;
let tileset;
let layer;
let platforms;

let follower;
let path;

let camera;

let bombs;
let bombVelocity = 0;
let bombMaxVelocity = 300;
let bombBar;

let capitansGroup;

let lastFired = 0;