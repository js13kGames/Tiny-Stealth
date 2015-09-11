import {BasicObject} from '../engine/BasicObject';
import {Core} from '../engine/core';
import {angle} from '../engine/angle';
import {distance} from '../engine/distance';
import {Bullet} from './bullet';

const SAT = require('../engine/sat/SAT.js');

export class Enemy extends BasicObject{
  constructor(options){

    super(options);

    this.bullet = new Bullet({
      x: 0,
      y: 0,
      width: 8,
      height: 8,
      ownerReference: this
    });

    this.goingUpOrDown = 'down';

  }

  checkBulletCollisionAgainstPlayer(){

    this.bullet.shape.pos.x = this.bullet.nextPosition.x;
    this.bullet.shape.pos.y = this.bullet.nextPosition.y;

    Core.player.shape.pos.x = Core.player.nextPosition.x;
    Core.player.shape.pos.y = Core.player.nextPosition.y;

    let collide = SAT.testPolygonPolygon(this.bullet.shape, Core.player.shape, Enemy.bulletCollisionResponse);

    Enemy.bulletCollisionResponse.clear();

    return collide;

  }

  draw(){

    if(this.visible == false) return;

    this.bullet.draw();

    Core.ctx.fillStyle = '#f52dee';

    if(distance(this.x + (this.width / 2), this.y + (this.height / 2), Core.player.x + (Core.player.width / 2), Core.player.y + (Core.player.height / 2)) < 64 && this.bullet.alive == false){
      Core.ctx.fillStyle = '#2f3e3f';
    }

    Core.ctx.fillRect(this.x - Core.camera.x, this.y - Core.camera.y, this.width, this.height);

  }

  update(){

  if(this.active == false) return;

    this.bullet.update();

    if(distance(this.x + (this.width / 2), this.y + (this.height / 2), Core.player.x + (Core.player.width / 2), Core.player.y + (Core.player.height / 2)) < 64 && this.bullet.alive == false){

      this.bullet.angle = angle(this.x + (this.width / 2), this.y + (this.height / 2), Core.player.x + (Core.player.width / 2), Core.player.y + (Core.player.height / 2));
      this.bullet.nextPosition.x = this.x + (4);
      this.bullet.nextPosition.y = this.y + (4);

      this.bullet.setAlive();

    }

    if(this.checkBulletCollisionAgainstPlayer()){
      Core.resetGame();
      this.bullet.setDead();
    }

  }
}

Enemy.bulletCollisionResponse = new SAT.Response();