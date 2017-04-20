var PreloadState = {
  //State variables here.

  preload: function() {
//    game.load.atlas('name', 'image', 'atlasJSON');
  },
  create:function() {
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    var text = game.add.text(0,0, "Preload", style);
  },
  update:function() {

  }
};
