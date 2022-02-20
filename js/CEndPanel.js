function CEndPanel(){
    var _iStartY;
    var _iEventToLaunch;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    var _oBg;
    
    var _oFade;
    var _oTitleText;
    var _oBestText;
    var _oTotScoreText;
    var _oButHome;
    var _oButRestart;
    var _oContainer;
    var _oContainerPanel;
    
    var _oThis = this;

    
    this._init = function(){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oListener = _oFade.on("click", function () {});
        _oContainer.addChild(_oFade);
        
       
        _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        //_oContainer.addChild(_oBg);
        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainer.addChild(_oContainerPanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(oSpriteBg);
        _oContainerPanel.addChild(oBg);
        
        _oTitleText = new CTLText(_oContainerPanel, 
                    oSpriteBg.width/2-250, oSpriteBg.height/2-200, 500, 80, 
                    80, "center", "#fff", FONT, 1,
                    0, 0,
                    TEXT_GAMEOVER,
                    true, true, false,
                    false );
                    


        _oBestText = new CTLText(_oContainerPanel, 
                    oSpriteBg.width/2-250, oSpriteBg.height/2-70, 500, 50, 
                    50, "center", "#fff", FONT, 1,
                    0, 0,
                    TEXT_BEST_SCORE,
                    true, true, false,
                    false );
                    

        
        _oTotScoreText = new CTLText(_oContainerPanel, 
                    oSpriteBg.width/2-250, oSpriteBg.height/2+0, 500, 50, 
                    50, "center", "#fff", FONT, 1,
                    0, 0,
                    TEXT_SCORE,
                    true, true, false,
                    false );
                    

        
        _oButHome = new CGfxButton(oSpriteBg.width/2 - 250,oSpriteBg.height/2 + 180,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButRestart = new CGfxButton(oSpriteBg.width/2 + 250,oSpriteBg.height/2+180,s_oSpriteLibrary.getSprite("but_restart"),_oContainerPanel);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        _iStartY = -oSpriteBg.height/2;
        
        _oContainerPanel.regX = oSpriteBg.width/2;
        _oContainerPanel.regY = oSpriteBg.height/2;
    };
    
    this.unload = function(){
        _oButHome.unload();
        _oButRestart.unload();
        
        _oFade.off("click", _oListener);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(iTotScore){
        $(s_oMain).trigger("save_score",iTotScore);
        $(s_oMain).trigger("share_event",iTotScore);
        
        playSound("time_over",1,false);

        _oTotScoreText.refreshText(TEXT_SCORE+": "+iTotScore);
        _oBestText.refreshText(TEXT_BEST_SCORE+": "+s_iBestScore);
        
        _oBg.alpha = 0;
        _oFade.alpha=0;
        _oContainerPanel.y = _iStartY;
        _oContainer.visible = true;
        
        createjs.Tween.get(_oBg).to({alpha:1}, 500);
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500);
        createjs.Tween.get(_oContainerPanel).wait(400).to({y:CANVAS_HEIGHT/2}, 800,createjs.Ease.bounceOut);
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainerPanel).to({y:_iStartY}, 800,createjs.Ease.backIn).call(function(){
                                                                createjs.Tween.get(_oBg).to({alpha:0}, 400,createjs.Ease.cubicOut).call(function(){
                                                                                                        _oContainer.visible = false;
                                                                    
                                                                                                        if(_aCbCompleted[_iEventToLaunch]){
                                                                                                            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
                                                                                                        }
                                                                })
                                                    });
    };
    
    this._onHome = function(){
        _iEventToLaunch = ON_BACK_MENU;
        
        _oThis.hide();
    };
    
    this._onRestart = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        
        _iEventToLaunch = ON_RESTART;
        
        _oThis.hide();
    };
    
    this._init();
}
