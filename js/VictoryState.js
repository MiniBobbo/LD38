var VictoryState = {
  //State variables here.
  bg:null,
  ship:null,
  stars:null,
  dialogBoxes:null,
  portrait:null,
  dialogText:null,
  timer:null,

  preload: function() {

  },
  create:function() {
    this.bg = game.add.sprite(0, 0, "bgs");
    this.createHud();
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    var ludum = game.add.text(20, 20, "Created for Ludum Dare 38\nTheme: A Small World\n\nCreated by Minibobbo", style);
    ludum.alpha = 0;
    // this.bg.animations.add('default', ['bg_empty']);
    // this.bg.animations.play('default');
    this.bg.frameName = GS.currentZone.frameName;
    var module = game.add.sprite(300, 150, "atlas");
    module.frameName = 'ship';
    module.name = 'ship';
    game.physics.enable(module, Phaser.Physics.ARCADE);

    this.timer = game.time.create(false);
    this.timer.add(0, function() {this.displayDialog({message:'Here we go!!!', emot: 'default',interrupt: false});}, this);

    this.timer.add(1500, function() { game.add.tween(module).to( {y: 100, angle:-30 }, 1000, Phaser.Easing.Quadratic.InOut, true);}, this);
    this.timer.add(3500, function() { game.add.tween(module).to( {x: 100, y: -500 }, 2000, Phaser.Easing.Elastic.InOut, true);}, this);
    this.timer.add(7000, function() { game.add.tween(this.dialogBoxes).to( {alpha:0 }, 2000, Phaser.Easing.Linear.None, true);}, this);
    this.timer.add(7000, function() { game.add.tween(this.bg).to( {alpha:0 }, 2000, Phaser.Easing.Linear.None, true);}, this);
    this.timer.add(9000, function() { game.add.tween(ludum).to( {alpha:1 }, 2000, Phaser.Easing.Linear.None, true);}, this);
    // this.timer.add(1500, function() { game.add.tween(module).to( {x: 100, y: -500 }, 300, Phaser.Easing.Bounce.IN, true);}, this);
    this.timer.start();
  },
  update:function() {

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
  },
};
