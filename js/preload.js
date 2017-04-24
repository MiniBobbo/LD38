var PreloadState = {
  //State variables here.

  preload: function() {
    game.load.atlas('atlas', 'assets/atlas.png', 'assets/atlas.json');
    game.load.atlas('bgs', 'assets/bgs.png', 'assets/bgs.json');
  },
  create:function() {
    GS.init();
    game.state.start('OverworldState');
  },
  update:function() {

  }
};
