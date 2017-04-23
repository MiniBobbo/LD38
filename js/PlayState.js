var PlayState = {
  //State variables here.
  bg:null,
  things:null,
  pickups:null,
  air:null,
  energy:null,
  food:null,
  player:null,
  movementEnabled:true,
  portrait:null,
  dialogBoxes:null,
  dialogText:null,
  dialogTimer:null,
  debug:true,
  //This is an interacting flag.
  int:false,
  preload: function() {

  },
  create:function() {
    game.renderer.renderSession.roundPixels = true;
    game.camera.flash(0x000000,500);
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    var text = game.add.text(0,0, "Play in zone:" + GS.currentZone.type, style);
    this.bg = game.add.sprite(0, 0, "bgs");
    this.bg.animations.add('default', ['bg_2']);
    this.bg.animations.play('default');
    this.things = game.add.group();
    this.pickups = game.add.group();


    //Create the HUD
    this.createHud();

  // debugger;

    //Create the keys
    this.createKeys();
    this.createType();
    this.createPickups();
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
    if(this.debug) {
      game.debug.body(this.player);
      for(i = 0; i < this.pickups.children.length; i++) {
        game.debug.body(this.pickups.children[i]);
      }
    }

  },
  addPlayer:function() {
    this.player = game.add.sprite(100, 360, "atlas");
    this.player.animations.add('stand', ['player_stand']);
    this.player.animations.play('stand');
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.checkWorldBounds = true;
    this.player.events.onOutOfBounds.add(this.playerOut, this);

  },
  playerOut:function() {
    game.camera.fade(0x000000, 500);
    game.camera.onFadeComplete.add(function() {game.state.start('OverworldState'); },this);

    // game.state.start('OverworldState');
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
    // debugger;
    PlayState.int = false;
    game.physics.arcade.overlap(PlayState.player, PlayState.pickups, PlayState.interactPickup);
    if(!PlayState.int) {
      game.physics.arcade.overlap(PlayState.player, PlayState.things, PlayState.interactWith);
    }
    if(!PlayState.int && GS.heldItem != null) {
      // debugger;
      PlayState.dropHeldItem();
    }
  },
  interactWith:function(player, thing) {
    //Here's where the actual work and game come into play.
    PlayState.int = true;
    switch (thing.name) {
      case 'module':
      PlayState.playerTalk('I can refill my air, energy and food at the module.', 'default', true);


        break;
        case 'solar':
        // debugger;
        if(GS.currentZone.equip != 'none') {
          PlayState.playerTalk('The solar panel I set up here should be providing power to the landing module.', 'default', true);

        }
        else if(GS.heldItem == null || GS.heldItem.name != 'power array') {
          PlayState.playerTalk('This looks like a good spot for solar.', 'default', true);

        } else {
          // debugger;
          GS.currentZone.equip = 'solar';
          GS.heldItem = null;
          game.state.start('PlayState');
        }


          break;
      default:
      PlayState.playerTalk('Not sure what this thing is.', 'default', true);

    }

  },
  interactPickup:function(player, pickup) {
    if(PlayState.int) {
      return;
    }
    PlayState.int = true;
    // debugger;
    if(GS.heldItem != null) {
      PlayState.playerTalk('I\'m already carrying something.  I\'ll have to put it down first.', 'default', false);
      return;
    } else {

      PlayState.playerTalk('Who knows when I will need this ' + pickup.stats.name, 'default', false);
      PlayState.pickupItem(pickup);
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
    this.dialogBoxes.alpha = 0;
    // game.add.tween(this.dialogBoxes).to({alpha:1}, 1);
    game.add.tween(this.dialogBoxes).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    // this.dialogBoxes.alpha = 1;

    //If there is a dialog timer stop it because we are about to start another one.
    if(this.dialogTimer!= null) {

      this.dialogTimer.timer.stop();
      this.dialogTimer.timer.start();

    } else {
      this.dialogTimer = game.time.events.add(4000, function() {game.add.tween(this.dialogBoxes).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);}, this);

    }



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

  },
  createPickups:function() {
    // debugger;
    for(i = 0; i < GS.currentZone.pickups.length; i++) {
      var curPickup =  GS.currentZone.pickups[i];
      var pu = game.make.sprite(curPickup.zoneLoc.x, curPickup.zoneLoc.y, "atlas");
      pu.anchor.set(.5,.5);

      pu.stats = curPickup;
      pu.frameName = 'player_' + curPickup.name;
      game.physics.enable(pu, Phaser.Physics.ARCADE);
      this.pickups.add(pu);
    }
  },
  dropHeldItem:function() {
    // debugger;
    var pu = game.make.sprite(this.player.x,0, "atlas");
    pu.stats = GS.heldItem;
    pu.stats.zoneLoc.x= this.player.x;
    pu.y = pu.stats.zoneLoc.y;


    pu.stats.overLoc.x = GS.currentZone.Xloc;
    pu.stats.overLoc.y = GS.currentZone.Yloc;
    GS.currentZone.pickups.push(pu.stats);

    GS.heldItem = null;
    pu.frameName = 'player_' + pu.stats.name;
    game.physics.enable(pu, Phaser.Physics.ARCADE);
    this.pickups.add(pu);

  },
  pickupItem:function(pickup) {
    this.int = true;
    GS.heldItem = pickup.stats;
    //Remove the current item from this zone.

    var index = GS.currentZone.pickups.indexOf(GS.heldItem);
    if (index > -1) {
    GS.currentZone.pickups.splice(index, 1);
    }

    pickup.destroy();

  },
  createType:function() {
    switch (GS.currentZone.type) {
      case 'module':
      var module = game.make.sprite(300, 150, "atlas");
      module.frameName = 'module';
      module.name = 'module';
          game.physics.enable(module, Phaser.Physics.ARCADE);
      this.things.add(module);

        break;
        case 'solar':
        //If we haven't built a solar panel here yet, show the spot.
        if(GS.currentZone.equip == 'none') {
          var solarspot = game.make.sprite(300, 150, "atlas");
          solarspot.frameName = 'panelspot';
          solarspot.name = 'solar';
              game.physics.enable(solarspot, Phaser.Physics.ARCADE);
          this.things.add(solarspot);
        } else {
          var solarspot = game.make.sprite(300, 150, "atlas");
          solarspot.frameName = 'solarset';
          solarspot.name = 'solar';
              game.physics.enable(solarspot, Phaser.Physics.ARCADE);
          this.things.add(solarspot);
        }

          break;
      default:

    }

  }

};
