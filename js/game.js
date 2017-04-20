
var game = new Phaser.Game(800, 600, Phaser.AUTO, '');


game.state.add('Preload', PreloadState);

game.state.start('Preload');
