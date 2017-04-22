var PlayState = {
  //State variables here.
  bg:null,
  things:null,
  air:null,
  energy:null,
  food:null,
  player:null,
  movementEnabled:true,
  portrait:null,
  dialogBoxes:null,
  dialogText:null,
  preload: function() {

  },
  create:function() {
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    var text = game.add.text(0,0, "Play in zone:" + GS.currentZone.type, style);
    this.bg = game.add.sprite(0, 0, "bgs");
    this.bg.animations.add('default', ['bg_2']);
    this.bg.animations.play('default');
    this.things = game.add.group();


    //Create the HUD
    this.createHud();

    debugger;
    //Special case where the module goes in the middle of the screen.
    if(GS.currentZone.type == 'module') {
      var module = game.make.sprite(300, 150, "atlas");
      module.frameName = 'module';
      module.name = 'module';
          game.physics.enable(module, Phaser.Physics.ARCADE);
      this.things.add(module);
    } else {

    }

    //Create the keys
    this.createKeys();

    //Add the player
    this.addPlayer();


  },
  update:function() {
    this.player.body.velocity.x = 0;
    if(this.movementEnabled && this.leftKey.isDown) {
      this.player.body.velocity.x = -GS.playerSpeed;

    } else if (this.movementEnabled && this.rightKey.isDown) {
      this.player.body.velocity.x = GS.playerSpeed;
    }
  },
  addPlayer:function() {
    this.player = game.add.sprite(370, 360, "atlas");
    this.player.animations.add('stand', ['player_stand']);
    this.player.animations.play('stand');
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.checkWorldBounds = true;
    this.player.events.onOutOfBounds.add(this.playerOut, this);

  },
  playerOut:function() {
    game.state.start('OverworldState');
  },
  createKeys:function() {
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
    this.spaceKey.onDown.add(this.interact);

},
  interact:function() {
    game.physics.arcade.overlap(PlayState.player, PlayState.things, PlayState.interactWith);
  },
  interactWith:function(player, thing) {
    //Here's where the actual work and game come into play.

    switch (thing.name) {
      case 'module':
      PlayState.playerTalk('I can refill my air, energy and food at the module.', 'default', true);


        break;
      default:
      PlayState.playerTalk('Not sure what this thing is.', 'default', true);

    }

  },
  playerTalk:function(message, emot, interrupt) {
    this.dialogText.text = message;
    switch (emot) {
      case 'test':

        break;
      default:
        this.portrait.frameName = 'portrait_default';
    }
    game.add.tween(this.dialogBoxes).to({alpha:1}, 1);
    this.dialogBoxes.alpha = 1;


  },
  createHud:function() {
    //Create dialog box stuff.
    this.dialogBoxes = game.add.group();
    this.portrait = game.make.sprite(0, 0, "atlas");
    var portraitFframe = game.add.sprite(0, 0, "atlas");
    portraitFframe.frameName = 'portrait_frame';
    this.dialogBoxes.add(portraitFframe);
    var dialog_frame = game.add.sprite(128, 0, "atlas");
    dialog_frame.frameName = 'dialog_frame';
    this.dialogBoxes.add(dialog_frame);
    this.dialogBoxes.y = 465;
    this.portrait.frameName = 'portrait_default';
    this.dialogBoxes.add(this.portrait);
    var small = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    this.dialogText = game.make.text(135, 5, "Wow, the moon or whatever is really something",small);
    this.dialogBoxes.add(this.dialogText);
    this.dialogBoxes.alpha = 0;


    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    //Add the indicators to the two left
    this.air = game.add.text(0, 0, "Air: " + GS.air, style);
    this.air = game.add.text(0, 40, "Energy: " + GS.energy, style);
    this.air = game.add.text(0, 80, "Food: " + GS.food, style);

  }

};
