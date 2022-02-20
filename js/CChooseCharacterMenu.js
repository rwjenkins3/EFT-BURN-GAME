function CChooseCharacterMenu(){
    var _oPanelContainer;
    var _oButMale;
    var _oButFemale;

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oBg;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oExitBut;
    
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(oFade);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2) - 10, y: (oSprite.height/2) + 10};
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);    
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: (oSprite.width/2) + 10, y: (oSprite.height/2) + 10};            
        _oExitBut = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite, s_oStage);
        _oExitBut.addEventListener(ON_MOUSE_UP, this._onExitBut, this);
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _pStartPosFullscreen = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:(oSprite.height/2) + 10};
            }else{
                _pStartPosFullscreen = {x:CANVAS_WIDTH - (oSprite.height/2) - 10,y:(oSprite.height/2) + 10};
            }
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }

        _oPanelContainer = new createjs.Container();
        s_oStage.addChild(_oPanelContainer);

        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT/2;

        var oSpritePanel = s_oSpriteLibrary.getSprite("msg_box");
        oPanel = createBitmap(oSpritePanel);   
        _oPanelContainer.addChild(oPanel);

        var iPanelHeight = oSpritePanel.height;
        var iPanelWidth = oSpritePanel.width;

        var iWidth = 700;
        var iHeight = 150;
        var iX = iPanelWidth/2 - iWidth/2;
        var iY = 50;
        var oTitle = new CTLText(_oPanelContainer, 
            iX, iY, iWidth, iHeight, 
            100, "center", "#fff", FONT, 1,
            0, 0,
            TEXT_SELECT_CHARACTER,
            true, true, false,
            false 
        );
        
        var iButY = (iPanelHeight)/2+50;
        var iButX = (iPanelWidth)/4;
        var oSprite = s_oSpriteLibrary.getSprite("but_male");
        _oButMale = new CGfxButton(iButX, iButY, oSprite, _oPanelContainer);
        _oButMale.addEventListenerWithParams(ON_MOUSE_UP, this._onChooseCharacter, s_oChooseCharacterMenu, true);

        iButX = iPanelWidth - (iPanelWidth/4);
        var oSprite = s_oSpriteLibrary.getSprite("but_female");
        _oButFemale = new CGfxButton(iButX, iButY, oSprite, _oPanelContainer);
        _oButFemale.addEventListenerWithParams(ON_MOUSE_UP, this._onChooseCharacter, s_oChooseCharacterMenu, false);
        
        _oPanelContainer.regX = iPanelWidth/2;
        _oPanelContainer.regY = iPanelHeight/2;

        this.refreshButtonPos();
        
        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(oFade);
        
        createjs.Tween.get(oFade).to({alpha:0}, 1000).call(function(){oFade.visible = false;}); 
    };  
    
    this.unload = function(){
        _bUpdate = false;
        _oExitBut.unload();
        _oButMale.unload();
        _oButFemale.unload();

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.unload();
        }
        
        s_oChooseCharacterMenu = null;
        s_oStage.removeAllChildren();        
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }        
        
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oExitBut.setPosition(_pStartPosExit.x + s_iOffsetX,s_iOffsetY + _pStartPosExit.y);
    };
    
    this._onChooseCharacter = function(bMale){
        s_oChooseCharacterMenu.unload();
        s_oMain.gotoGame(bMale);
    };

    this._onExitBut = function(){
        s_oChooseCharacterMenu.unload();
        s_oMain.gotoMenu();
    };

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
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

    
    
    s_oChooseCharacterMenu = this;        
    this._init();
    
    
};

var s_oChooseCharacterMenu = null;