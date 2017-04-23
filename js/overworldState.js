var OverworldState = {
  //State variables here
  player:null,
  leftKey:null,
  rightKey:null,
  upKey:null,
  downKey:null,
  spaceKey:null,
  startTime:null,
  goalText:null,

  preload: function() {

  },
  create:function() {
    //Gets the current time so we can ignore the initial keypresses.
    this.startTime = game.time.now;

    game.camera.flash(0x000000,500);

    var tiles = game.add.group();
    //Create the tiles.
    for(i=0; i < GS.maxTiles; i++) {
      for(j = 0; j < GS.maxTiles; j++) {
        var t = game.add.sprite(0, 0, "atlas");
        t.stats = GS.overworld[i][j];
        t.x = 100*i;
        t.y = 100*j;
        tiles.add(t);
        t.animations.add('empty',['ow_empty']);
        t.animations.add('module',['ow_module']);
        t.animations.add('unexplored',['ow_unexplored']);
        t.animations.add('solarspot',['ow_solarspot']);
        t.animations.add('solar',['ow_solar']);
        t.animations.add('sensorspot', ['ow_sensorspot']);
        t.animations.add('sensor', ['ow_sensor']);


        if(!t.stats.explored) {
          t.animations.play('unexplored');
        } else {
          switch (t.stats.type) {
            case 'solar':
            // debugger;
              if(t.stats.equip=='none') {
                t.animations.play('solarspot');
              } else {
                t.animations.play('solar');
              }

              break;
            case 'sensor':
            if(!t.stats.equip) {
              t.animations.play('sensorspot');
            } else {
              t.animations.play('sensor');
            }

              break;
            default:
            t.animations.play(t.stats.type);

          }
        }

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

    this.createHud();

  },
  update:function() {
  },
  movePlayerSprite:function() {
    // debugger;
    // game.add.tween(this.dialogBoxes).to( { alpha: 1 }, );
    game.add.tween(this.player).to({x: GS.playerLoc.x * 100 + 18, y: GS.playerLoc.y * 100 + 18}, 500, Phaser.Easing.Quadratic.InOut, true).onComplete.add(OverworldState.exploreZone);
    },
  exploreZone:function() {
    if(!GS.overworld[GS.playerLoc.x][GS.playerLoc.y].explored) {
      GS.overworld[GS.playerLoc.x][GS.playerLoc.y].explored = true;
      OverworldState.enterZone();
    }
  },
  movePlayer:function(dir) {
    if(game.time.now - OverworldState.startTime < 5) {
      return;
    }
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
    game.camera.fade(0x000000, 500);
    game.camera.onFadeComplete.add(function() {game.state.start('PlayState'); },this);


  },
  createHud:function() {
    var style = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle", wordWrap:true, wordWrapWidth:160 };
    this.goalText = game.add.text(620, 30, "", style);
    // this.goalText.maxWidth = 160;
    for(i=0;i < GS.goals.length; i++) {
      var thisGoal = GS.goals[i];
      if(thisGoal.show && !thisGoal.completed) {
        this.goalText.text += thisGoal.name + '\n';
      }
    }

  }
};
