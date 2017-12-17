function Rider () {
    this.width = 125;
    this.height = 122;
    this.speed  = 8;
    this.x = 0;
    this.y = 0;
    
    this.directionX = 0;
    this.directionY = 0;

    
    this.gravity = 1;
    this.jumpDirectionY  = -10;
    this.isFalling = false;
    this.isJumping = false;

    
    this.sheet = new SpriteSheet('img/horserider1.png', this.width, this.height);

    this.walkAnim  = new Animation(this.sheet, 8, 1, 10);
    this.jumpAnim  = new Animation(this.sheet, 6, 5, 10);
    this.fallAnim  = new Animation(this.sheet, 4, 13, 15);


    this.anim      = this.walkAnim;

    
    this.advance = function() {
    this.x += this.directionX;
    this.y += this.directionY;
    };

    let jumpCounter = 0;

   
    this.update = function() {

      if (keyHeld_Jump && this.directionY === 0 && !this.isJumping) {
        this.isJumping = true;
        this.directionY = this.jumpDirectionY;
        jumpCounter =10;
      }

      
      if (keyHeld_Jump && jumpCounter) {
        this.directionY = this.jumpDirectionY;
      }

      jumpCounter = Math.max(jumpCounter-1, 0);

      this.advance();

      
      if (this.isFalling || this.isJumping) {
        this.directionY += this.gravity;
      }

      
      if (this.directionY > 0) {
        this.anim = this.fallAnim;
      }

      else if (this.directionY < 0) {
        this.anim = this.jumpAnim;
      }
      else {
        this.anim = this.walkAnim;
      }

      this.anim.update();
    };


    this.minDist = function(vec) {
    let minDist = Infinity;
    let max     = Math.max( Math.abs(this.directionX), Math.abs(this.directionY),
                            Math.abs(vec.directionX ), Math.abs(vec.directionY ) );
    let slice   = 1 / max;

    let x, y, distSquared;


    let vec1 = {}, vec2 = {};
    vec1.x = this.x + this.width/2;
    vec1.y = this.y + this.height/2;
    vec2.x = vec.x + vec.width/2;
    vec2.y = vec.y + vec.height/2;
    for (let percent = 0; percent < 1; percent += slice) {
      x = (vec1.x + this.directionX * percent) - (vec2.x + vec.directionX * percent);
      y = (vec1.y + this.directionY * percent) - (vec2.y + vec.directionY * percent);
      distSquared = x * x + y * y;

      minDist = Math.min(minDist, distSquared);
    }

    return Math.sqrt(minDist);
  };


    this.draw = function() {
      this.anim.draw(this.x, this.y);
    };

    this.reset = function() {
      this.x = 64;
      this.y = 250;
    };
  }