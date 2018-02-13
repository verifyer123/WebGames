

	function createOverlay(lives){
		//lives = 1;
		coins = 0;
		heartsText.setText(" ");
		xpText.setText(" ");
		speedGame = 5;
        starGame = false;
		
        sceneGroup = game.add.group();
        overlayGroup = game.add.group()
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,function (rect){onClickPlay(lives)})


		/*if(game.device != 'desktop'){
		overlayGroup.scale.setTo(0.9,0.9);
		}else{
			overlayGroup.scale.setTo(1.2,1.2);
		}
		
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
        	if(lives!=null){
	        	heartsText.setText("x " + lives);
	        }
	        else{
	            heartsText.setText("x "+heartsText.initialLives)
	        }
            xpText.setText(coins);
            rect.inputEnabled = false
			sound.play("pop")
          game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                overlayGroup.y = -game.world.height

		
		bgm = game.add.audio('sillyAdventureGameLoop')
            game.sound.setDecodedCallback(bgm, function(){
            }, this);
		
		bgm.loopFull(0.5);
		starGame = true;
		buttons.getButton(bgm,sceneGroup)
				//TweenMax.to(readyButton,1,{y:game.height - readyButton.height,ease:Back.easeOut});		
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.45,0.5);
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'gametuto')
		tuto.anchor.setTo(0.4,0.5)
		
        
        var action = 'tap'
        
        if(game.device == 'desktop'){
            action = 'click'
        }
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 225,'howTo')
		howTo.anchor.setTo(0.4,0.5)
		howTo.scale.setTo(0.7,0.7)
        
		var deviceName = 'pc'
		var offsetX = 0
        if(!game.device.desktop){
           deviceName = 'tablet'
			offsetX = 50
		  	var inputLogo = overlayGroup.create(game.world.centerX + offsetX,game.world.centerY + 145,'movil');
        	inputLogo.anchor.setTo(0.5,0.5);	
			inputLogo.alpha =0;
        }else{
			var inputLogo = overlayGroup.create(game.world.centerX-20,game.world.centerY + 145,'pc');
        	inputLogo.anchor.setTo(0.2,0.5);	
			inputLogo.alpha =0;
		}
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height,'buttonPlay')
		button.anchor.setTo(0.2,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.1,0.5)*/
    }	

    function onClickPlay(lives){

    	if(lives!=null){
        	heartsText.setText("x " + lives);
        }
        else{
            heartsText.setText("x "+heartsText.initialLives)
        }
        xpText.setText(coins);
        //rect.inputEnabled = false
		//sound.play("pop")
      	
            overlayGroup.y = -game.world.height

			bgm = game.add.audio('sillyAdventureGameLoop')
		        game.sound.setDecodedCallback(bgm, function(){
		        }, this);
			
			bgm.loopFull(0.5);
			starGame = true;
			buttons.getButton(bgm,sceneGroup)
				//TweenMax.to(readyButton,1,{y:game.height - readyButton.height,ease:Back.easeOut});		
	    
    }

    function setLives(lives){
    	heartsText.setText("x " + lives);
    }

function createHearts(lives){
		var heartsGroup = game.add.group();
		heartsIcon = heartsGroup.create(0,0,"heartsIcon");
		heartsIcon.anchor.setTo(0, 0);	
		heartsIcon.x = game.world.width - heartsIcon.width;
		heartsIcon.y = 5;	
		heartsText = game.add.text(50, 10, "x " + lives, styleWhite,heartsGroup);	
		heartsText.anchor.setTo(0, 0);	
		heartsText.x = game.world.width - 75;
		heartsText.y = 5;
		heartsText.initialLives = lives
		sceneGroup.add(heartsGroup);	
}
	
function createCoins(coins){
		var coinsGroup = game.add.group();
		xpIcon = coinsGroup.create(0,0,"xpIcon");
		xpIcon.anchor.setTo(0, 0);	
		xpIcon.x = 0;
		xpIcon.y = 5;	
		xpText = game.add.text(50, 10, coins, styleWhite,coinsGroup);	
		xpText.anchor.setTo(0, 0);	
		xpText.x = 75;
		xpText.y = 2;	
		sceneGroup.add(coinsGroup);
}	

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	
	return array;
}


		function ActiveDrag(object,target){
			this.game.physics.arcade.enable(target);
			this.game.physics.arcade.enable(object);
			object.inputEnabled = true;
			object.originalPosition = object.position.clone();
			object.input.enableDrag();
			object.positionX = object.x;
			object.positionY = object.y;
		}






