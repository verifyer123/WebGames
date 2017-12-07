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

	function preloadCards(scene, cards) {
		var imageList = scene.assets.images
		for(var pcardIndex = 0; pcardIndex < cards.length; pcardIndex++){
			var name = cards[pcardIndex].id
			console.log(name, "playerCard")
			var path = cards[pcardIndex].data.directory
			var yogotarReplace = name.replace("yogotar", "")
			yogotarReplace = yogotarReplace.charAt(0).toLowerCase() + yogotarReplace.slice(1)
			console.log(yogotarReplace)
			path = path.replace(".json", "")
			path = path.replace("/" + yogotarReplace, "")
			var file = path + "/card.png"
			imageList.push({name:name + "Card", file:file})
		}
	}
	
	function getCard(card) {
		var cardGroup = game.add.group()
		var cardBg = cardGroup.create(0,0, "atlas.cards", "t_" + card.data.stats.element)
		cardBg.anchor.setTo(0.5, 0.5)

		var cardImage = cardGroup.create(0,0, card.id + "Card")
		cardImage.anchor.setTo(0.5, 0.5)
		cardImage.scale.setTo(0.8, 0.8)
		cardImage.scale.x = card.data.visuals.cardFacing === "right" ? cardImage.scale.x * 1 : cardImage.scale.x * -1

		var star = cardGroup.create(-78, -120, "atlas.cards", "star")
		star.anchor.setTo(0.5, 0.5)
		star.scale.setTo(0.8, 0.8)

		var element = cardGroup.create((-256 + 55) * 0.5, (310 -20) * 0.5, "atlas.cards", "e_" + card.data.stats.element)
		element.anchor.setTo(0, 1)
		element.scale.setTo(0.6, 0.6)

		var fontStyle = {font: "42px VAGRounded", fontWeight: "bold", fill: "#15119b", align: "center"}
		var level = getLevel(card.xp)
		var levelText = game.add.text(star.x, star.y + 5, level, fontStyle)
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