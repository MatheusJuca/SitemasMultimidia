var StateOver={    
    
    
    create:function()
    {
        //Exibe o score
        var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

        var text = game.add.text(game.world.centerX, game.world.centerY + 100, "Score: " + score, style);

        text.anchor.set(0.5);

        //  And now we'll color in some of the letters
        text.addColor('#ffff00', 16);
        text.addColor('#ffffff', 25);

        text.addColor('#ff00ff', 28);
        text.addColor('#ffffff', 32);
        //Add sprite de playagain
        this.playAgain=game.add.sprite(game.width/2,game.height/2,"playAgain");
        //Centraliza imagem
        this.playAgain.anchor.set(0.5,0.5);
        //permite input
        this.playAgain.inputEnabled=true;
        //Adiciona listener
        this.playAgain.events.onInputDown.add(this.restartGame,this);
    },
    
    restartGame:function()
    {
    	//restarta o jogo chamando o estado main
    	game.state.start("StateMain");
    }
}