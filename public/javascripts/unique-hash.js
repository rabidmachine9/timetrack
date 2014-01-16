var uniqueHash = function(num){
	var chars = 'abcdef1234567890';

	var length = chars.length;
	var hash = '';
	var index = 0;
	for(;index<num;index++){
		var randomNumber = Math.round(Math.random()*(length-1));
		var randomCharacter = chars[randomNumber];
		hash += randomCharacter;
	}

	return hash;
}


