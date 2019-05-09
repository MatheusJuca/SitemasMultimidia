var StateOver={    
    
    
    create:function()
    {
    	//Adda sprite de playagain
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