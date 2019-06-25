var StateMain = {
    preload: function() {
	
        game.load.image("bar", "Jogo/Assets/powerbar.png");
        game.load.image("block", "Jogo/Assets/block.png");
        game.load.image("floor", "Jogo/Assets/floor.png");

        game.load.atlasJSONHash('bird','Jogo/Assets/bird.png','Jogo/Assets/bird.json');
        game.load.image("playAgain", "Jogo/Assets/playAgain.png");
        game.load.atlasJSONHash('hero', 'Jogo/Assets/explorer.png', 'Jogo/Assets/explorer.json');
       //
       //
       //
       game.load.image("background","Jogo/Assets/background.png");
       game.load.image("city1","Jogo/Assets/city1.png");
       game.load.image("city2","Jogo/Assets/city2.png");

    },
    create: function() {
        this.isDead = false;
        this.isSliding = false;
        this.clickLock = false;
        cont = 0;
        isJumping = false;
        this.power = 0;
        //Coloca background preto na tela de game over
        game.stage.backgroundColor = "#000000";
		
		var score = 0;
		game.add.text(30, 20, "SCORE:", { font: "bold 12px sans-serif",
		fill: "#ffffff",
		align: "center",
		position: "absolute"});

		scoreDisplay = game.add.text(80, 19, score,{ font: "bold 14px sans-serif",
		fill: "#ffffff",
		align: "center" });

        //background
        //
    

        //parallax cidade
        //
        this.city2=game.add.tileSprite(0,0,game.width,game.height/3,"city2");
        this.city2.y=game.height-this.city2.height;

        this.city1=game.add.tileSprite(0,0,game.width,game.height/3,"city1");
        this.city1.y=game.height-this.city1.height;

        this.city2.autoScroll(50,0);
        this.city1.autoScroll(150,0);

        //Adiciona o chao
        this.floor=game.add.tileSprite(0,game.height*.9,game.width,50,"floor");
        this.floor.autoScroll(200,0);
        //
        //
        //adiciona o personagem principal 
        this.hero = game.add.sprite(game.width * .8, this.floor.y, "hero");
        //faz animacao dos personagens
        this.hero.animations.add("die", this.makeArray(0, 10), 12, false);
        this.hero.animations.add("jump", this.makeArray(20, 30), 12, false);
        this.hero.animations.add("run", this.makeArray(30, 40), 12, true);
        this.hero.animations.add("slide", this.makeArray(40,50), 12, false);
        this.hero.animations.play("run");
        this.hero.width = game.width / 12;
        this.hero.scale.y = this.hero.scale.x;
        this.hero.scale.x *= -1;
        this.hero.anchor.set(0.5, 1);
        //Adiciona a barra de pulo acima do personagem
        this.powerBar = game.add.sprite(this.hero.x + this.hero.width / 2, this.hero.y - this.hero.height / 2, "bar");
        this.powerBar.width = 0;
      
        //Comeca engine de fisica
        //
        //
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //Permite fisica do personagem principal
        //
        //
        game.physics.enable(this.hero, Phaser.Physics.ARCADE);
        game.physics.enable(this.floor, Phaser.Physics.ARCADE);
        this.hero.body.gravity.y = 500;
        this.hero.body.collideWorldBounds = true;
        this.floor.body.immovable = true;
        //Define posicao inicial
        this.startY = this.hero.y;
        //set listeners
        game.input.onDown.add(this.mouseDown, this);
        cursors = game.input.keyboard.createCursorKeys();
        this.blocks = game.add.group();
        this.makeBlocks();
        this.makeBird();
    },
    makeArray: function(start, end) {
        var myArray = [];
        for (var i = start; i < end; i++) {
            myArray.push(i);
        }
        return myArray;
    },
    mouseDown: function() {
        if (this.clickLock == true) {
            return;
        }
        if (cont > 2){
            return;
        }
        game.input.onDown.remove(this.mouseDown, this);
        this.timer = game.time.events.loop(Phaser.Timer.SECOND / 1000, this.increasePower, this);
        game.input.onUp.add(this.mouseUp, this);
        cont += 1;
    },
    mouseUp: function() { 
        game.input.onUp.remove(this.mouseUp, this);
        isJumping = true;
        this.doJump();
        game.time.events.remove(this.timer);
        this.power = 0;
        this.powerBar.width = 0;
        game.input.onDown.add(this.mouseDown, this);
        this.hero.animations.play("jump");
    },
    increasePower: function() {
        this.power++;
        this.powerBar.width = this.power;
        if (this.power > 45) {
            this.power = 45;
        }
    },
    doJump: function() {
        isJumping = true;
        this.hero.body.velocity.y = -this.power * 12;
    },
    
    doSlide: function() {
        this.isSliding = true;
        if (!this.isDead){
            if (!this.isJumping){
                this.hero.animations.play("slide");
            }
        }   
        this.isSliding = false;
    },
    makeBlocks: function() {
        this.blocks.removeAll();
        var wallHeight = game.rnd.integerInRange(1, 5);
        for (var i = 0; i < wallHeight; i++) {
            var block = game.add.sprite(0, -i * 32, "block");
            this.blocks.add(block);
        }
        this.blocks.x = 0 + this.blocks.width
        this.blocks.y = this.floor.y - 32;
        //
        //Loop para cada bloco e fisica
        this.blocks.forEach(function(block) {
            //permite fisica
            game.physics.enable(block, Phaser.Physics.ARCADE);
            block.body.velocity.x = 200;
            //Aplica alguma gravidade mas nao muita para os blocos nao colidirem uns com os outros
            block.body.gravity.y = 3;
            //Seta bounce para os blocos reagirem ao contato com o personagem
            block.body.bounce.set(1, 1);
        });
    },
    makeBird: function() {
        //Se o passaro existe destroi ele
        if (this.bird) {
            this.bird.destroy();
        }
        //Seleciona um numero de cima da tela entre 10 e 40 porcento da altura da tela para spwanar
        var birdY = game.rnd.integerInRange(game.height * .1, game.height * .4);
        //Add sprites do passaro
        this.bird = game.add.sprite(0, birdY, "bird");
        this.bird.animations.add("fly",this.makeArray(0,8),12,true);
        this.bird.animations.play("fly");
        //
        //
        //adiciona fisica
        game.physics.enable(this.bird, Phaser.Physics.ARCADE);
        //Seta velocidade acima da dos blocos para evitar paredes impossiveis
        this.bird.body.velocity.x = 340;
        //Seta bounce do passaro
        this.bird.body.bounce.set(2, 2);

        this.bird.width=game.width*.07;
        this.bird.scale.y=this.bird.scale.x;
        this.bird.scale.x=-this.bird.scale.x;

    },
	//Seta animacao apenas quando o personagem e construido dentro do jogo
    onGround() { 
        cont = 0;
        if (this.hero) {
            if (!this.isDead){
                if (!this.isSliding){
                    this.hero.y = this.floor.y;
                    this.hero.animations.play("run");
                }
            }
        } 
    },
    update: function() {
        game.physics.arcade.collide(this.hero, this.floor, this.onGround, null, this);
        //
        //colide personagem e chao
        //
        game.physics.arcade.collide(this.hero, this.blocks, this.delayOver, null, this);
        //
        //colide personagem e blocos
        //
        game.physics.arcade.collide(this.floor, this.blocks);
        //
		//colide chao e blocos
		//
        //quando especificando um grupo, todos os filhos daquele grupo vao se colidir um com o outor
        //
        game.physics.arcade.collide(this.blocks);
        //colide o personagem e o passaro
        //
        game.physics.arcade.collide(this.hero, this.bird, this.delayOver, null, this);
        //
        //get primeiro filo
        var fchild = this.blocks.getChildAt(0);
        //se fora da tela reseta logica de criar blocos
        if (fchild.x >= game.width) {
            this.makeBlocks();
			score += 10;
			scoreDisplay.text = score;
			
        }
        //se passaro fora da tela reseta logica de criar passaros
        if (this.bird.x > game.width) {
            this.makeBird();
			score += 15;
			scoreDisplay.text = score;
        }
		//logica de morte
        if (this.hero.y < this.hero.height) {
            this.hero.body.velocity.y = 200;
            this.delayOver();
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            this.doSlide();
        }
    },
    delayOver: function() {
        this.clickLock = true;
        this.isDead = true;
        if (this.hero) {
            if (!this.isSliding){
                this.hero.animations.play("die"); 
            }
        }
        game.time.events.add(Phaser.Timer.SECOND, this.gameOver, this);
    },
    gameOver: function() {
        game.state.start("StateOver");
    }
}