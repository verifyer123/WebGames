var animation = function(){
	
	var storeJSON = {
		"glasses": [
			{
			"name": "glass1",
			"id": "0",
			"price": "50",
			"buy": true,
			"select": true	
			},
			{
			"name": "glass2",
			"id": "1",
			"price": "20",	
			"buy": false,
			"select": false			
			},
			{
			"name": "glass3",
			"id": "2",
			"price": "50",	
			"buy": false,
			"select": false			
			},
			{
			"name": "glass4",
			"id": "3",
			"price": "50",	
			"buy": false,
			"select": false			
			},
			{
			"name": "glass5",
			"id": "4",
			"price": "20",	
			"buy": false,
			"select": false			
			},
			{
			"name": "glass6",
			"id": "5",
			"price": "50",	
			"buy": false,
			"select": false			
			},
			{
			"name": "glass7",
			"id": "6",
			"price": "50",	
			"buy": false,
			"select": false			
			},
			{
			"name": "glass8",
			"id": "7",
			"price": "50",	
			"buy": false,
			"select": false			
			},
			{
			"name": "glass9",
			"id": "8",
			"price": "50",	
			"buy": false,
			"select": false			
			}
		],

		"hairs": [
			{
			"name": "hair1",
			"id": "0",
			"price": "50",		
			"buy": true,
			"select": true	
			},
			{
			"name": "hair2",
			"id": "1",
			"price": "20",			
			"buy": false,
			"select": false			
			},
			{
			"name": "hair3",
			"id": "2",
			"price": "50",		
			"buy": false,
			"select": false	
			},
			{
			"name": "hair4",
			"id": "3",
			"price": "50",			
			"buy": false,
			"select": false			
			},			
			{
			"name": "hair5",
			"id": "4",
			"price": "50",		
			"buy": false,
			"select": false	
			},
			{
			"name": "hair6",
			"id": "5",
			"price": "20",			
			"buy": false,
			"select": false			
			},
			{
			"name": "hair7",
			"id": "6",
			"price": "50",		
			"buy": false,
			"select": false	
			},
			{
			"name": "hair8",
			"id": "7",
			"price": "50",			
			"buy": false,
			"select": false			
			},
			{
			"name": "hair9",
			"id": "8",
			"price": "50",			
			"buy": false,
			"select": false			
			}
		],

		"colors": [
			{
			"name": "color1",
			"id": "0",
			"price": "50",			
			"buy": true,
			"select": true	
			},
			{
			"name": "color2",
			"id": "1",
			"price": "20",			
			"buy": false,
			"select": false			
			},
			{
			"name": "color3",
			"id": "2",
			"price": "50",			
			"buy": false,
			"select": false			
			},
			{
			"name": "color4",
			"id": "3",
			"price": "100",			
			"buy": false,
			"select": false			
			},
			{
			"name": "color5",
			"id": "4",
			"price": "50",			
			"buy": false,
			"select": false			
			},
			{
			"name": "color6",
			"id": "5",
			"price": "100",			
			"buy": false,
			"select": false			
			}
		],

		"shorts": [
			{
			"name": "short1",
			"id": "0",
			"price": "50",			
			"buy": true,
			"select": true	
			},
			{
			"name": "short2",
			"id": "1",
			"price": "20",			
			"buy": false,
			"select": false			
			},
			{
			"name": "short3",
			"id": "2",
			"price": "50",			
			"buy": false,
			"select": false			
			},
			{
			"name": "short4",
			"id": "3",
			"price": "50",			
			"buy": false,
			"select": false			
			},
			{
			"name": "short5",
			"id": "4",
			"price": "20",			
			"buy": false,
			"select": false			
			},
			{
			"name": "short6",
			"id": "5",
			"price": "50",			
			"buy": false,
			"select": false			
			},
			{
			"name": "short7",
			"id": "6",
			"price": "50",			
			"buy": false,
			"select": false			
			},
			{
			"name": "short8",
			"id": "7",
			"price": "50",			
			"buy": false,
			"select": false			
			},
			{
			"name": "short9",
			"id": "8",
			"price": "50",			
			"buy": false,
			"select": false			
			}
		],

		"bgs": [
			{
			"name": "bg1",
			"id": "0",
			"price": "50",			
			"buy": true,
			"select": true	
			},
			{
			"name": "bg2",
			"id": "1",
			"price": "20",			
			"buy": false,
			"select": false			
			},
			{
			"name": "bg3",
			"id": "2",
			"price": "50",			
			"buy": false,
			"select": false			
			},
			{
			"name": "bg4",
			"id": "3",
			"price": "50",			
			"buy": false,
			"select": false			
			}
		]
	}	

		assets = {
			atlases: [],
			images: [],
			sounds: [],
		}
	 
		var nextScrollPress = false;
		var prevScrollPress = false;
		var glassGroup;
		var hairGroup;
		var skinGroup;
		var shortGroup;
		var bgGroup;	
		var readyGroup;
		var NumButtonsMenu = 5;	
		var numButtons=new Array;
		var numImgButtons=new Array;
		var buttonInactive = 0xFFFFFF;
		var buttonActive = 0x7C1354;	
		var numGlassItems = 8;
		var numHairItems = 8;
		var numColorsItems = 5;	
		var numShortItems = 8;	
		var numbgItems = 4;				
		var buttonsGlassItems = new Array;	
		var buttonsHairItems = new Array;	
		var buttonsSkinItems = new Array;
		var buttonsShortItems = new Array;	
		var buttonsbgItems = new Array;	
		var buttonsbgItems = new Array;	
		var contador = 0;	
		var skinTable = new Array;
		var glassStarIcon;	
		var hairStarIcon;	
		var skinStarIcon;
		var shortStarIcon;
		var bgStarIcon;		
		var selectBuy = new Array;	
		var getprofile = JSON.parse(localStorage.getItem("profile"));
		var getCoins = getprofile.coins;										  
		var newGlass;	
		var newHair;
		var newSkin;	
		var allProducts;	

		function createTextPart(text,posx,posy,color,grupo){
			var style = { font: "25px Arial", fill: color, wordWrap: true, wordWrapWidth: 100, align: "center" };
			texto = game.add.text(posx, posy, text, style , grupo);
			texto.anchor.setTo(0.5,0);
		}

		function createTextMenu(text,posx,posy,color,grupo){
			var style = { font: "30px Arial", fill: color, wordWrap: true, wordWrapWidth: 100, align: "center" };
			texto = game.add.text(posx, posy, text, style , grupo);
		}	

		function preload() { 
			this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

			game.plugins.add(Fabrique.Plugins.Spine);
			game.stage.disableVisibilityChange = true;
			game.load.spine('men', "img/spines/skeleton.json");
			game.load.image("bgMenu1", "img/glass_menu.png");
			game.load.image("bgMenu2", "img/hair_menu.png");
			game.load.image("bgMenu3", "img/color_menu.png");
			game.load.image("bgMenu4", "img/glass_menu.png");
			game.load.image("bgMenu5", "img/bg_menu.png");
			game.load.image("thumbbg1", "img/bg/bg1thumb.png");
			game.load.image("thumbbg2", "img/bg/bg2thumb.png");
			game.load.image("thumbbg3", "img/bg/bg3thumb.png");
			game.load.image("thumbbg4", "img/bg/bg4thumb.png");
			game.load.image("bg1", "img/bg/bg1.png");
			game.load.image("bg2", "img/bg/bg2.png");
			game.load.image("bg3", "img/bg/bg3.png");
			game.load.image("bg4", "img/bg/bg4.png");
			game.load.image("starIcon", "img/star_icon.png");
			game.load.image("xpIcon", "img/xp_icon.png");
			game.load.image("comprado", "img/comprado.png");
			game.load.image("buyButton", "img/buy_button.png");
			for(var p= 0;p<=numHairItems;p++){
			game.load.image("glass" + [p+1], "img/glasses/glasses" + [p+1] + ".png");
			}
			for(var r= 0;r<=numHairItems;r++){
			game.load.image("hair" + [r+1], "img/hairs/hair" + [r+1] + ".png");	
			}
			for(var i= 0;i<=numColorsItems;i++){
			game.load.image("skin" + [i+1], "img/skins/Skin" + [i+1] + ".png");	
			}
			for(var s= 0;s<=numShortItems;s++){
			game.load.image("short" + [s+1], "img/shorts/short" + [s+1] + ".png");	
			}
			game.load.image("logOut","img/settings.png");
			game.load.image("nextButton","img/nextButton.png");
		}	

		function createScene(){	
	
		if(getprofile.allProducts){
			allProducts = getprofile.allProducts
			
			for(var index1 = 1; index1<=numGlassItems;index1++){
				if(allProducts.glasses[index1-1].select){
					skinTable[0] = index1;
				}
			}
			for(var index2 = 1; index2<=numHairItems;index2++){
				if(allProducts.hairs[index2-1].select){
					skinTable[1] = index2;
				}	
			}
			for(var index3 = 1; index3<=numColorsItems;index3++){
				if(allProducts.colors[index3-1].select){
					skinTable[2] = index3;
				}		
			}
			for(var index4 = 1; index4<=numShortItems;index4++){
				if(allProducts.shorts[index4-1].select){
					skinTable[3] = index4;
				}
			}
			for(var index5 = 1; index5<=numbgItems;index5++){
				if(allProducts.bgs[index5-1].select){
					skinTable[4] = index5;
				}					
			}
			
		}else{
			allProducts = storeJSON
			skinTable= [1,1,1,1,1]; //getprofile && getprofile.storeData || 
		};
			
			/*allProducts = storeJSON
			skinTable=[1,1,1,1,1];*/
		

		function saveStore(dataToSend, currentCoins, skinTable){
			amazing.userUpdate(dataToSend, function(event){
				if(event && event.status == "success"){
					var profile = amazing.getUserProfile()
					profile.allProducts = allProducts
					profile.storeData = skinTable
					profile.coins = currentCoins
					amazing.saveUserProfile(profile)

					getCoins = profile.coins	
				}
			}, function(event){
				console.log("Updating failed");
			})
		}

		function saveStoreToServer(newDataStore, currentCoins){
			if(newDataStore){
				var data = {
					email: getprofile.email,
					authentication:getprofile.authentication,
					allProducts: newDataStore,
					coins: currentCoins,
					storeData: skinTable
				}
				saveStore(data, currentCoins, skinTable)
			}
		}

		function sentToServer(currentCoins){
			//Server data
			saveStoreToServer(allProducts, currentCoins)
		}

		function sendDataGame(){
			//Minigame data
			var storeForGames = skinTable
			storeForGames = JSON.stringify(skinTable)
			localStorage.setItem("storeForGames", storeForGames)
		}	

		var banner2 = game.add.graphics(0, 0);
		banner2.beginFill(0x7C1354);
		banner2.drawRect(0, 0, game.width, 80);
		var xpCoinsbanner = game.add.sprite(game.world.centerX - 100,0,"xpIcon");	
		var style = { font: "45px Arial", fill: "#FFFFFF", wordWrap: true, wordWrapWidth: 100, align: "center" };	
		var textCoinsBanner = game.add.text(game.world.centerX, 15, getCoins, style);	
		//FONDO DEL SPINE
		var settingsButton = game.add.graphics(0, 0);

		settingsButton.beginFill(0xD1196D);
		settingsButton.drawRect(0, 0, 100, 80);	
		settingsButton.x = game.width - settingsButton.width;
		var settingsIcon = game.add.sprite(0 ,10, "logOut");
		settingsIcon.x = 	game.width - settingsIcon.width - settingsIcon.width/6;	
		settingsIcon.inputEnabled = true;
		settingsIcon.events.onInputUp.add(toProfileFunction, this);	
		
		function toProfileFunction	(){
			goToProfile();		
		}
			
		var groupBgSpine = game.add.group();
		var bgSpine;	
		for(var p=1;p<=4;p++){
				bgSpine = groupBgSpine.create(0, 80,"bg" + p);
				bgSpine.width = game.width/1.1;
				bgSpine.anchor.setTo(1,0);
				bgSpine.x = bgSpine.width * p;	
		}
			groupBgSpine.x = 100;

		//SPINE
		var buddy = game.add.spine(game.width/1.5, game.height/2.2, "men");
		buddy.scale.setTo(1.7);
		buddy.isRunning = true
		buddy.setAnimationByName(0, "IDLE", true);

		newSkin = buddy.createCombinedSkin(
				   'combined',    
				   'glasses' + skinTable[0],        
				   'hair' +  skinTable[1],
				   'skin' + skinTable[2],
				   'torso' + skinTable[3]      
		);

		buddy.setSkinByName('combined')		
		//Menu de los botones			
		for(var i = 1; i<=NumButtonsMenu;i++){
			numButtons[i-1] = game.add.graphics(0, 0);
			numButtons[i-1].id = i-1;
			numButtons[i-1].beginFill(buttonInactive);
			numButtons[i-1].drawRect(0, 0, game.width/5, game.height/11.8); 
			numButtons[i-1].y = numButtons[i-1].height * i - 2;
			numButtons[i-1].inputEnabled = true;
			numButtons[i-1].events.onInputUp.add(presiona, this);
			numButtons[i-1].tint = 0xD1196D;		
			numImgButtons[i-1] = game.add.sprite(numButtons[i-1].x + numButtons[i-1].width/2, numButtons[i-1].height * i + 10,"bgMenu" + i);

			numImgButtons[i-1].anchor.setTo(0.5,0);
			numImgButtons[i-1].tint = buttonActive;
		}
			
		numButtons[0].tint	= buttonActive;
		numImgButtons[0].tint = 0xFFFFFF;	
		function presiona(buttonMenu){
			for(var n = 1; n<=NumButtonsMenu;n++){
				numButtons[n-1].tint = 0xD1196D;
				numImgButtons[n-1].tint	= buttonActive;
			}
			numImgButtons[buttonMenu.id].tint = 0xFFFFFF;
			buttonMenu.tint = buttonActive;
				switch(buttonMenu.id){
					case 0:
						glassGroup.visible = true;
						hairGroup.visible = false;
						skinGroup.visible = false;
						shortGroup.visible = false;
						bgGroup.visible = false;
						readyGroup = glassGroup;
					break;
					case 1:
						hairGroup.visible = true;
						glassGroup.visible = false;
						skinGroup.visible = false;
						shortGroup.visible = false;
						bgGroup.visible = false;
						readyGroup = hairGroup;
					break;
					case 2:
						skinGroup.visible = true;
						hairGroup.visible = false;
						glassGroup.visible = false;
						shortGroup.visible = false;
						bgGroup.visible = false;
						readyGroup = skinGroup;
					break;
					case 3:
						shortGroup.visible = true;
						skinGroup.visible = false;
						hairGroup.visible = false;
						glassGroup.visible = false;
						bgGroup.visible = false;
						readyGroup = shortGroup;
					break;
					case 4:
						bgGroup.visible = true;
						shortGroup.visible = false;
						skinGroup.visible = false;
						hairGroup.visible = false;
						glassGroup.visible = false;
						readyGroup = bgGroup;
					break;
				}	
			}

			createTextPart("Lentes",numImgButtons[0].x,numImgButtons[0].y + numImgButtons[0].height,"#ffffff");
			createTextPart(" Pelo",numImgButtons[1].x,numImgButtons[1].y + numImgButtons[1].height,"#ffffff");
			createTextPart(" Color",numImgButtons[2].x,numImgButtons[2].y + numImgButtons[2].height,"#ffffff");
			createTextPart(" Ropa",numImgButtons[3].x,numImgButtons[3].y + numImgButtons[3].height,"#ffffff");
			createTextPart("Fondo",numImgButtons[4].x,numImgButtons[4].y + numImgButtons[4].height,"#ffffff");

		//MENU PARA PERSONALIZAR LOS LENTES DEL SPINE

		glassGroup = game.add.group();

			var stylePrice = { font: "35px Arial", fill: "#EA0A8F", wordWrap: true, wordWrapWidth: 100, align: "center",fontWeight:"bold" };
			
			for(var t =1;t<=numGlassItems;t++ )
			{	
				buttonsGlassItems[t-1] = game.add.graphics(265 * (t-1), game.height/2.3,glassGroup);
				buttonsGlassItems[t-1].id = t;
				buttonsGlassItems[t-1].beginFill(buttonInactive);
				buttonsGlassItems[t-1].lineStyle(5,0xCACACA,1);	
				buttonsGlassItems[t-1].drawRect(10, 85, 250, 350); 
				buttonsGlassItems[t-1].inputEnabled = true;
				buttonsGlassItems[t-1].events.onInputUp.add(glassButtonItem, this);
				buttonsGlassItems[t-1].tint = 0xE0E0E0;	
				buttonsGlassItems[t-1] = glassGroup.create(buttonsGlassItems[t-1].x+45, buttonsGlassItems[t-1].y + 160,"glass" + t);	

				if(allProducts.glasses[t-1].buy == false){
					buttonsGlassItems[t-1][0] = glassGroup.create(buttonsGlassItems[t-1].x+20, buttonsGlassItems[t-1].y + 80,"xpIcon");				
					buttonsGlassItems[t-1][1] = game.add.text(buttonsGlassItems[t-1].x+100, buttonsGlassItems[t-1].y+100, allProducts.glasses[t-1].price, stylePrice , glassGroup);	
					buttonsGlassItems[t-1][2] = glassGroup.create(buttonsGlassItems[t-1].x+13, buttonsGlassItems[t-1].y + 180,"buyButton");		
					buttonsGlassItems[t-1][2].inputEnabled = true;
					buttonsGlassItems[t-1][2].id = t;
					buttonsGlassItems[t-1][2].events.onInputUp.add(buyGlassButton, this); 	
					buttonsGlassItems[t-1][3] = glassGroup.create(buttonsGlassItems[t-1].x-15, buttonsGlassItems[t-1].y + 120,"comprado");	
					buttonsGlassItems[t-1][3].scale.setTo(1.5,1.5);
					buttonsGlassItems[t-1][3].alpha = 0;
					
				}else{
					buttonsGlassItems[t-1][3] = glassGroup.create(buttonsGlassItems[t-1].x-15, buttonsGlassItems[t-1].y + 120,"comprado");	
					buttonsGlassItems[t-1][3].scale.setTo(1.5,1.5);
				}
			}

			function buyGlassButton(glassItem){
				showWindowBuy();
				contador++
				skinTable[0] = glassItem.id;
				if(glassStarIcon != undefined){
					glassStarIcon.destroy();
				}
				selectBuy[0] = 1;
				selectBuy[1] = glassItem.id-1;
				glassStarIcon = glassGroup.create(buttonsGlassItems[glassItem.id-1].x - 35 , buttonsGlassItems[glassItem.id-1].y-76,"starIcon");
				newGlass = buddy.createCombinedSkin(
				   'glasscombined' + contador,    
				   'glasses' + skinTable[0],        
				   'hair' +  skinTable[1],
				   'skin' + skinTable[2],
				   'torso' + skinTable[3]      
				);
				buddy.setAnimationByName(0, "IDLE", true);	
				buddy.setToSetupPose();		
				buddy.setSkinByName('glasscombined' + contador);			
			}

			function glassButtonItem(glassItem){
				contador++
				skinTable[0] = glassItem.id;
				if(glassStarIcon != undefined){
					glassStarIcon.destroy();
				}
				selectBuy[0] = 1;
				selectBuy[1] = glassItem.id-1;
				glassStarIcon = glassGroup.create(buttonsGlassItems[glassItem.id-1].x - 35 , buttonsGlassItems[glassItem.id-1].y-76,"starIcon");	
				newGlass = buddy.createCombinedSkin(
				   'glasscombined' + contador,    
				   'glasses' + skinTable[0],        
				   'hair' +  skinTable[1],
				   'skin' + skinTable[2],
				   'torso' + skinTable[3]      
				);
				buddy.setAnimationByName(0, "IDLE", true);	
				buddy.setToSetupPose();		
				buddy.setSkinByName('glasscombined' + contador);
				if(allProducts.glasses[selectBuy[1]].buy == true){
					for(var pk = 0;pk<=allProducts.glasses.length-1;pk++){
						allProducts.glasses[pk].select = false;
					}
					allProducts.glasses[selectBuy[1]].select = true;
					sendDataGame();	
				}
			}
			glassGroup.visible = true;	

			//MENU PARA PERSONALIZAR EL PELO DEL SPINE 
			hairGroup = game.add.group();
			var xpHair = new Array;
			var textHair = new Array;
			var buttonHair = new Array;
			
			for(var h =1;h<=numHairItems;h++ )
			{	
				buttonsHairItems[h-1] = game.add.graphics(265 * (h-1), game.height/2.3,hairGroup);
				buttonsHairItems[h-1].id = h;
				buttonsHairItems[h-1].beginFill(buttonInactive);
				buttonsHairItems[h-1].lineStyle(5,0xCACACA,1);	
				buttonsHairItems[h-1].drawRect(10, 85, 250, 350); 
				buttonsHairItems[h-1].inputEnabled = true;
				buttonsHairItems[h-1].events.onInputUp.add(ButtonHairItem, this);
				buttonsHairItems[h-1].tint = 0xE0E0E0;	
				buttonsHairItems[h-1] = hairGroup.create(buttonsHairItems[h-1].x+45, buttonsHairItems[h-1].y + 145,"hair" + h);
				
				if(allProducts.hairs[h-1].buy == false){
					xpHair[h-1] = hairGroup.create(buttonsHairItems[h-1].x+20, buttonsHairItems[h-1].y + 120,"xpIcon");
					textHair[h-1] = game.add.text(buttonsHairItems[h-1].x+90, buttonsHairItems[h-1].y+140, allProducts.hairs[h-1].price, stylePrice , hairGroup); 
					buttonHair[h-1] = hairGroup.create(buttonsHairItems[h-1].x+13, buttonsHairItems[h-1].y + 200,"buyButton");	
					buttonHair[h-1].inputEnabled = true;
					buttonHair[h-1].id = h;
					buttonHair[h-1].events.onInputUp.add(buyHairButton, this);
					buttonsHairItems[h-1][3] = hairGroup.create(buttonsHairItems[h-1].x-15, buttonsHairItems[h-1].y + 150,"comprado");	
					buttonsHairItems[h-1][3].scale.setTo(1.5,1.5);
					buttonsHairItems[h-1][3].alpha = 0;
					
				}else{
					buttonsHairItems[h-1][3] = hairGroup.create(buttonsHairItems[h-1].x-15, buttonsHairItems[h-1].y + 150,"comprado");	
					buttonsHairItems[h-1][3].scale.setTo(1.5,1.5);
				}
			}

			function buyHairButton(hairItem){
				showWindowBuy();
				contador++
				skinTable[1] = hairItem.id;
				if(hairStarIcon != undefined){
					hairStarIcon.destroy();
				}
				hairStarIcon = hairGroup.create(buttonsHairItems[hairItem.id-1].x - 35 , buttonsHairItems[hairItem.id-1].y-63,"starIcon");
				selectBuy[0] = 2;
				selectBuy[1] = hairItem.id - 1;
				newHair = buddy.createCombinedSkin(
				   'hairCombined' + contador,    
				   'glasses' + skinTable[0],        
				   'hair' +  skinTable[1],
				   'skin' + skinTable[2],
				   'torso' + skinTable[3]      
				);		
				buddy.setAnimationByName(0, "IDLE", true);	
				buddy.setToSetupPose();		
				buddy.setSkinByName('hairCombined' + contador);			
			}		

			function ButtonHairItem(hairItem){
				contador++
				skinTable[1] = hairItem.id;
				if(hairStarIcon != undefined){
					hairStarIcon.destroy();
				}
				hairStarIcon = hairGroup.create(buttonsHairItems[hairItem.id-1].x - 35 , buttonsHairItems[hairItem.id-1].y-63,"starIcon");
				selectBuy[0] = 2;
				selectBuy[1] = hairItem.id-1;
				newHair = buddy.createCombinedSkin(
				   'hairCombined' + contador,    
				   'glasses' + skinTable[0],        
				   'hair' +  skinTable[1],
				   'skin' + skinTable[2],
				   'torso' + skinTable[3]      
				);			
				buddy.setAnimationByName(0, "IDLE", true);	
				buddy.setToSetupPose();		
				buddy.setSkinByName('hairCombined' + contador);	

				if(allProducts.hairs[selectBuy[1]].buy == true){
					for(var p = 0;p<=allProducts.hairs.length-1;p++){
						allProducts.hairs[p].select = false;
					}
					allProducts.hairs[selectBuy[1]].select = true;
					sendDataGame();	
				}
			}
			hairGroup.visible = false;

			//MENU PARA PERSONALIZAR EL COLOR DEL SPINE 
			skinGroup = game.add.group();
			for(var r =1;r<=numColorsItems;r++ )
			{
				buttonsSkinItems[r-1] = game.add.graphics(265 * (r-1), game.height/2.3,skinGroup);
				buttonsSkinItems[r-1].id = r;
				buttonsSkinItems[r-1].beginFill(buttonInactive);
				buttonsSkinItems[r-1].lineStyle(5,0xCACACA,1);	
				buttonsSkinItems[r-1].drawRect(10, 85, 250, 350); 
				buttonsSkinItems[r-1].inputEnabled = true;
				buttonsSkinItems[r-1].events.onInputUp.add(ButtonSkinItem, this);
				buttonsSkinItems[r-1].tint = 0xE0E0E0;	
				buttonsSkinItems[r-1] = skinGroup.create(buttonsSkinItems[r-1].x+75, buttonsSkinItems[r-1].y + 125,"skin" + r);	

				if(allProducts.colors[r-1].buy == false){
					buttonsSkinItems[r-1][0] = skinGroup.create(buttonsSkinItems[r-1].x-20, buttonsSkinItems[r-1].y + 150,"xpIcon");
					buttonsSkinItems[r-1][1] = game.add.text(buttonsSkinItems[r-1].x+50, buttonsSkinItems[r-1].y+170, allProducts.colors[r-1].price, stylePrice , skinGroup); 
					buttonsSkinItems[r-1][2] = skinGroup.create(buttonsSkinItems[r-1].x-20, buttonsSkinItems[r-1].y+230,"buyButton");	
					buttonsSkinItems[r-1][2].inputEnabled = true;
					buttonsSkinItems[r-1][2].id = r;
					buttonsSkinItems[r-1][2].events.onInputUp.add(buySkinButton, this);
					buttonsSkinItems[r-1][3] = skinGroup.create(buttonsSkinItems[r-1].x-45, buttonsSkinItems[r-1].y + 170,"comprado");	
					buttonsSkinItems[r-1][3].scale.setTo(1.5,1.5);
					buttonsSkinItems[r-1][3].alpha = 0;
					
				}else{
					buttonsSkinItems[r-1][3] = skinGroup.create(buttonsSkinItems[r-1].x-45, buttonsSkinItems[r-1].y + 170,"comprado");	
					buttonsSkinItems[r-1][3].scale.setTo(1.5,1.5);
				}

			}


			function buySkinButton(skinItem){
				showWindowBuy();
				contador++
				skinTable[2] = skinItem.id;

				if(skinStarIcon != undefined){
					skinStarIcon.destroy();
				}
				selectBuy[0] = 3;
				selectBuy[1] = skinItem.id-1;
				skinStarIcon = skinGroup.create(buttonsSkinItems[skinItem.id-1].x - 65 , buttonsSkinItems[skinItem.id-1].y-40,"starIcon")
			 newSkin = buddy.createCombinedSkin(
				   'skinCombined' + contador,    
				   'glasses' + skinTable[0],        
				   'hair' +  skinTable[1],
				   'skin' + skinTable[2],
				   'torso' + skinTable[3]      
				);			


				buddy.setAnimationByName(0, "IDLE", true);	
				buddy.setToSetupPose();		
				buddy.setSkinByName('skinCombined' + contador);	
			}



			function ButtonSkinItem(skinItem){
				contador++
				skinTable[2] = skinItem.id;

				if(skinStarIcon != undefined){
					skinStarIcon.destroy();
				}
				selectBuy[0] = 3;
				selectBuy[1] = skinItem.id-1;
				skinStarIcon = skinGroup.create(buttonsSkinItems[skinItem.id-1].x - 65 , buttonsSkinItems[skinItem.id-1].y-40,"starIcon")
				newSkin = buddy.createCombinedSkin(
				   'skinCombined' + contador,    
				   'glasses' + skinTable[0],        
				   'hair' +  skinTable[1],
				   'skin' + skinTable[2],
				   'torso' + skinTable[3]      
				);			


				buddy.setAnimationByName(0, "IDLE", true);	
				buddy.setToSetupPose();		
				buddy.setSkinByName('skinCombined' + contador);	

				if(allProducts.colors[selectBuy[1]].buy == true){
					for(var p = 0;p<=allProducts.colors.length-1;p++){
						allProducts.colors[p].select = false;
					}
					allProducts.colors[selectBuy[1]].select = true;
					sendDataGame();	
				}
			}

			skinGroup.visible = false;			

			//MENU PARA PERSONALIZAR EL SHORT DEL SPINE 

			shortGroup = game.add.group();

			for(var r =1;r<=numShortItems;r++ )
			{
				buttonsShortItems[r-1] = game.add.graphics(265 * (r-1), game.height/2.3,shortGroup);
				buttonsShortItems[r-1].id = r;
				buttonsShortItems[r-1].beginFill(buttonInactive);
				buttonsShortItems[r-1].lineStyle(5,0xCACACA,1);	
				buttonsShortItems[r-1].drawRect(10, 85, 250, 350); 
				buttonsShortItems[r-1].inputEnabled = true;
				buttonsShortItems[r-1].events.onInputUp.add(ButtonShortItem, this);
				buttonsShortItems[r-1].tint = 0xE0E0E0;	
				buttonsShortItems[r-1] = shortGroup.create(buttonsShortItems[r-1].x+45, buttonsShortItems[r-1].y + 150,"short" + r);	
				if(allProducts.shorts[r-1].buy == false){
					buttonsShortItems[r-1][0] = shortGroup.create(buttonsShortItems[r-1].x+10, buttonsShortItems[r-1].y + 100,"xpIcon");
					buttonsShortItems[r-1][1] = game.add.text(buttonsShortItems[r-1].x+80, buttonsShortItems[r-1].y+120, allProducts.shorts[r-1].price, stylePrice , shortGroup); 
					buttonsShortItems[r-1][2] = shortGroup.create(buttonsShortItems[r-1].x+10, buttonsShortItems[r-1].y+180,"buyButton");	
					buttonsShortItems[r-1][2].inputEnabled = true;
					buttonsShortItems[r-1][2].id = r;
					buttonsShortItems[r-1][2].events.onInputUp.add(buyShortButton, this);
					buttonsShortItems[r-1][3] = shortGroup.create(buttonsShortItems[r-1].x-15, buttonsShortItems[r-1].y + 110,"comprado");	
					buttonsShortItems[r-1][3].scale.setTo(1.5,1.5);
					buttonsShortItems[r-1][3].alpha = 0;
					
				}else{
					buttonsShortItems[r-1][3] = shortGroup.create(buttonsShortItems[r-1].x-15, buttonsShortItems[r-1].y + 110,"comprado");	
					buttonsShortItems[r-1][3].scale.setTo(1.5,1.5);
				}			
			}

			function buyShortButton(shortItem){
				showWindowBuy();
				contador++
				skinTable[3] = shortItem.id;

				if(shortStarIcon != undefined){
					shortStarIcon.destroy();
				}
				selectBuy[0] = 4;
				selectBuy[1] = shortItem.id-1;
				shortStarIcon = shortGroup.create(buttonsShortItems[shortItem.id-1].x - 33 , buttonsShortItems[shortItem.id-1].y-65,"starIcon")
			 var newSkin = buddy.createCombinedSkin(
				   'shortCombined' + contador,    
				   'glasses' + skinTable[0],        
				   'hair' +  skinTable[1],
				   'skin' + skinTable[2],
				   'torso' + skinTable[3]      
				);			


				buddy.setAnimationByName(0, "IDLE", true);	
				buddy.setToSetupPose();		
				buddy.setSkinByName('shortCombined' + contador);
			}		


			function ButtonShortItem(shortItem){
				contador++
				skinTable[3] = shortItem.id;

				if(shortStarIcon != undefined){
					shortStarIcon.destroy();
				}
				selectBuy[0] = 4;
				selectBuy[1] = shortItem.id-1;
				shortStarIcon = shortGroup.create(buttonsShortItems[shortItem.id-1].x - 33 , buttonsShortItems[shortItem.id-1].y-65,"starIcon")
			 var newSkin = buddy.createCombinedSkin(
				   'shortCombined' + contador,    
				   'glasses' + skinTable[0],        
				   'hair' +  skinTable[1],
				   'skin' + skinTable[2],
				   'torso' + skinTable[3]      
				);			


				buddy.setAnimationByName(0, "IDLE", true);	
				buddy.setToSetupPose();		
				buddy.setSkinByName('shortCombined' + contador);

				if(allProducts.shorts[selectBuy[1]].buy == true){
					for(var p = 0;p<=allProducts.shorts.length-1;p++){
						allProducts.shorts[p].select = false;
					}
					allProducts.shorts[selectBuy[1]].select = true;
					sendDataGame();	
				}

			}

			shortGroup.visible = false;	


			//MENU PARA PERSONALIZAR EL FONDO 

			bgGroup = game.add.group();

			for(var r =1;r<=numbgItems;r++ )
			{
				buttonsbgItems[r-1] = game.add.graphics(265 * (r-1), game.height/2.3,bgGroup);
				buttonsbgItems[r-1].id = r;
				buttonsbgItems[r-1].beginFill(buttonInactive);
				buttonsbgItems[r-1].lineStyle(5,0xCACACA,1);	
				buttonsbgItems[r-1].drawRect(10, 85, 250, 350); 
				buttonsbgItems[r-1].inputEnabled = true;
				buttonsbgItems[r-1].events.onInputUp.add(ButtonbgItem, this);
				buttonsbgItems[r-1].tint = 0xE0E0E0;	
				buttonsbgItems[r-1] = bgGroup.create(buttonsbgItems[r-1].x+38, buttonsSkinItems[r-1].y ,"thumbbg" + r);	

				if(allProducts.bgs[r-1].buy == false){
					buttonsbgItems[r-1][0] = bgGroup.create(buttonsbgItems[r-1].x+20, buttonsbgItems[r-1].y + 155,"xpIcon");
					buttonsbgItems[r-1][1] = game.add.text(buttonsbgItems[r-1].x+90, buttonsbgItems[r-1].y+172, allProducts.bgs[r-1].price, stylePrice , bgGroup); 
					buttonsbgItems[r-1][2] = bgGroup.create(buttonsbgItems[r-1].x+20, buttonsbgItems[r-1].y + 235,"buyButton");
					buttonsbgItems[r-1][2].inputEnabled = true;
					buttonsbgItems[r-1][2].id = r;
					buttonsbgItems[r-1][2].events.onInputUp.add(buyBgButton, this);
					buttonsbgItems[r-1][3] = bgGroup.create(buttonsbgItems[r-1].x-10, buttonsbgItems[r-1].y + 160,"comprado");
					buttonsbgItems[r-1][3].scale.setTo(1.5,1.5);
					buttonsbgItems[r-1][3].alpha = 0;
					
				}else{
					buttonsbgItems[r-1][3] = bgGroup.create(buttonsbgItems[r-1].x-10, buttonsbgItems[r-1].y + 160,"comprado");
					buttonsbgItems[r-1][3].scale.setTo(1.5,1.5);
				}


			}

			function buyBgButton(bgItem){
				showWindowBuy();
				contador++
				skinTable[4] = bgItem.id;

				if(bgStarIcon != undefined){
					bgStarIcon.destroy();
				}
				selectBuy[0] = 5;
				selectBuy[1] = bgItem.id-1;
				//(bgSpine.x - bgSpine.x + bgSpine.width) * [p-1]
				TweenMax.to(groupBgSpine,1,{x:100 - [bgSpine.width ] * [bgItem.id-1] });
				bgStarIcon = bgGroup.create(buttonsbgItems[bgItem.id-1].x - 30 , buttonsbgItems[bgItem.id-1].y-42,"starIcon");
			}			

			function ButtonbgItem(bgItem){
				contador++
				skinTable[4] = bgItem.id;

				if(bgStarIcon != undefined){
					bgStarIcon.destroy();
				}
				selectBuy[0] = 5;
				selectBuy[1] = bgItem.id-1;
				TweenMax.to(groupBgSpine,1,{x:100 - [bgSpine.width ] * [bgItem.id-1] });
				bgStarIcon = bgGroup.create(buttonsbgItems[bgItem.id-1].x - 30 , buttonsbgItems[bgItem.id-1].y-42,"starIcon");

				if(allProducts.bgs[selectBuy[1]].buy == true){
					for(var p = 0;p<=allProducts.bgs.length-1;p++){
						allProducts.bgs[p].select = false;
					}
					allProducts.bgs[selectBuy[1]].select = true;
					sendDataGame();	
				}			

			}		
			bgGroup.visible = false;			

			function showWindowBuy(){
				$(".windowPopBuy").show();
				$(".popBuy").show();
				$(".noMoneyWindow").hide();
			}		

			function noMoney(){
				$(".windowPopBuy").hide();
				$(".noMoneyWindow").show();
			}

			$("#cancelBuy").click(function(){
				$(".popBuy").hide();
			});	

			$("#acceptBuy").click(function(){

				var totalCoins = getCoins;

				switch(selectBuy[0]){
					case 1:
					var selectPriceProduct = parseInt(allProducts.glasses[selectBuy[1]].price);

					if(totalCoins >= selectPriceProduct){
						textCoinsBanner.setText(totalCoins = totalCoins - selectPriceProduct);
						buttonsGlassItems[selectBuy[1]][0].visible=false;
						buttonsGlassItems[selectBuy[1]][1].visible=false;
						buttonsGlassItems[selectBuy[1]][2].visible=false;
						buttonsGlassItems[selectBuy[1]][3].alpha = 1;
						buddy.setSkinByName('glasscombined' + contador);		
						buddy.setToSetupPose();
						buddy.setAnimationByName(0, "IDLE", true);	

						for(var pk = 0;pk<=allProducts.glasses.length-1;pk++){
							allProducts.glasses[pk].select = false;
						}

						allProducts.glasses[selectBuy[1]].buy = true;
						allProducts.glasses[selectBuy[1]].select = true;
						sendDataGame();
						sentToServer(totalCoins);
					}else{
						noMoney();
					}
					break;

					case 2:
					var selectPriceHairProduct = parseInt(allProducts.hairs[selectBuy[1]].price);

						if(totalCoins >= selectPriceHairProduct){

						textCoinsBanner.setText(totalCoins = totalCoins - selectPriceHairProduct);		
						xpHair[selectBuy[1]].visible = false;
						textHair[selectBuy[1]].visible = false;
						buttonHair[selectBuy[1]].visible = false;	
						buttonsHairItems[selectBuy[1]][3].alpha = 1;	
						buddy.setSkinByName('haircombined' + contador);		
						buddy.setToSetupPose();
						buddy.setAnimationByName(0, "IDLE", true);	
						for(var pk = 0;pk<=allProducts.glasses.length-1;pk++){
							allProducts.hairs[pk].select = false;
						}
						allProducts.hairs[selectBuy[1]].buy = true;
						allProducts.hairs[selectBuy[1]].select = true;	

						sendDataGame();	
						sentToServer(totalCoins);
					}else{
						noMoney();
					}
					break;

					case 3:
					var selectPriceColorProduct = parseInt(allProducts.colors[selectBuy[1]].price);

						if(totalCoins >= selectPriceColorProduct){

						textCoinsBanner.setText(totalCoins = totalCoins - selectPriceColorProduct);		
						buttonsSkinItems[selectBuy[1]][0].visible = false;
						buttonsSkinItems[selectBuy[1]][1].visible = false;
						buttonsSkinItems[selectBuy[1]][2].visible = false;	
						buttonsSkinItems[selectBuy[1]][3].alpha = 1;	
						buddy.setSkinByName('haircombined' + contador);		
						buddy.setToSetupPose();
						buddy.setAnimationByName(0, "IDLE", true);	
						for(var pk = 0;pk<=allProducts.colors.length-1;pk++){
							allProducts.colors[pk].select = false;
						}
						allProducts.colors[selectBuy[1]].buy = true;
						allProducts.colors[selectBuy[1]].select = true;	

						sendDataGame();	
						sentToServer(totalCoins);
					}else{
						noMoney();
					}
					break;

					case 4:
					var selectPriceShortProduct = parseInt(allProducts.shorts[selectBuy[1]].price);

						if(totalCoins >= selectPriceShortProduct){

						textCoinsBanner.setText(totalCoins = totalCoins - selectPriceShortProduct);		
						buttonsShortItems[selectBuy[1]][0].visible = false;
						buttonsShortItems[selectBuy[1]][1].visible = false;
						buttonsShortItems[selectBuy[1]][2].visible = false;	
						buttonsShortItems[selectBuy[1]][3].alpha = 1;		
						buddy.setSkinByName('haircombined' + contador);		
						buddy.setToSetupPose();
						buddy.setAnimationByName(0, "IDLE", true);	
						for(var pk = 0;pk<=allProducts.shorts.length-1;pk++){
							allProducts.shorts[pk].select = false;
						}
						allProducts.shorts[selectBuy[1]].buy = true;
						allProducts.shorts[selectBuy[1]].select = true;	

						sendDataGame();	
						sentToServer(totalCoins);
					}else{
						noMoney();
					}
					break;	

					case 5:
					var selectPriceBgProduct = parseInt(allProducts.bgs[selectBuy[1]].price);

						if(totalCoins >= selectPriceBgProduct){

						textCoinsBanner.setText(totalCoins = totalCoins - selectPriceBgProduct);		
						buttonsbgItems[selectBuy[1]][0].visible = false;
						buttonsbgItems[selectBuy[1]][1].visible = false;
						buttonsbgItems[selectBuy[1]][2].visible = false;
						buttonsbgItems[selectBuy[1]][3].alpha = 1;	
						buddy.setSkinByName('haircombined' + contador);		
						buddy.setToSetupPose();
						buddy.setAnimationByName(0, "IDLE", true);	
						for(var pk = 0;pk<=allProducts.bgs.length-1;pk++){
							allProducts.bgs[pk].select = false;
						}
						allProducts.bgs[selectBuy[1]].buy = true;
						allProducts.bgs[selectBuy[1]].select = true;	

						sendDataGame();	
						sentToServer(totalCoins);
					}else{
						noMoney();
					}
					break;

				}		
				$(".popBuy").hide();
			});

			$(".popBuy").hide();
			
			
			
			
			readyGroup = glassGroup;
		
  this.swipe = new Swipe(this.game);
  
	
		}
	
		function update() {
			
			  // in update
  var direction = this.swipe.check();
  if (direction!==null) {
    // direction= { x: x, y: y, direction: direction }
    switch(direction.direction) {
       case this.swipe.DIRECTION_LEFT: 
			if(readyGroup.x >= - (readyGroup.width - game.width - 20)){
		TweenMax.to(readyGroup,1,{x:readyGroup.x-game.width/2,ease:Back.easeOut});
			}
			break;// do something
       case this.swipe.DIRECTION_RIGHT:
			if(readyGroup.x <=  -20){
				TweenMax.to(readyGroup,1,{x:readyGroup.x+game.width/2,ease:Back.easeOut});
			}
			break;
    }
  }
			
			
		}
	
	
		return {
			assets: assets,
			name: "animation",
			update:update,
			create: createScene,
			preload: preload,
		}

}()