
var game = new Phaser.Game(800, 600, Phaser.AUTO, '');


game.state.add('Preload', PreloadState);
game.state.add('MenuState', MenuState);
game.state.add('PlayState',PlayState);

game.state.start('Preload');
