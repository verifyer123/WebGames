var charactersEntity = function () {

	var leveling = {
		"startXp": 10,
		"levelXp": 10
	}

	var startXp = leveling.startXp
	var halfLevelXP = leveling.levelXp * 0.5

	function getLevelXP(level){

		if (level < 2 )
			return 0
	else{
			level = level - 1
		}

		return halfLevelXP * (level * level) + halfLevelXP * level + startXp
	}

	function getLevel(currentXp){

		var startXp = leveling.startXp
		var halfXp = leveling.levelXp * 0.5

		var level = 1

		if (currentXp >= (startXp + leveling.levelXp))
			level = (Math.pow(((-4 * halfXp * startXp) + (4 * halfXp * currentXp) + (halfXp * halfXp)), 0.5) + halfXp) / (2 * halfXp)


		return Math.floor(level)
	}

	function preloadCards(scene, playerCards, enemyCards) {
		var imageList = scene.assets.images
		for(var pcardIndex = 0; pcardIndex < playerCards.length; pcardIndex++){
			var name = playerCards[pcardIndex].id
			var path = epicCharacters[name].directory
			path = path.replace(name + ".json", "")
			var file = path + "/card.png"
			imageList.push({name:name + "Card", file:file})
			console.log(name, file)
		}

		for(var ecardIndex = 0; ecardIndex < enemyCards.length; ecardIndex++){
			var name = enemyCards[ecardIndex].id
			var file = epicCharacters[name].directory + "/card.png"
			imageList.push({name:name + "Card", file:file})
		}
	}
	
	function getCard(card) {
		var cardGroup = game.add.group()
		var cardBg = cardGroup.create(0,0, card.id + "Card")
		cardBg.anchor.setTo(0.5, 0.5)

		var fontStyle = {font: "42px VAGRounded", fontWeight: "bold", fill: "#0ca0b7", align: "center"}
		var level = getLevel(card.xp)
		var levelText = game.add.text(-78, -100, level, fontStyle)
		levelText.anchor.setTo(0.5, 0.5)
		cardGroup.add(levelText)

		return cardGroup
	}

	return{
		getLevelXp:getLevelXP,
		getLevel:getLevel,
		preloadCards:preloadCards,
		getCard:getCard
	}
}()