
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  let playButton = document.querySelector('#start');
  let restartButton = document.querySelector('#restartScreen');
  let ground = [],  enemies = [], environment = [];
  let platformHeight, platformLength, gapLength, score, stop;
  let platformWidth = 32;
  let platformBase = canvas.height - platformWidth*5;  
  let platformSpacer = 64;
  let rider = new Rider ();
  
  let requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback, element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();


  let assetLoader = (function() {
      this.imgs        = {
      'bg'           : 'img/fortress1.jpg',
      'sky'          : 'img/sky1.png',
      'backdrop'    : 'img/background2.png',
      'grass'        : 'img/grass2.png',
      'firewater'    : 'img/firewater.png',
      'grass1'       : 'img/grass3.png',
      'grass2'       : 'img/ground2.png',
      'bridge'       : 'img/bridge.png',
      'stone'        : 'img/stone.png',
      'flower1'      : 'img/flower1.png',
      'flower2'      : 'img/flower2.png',
      'enemy'        : 'img/knight-enemy.png',
      'fire'         : 'img/fire.png'
    };

    let assetsLoaded = 0;                                
    let numImgs      = Object.keys(this.imgs).length;    
    this.totalAssest = numImgs;                          
 
    function assetLoaded(dic, name) {
      if (this[dic][name].status !== 'loading') {
        return;
      }

      this[dic][name].status = 'loaded';
      assetsLoaded++;

      if (assetsLoaded === this.totalAssest) {
        showPlayButton();
      }
    }
    
    this.downloadAll = function() {
      let self = this;
      let src;

      for (let img in this.imgs) {
        if (this.imgs.hasOwnProperty(img)) {
          src = this.imgs[img];

        (function(self, img) {
            self.imgs[img] = document.createElement("img");
            self.imgs[img].status = 'loading';
            self.imgs[img].name = img;
            self.imgs[img].onload = function() { assetLoaded.call(self, 'imgs', img) };
            self.imgs[img].src = src;
          })(self, img);
        }
      }
    }

    return {
      imgs: this.imgs,
      totalAssest: this.totalAssest,
      downloadAll: this.downloadAll
    };
  })();

  assetLoader.downloadAll();

    document.querySelector('#start').addEventListener('click', function() {
    hide(playButton);
    startGame();
  });

  function startGame() {
    hide(restartButton);
    variablesReset();
    startGroundDraw ();
    startFireWaterDraw();
    animate();
  }

  let background = (function() {
    let sky   = {};
    let backdrop = {};
    
    this.draw = function() {
      ctx.drawImage(assetLoader.imgs.bg, 0, 0);

      sky.x -= sky.speed;
      backdrop.x -= backdrop.speed;
      
      ctx.drawImage(assetLoader.imgs.sky, sky.x, sky.y);
      ctx.drawImage(assetLoader.imgs.sky, sky.x + canvas.width, sky.y);

      ctx.drawImage(assetLoader.imgs.backdrop, backdrop.x, canvas.height/2);
      ctx.drawImage(assetLoader.imgs.backdrop, backdrop.x + canvas.width, canvas.height/2);
      
      if (sky.x + assetLoader.imgs.sky.width <= 0)
        sky.x = 0;
      if (backdrop.x + assetLoader.imgs.backdrop.width <= 0)
        backdrop.x = 0;
    };

    
    this.reset = function()  {
      sky.x = 0;
      sky.y = 0;
      sky.speed = 0.2;

      backdrop.x = 0;
      backdrop.y = 0;
      backdrop.speed = 3.6;
    }

    return {
      draw: this.draw,
      reset: this.reset
    };
  })();

 
  function InstanceClass(x, y, type, directionX, directionY) {
    this.x = x || 0;
    this.y = y || 0;
    this.directionX = directionX || 0;
    this.directionY = directionY || 0;
    this.width  = platformWidth;
    this.height = platformWidth;
    this.type   = type;
     
    this.advance = function() {
    this.x += this.directionX;
    this.y += this.directionY;
    };
    this.update = function() {
      this.directionX = -rider.speed;
      this.advance();
    };

    this.draw = function() {
      ctx.save();
      ctx.translate(0.5,0.5);
      ctx.drawImage(assetLoader.imgs[this.type], this.x, this.y);
      ctx.restore();
    };
  }
  
  function getType() {
    let type;
    switch (platformHeight) {
      case 0:
      case 1:
        type = Math.random() > 0.5 ? 'grass1' : 'grass2';
        break;
      case 2:
        type = 'grass';
        break;
      case 3:
        type = 'bridge';
        break;
    }
    return type;
  }

 
  function updateGround() {
    
    //console.log(ground);
    rider.isFalling = true;
    for (let i = 0; i < ground.length; i++) {
      ground[i].update();
      ground[i].draw();

      
      let angle;
      if (rider.minDist(ground[i]) <= rider.height/2 + platformWidth/2 &&
          (angle = Math.atan2(rider.y - ground[i].y, rider.x - ground[i].x) * 180/Math.PI) > -130 &&
          angle < -50) {
        rider.isJumping = false;
        rider.isFalling = false;
        rider.y = ground[i].y - rider.height + 10;
        rider.directionY = 0;
      }
    }

    if (ground[0] && ground[0].x < -platformWidth*2) {
      ground.splice(0, 1);
    }
  }


  function updateFireWater() {
    for (let i = 0; i < firewater.length; i++) {
      firewater[i].update();
      firewater[i].draw();
    }

    if (firewater[0] && firewater[0].x < -platformWidth) {
      let w = firewater.splice(0, 1)[0];
      w.x = firewater[firewater.length-1].x + platformWidth;
      firewater.push(w);
    }
  }


  function updateEnvironment() {
       for (let i = 0; i < environment.length; i++) {
      environment[i].update();
      environment[i].draw();
    }

    if (environment[0] && environment[0].x < -platformWidth) {
      environment.splice(0, 1);
    }
  }


  function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].update();
      enemies[i].draw();

      if (rider.minDist(enemies[i]) <= rider.width/2 - platformWidth/2) {
        console.log(platformWidth);
        gameOver();
      }
    }

    if (enemies[0] && enemies[0].x < -platformWidth) {
      enemies.splice(0, 1);
    }
  }


  function updateHero() {
    rider.update();
    rider.draw();

    if (rider.y + rider.height >= canvas.height) {
      gameOver();
    }
  }


  function spawnInstanceClasses() {
    score++;
    if (gapLength > 0) {
      gapLength-=1;
    }
    
    else if (platformLength > 0) {
      let type = getType();

      ground.push(new InstanceClass(
        canvas.width + platformWidth % rider.speed,
        platformBase - platformHeight * platformSpacer,
        type
      ));
      platformLength--;

      spawnEnvironmentInstanceClasses();

      spawnEnemyInstanceClasses();
    }
    else {
      gapLength = rand(rider.speed - 2, rider.speed);
      platformHeight = bound(rand(0, platformHeight + rand(0, 2)), 0, 3);
      platformLength = rand(Math.floor(rider.speed/2), rider.speed * 4);
    }
  }


  function spawnEnvironmentInstanceClasses() {
    if (score > 4 && rand(0, 20) === 0 && platformHeight < 3) {
      if (Math.random() > 0.5) {
        environment.push(new InstanceClass(
          canvas.width + platformWidth % rider.speed,
          platformBase - platformHeight * platformSpacer - platformWidth,
          'stone'
        ));
      }
      else if (platformLength > 2) {
        environment.push(new InstanceClass(
          canvas.width + platformWidth % rider.speed,
          platformBase - platformHeight * platformSpacer - platformWidth,
          'flower1'
        ));
        environment.push(new InstanceClass(
          canvas.width + platformWidth % rider.speed + platformWidth,
          platformBase - platformHeight * platformSpacer - platformWidth,
          'flower2'
        ));
      }
    }
  }


  function spawnEnemyInstanceClasses() {
    if (score > 5 && Math.random() > 0.96 && enemies.length < 3 && platformLength > 5 &&
        (enemies.length ? canvas.width - enemies[enemies.length-1].x >= platformWidth * 6 ||
         canvas.width - enemies[enemies.length-1].x < platformWidth : true)) {
      enemies.push(new InstanceClass(
        canvas.width + platformWidth % rider.speed,
        platformBase - platformHeight * platformSpacer - platformWidth*2,
        Math.random() > 0.5 ? 'enemy' : 'fire'
      ));
    }
  }

  function frameCounter(){
       
      if (frameCount % Math.floor(platformWidth / rider.speed) === 0) {
        spawnInstanceClasses();
      }

      if (frameCount > (Math.floor(platformWidth / rider.speed) * rider.speed * 20) && rider.dy !== 0) {
        rider.speed = bound(++rider.speed, 0, 15);
        rider.walkAnim.frameSpeed = Math.floor(platformWidth / rider.speed) - 1;

        frameCount = 0;

        if (gapLength === 0) {
          let type = getType();
          ground.push(new InstanceClass(
            canvas.width + platformWidth % rider.speed,
            platformBase - platformHeight * platformSpacer/2,
            type
          ));
          platformLength--;
        }
      }
      frameCount++; 
  }

  function animate() {
    if (!stop) {
      setupInput(); 
      requestAnimFrame( animate );
      background.draw();
      updateFireWater();
      updateEnvironment();
      updateHero();
      updateGround();
      updateEnemies();
      showScore();
      frameCounter();
    }
  }

  function showScore(){
      ctx.font="1em  CloisterBlack";
      ctx.fillText(`Score: ${score}m`, canvas.width/2, 30);
  }

  function variablesReset(){
        environment = [];
        enemies = [];
        ground = [];
        firewater = [];
        frameCount = 0;
        stop = false;
        score = 0;
        platformHeight = 2;
        platformLength = 15;
        gapLength = 0;

        rider.reset();
        background.reset();
  }

function startGroundDraw (){
    for (let i = 0; i < 30; i++) {
      ground.push(new InstanceClass(i * (platformWidth+30), platformBase - platformHeight * platformSpacer, 'grass'));
    }
}

function startFireWaterDraw(){
      for (let i = 0; i < canvas.width / 32 + 2; i++) {
      firewater.push(new InstanceClass(i * platformWidth, canvas.height-32, 'firewater'));
    }
}



  function rand(low, high) {
    return Math.floor( Math.random() * (high - low + 1) + low );
  }

  function bound(num, low, high) {
    return Math.max( Math.min(num, high), low);
  }

  function hide(el) {
    el.classList.add("hide");
  }

  function show(el) {
    el.classList.remove("hide");
  } 

  function showPlayButton() {
    show(playButton);
  }


    function gameOver() {
    stop = true;
    show(restartButton);
    document.querySelector('#restart').addEventListener('click', startGame);
  }