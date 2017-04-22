
var game = new Phaser.Game(800, 600, Phaser.AUTO, '');


game.state.add('Preload', PreloadState);
game.state.add('MenuState', MenuState);
game.state.add('PlayState',PlayState);
game.state.add('OverworldState',OverworldState);


game.state.start('Preload');


var GS = {
  equipment:[],
  overworld:[],
  energy:100,
  air:100,
  food:100,
  maxTiles:6,
  playerLoc:new Phaser.Point(1,1),
  currentZone:null,
  playerSpeed:200,
  init:function() {
    //Create the new equipment here
    var module = game.add.sprite(0, 0, "atlas");
    module.type = 'module';
    module.description = 'This is my lunar module.  I can get air and energy here.';

    //Create the overworld tiles:  There are 6x6 tiles

    for(i=0;i <this.maxTiles;i++) {
      this.overworld.push([]);
      for(j=0; j < this.maxTiles;j++) {
        var overworldTile = game.make.sprite(0, 0, "atlas");
        overworldTile.Xloc = i;
        overworldTile.Yloc = j;
        overworldTile.type = 'nothing';
        overworldTile.animations.add('empty',['ow_empty']);
        overworldTile.animations.play('empty');
        this.overworld[i].push(overworldTile);

      }

    }

    //Place the module
    var m = this.overworld[1][1];
    m.type = 'module';
    m.equip = 'module';
    var modsprite = game.make.sprite(0, 0, "atlas");
    modsprite.animations.add('mod', ['ow_module']);
    modsprite.animations.play('mod');
    m.addChild(modsprite);


  }





}
