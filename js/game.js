
var game = new Phaser.Game(800, 600, Phaser.AUTO, '');


game.state.add('Preload', PreloadState);
game.state.add('MenuState', MenuState);
game.state.add('PlayState',PlayState);
game.state.add('OverworldState',OverworldState);
game.state.add('LoseState',LoseState);
game.state.add('VictoryState',VictoryState);



game.state.start('Preload');


var GS = {
  equipment:[],
  overworld:[],
  goals:[],
  energy:100,
  air:100,
  maxAir:100,
  food:100,
  maxTiles:6,
  playerLoc:new Phaser.Point(1,1),
  currentZone:null,
  playerSpeed:200,
  heldItem:null,
  modulePowered:false,
  sensorsPowered:false,
  signalDiscovered:false,
  sensor1placed:false,
  sensor2placed:false,
  signalTriangulated:false,

  init:function() {
    //Set all the defaults:
    this.goals = [];
    this.equipment = [];
    this.goals = [];
    this.air = 100;
    this.maxAir = 100;
    this.playerLoc = new Phaser.Point(1,1);
    this.currentZone = new Phaser.Point(1,1);
    this.heldItem = null;
    this.modulePowered = false;
    this.sensorsPowered=false;
    this.signalDiscovered=false;
    this.sensor1placed=false;
    this.sensor2placed=false;
    this.signalTriangulated=false;


    //Create the new equipment here
    var module = game.add.sprite(0, 0, "atlas");
    module.type = 'module';
    module.description = 'This is my lunar module.  I can get air and energy here.';

    //Create the overworld tiles:  There are 6x6 tiles

    for(i=0;i <this.maxTiles;i++) {
      this.overworld.push([]);
      for(j=0; j < this.maxTiles;j++) {
        var overworldTile = {};
        overworldTile.frameName = 'bg_empty' + game.rnd.integerInRange(1,3)
        overworldTile.explored = false;
        overworldTile.Xloc = i;
        overworldTile.Yloc = j;
        overworldTile.type = 'empty';
        overworldTile.equip = false;

        overworldTile.pickups = [];
        this.overworld[i].push(overworldTile);

      }

    }


    //Create the goals
    this.goals.push({
      name:'- Find and deploy solar panels',
      completed:false,
      show:true,
    });
    this.goals.push({
      name:'- Find a spot for the first sensor',
      completed:false,
      show:true,
    });
    this.goals.push({
      name:'- Find a spot for the second sensor',
      completed:false,
      show:true,
    });

    //Debug, give the player an item.
    // this.giveItem('power array');
    // this.signalDiscovered = true;

    //Place the module
    var m = this.overworld[1][1];
    m.type = 'module';
    m.equip = 'module';
    m.explored = true;

    m = this.overworld[2][2];
    m.type = 'solar';

    m = this.overworld[3][0];
    m.type = 'solar';
    m = this.overworld[0][0];
    m.type = 'sensor';
    m = this.overworld[0][3];
    m.type = 'sensor';
    m = this.overworld[5][3];
    m.type = 'signal';
    // m.equip = true;
    // this.signalTriangulated=true;







    // this.placePickup(1,0,'power array');
    this.placePickup(1,0,'power array');
    this.placePickup(1,2,'power array');
    this.placePickup(4,3,'sensor');
    this.placePickup(1,5,'sensor');

  },
  placePickup(x,y,pickup) {
    var m = this.overworld[x][y];
    var pu = {
    name:pickup,
    overLoc:new Phaser.Point(x,y),
    zoneLoc:new Phaser.Point(game.rnd.integerInRange(100,700),360)
  };

    m.pickups.push(pu);
    // debugger;

  },
  giveItem:function(name) {
    //This is a debug feature to just give the player a pickup so I don't have to
    //go get one every time.
    var pu = {
    name:name,
    overLoc:new Phaser.Point(),
    zoneLoc:new Phaser.Point(game.rnd.integerInRange(100,700),360)
  };
  // GS.heldItem = pu;

    // m.pickups.push(pu);


  },
  checkItem:function(name) {
    // debugger;
    if(this.heldItem == null) {
      return false;
    }
    if(this.heldItem.name == name) {
      return true;

    }
    return false;
  },
  changeAirLevel(newLevel) {
    game.add.tween(this).to({air: newLevel}, 300, Phaser.Easing.Linear.None, true);
  }





}
