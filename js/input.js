	const KEY_SPACE=32;
	let keyHeld_Jump= false;

	function keyPressed(e) {
		if (e.keyCode ===KEY_SPACE){
			keyHeld_Jump=true;
		}
	}
	function keyReleased(e) {
		if (e.keyCode ===KEY_SPACE){
			keyHeld_Jump=false;
		}
	}

	function setupInput() {
				document.addEventListener('keydown', keyPressed);
				document.addEventListener('keyup', keyReleased);
	}

