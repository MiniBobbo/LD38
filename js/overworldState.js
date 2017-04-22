var OverworldState = {
  //State variables here
  player:null,
  leftKey:null,
  rightKey:null,
  upKey:null,
  downKey:null,
  spaceKey:null,

  preload: function() {

  },
  create:function() {
    var tiles = game.add.group();
    //Create the tiles.
    for(i=0; i < GS.maxTiles; i++) {
      for(j = 0; j < GS.maxTiles; j++) {
        var t = GS.overworld[i][j]
        t.x = 100*i;
        t.y = 100*j;
        tiles.add(t);
      }
    }
    //Add the player.
    this.player = game.add.sprite(0, 0, "atlas");
    this.player.animations.add('stand',['player_stand']);
    this.player.animations.play('stand');

    //Put the player in the default Location
    this.player.x = GS.playerLoc.x * 100 + 18;
    this.player.y = GS.playerLoc.y * 100 + 18;

    //Add the keys and the listeners to do stuff.
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.leftKey.name = 'left';
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.rightKey.name = 'right';
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.upKey.name = 'up';
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.downKey.name = 'down';
  	this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(this.enterZone);
    this.leftKey.onDown.add(this.movePlayer);
    this.rightKey.onDown.add(this.movePlayer);
    this.upKey.onDown.add(this.movePlayer);
    this.downKey.onDown.add(this.movePlayer);


  },
  update:function() {
  },
  movePlayerSprite:function() {
    // debugger;
    game.add.tween(this.player).to({x:  GS.playerLoc.x * 100 + 18, y: GS.playerLoc.y * 100 + 18}, 1, Phaser.Easing.Bounce.Out, true);
  },
  movePlayer:function(dir) {
    switch (dir.name) {
      case 'left':
      if(GS.playerLoc.x > 0) {
        GS.playerLoc.x -=1;
      }
        break;
        case 'right':
        if(GS.playerLoc.x < GS.maxTiles-1) {
          GS.playerLoc.x +=1;
        }
          break;
          case 'up':
          if(GS.playerLoc.y > 0) {
            GS.playerLoc.y -=1;
          }
            break;
            case 'down':
            if(GS.playerLoc.y < GS.maxTiles-1) {
              GS.playerLoc.y +=1;
            }
              break;
      default:
    }
    OverworldState.movePlayerSprite();
  },
  enterZone:function() {
    // debugger;
    //Set the current zone, then change the state to the PlayState which has the specific zines that we need to explore.
    GS.currentZone = GS.overworld[GS.playerLoc.x][GS.playerLoc.y];
    game.state.start('PlayState');

  }
};
