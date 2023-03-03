class Enemy extends Phaser.Physics.Arcade.Sprite {

   constructor(scene, x, y, textureKey) {
      super(scene, x, y, textureKey);
      scene.add.existing(this);
      scene.physics.add.existing(this);
   }

   setState(name) {
      if (this?.currentState?.name === name) return
      this.currentState = this.states.find(state => state.name === name);
      this.anims.play(name);
      this.currentState.enter();
   }

   preUpdate(time, delta) {
      super.preUpdate(time, delta);
      if (this?.body?.velocity?.x < 0) {
         this.flipX = true;
         this.setOffset(30, 5);
      }
      if (this?.body?.velocity?.x > 0) {
         this.flipX = false;
         this.setOffset(20, 5);
      }
   }

   walkingBehavior() {
      let npc = this;
      let layer = groundLayer;
      const isNextGroundTileCollidable = (layer, npc, isLeftOrientated) => {
         const { x, y, width, height } = npc.body;
         const posX = x + (isLeftOrientated ? -0.5 : width + 0.5);
         const tile = layer.getTileAtWorldXY(posX, y + height + 0.5);
         return tile?.collideUp
      }
      const isNextTileCollidable = (layer, npc, isLeftOrientated) => {
         const { x, y, width, height } = npc.body;
         const posX = x + (isLeftOrientated ? -0.5 : width + 0.5);
         const tile = layer.getTileAtWorldXY(posX, y + height - 0.5);
         //console.log(tile?.collideLeft)
         if (isLeftOrientated) return tile?.collideRight;
         return tile?.collideLeft;
      }
      const nextGroundTile = isNextGroundTileCollidable(layer, npc, npc.flipX)
      const nextTile = isNextTileCollidable(layer, npc, npc.flipX)
      if (!nextGroundTile || nextTile) return true
      return false
   }

}