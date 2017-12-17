    function SpriteSheet(path, frameWidth, frameHeight) {
      this.image = document.createElement("img");
      this.frameWidth = frameWidth;
      this.frameHeight = frameHeight;

      let self = this;
      this.image.onload = function() {
        self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
      };
      this.image.src = path;
    }

    function Animation(spritesheet, frameSpeed, startFrame, endFrame) {
      let animationSequence = [];  
      let currentFrame = 0;        
      let counter = 0;             
      
      for (let frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
        animationSequence.push(frameNumber);

      this.update = function() {
            if (counter === (frameSpeed - 1))
          currentFrame = (currentFrame + 1) % animationSequence.length;
       
        counter = (counter + 1) % frameSpeed;
      };

      this.draw = function(x, y) {
        
        let row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
        let col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);
        ctx.drawImage(spritesheet.image,
          col * spritesheet.frameWidth, row * spritesheet.frameHeight,
          spritesheet.frameWidth, spritesheet.frameHeight,
          x, y,
          spritesheet.frameWidth, spritesheet.frameHeight);
      };
    }