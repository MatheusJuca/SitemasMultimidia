var game;
var score = 0;
var highscore, scoreDisplay, highScoreText;
window.onload = function()
{
	
    game=new Phaser.Game(640,480,Phaser.AUTO,"ph_game");
    game.state.add("StateOver",StateOver);
    game.state.add("StateMain",StateMain);
    game.state.start("StateMain");
}