var PlayState = {
  //State variables here.
  dead:false,
  runOnce:true,
  elapsed:0,
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
  debug:false,
  speakQueue:[],
  speakCurrent:false,
  speakFinishTime:null,
  speakTransition:false,
  debugKey:null,
  //This is an interacting flag.
  int:false,
  lastTime:null,
  timer:null,
  preload: function() {

  },
  create:function() {
    game.renderer.renderSession.roundPixels = true;
    game.camera.flash(0x000000,500);
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    var text = game.add.text(0,0, "Play in zone:" + GS.currentZone.type, style);
    this.bg = game.add.sprite(0, 0, "bgs");
    // this.bg.animations.add('default', ['bg_empty']);
    // this.bg.animations.play('default');
    this.bg.frameName = GS.currentZone.frameName;
    this.things = game.add.group();
    this.pickups = game.add.group();

    //Allow us to debug with the P key if debug is true
    if(this.debug) {
        this.debugKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
    }

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
    if (this.debug && this.debugKey.isDown)
    {
        debugger;
        // this.player.animations.play('dead');
    }
    if(this.dead) {
      return;
    }

    if(GS.currentZone.type == 'signal' && GS.currentZone.equip) {
      this.timer.start();
    }

    var dt = game.time.now - this.lastTime;
    this.lastTime = game.time.now;

    //We lose air at 1 every second.
    if(dt < 1000 && this.movementEnabled){
      this.elapsed += dt;
    }
    if(this.elapsed > 1000) {
      GS.air--;
      this.elapsed -= 1000;
      if(GS.air == 50) {
        this.playerTalk('Running low on air...', 'default', true);
      } else if (GS.air <= 0) {
        this.playerDies();
      }
    }

    this.air.text = 'Air: ' + Math.floor(GS.air);

    if(this.speakCurrent) {
      if(game.time.now > this.speakFinishTime && !this.speakTransition) {
        this.speakTransition = true;
        game.add.tween(this.dialogBoxes).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true).onComplete.add(function() {
          PlayState.speakTransition = false;
          PlayState.speakCurrent = false;
          PlayState.speakQueue.shift();
          PlayState.movementEnabled = true;

        });
      }
    }
    else if(this.speakQueue.length > 0) {
      this.displayDialog(this.speakQueue[0]);
    }

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
    this.player.animations.add('dead', Phaser.Animation.generateFrameNames('player_dead', 1, 3), 3, false);
    this.player.animations.play('stand');
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.checkWorldBounds = true;
    this.player.events.onOutOfBounds.add(this.playerOut, this);

  },
  playerOut:function() {
    this.speakQueue.length = 0;
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
    if(PlayState.movementEnabled == false) {
      return;
    }

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
      if(!GS.modulePowered) {
        if(this.runOnce) {
          PlayState.playerTalk('I used up the last of the landing module\'s power to avoid crashing.', 'default', false);
          PlayState.playerTalk('Let\'s try the radio.', 'default', false);
          PlayState.playerTalk('*HISS*', 'static', false);
          PlayState.playerTalk('I need to find where the solar panels went and get them set up so I can get the batteries charged.', 'default', false);
          this.runOnce = false;
        }
        PlayState.playerTalk('The air scrubbers aren\'t very effective without the solar panels set up.', 'default', false);

      }
      else if(GS.modulePowered && !GS.sensorsPowered) {
        PlayState.playerTalk('Now that I\'ve restored power to the landing module I can refill my air tanks here.', 'default', true);
        PlayState.playerTalk('I don\'t have enough power to turn on the communications array yet.  I need a second solar array.', 'default', true);
      } else if(GS.sensorsPowered && !GS.signalDiscovered) {
        PlayState.playerTalk('Ok, the communication array should be running now.', 'default',false );
        PlayState.playerTalk('*HISS* *POP* *CRACKLE*.', 'static', false);
        PlayState.playerTalk('The equipment is working, what could be wrong?', 'default',false );
        PlayState.playerTalk('I\'m getting the same interference that caused me to crash!  I wonder if I can locate it?', 'default',false );
        PlayState.playerTalk('If I can set up the two other redundant sensor arrays I should be able to trianglulate the signal location.', 'default',false );
        PlayState.playerTalk('I\'ve got to find them and a couple spots to put them.', 'default',false );
        GS.signalDiscovered = true;
      } else if (!GS.sensor1placed && GS.signalDiscovered) {
        PlayState.playerTalk('I need to find and place two sensors to triangulate the location of the interference.', 'default',false );
      } else if (!GS.sensor2placed && GS.sensor1placed) {
        PlayState.playerTalk('I placed one of the sensors.  Time to place the second.', 'default',true );
      }  else if (GS.sensor2placed && !GS.signalTriangulated) {
        PlayState.playerTalk('Ok, let me try to find where the interference is coming from...', 'default',false );
        PlayState.playerTalk('*HISS* *POP* *CRACKLE*.', 'static', false);
        PlayState.playerTalk('Excellent.  I placed the location on my map.', 'default',false );
        GS.signalTriangulated = true;
        GS.overworld[1][2].equip = true;
      }  else if (GS.signalTriangulated) {
        PlayState.playerTalk('Better prepare for the trek to the source of the interference.', 'default',false );

      }
      GS.changeAirLevel(GS.maxAir);

        break;
        case 'solar':
        // debugger;
        if(GS.currentZone.equip != false) {
          if(GS.modulePowered && !GS.sensorsPowered) {
            PlayState.playerTalk('The solar panel I set up here should be providing power to the landing module.', 'default', true);
          } else {
            PlayState.playerTalk('Now that I have two solar panels set up there should be enough energy to run the communication array.', 'default', false);
          }

        }
        else if(GS.heldItem == null || GS.heldItem.name != 'power array') {
          PlayState.playerTalk('This looks like a good spot for solar.', 'default', true);

        } else {
          debugger;
          GS.currentZone.equip = true;
          GS.heldItem = null;
          if(!GS.modulePowered) {
            GS.modulePowered = true;
            GS.maxAir = 200;
          } else {
            GS.sensorsPowered = true;
          }
          game.state.start('PlayState');
        }
          break;
        case 'sensor':
        if(!GS.signalDiscovered) {
          PlayState.playerTalk('Just a large flat rock.', 'default', true);
        }
        else if(GS.currentZone.equip) {
          if(!GS.sensor2placed) {
            PlayState.playerTalk('One sensor down, one to go.', 'default', true);
          } else {
            PlayState.playerTalk('I should be able to triangulate the source of the interference from the landing module.', 'default', true);
          }

        } else if(!GS.currentZone.equip  && GS.checkItem('sensor')) {
          GS.currentZone.equip = true;
          GS.heldItem = null;
          if(!GS.sensor1placed) {
            GS.sensor1placed = true;
          } else {
            GS.sensor2placed = true;
          }
          game.state.start('PlayState');
        } else if(GS.signalDiscovered && !GS.checkItem('sensor')) {
          PlayState.playerTalk('This would be a great place to put a sensor package if I can find one.', 'default', true);

        }

          break;
      case 'ship':
        if(GS.currentZone.equip) {
          game.state.start('VictoryState');
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
      PlayState.playerTalk('I\'m already carrying something.  I\'ll have to put it down first if I want to pick this up.', 'default', false);
      return;
    } else {
      // debugger;
      switch (pickup.stats.name) {
        case 'power array':
          PlayState.playerTalk('This is one of the power arrays that fell from the landing module.', 'default', true);
          PlayState.playerTalk('I will have to find a good place to set it.', 'default', true);
          break;
        case 'sensor':
        PlayState.playerTalk('This is a redundant sensor array that can send or receive signals.', 'default', true);
        if(!GS.signalDiscovered) {
          PlayState.playerTalk('I don\'t really need this one.  I have a much more powerful sensor array on the landing module.', 'default', true);
          PlayState.playerTalk('I guess it can\'t hurt to take it with me.', 'default', true);

        } else {
          PlayState.playerTalk('I will need this to triangulate the source of the interference.', 'default', true);
          PlayState.playerTalk('It will need to go somewhere clear and elevated.', 'default', true);


        }

          break;
        default:

      }
      PlayState.pickupItem(pickup);
    }
  },
  playerTalk:function(message, emot, interrupt) {
    this.speakQueue.push({message:message, emot:emot, interrupt:interrupt});

  },
  displayDialog:function(speak) {
    this.dialogText.text = speak.message;
    this.portrait.animations.play(speak.emot);
    // switch (speak.emot) {
    //   case 'test':
    //
    //     break;
    //   default:
    //     this.portrait.frameName = 'portrait_default';
    // }
    this.dialogBoxes.alpha = 0;
    // game.add.tween(this.dialogBoxes).to({alpha:1}, 1);
    game.add.tween(this.dialogBoxes).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    this.speakCurrent = true;
    this.speakFinishTime = game.time.now + 3000;
    this.movementEnabled = speak.interrupt;
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
    this.portrait.animations.add('static', Phaser.Animation.generateFrameNames('portrait_static', 1, 4), 30, true);
    this.portrait.animations.add('default', ['portrait_default']);

    this.portrait.frameName = 'portrait_default';
    this.dialogBoxes.add(this.portrait);
    var small = { font: "bold 26px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle", wordWrap:true, wordWrapWidth: 630};
    this.dialogText = game.make.text(135, 5, "Wow, the moon or whatever is really something",small);
    this.dialogBoxes.add(this.dialogText);
    this.dialogBoxes.alpha = 0;


    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    //Add the indicators to the two left
    this.air = game.add.text(0, 0, "Air: " + GS.air, style);

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
      case 'signal':
      if(GS.currentZone.equip) {

        var module = game.make.sprite(300, 150, "atlas");
        module.frameName = 'ship';
        module.name = 'ship';
        game.physics.enable(module, Phaser.Physics.ARCADE);
        this.things.add(module);
        module.alpha =0;
        this.timer = game.time.create(false);
        this.timer.add(0, function() {
          PlayState.movementEnabled = false;
          this.playerTalk('Here is the source of the interference, but I don\'t see anything...', 'default', false);
        }, this);

        this.timer.add(5000, function() { game.add.tween(module).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);  } ,PlayState);
        this.timer.add(6000, function() { this.playerTalk('What is that?', 'default', false);  } ,PlayState);

      }
        break;
      case 'module':
      var module = game.make.sprite(300, 150, "atlas");
      module.frameName = 'module';
      module.name = 'module';
          game.physics.enable(module, Phaser.Physics.ARCADE);
      this.things.add(module);

        break;
        case 'solar':
        //If we haven't built a solar panel here yet, show the spot.
        if(!GS.currentZone.equip ) {
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
        case 'sensor':
        if(!GS.currentZone.equip) {
          var sensorspot = game.make.sprite(300, 150, "atlas");
          sensorspot.frameName = 'sensorspot';
          sensorspot.name = 'sensor';
              game.physics.enable(sensorspot, Phaser.Physics.ARCADE);
          this.things.add(sensorspot);
        } else {
          var sensorspot = game.make.sprite(300, 150, "atlas");
          sensorspot.animations.add('sensor', Phaser.Animation.generateFrameNames('sensor', 1, 7), 20, true);
          sensorspot.animations.play('sensor');
          sensorspot.name = 'sensor';
              game.physics.enable(sensorspot, Phaser.Physics.ARCADE);
          this.things.add(sensorspot);
        }


        break;
      default:

    }

  },
  playerDies:function() {
    // debugger;
    this.dead = true;
    this.movementEnabled = false;
    //The player dies.
    game.camera.fade(0x000000, 1500);
    game.camera.onFadeComplete.add(function() {game.state.start('LoseState'); },this);
    this.player.animations.play('dead');

  }

};
