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

	return{
		getLevelXp:getLevelXP,
		getLevel:getLevel
	}
}()