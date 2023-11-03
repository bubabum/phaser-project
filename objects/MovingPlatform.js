class MovingPlatform extends Phaser.Physics.Arcade.Sprite {

   constructor({ scene, x, y, textureKey, type }) {
      super(scene, x, y, textureKey);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.scene = scene;
      this.type = type;
      this.body.checkCollision.down = false;
      this.body.checkCollision.left = false;
      this.body.checkCollision.right = false;
      // this.setPosition(this.getTileCenterX(x));
      // this.setDepth(25);
   }

   update() {
      if (this.canMoveForward()) this.toogleDirection();
   }

   toogleDirection() {
      this.body.velocity.x *= -1;
      this.body.velocity.y *= -1;
   }

   canMoveForward() {
      const marginX = 5;
      // if (this.body.velocity.y > 0) direction = 'DOWN';
      const isNextGroundTileCollidable = (layer, npc) => {
         const { x, y, width, height } = npc.body;
         //const posX = x + (isLeftOrientated ? -marginX : width + marginX);
         const tile = layer.getTileAtWorldXY(x, y + 64 + 5 + 0.5); // change 64 to tilest size
         return tile?.collideUp
      }
      // const isNextTileCollidable = (layer, npc) => {
      //    const { x, y, width, height } = npc.body;
      //    const posX = x + (isLeftOrientated ? -marginX : width + marginX);
      //    const tile = layer.getTileAtWorldXY(posX, y + height - 0.5);
      //    if (isLeftOrientated) return tile?.collideRight;
      //    return tile?.collideLeft
      // }
      const nextPlatformTile = isNextGroundTileCollidable(this.scene.platformsLayer, this)
      const nextGroundTile = isNextGroundTileCollidable(this.scene.groundLayer, this)
      if (!nextGroundTile && !nextPlatformTile) return false
      return true
   }

   // getTileCenterX(x) {
   //    const { tileWidth } = this.scene.tileset;
   //    return Math.floor(x / tileWidth) * tileWidth + tileWidth / 2;
   // }


}