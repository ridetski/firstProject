"use strict";

function Application(canvas) {
    var self = this; 
    this._canvas = canvas;
    var timer;
    var count = 2;
    var startTimer = 1;
    var statusLoad=false;
    
    var levelDb = [];
    var levelBbStorage;
    var stateOnPause;
    var gamerStorage = [];
    
    var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
    var updatePassword;
    var updatePasswordResults;
    
    var levelData;
    var startPosition;
    var diamondsLevel;
    var menuGameData;
    var sortArrayScore;
    
    var textBox=document.getElementById('textBox');
    var textBlock=document.getElementById('textBlock');
    var controlPanel = document.getElementById('controls');
    var gamerName = getName();
    var current = "dataOnPauseRidetski"+gamerName;
    if (window.localStorage[current] !== undefined){
            levelBbStorage = JSON.parse(window.localStorage[current]);
            clearInterval(timer);
            };
    
    loadAllData();
    restoreResults(); 
    
    //alert('Let`s play, ' + gamerName + '! ' + 'Click "START" and join game!');
    
    this._canvas.focus();
    this._context = canvas.getContext("2d");
    this._soundPlayer = new SoundPlayer();
    //this._soundPlayer.play('game');
    this._fontImage = new Image();
    this._spriteImage = new Image();
    this._fontImage.onload = setTimeout(onload,250);
    this._spriteImage.onload = setTimeout(onload,250);
    this._fontImage.src = 'assets/sprite1.gif';
    this._spriteImage.src = 'assets/sprite.gif'; 
        
    this.itemGame=document.getElementById('itemGame');
    this.itemRules=document.getElementById('itemRules');
    this.itemScore=document.getElementById('itemScore');
    this.textBox=document.getElementById('textBox');
    this.startBox=document.getElementById('start');
    this.pauseBox=document.getElementById('pause');
    this.storeBox=document.getElementById('store');
    this.restoreBox=document.getElementById('restore');
    this.endGameBox=document.getElementById('endgame');

    this.itemGame.addEventListener('click',menuUnblock,false);
    this.itemRules.addEventListener('click',menuUnblock,false);
    this.itemScore.addEventListener('click',menuUnblock,false);
    this.textBox.addEventListener('click',menuBlock,false);
    this.startBox.addEventListener('click',startTimerGame,false);
    this.pauseBox.addEventListener('click',pauseTimerGame,false);
    this.storeBox.addEventListener('click',storeInfo,false);
    this.restoreBox.addEventListener('click',restoreInfo,false);
    this.endGameBox.addEventListener('click',endGame,false);
    window.addEventListener('blur',blurGame,false);
    
    function onload() {
        if (--count == 0) {return self.start();}
    };
    function loadAllData() {
      $.ajax({
        url: 'levels.json',
        dataType: 'json',
        success: function (data, textStatus){
        console.log(data);
        levelData = data;
        console.log(textStatus);
        }
    }
    ); 
      $.ajax({
        url: 'startPosition.json',
        dataType: 'json',
        success: function (data, textStatus){
        console.log(data);
        startPosition = data;
        console.log(textStatus);
        }
    }
    );
       $.ajax({
        url: 'diamondsLevel.json',
        dataType: 'json',
        success: function (data, textStatus){
        console.log(data);
        diamondsLevel = data;
        console.log(textStatus);
        }
    }
    );
        $.ajax({
        url: 'menuGame.json',
        dataType: 'json',
        success: function (data, textStatus){
        console.log(data);
        menuGameData = data;
        console.log(textStatus);
        }
    }
    );
   };
    function getName() {
        var name = prompt('vvedite imya');
        if (!name) getName();
        else
        {
        var testName = /[a-zA-Z0-9_]{3,}/.test(name);
        name = /[a-zA-Z0-9_]{3,}/.exec(name);
        console.log(testName, name);
        return name[0];
        };
    };
    function sortResults(scoreTable){
        function compareScore(a,b){
            return a[1] - b[1];
        }
        scoreTable.sort(compareScore);
        scoreTable.reverse();
        console.log(scoreTable);
        return scoreTable;
    };
   
    function startTimerGame(){
        if (startTimer==1){ 
        
            var dataOnPause = window.localStorage[current];
            if (dataOnPause !== undefined){
                
                levelBbStorage = JSON.parse(dataOnPause);
               //window.localStorage.removeItem[current];
                statusLoad = true;
            }
            self._soundPlayer.play('game');
            timer=window.setInterval(function () { return self.interval(); }, 40);  
            startTimer=0;       
        } else {
            return;};
};    
    function pauseTimerGame(){
        clearInterval(timer);
        console.log(stateOnPause);
        window.localStorage.setItem(current,stateOnPause);

        self._soundPlayer.mute('game');
        startTimer=1;
}; 
    function blurGame(){
        clearInterval(timer);
        self._soundPlayer.mute('game');
        startTimer=1;
}; 
    
    function menuUnblock(EO){
        clearInterval(timer);
        self._soundPlayer.mute('game');
        startTimer=1;
        
        var textContent={
        "game": menuGameData[0],
        "rules":menuGameData[1],
        "score": scoreTableMaker()
    };
        
        var divContainer={
            game:"itemGame",
            rules:"itemRules",
            score:"itemScore"
        };
        
        EO=EO||window.event;
        console.log(EO.target.id);
        var div = EO.target.id;
        
        if (div==divContainer.game){var text=textContent.game};
        if (div==divContainer.rules){var text=textContent.rules};
        if (div==divContainer.score){var text=textContent.score};
        textBlock.innerHTML=text;
        textBox.style.width = '98%';
        textBox.style.zIndex = '99';
        textBox.style.height = '100%';
        controlPanel.style.display = 'flex';
};
    function menuBlock(){
        controlPanel.style.display = 'none';
        textBlock.innerHTML="";
        textBox.style.height='0px';
        textBox.style.width ='0px';
        startTimer = true;
}; 
    function endGame(){
        clearInterval(timer);
        self._soundPlayer.mute('game');
        startTimer=1;
        statusLoad=false;
        storeResults();
        sortArrayScore = sortResults(gamerStorage);
        window.localStorage.removeItem(current);
        self.reset();
    };
    
    function storeInfo() {
        clearInterval(timer);
        self._soundPlayer.mute('game');
        startTimer=1;
        stringName='RIDETSKI_DIGGER_TEST'+gamerName;
        updatePassword=Math.random();
        //---------
        //---------
        $.ajax( {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'LOCKGET', n : stringName, p : updatePassword },
            success : lockGetReady, error : errorHandler
                } );
   

    function lockGetReady(callresult) {
        if ( callresult.error!=undefined )
            console.log(callresult.error); 
        else {
            //statusLoad=false;
            $.ajax( {
                    url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                    data : { f : 'UPDATE', n : stringName, v : JSON.stringify(levelDb), p : updatePassword },
                    success : updateReady, error : errorHandler
                }
            );
        }
    }

    function updateReady(callresult) {
        if ( callresult.error!=undefined )
            console.log(callresult.error); 
    }
 };
    function restoreInfo() {
    var stringName='RIDETSKI_DIGGER_TEST'+gamerName;
        $.ajax(
            {
                url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'READ', n : stringName },
                success : readReady, error : errorHandler
            }
        );

    function readReady(callresult) {
        if ( callresult.error!=undefined )
           console.log(callresult.error); 
        else if ( callresult.result!="" ) {
            statusLoad=true;
            levelBbStorage=JSON.parse(callresult.result);
            timer=window.setInterval(function () { return self.interval(); }, 40);  
            //self._soundPlayer.play('game');
            startTimer=0;    
        }
    }
 };
    function storeResults() {
        var stringName='RIDETSKI_DIGGER_TEST';
        var nameStorage = [gamerName, self._score];
        console.log(nameStorage);
        gamerStorage.push(nameStorage);
        updatePasswordResults=Math.random();
        $.ajax( {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'LOCKGET', n : stringName, p : updatePasswordResults },
            success : lockGetReady, error : errorHandler
                } );
    
        function lockGetReady(callresult) {
            if ( callresult.error!=undefined )
                console.log(callresult.error); 
            else {
                $.ajax( {
                url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'UPDATE', n : stringName, v : JSON.stringify(gamerStorage), p : updatePasswordResults },
                success : updateReady, error : errorHandler
                });
        }
    }

        function updateReady(callresult) {
            if ( callresult.error!=undefined )
                console.log(callresult.error); 
    }
    };
    function restoreResults() {
        var stringName='RIDETSKI_DIGGER_TEST';
        $.ajax(
            {
                url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'READ', n : stringName },
                success : readReady, error : errorHandler
            }
        );
    
        function readReady(callresult) {
        if ( callresult.error!=undefined )
           {
            console.log(callresult.error);   
           } 
        else if ( callresult.result!="" ) {
            gamerStorage = JSON.parse(callresult.result);
            console.log(gamerStorage);
            sortArrayScore = sortResults(gamerStorage);
            scoreTableMaker();
        }
    }
    };
    function errorHandler(jqXHR,statusStr,errorStr) {
        console.log(statusStr+' '+errorStr);
    };
    
    function scoreTableMaker(){
        var str;
        str = '<div class="tableBox">';
        str+='<table class="tableScore"><caption>BEST SCORES</caption>';
        for(var i=0;i<20;i++){
            var row = sortArrayScore[i];
            str+='<tr><td>'+row[0]+'</td><td>'+row[1]+'</td></tr>';
        }
        str+='</table></div>';
        return str;
    };
        
    this.start = function () {
        this.drawText(0, 8, "  ROOM:     TIME:        DIAMONDS:      ");
        this.drawText(0, 16, "  LIVES:    SCORE:       COLLECTED:     ");
        this._screen = [];
        for (var x = 0; x < 20; x++) {
        this._screen[x] = [];
        for (var y = 0; y < 14; y++) {
            this._screen[x][y] = 0;
        }
    }
    this._mouseDownHandler = function (e) { self.mouseDown(e); };
    this._touchStartHandler = function (e) { self.touchStart(e); };
    this._touchEndHandler = function (e) { self.touchEnd(e); };
    this._touchMoveHandler = function (e) { self.touchMove(e); };
    this._keyDownHandler = function (e) { self.keyDown(e); };
    this._keyUpHandler = function (e) { self.keyUp(e); };
    this._canvas.addEventListener("touchstart", this._touchStartHandler, false);
    this._canvas.addEventListener("touchmove", this._touchMoveHandler, false);
    this._canvas.addEventListener("touchend", this._touchEndHandler, false);
    this._canvas.addEventListener("mousedown", this._mouseDownHandler, false);
    document.addEventListener("keydown", this._keyDownHandler, false);
    document.addEventListener("keyup", this._keyUpHandler, false);
    this._blink = 0;
    this.reset();
    };
    this.addKey = function (key) {
    if (key < 4) {
        this._keys[key] = true;
    }
    else if (key == Key.reset) {
        this._lives--;
        if (this._lives >= 0) {
            //this._score = 0;
            this.loadLevel();
            
        }
        else {
            storeResults();
            console.log('name: ' + gamerName + '| score: '+ score)
            this.reset();
        }
    }
};
    this.removeKey = function (key) {
    if (key < 4) {
        this._keysRelease[key] = true;
    }
};
    this.reset = function () {
    this._lives = 10;
    this._score = 0;
      
    this._room = 0;
    this.loadLevel();
};
    this.loadLevel = function () {
      
    this._level = new Level(levelData[this._room],startPosition[this._room],diamondsLevel[this._room]);
    this._keys = [false, false, false, false];
    this._keysRelease = [false, false, false, false];
    this._tick = 0;
    this.paint();
};
    this.nextLevel = function () {
    if (this._room < (levelData.length - 1)) {
        this._room++;
        this.loadLevel();
    }
};
    this.isPlayerAlive = function () {
    return (this._level === null) || (this._level.isPlayerAlive());
};
    this.interval = function () {
    this._tick++;
        
    this._blink++;
    if (this._blink == 6) {
        this._blink = 0;
    }
    if ((this._tick % 2) === 0) {
        // keyboard
        for (var i = 0; i < 4; i++) {
            if (this._keysRelease[i]) {
                this._keys[i] = false;
                this._keysRelease[i] = false;
            }
        }
        this._level.update();
        if (this._level.movePlayer(this._keys)) {
            this.nextLevel();
        }
        else {
            this._level.move();
            // play sound
            var soundTable = ["diamond", "stone", "step"];
            for (var i = 0; i < soundTable.length; i++) {
                if (this._level.playSound(i) && this._soundPlayer.play(soundTable[i])) {
                    break;
                }
            }
        }
    }
    this._score += this._level.score;
    this._level.score = 0;
    this.paint();
};
    this.paint = function () {
    if (statusLoad) {
        [
            [this._level.collected,this._level.diamonds,this._level.time,this._level._map],
            [this._level._player.alive,this._level._player.position.x,this._level._player.position.y],
            [this._score,this._lives,this._room]
        ] = levelBbStorage;
        statusLoad = false;
    };    
    var blink = ((this._blink + 4) % 6);
    // update statusbar
    this.drawText(9 * 8, 8, this.formatNumber(this._room + 1, 2));
    this.drawText(9 * 8, 16, this.formatNumber(this._lives, 2));
    this.drawText(19 * 8, 16, this.formatNumber(this._score, 5));
    //   
    this.drawText(19 * 8, 8, this.formatNumber(this._level.time, 5));
    this.drawText(36 * 8, 8, this.formatNumber(this._level.diamonds, 2));
    this.drawText(36 * 8, 16, this.formatNumber(this._level.collected, 2));
    levelDb = [[this._level.collected,this._level.diamonds,this._level.time,this._level._map],
               [this._level._player.alive,this._level._player.position.x,this._level._player.position.y],
               [this._score,this._lives,this._room]];  
    stateOnPause = JSON.stringify(levelDb); 
    //score = this._score;    
    //console.log(stateOnPause);
        
    // paint sprites
    for (var x = 0; x < 20; x++) {
        for (var y = 0; y < 14; y++) {
            var spriteIndex = this._level.getSpriteIndex(x, y, blink);
            
            if (this._screen[x][y] != spriteIndex) {
                this._screen[x][y] = spriteIndex;
                this._context.drawImage(this._spriteImage, spriteIndex * 16 * 2, 0, 16 * 2, 16 * 2, x * 16 * 2, y * (16 * 2) + (32 * 2), 16 * 2, 16 * 2);
            }
        }
    }    
};
    this.drawText = function (x, y, text) {
    for (var i = 0; i < text.length; i++) {
        var index = text.charCodeAt(i) - 32;
        this._context.fillRect(x * 2, y * 2, 16, 16);
        this._context.drawImage(this._fontImage, 0, index * 16, 16, 16, x * 2, y * 2, 16, 16);
        x += 8;
    }
};
    this.formatNumber = function (value, digits) {
    var text = value.toString();
    while (text.length < digits) {
        text = "0" + text;
    }
    return text;
};
    this.keyDown = function (e) {
    if (!e.ctrlKey && !e.altKey && !e.altKey && !e.metaKey) {
        var keyMap = { "37": Key.left, "39": Key.right, "38": Key.up, "40": Key.down, "27": Key.reset };
        if (e.keyCode in keyMap) {
            this.stopEvent(e);
            this.addKey(keyMap[e.keyCode]);
        }
        else if (!this.isPlayerAlive()) {
            this.stopEvent(e);
            this.addKey(Key.reset);
        }
    }
};
    this.keyUp = function (e) {
    var keyMap = { "37": Key.left, "39": Key.right, "38": Key.up, "40": Key.down };
    if (e.keyCode in keyMap) {
        this.stopEvent(e);
        this.removeKey(keyMap[e.keyCode]);
    }
};
    this.mouseDown = function (e) {
    e.preventDefault();
    this._canvas.focus();
};
    this.touchStart = function (e) {
    e.preventDefault();
    if ((e.touches.length > 2) || (!this.isPlayerAlive())) {
        this.addKey(Key.reset);
    }
    else {
        for (var i = 0; i < e.touches.length; i++) {
            this._touchPosition = new Position(e.touches[i].pageX, e.touches[i].pageY);
        }
    }
};
    this.touchMove = function (e) {
    e.preventDefault();
    for (var i = 0; i < e.touches.length; i++) {
        if (this._touchPosition !== null) {
            var x = e.touches[i].pageX;
            var y = e.touches[i].pageY;
            var direction = null;
            if ((this._touchPosition.x - x) > 20) {
                direction = Key.left;
            }
            else if ((this._touchPosition.x - x) < -20) {
                direction = Key.right;
            }
            else if ((this._touchPosition.y - y) > 20) {
                direction = Key.up;
            }
            else if ((this._touchPosition.y - y) < -20) {
                direction = Key.down;
            }
            if (direction !== null) {
                this._touchPosition = new Position(x, y);
                for (var i = Key.left; i <= Key.down; i++) {
                    if (direction == i) {
                        this.addKey(i);
                    }
                    else {
                        this.removeKey(i);
                    }
                }
            }
        }
    }
};
    this.touchEnd = function (e) {
    e.preventDefault();
    this._touchPosition = null;
    this.removeKey(Key.left);
    this.removeKey(Key.right);
    this.removeKey(Key.up);
    this.removeKey(Key.down);
};
    this.stopEvent = function (e) {
    e.preventDefault();
    e.stopPropagation();
};
};  
var Key = {
    "left": 0, "right": 1, "up": 2, "down": 3, "reset": 4
};
var Direction = { 
    "none": 0, "left": 1, "right": 2, "up": 3, "down": 4 
};
var Sprite = {
    "nothing": 0, "stone": 1, "ground": 2, 
    "diamond": 5, "wall": 6, "marker": 8, "player": 10,
     "exit": 12, "buffer": 13, "changer": 14
};
function Level(data,pos,diamonds) {
    this.collected = 0;
    this.time = 5000;
    this.score = 0;
    this._soundPlayer = new SoundPlayer();
    this.mapData = data;
    
    this._map = [];
    
    for (var x = 0; x < 20; x++) {
        this._map[x] = [];
    }
    
    for (var y = 0; y < 14; y++) {
        for (var x = 0; x < 20; x++) {
            this._map[x][y] = this.mapData[x][y];
        }
    }
    
    var position = new Position(pos[0], pos[1]);
    this._player = new Player(position);
    this._map[this._player.position.x][this._player.position.y] = Sprite.player;
    this.diamonds = diamonds;
   
    this.isPlayerAlive = function () {
    return this._player.alive;
};
    this.update = function () {
    // turn buffers into nothing
    for (var y = 13; y >= 0; y--) {
        for (var x = 19; x >= 0; x--) {
            if (this._map[x][y] === Sprite.buffer) {
                this._map[x][y] = Sprite.nothing;
            }
        }
    }
    // reset sound state
    this._soundTable = [false, false, false];
};
    this.playSound = function (sound) {
    return this._soundTable[sound];
};
    this.move = function () {
    // gravity for stones and diamonds
    for (var y = 13; y >= 0; y--) {
        for (var x = 19; x >= 0; x--) {
            if (this._map[x][y] === Sprite.stone || this._map[x][y] === Sprite.diamond) {
                var dx = x;
                var dy = y;
                if (this._map[x][y + 1] === Sprite.nothing) {
                    dy = y + 1;
                }
                else {
                    if (this._map[x][y + 1] === Sprite.stone || this._map[x][y + 1] === Sprite.diamond) {
                        if (this._map[x - 1][y + 1] === Sprite.nothing && this._map[x - 1][y] === Sprite.nothing) {
                            dx = x - 1;
                            dy = y + 1;
                        }
                        else if (this._map[x + 1][y + 1] === Sprite.nothing && this._map[x + 1][y] === Sprite.nothing) {
                            dx = x + 1;
                            dy = y + 1;
                        }
                    }
                    if ((this._map[x][y + 1] === Sprite.changer) && ((this._map[x][y] === Sprite.stone)) && (this._map[x][y + 2] === Sprite.nothing)) {
                        dy = y + 2;
                    }
                }
                if (dx != x || dy != y) {
                    this._map[dx][dy] = Sprite.marker;
                }
            }
        }
    }
    for (var y = 13; y >= 0; y--) {
        for (var x = 19; x >= 0; x--) {
            if (this._map[x][y] === Sprite.stone || this._map[x][y] === Sprite.diamond) {
                var dx = x;
                var dy = y;
                if (this._map[x][y + 1] === Sprite.marker) {
                    dy = y + 1;
                }
                else {
                    if ((this._map[x][y + 1] === Sprite.stone) || (this._map[x][y + 1] === Sprite.diamond) || (this._map[x][y + 1] === Sprite.nothing)) {
                        if ((this._map[x - 1][y + 1] === Sprite.marker) && ((this._map[x - 1][y] === Sprite.nothing) || (this._map[x - 1][y] === Sprite.marker))) {
                            dx = x - 1;
                            dy = y + 1;
                        }
                        else if ((this._map[x + 1][y + 1] === Sprite.marker) && ((this._map[x + 1][y] === Sprite.nothing) || (this._map[x + 1][y] === Sprite.marker))) {
                            dx = x + 1;
                            dy = y + 1;
                        }
                    }
                    if ((this._map[x][y + 1] === Sprite.changer) && ((this._map[x][y] === Sprite.stone)) && (this._map[x][y + 2] === Sprite.marker)) {
                        dy = y + 2;
                    }
                }
                if (dx != x || dy != y) {
                    if ((dy - y) === 2) {
                        this._map[dx][dy] = Sprite.diamond;
                    }
                    else {
                        this._map[dx][dy] = this._map[x][y];
                    }
                    this._map[x][y] = Sprite.nothing;
                    if (this._map[dx][dy + 1] === Sprite.stone || this._map[dx][dy + 1] === Sprite.diamond || this._map[dx][dy + 1] === Sprite.wall) {
                        this._soundTable[Sound.stone] = true;
                    }
                    if (this.isPlayer(dx, dy + 1)) {
                        this._player.kill();
                        console.log(score);
                        this._soundPlayer.play('dead');
                    }
                    
                }
            }
        }
    }
    
    if (this.time > 0) {
        this.time--;
    }
    if (this.time === 0) {
        this._player.kill();
        console.log(score);
        this._soundPlayer.play('dead');
        
    } 
};
    this.movePlayer = function (keys) {
    if (this._player.alive) {
        this._player.direction = Direction.none;
        var p = this._player.position.clone();
        var d = p.clone();
        var z = d.clone();
        if (keys[Key.left]) {
            z.x--;
            this._player.direction = Direction.left;
        }
        else {
            this._player.stone[0] = false;
            if (keys[Key.right]) {
                z.x++;
                this._player.direction = Direction.right;
            }
            else {
                this._player.stone[1] = false;
                if (keys[Key.up]) {
                    z.y--;
                    this._player.direction = Direction.up;
                }
                else if (keys[Key.down]) {
                    z.y++;
                    this._player.direction = Direction.down;
                }
            }
        }
        if (!d.equals(z)) {
            if (this._map[z.x][z.y] === Sprite.nothing) {
                this.placePlayer(d.x, d.y);
            }
            if (this._map[z.x][z.y] === Sprite.diamond) {
                this.collected += 1;
                this.score += 3;
                this._soundTable[Sound.diamond] = true;//----------------------
            }
            if (this._map[z.x][z.y] === Sprite.stone) {
                if ((z.x > d.x) && (this._map[z.x + 1][z.y] === Sprite.nothing)) {
                    if (this._player.stone[1]) {
                        this._map[d.x + 2][d.y] = this._map[d.x + 1][d.y];
                        this._map[d.x + 1][d.y] = Sprite.nothing;
                    }
                    this._player.stone[1] = !this._player.stone[1];
                }
                if ((z.x < d.x) && (this._map[z.x - 1][z.y] === Sprite.nothing)) {
                    if (this._player.stone[0]) {
                        this._map[d.x - 2][d.y] = this._map[d.x - 1][d.y];
                        this._map[d.x - 1][d.y] = Sprite.nothing;
                    }
                    this._player.stone[0] = !this._player.stone[0];
                }
            }
            if (this._map[z.x][z.y] === Sprite.nothing || this._map[z.x][z.y] === Sprite.ground || this._map[z.x][z.y] === Sprite.diamond) {
                this.placePlayer(z.x, z.y);
                this._map[d.x][d.y] = Sprite.buffer;
                this._soundTable[Sound.step] = true;//-------------------------
            }
            if (this._map[z.x][z.y] === Sprite.exit) {
                if (this.collected >= this.diamonds) {
                    return true; // next level
                }
            }
         }
        // animate player
        this._player.animate();
    }
    return false;
};
    this.isPlayer = function (x, y) {
    return (this._map[x][y] === Sprite.player);
};
    this.placePlayer = function (x, y) {
    this._map[x][y] = Sprite.player;
    this._player.position.x = x;
    this._player.position.y = y;
};
    this.getSpriteIndex = function (x, y, blink) {
    switch (this._map[x][y]) {
        case Sprite.nothing:
        case Sprite.buffer:
        case Sprite.marker:
            return 0;
        case Sprite.stone:
            return 1;
        case Sprite.ground:
            return 2;
        case Sprite.diamond:
            return 13 - ((blink + 4) % 6);
        case Sprite.wall:
            return 14;
        case Sprite.exit:
            return 32;
        case Sprite.changer:
            return 33;
        case Sprite.player:
            if (x == this._player.position.x && y == this._player.position.y) {
                return this._player.getImageIndex();
            }
            return 15;
    }
};
};
function Player(position) {
    this._direction = Direction.none;
    this.stone = [false, false];
    this.step = 0;
    this.alive = true;
    this.position = position;

    this.kill = function () {   
    this.alive = false;
};
    this.animate = function () {
    this.step++;
    var max = 30;
    if (this.direction == Direction.left || this.direction == Direction.right) {
        max = 6;
    }
    if (this.direction == Direction.up || this.direction == Direction.down) {
        max = 2;
    }
    this.step = (this.step >= max) ? 0 : this.step;
};
    this.getImageIndex = function () {
    if (!this.alive) {
        return 31;
    }
    else if (this.direction === Direction.left && this.step < 6) {
        return [16, 17, 18, 19, 18, 17][this.step];
    }
    else if (this.direction === Direction.right && this.step < 6) {
        return [20, 21, 22, 23, 22, 21][this.step];
    }
    else if (this.direction === Direction.up && this.step < 2) {
        return [24, 25][this.step];
    }
    else if (this.direction === Direction.down && this.step < 2) {
        return [26, 27][this.step];
    }
    return [15, 15, 15, 15, 15, 15, 15, 15, 28, 28, 15, 15, 28, 28, 15, 15, 15, 15, 15, 15, 29, 29, 30, 30, 29, 29, 15, 15, 15, 15][this.step];
};
};
function Position(x, y) {
    this.x = x;
    this.y = y;

    this.equals = function (position) {
    return (this.x == position.x && this.y == position.y);
    };
    
    this.clone = function () {
    return new Position(this.x, this.y);
};
    };
var Sound = {
    "diamond": 0, "stone": 1, "step": 2
};
function SoundPlayer() {
    this._soundTable = {};
    var soundTable = this._soundTable;
    var diamondSound = document.getElementById('diamond');
    var stoneSound = document.getElementById('stone');
    var stepSound = document.getElementById('step');
    var gameSound = document.getElementById('game');
    var deadSound = document.getElementById('dead');
    soundTable['diamond'] = diamondSound;
    soundTable['stone'] = stoneSound;
    soundTable['step'] = stepSound;
    soundTable['game'] = gameSound;
    soundTable['dead'] = deadSound;
    

    this.play = function (name) {
        var sound = this._soundTable[name];
        if (sound) {
            sound.play();
            return true;
        }
        return false;
    }
    
    this.mute = function (name) {
        var sound = this._soundTable[name];
        sound.pause();
    }
};