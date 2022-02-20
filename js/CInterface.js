function CInterface(){

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oButExit;
    var _oButLeft;
    var _oButRight;
    var _oButHelp;
    var _oGUIExpandible;
    var _oContainerPause;
    var _oContainerTime;
    var _oContainerScore;
    var _oContainerBestScore;
    var _oRollingScore;
    var _oTextTime;
    var _oTextScore;
    var _oTextBestScore;
    var _oHitAreaLeft;
    var _oHitAreaLeftListenerDown;
    var _oHitAreaLeftListenerUp;
    var _oHitAreaRight;
    var _oHitAreaRightListenerDown;
    var _oHitAreaRightListenerUp;
    


    var _pStartPosScore;
    var _pStartPosBestScore;
    var _pStartPosTime;
    var _pStartPosLeft;
    var _pStartPosRight;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    
    this._init = function(){
        
        _oContainerPause = new createjs.Container();
        _oContainerPause.visible = false;
        s_oStage.addChild(_oContainerPause);

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oFade.alpha = 0.5;
        _oContainerPause.addChild(oFade);

        var oTextPause = new createjs.Text(TEXT_PAUSE,"120px "+FONT, "#fff");
        oTextPause.textAlign = "center";
        oTextPause.textBaseline = "alphabetic";
        oTextPause.x = CANVAS_WIDTH/2;
        oTextPause.y = CANVAS_HEIGHT/2;
        _oContainerPause.addChild(oTextPause);
        
        if(!s_bMobile) {
            //KEY LISTENER
            document.onkeydown   = s_oGame.onKeyDown;
            document.onkeyup   = s_oGame.onKeyUp;
        }else{
            var oSpriteLeft = s_oSpriteLibrary.getSprite("but_left");
            _pStartPosLeft = {x:oSpriteLeft.width/2 + 50,y:CANVAS_HEIGHT-oSpriteLeft.height/2 -20};
            _oButLeft = new CGfxButton(_pStartPosLeft.x,_pStartPosLeft.y,oSpriteLeft,s_oStage);
            _oButLeft.addEventListener(ON_MOUSE_DOWN,this._onLeftDown,this);
            _oButLeft.addEventListener(ON_MOUSE_UP,this._onLeftUp,this);
            
            var oSpriteRight = s_oSpriteLibrary.getSprite("but_right");
            _pStartPosRight = {x:CANVAS_WIDTH - oSpriteRight.width/2 - 50,y:CANVAS_HEIGHT-oSpriteRight.height/2 -20};
            _oButRight = new CGfxButton(_pStartPosRight.x,_pStartPosRight.y,oSpriteRight,s_oStage);
            _oButRight.addEventListener(ON_MOUSE_DOWN,this._onRightDown,this);
            _oButRight.addEventListener(ON_MOUSE_UP,this._onRightUp,this);

            _oHitAreaLeft = new createjs.Shape();
            _oHitAreaLeft.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(10,0,CANVAS_WIDTH/2-10,CANVAS_HEIGHT);
            s_oStage.addChild(_oHitAreaLeft);
            _oHitAreaLeftListenerDown = _oHitAreaLeft.on("mousedown",_oButLeft.buttonDown);
            _oHitAreaLeftListenerUp = _oHitAreaLeft.on("pressup",_oButLeft.buttonRelease);

            _oHitAreaRight = new createjs.Shape();
            _oHitAreaRight.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(CANVAS_WIDTH/2+10,0,CANVAS_WIDTH/2-10,CANVAS_HEIGHT);
            s_oStage.addChild(_oHitAreaRight);
            _oHitAreaRightListenerDown = _oHitAreaRight.on("mousedown",_oButRight.buttonDown);
            _oHitAreaRightListenerUp = _oHitAreaRight.on("pressup",_oButRight.buttonRelease);
        }
        
        //SCORE CONTAINER
        _pStartPosScore = {x:10,y:10};
        _oContainerScore = new createjs.Container();
        _oContainerScore.x = _pStartPosScore.x;
        _oContainerScore.y = _pStartPosScore.y;
        s_oStage.addChild(_oContainerScore);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("score_panel");
        var oBgScore = createBitmap(oSpriteBg);
        _oContainerScore.addChild(oBgScore);
        
        _oTextScore = new CTLText(_oContainerScore, 
                    100, 24, 200, 54, 
                    54, "left", "#fff", FONT, 1,
                    0, 0,
                    "0",
                    true, true, false,
                    false );

        
        
        //BEST SCORE CONTAINER
        _pStartPosBestScore = {x:10,y:oSpriteBg.height+10};
        _oContainerBestScore = new createjs.Container();
        _oContainerBestScore.x = _pStartPosBestScore.x;
        _oContainerBestScore.y = _pStartPosBestScore.y;
        s_oStage.addChild(_oContainerBestScore);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("best_score_panel");
        var oBgScore = createBitmap(oSpriteBg);
        _oContainerBestScore.addChild(oBgScore);
        
        _oTextBestScore = new CTLText(_oContainerBestScore, 
                    100, 24, 200, 54, 
                    54, "left", "#fff", FONT, 1,
                    0, 0,
                    s_iBestScore.toString(),
                    true, true, false,
                    false 
        );
        
        
        
        //TIME CONTAINER
        _pStartPosTime = {x:10,y:_oContainerBestScore.y + oSpriteBg.height};
        _oContainerTime = new createjs.Container();
        _oContainerTime.x = _pStartPosTime.x;
        _oContainerTime.y = _pStartPosTime.y;
        s_oStage.addChild(_oContainerTime);
        
        var oBgTime = createBitmap(s_oSpriteLibrary.getSprite("time_panel"));
        _oContainerTime.addChild(oBgTime);
        
        _oTextTime = new CTLText(_oContainerTime, 
                    100, 19, 200, 64, 
                    64, "center", "#fff", FONT, 1,
                    0, 0,
                    formatTime(TIME_LEVEL),
                    true, true, false,
                    false );

        
        
        
        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)-10, y: (oSprite.height/2)+10 };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _oButExit.getX() - oSprite.width/2 -10, y: (oSprite.height/2)+10 };
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
            
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSprite.width/2 - 10,y:(oSprite.height/2) + 10};
        }else{
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x: _oButExit.getX() - oSprite.width/2 -10, y: (oSprite.height/2)+10 };
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.isEnabled){            
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        } 

        
        _oButHelp = new CGfxButton(100,100,s_oSpriteLibrary.getSprite("but_help"),s_oStage);
        _oButHelp.addEventListener(ON_MOUSE_UP,this._onHelp,this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_settings');
        _oGUIExpandible = new CGUIExpandible(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oGUIExpandible.addButton(_oButExit);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oGUIExpandible.addButton(_oAudioToggle);
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oGUIExpandible.addButton(_oButFullscreen);
        }
        
        _oGUIExpandible.addButton(_oButHelp);
        
        
        
        _oRollingScore = new CRollingScore();
    };
    
    this.unload = function(){
        _oGUIExpandible.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.unload();
        }
        
        if(!s_bMobile) {
            //KEY LISTENER
            document.onkeydown   = null;
            document.onkeyup   = null;
        }else{
            _oButLeft.unload();
            _oButRight.unload();

            _oHitAreaLeft.off("mousedown", _oHitAreaLeftListenerDown);
            _oHitAreaLeft.off("pressup", _oHitAreaLeftListenerUp);

            _oHitAreaRight.off("mousedown", _oHitAreaRightListenerDown);
            _oHitAreaRight.off("pressup", _oHitAreaRightListenerUp);
        }
        
        _oButExit.unload();

        s_oInterface = null;
    };
        
    this.refreshButtonPos = function(){
        _oGUIExpandible.refreshPos();
        
        _oContainerScore.x = _pStartPosScore.x + s_iOffsetX;
        _oContainerScore.y = _pStartPosScore.y + s_iOffsetY;

        _oContainerBestScore.x = _pStartPosBestScore.x + s_iOffsetX;
        _oContainerBestScore.y = _pStartPosBestScore.y + s_iOffsetY;

        if(s_bLandscape){
            _pStartPosTime = {x:10,y:_oContainerBestScore.y + _oContainerBestScore.getBounds().height - s_iOffsetY};
        }else{
            _pStartPosTime = {x:_oContainerScore.getBounds().width + 20,y:_oContainerScore.y};
        }

        _oContainerTime.x = _pStartPosTime.x + s_iOffsetX;
        _oContainerTime.y = _pStartPosTime.y + s_iOffsetY;

        if(s_bMobile){
            _oButLeft.setPosition(_pStartPosLeft.x + s_iOffsetX,_pStartPosLeft.y - s_iOffsetY);
            _oButRight.setPosition(_pStartPosRight.x - s_iOffsetX,_pStartPosRight.y - s_iOffsetY);
        }
    };
    
    this.reset = function(iScore){
        this.refreshTime(TIME_LEVEL);
        this.refreshScore(iScore);
        _oGUIExpandible.reset();
    };

    this.refreshTime = function(iTime){
        _oTextTime.refreshText(formatTime(iTime));
    };
    
    this.refreshScore = function(iScore){
        _oRollingScore.rolling(_oTextScore.getText(), null, iScore);
    };
    
    this.refreshBestScore = function(){
        _oTextBestScore.refreshText(s_iBestScore);
    };
    
    this.onPause = function(){
        if(_oContainerPause.visible == true){
            _oContainerPause.visible = false;
            s_oGame.playAlertTween();
        }else{
            _oContainerPause.visible = true;
            s_oGame.pauseAlertTween();
        }
    };

    this.collapseGUIButtons = function(){
        if(_oGUIExpandible.isExpanded()){
            _oGUIExpandible._onMenu();
            this.onPause();
        }
    };
    
    this.disableGUIExpandible = function(){
        _oGUIExpandible.disable();
    };

    this.enableGUIExpandible = function(){
        _oGUIExpandible.enable();
    };
    
    this._onLeftDown = function(){
        s_oGame.moveLeft(true);
    };
    
    this._onRightDown = function(){
        s_oGame.moveRight(true);
    };
    
    this._onLeftUp = function(){
        s_oGame.moveLeft(false);
    };
    
    this._onRightUp = function(){
        s_oGame.moveRight(false);
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        s_oGame.onExit();
    };
    
    this._onHelp = function(){
        s_oGame.showHelpPanel();
    };

    this.isPaused = function(){
        return _oContainerPause.visible;
    };
    
    this.resetFullscreenBut = function(){
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setActive(s_bFullscreen);
        }
    };
        
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;