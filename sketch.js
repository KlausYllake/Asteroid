var space, spaceSprite
var isMoving = 1;
var player, playerImage, playerCrash;
var shoot, shootGroup, shootSound;
var meteor, meteorImage, meteorGroup;
var explosion, expSound;
var cooldown = false, score = 0;
var highscore = 0, gameState = 0;
var speed = 0, ammo = 10;

function preload()  {
  playerImage = loadAnimation("spaceship1.png", "spaceship2.png");
    
  meteorImage = loadImage("meteor.png");
  explosion = loadAnimation("explosion1.png","explosion2.png",
  "explosion3.png","explosion4.png","explosion5.png","explosion6.png");
  
  spaceImage = loadImage("space.png");
  
  
  playerCrash = loadSound("playerCrash.mp3");
  expSound = loadSound("explosionSound.mp3")
  shootSound = loadSound("shootSound.mp3");

}

function setup() {
  createCanvas(400, 300);
  
  space = createSprite(20,150,20,20);
  space.addImage(spaceImage);
  space.scale = 0.5;
  space.velocityX = -0.5;

  player = createSprite(20,150,20,20);
  player.shapeColor = "white";
  player.addAnimation("flying", playerImage);
  player.scale = 0.15;
  player.visible = false;
  
  meteorGroup = new Group();
  shootGroup = new Group();
}

function draw() {
  camera.position.x = player.x;

  space.velocityX = (-0.5 + speed/50)*isMoving;
  fill("yellow");
  drawSprites();
  
  if (ammo > 10) {
    ammo = 10;
  }
  
  text("Score: " + Math.round(score),player.x-190,20);
  text("Highscore: " + Math.round(highscore),player.x,20);
  
  if (space.x < player.x-150 || space.x > player.x+150) {
      space.x = player.x-10;
  }

  if (player.y > 275) {
    player.y = 275;
  }
  else if (player.y < 25) {
    player.y = 25;
  }

  if (gameState == 0) {
    textSize(30);
    text("Press space to play!",player.x-140,150);
    
    if (keyDown("space") || keyWentDown("enter") || mouseWentDown()) {
      player.visible = true;
      gameState = 1;
    }
  }
  else if (gameState == 1) {
    score = score + frameRate()/1000;
    text("Ammo: " +ammo+ "/10",player.x-190,290)
    
    if (ammo < 10) {
        if (cooldown == false) {
        cooldown = true;
        setTimeout(function() {
          ammo =  ammo + 1;
          cooldown = false;
        },2400);
      }
    }
    
    moves("w","up",2,-5);
    moves("a","left",1,-5);
    moves("s","down",2,+5);
    moves("d","right",1,+5);
    
    if (keyWentDown("space") || keyWentDown("enter") || mouseWentDown()) {
      shooting();
    }
    shootGroup.collide(meteorGroup, meteorShoot);
    
    if (frameCount % 60 == 0) {
      meteors()
    }
    
    speed = speed + (score*(-1)/10000);
    
    if (player.isTouching(meteorGroup)) {
      if (highscore < score) {
        highscore = score;
      }
      playerCrash.play();
      gameState = -1;
    }
  }
  else {
    textSize(30);
    text("Game Over!",player.x-80,150);
    textSize(15);
    text("Press space to try again",player.x-80,180);
    
    meteorGroup.setVelocityXEach(0);
    space.velocityX = 0;
    meteorGroup.setLifetimeEach(-1);

    if (keyDown("space") || keyWentDown("enter") || mouseWentDown()) {
      shootGroup.destroyEach();
      meteorGroup.destroyEach();
      space.velocityX = -0.5;
      
      player.x = 10;
      player.y = 150;
      ammo = 10;
      
      score = 0;
      speed = 0;
      gameState = 1;
    }
  }
}

function meteorShoot(shoot,meteor) {
  shoot.destroy();
  expSound.play();
  
  meteorGroup.remove(meteor);
  meteor.changeAnimation("exploding");
  setTimeout(function() {
      meteor.destroy();
  },750);
  score = score + 5;
  }

function moves(key,otherKey,rNumber,velocity) {
  if (keyDown(key) || keyDown(otherKey)) {
    switch (rNumber) {
      case 1: player.x = player.x + velocity;

      if (keyDown("a") || keyDown("left")) {
        isMoving = -1;
      }
      else {
        isMoving = 1;
      } 
      break;
      case 2: player.y = player.y + velocity; break;
    }
  }
}

function shooting() {
  if (ammo > 0) {
    shoot = createSprite(player.x+30,player.y,15,5);
    shoot.shapeColor = "red";
    shoot.velocityX = +30;
    shoot.lifetime = 15;
    
    shootSound.play();
    ammo = ammo - 1;
    
    shootGroup.add(shoot);
  }
}

function meteors() {
  meteor = createSprite(player.x+250,random(10,290),20,20);
  meteor.addImage(meteorImage);
  meteor.addAnimation("exploding",explosion);
  meteor.velocityX = random(-5,-7) + speed;
  meteor.lifetime = 100;
  
  var rNumber = Math.round(random(1,3));
  switch (rNumber) {
    case 1: meteor.scale = 0.1;
      meteor.setCollider("circle",-30,0,130); break;
    case 2: meteor.scale = 0.2;
      meteor.setCollider("circle",-30,10,150); break;
    case 3: meteor.scale = 0.3;
      meteor.setCollider("circle",-30,10,150); break;
  }
  player.depth = player.depth + 10;
  
  meteorGroup.add(meteor);
}