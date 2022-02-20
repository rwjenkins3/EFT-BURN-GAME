function CHelpPanel(szMaterialToCollect, aMalus, bMale){
    var _iStartY;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oFade;
    var _oItemToCollect;
    var _oTextCollect;
    var _oKeyLeft;
    var _oKeyRight;
    var _oMiniHero;
    var _aMalusMaterials = new Array();
    var _oButStart;
    var _oContainer;
    var _oContainerPanel;
    
    var _oThis = this;
    
    this._init = function(szMaterialToCollect, aMalus, bMale){
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
        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainer.addChild(_oContainerPanel);

        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_big");
        var oBg = createBitmap(oSpriteBg);
        _oContainerPanel.addChild(oBg);

        _oTextCollect = new CTLText(_oContainerPanel, 
            oSpriteBg.width/2-(oSpriteBg.width-150)/2, 50, oSpriteBg.width-150, 100, 
            70, "center", "#fff", FONT, 1,
            0, 0,
            TEXT_HELP_PANEL_COLLECT+" "+TEXT_MATERIALS[szMaterialToCollect],
            true, true, true,
            false
        );

        var oSprite = s_oSpriteLibrary.getSprite(szMaterialToCollect);
        _oItemToCollect = createBitmap(oSprite);
        _oItemToCollect.x = 310;
        _oItemToCollect.y = oSpriteBg.height/2-oSprite.height-50;
        _oContainerPanel.addChild(_oItemToCollect);

        var oCollectBitmap = createBitmap(s_oSpriteLibrary.getSprite("collect"));
        oCollectBitmap.x = 550;
        oCollectBitmap.y = oSpriteBg.height/2-oSprite.height-50;
        _oContainerPanel.addChild(oCollectBitmap);

        var iX = 310;
        for(var i=0;i<3;i++){
            var oSprite = s_oSpriteLibrary.getSprite(aMalus.pop());
            var oItem = createBitmap(oSprite);
            oItem.x = iX;
            oItem.y = oSpriteBg.height/2-oSprite.height+130;
            _oContainerPanel.addChild(oItem);
            _aMalusMaterials.push(oItem);
            
            iX -= 125;
        }

        var oAvoidBitmap = createBitmap(s_oSpriteLibrary.getSprite("avoid"));
        oAvoidBitmap.x = 550;
        oAvoidBitmap.y = oSpriteBg.height/2-oSprite.height+130;
        _oContainerPanel.addChild(oAvoidBitmap);
        
        if(s_bMobile){
            var oSpriteKeys = s_oSpriteLibrary.getSprite("but_left");
            _oKeyLeft = createBitmap(oSpriteKeys);
            _oKeyLeft.regX = oSpriteKeys.width/2;
            _oKeyLeft.regY = oSpriteKeys.height/2;
            _oKeyLeft.x = oSpriteBg.width/2-300;
            _oKeyLeft.y = oSpriteBg.height-180;
            _oKeyLeft.scale = 0.65;
            _oContainerPanel.addChild(_oKeyLeft);

            var oSpriteKeys = s_oSpriteLibrary.getSprite("but_right");
            _oKeyRight = createBitmap(oSpriteKeys);
            _oKeyRight.regX = oSpriteKeys.width/2;
            _oKeyRight.regY = oSpriteKeys.height/2;
            _oKeyRight.x = oSpriteBg.width/2+300;
            _oKeyRight.y = oSpriteBg.height-180;
            _oKeyRight.scale = 0.65;
            _oContainerPanel.addChild(_oKeyRight);
    	}else{

            var oSpriteKeys = s_oSpriteLibrary.getSprite("keyboard_left");
            _oKeyLeft = createBitmap(oSpriteKeys);
            _oKeyLeft.regX = oSpriteKeys.width/2;
            _oKeyLeft.regY = oSpriteKeys.height/2;
            _oKeyLeft.x = oSpriteBg.width/2-300;
            _oKeyLeft.y = oSpriteBg.height-180;
            _oContainerPanel.addChild(_oKeyLeft);

            var oSpriteKeys = s_oSpriteLibrary.getSprite("keyboard_right");
            _oKeyRight = createBitmap(oSpriteKeys);
            _oKeyRight.regX = oSpriteKeys.width/2;
            _oKeyRight.regY = oSpriteKeys.height/2;
            _oKeyRight.x = oSpriteBg.width/2+300;
            _oKeyRight.y = oSpriteBg.height-180;
            _oContainerPanel.addChild(_oKeyRight);
    	}

        var szCharacter = bMale?"male":"female";
        var aSprites = new Array();
        for(var i=0;i<4;i++){
            for(var j=6;j<=24;j++){
                aSprites.push(s_oSpriteLibrary.getSprite(szCharacter+"_"+MATERIALS[i]+"_"+j));
            }
        }
        var oData = {   
                        images: aSprites, 
                        // width, height & registration point of each sprite
                        frames: {width: aSprites[0].width, height: aSprites[0].height,regX:aSprites[0].width/2,regY:aSprites[0].height/2}, 
                        animations: {   
                                        walk_glass:[0,18],
                                        walk_organic:[0+(19*1),18+(19*1)],
                                        walk_paper:[0+(19*2),18+(19*2)],
                                        walk_plastic:[0+(19*3),18+(19*3)]
                                    }
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oMiniHero = createSprite(oSpriteSheet,"walk_"+szMaterialToCollect,aSprites[0].width/2,aSprites[0].height/2,aSprites[0].width,aSprites[0].height);
        _oMiniHero.scale = 0.4;
        _oMiniHero.x = oSpriteBg.width/2-150;
        _oMiniHero.y = oSpriteBg.height-180;
        _oContainerPanel.addChild(_oMiniHero);
        this._addHelpMoveTween();

        _oButStart = new CGfxButton(oSpriteBg.width/2, oSpriteBg.height-10,s_oSpriteLibrary.getSprite("but_next"),_oContainerPanel);
        _oButStart.addEventListener(ON_MOUSE_UP,this._onStart,this);
        
        _iStartY = -oSpriteBg.height;
        
        _oContainerPanel.regX = oSpriteBg.width/2;
        _oContainerPanel.regY = oSpriteBg.height/2;
    };
    
    this.unload = function(){
        _oFade.off("click",_oListener);
        _oButStart.unload();
        createjs.Tween.removeTweens(_oMiniHero);
        s_oStage.removeChild(_oContainer);
    };

    this.refresh = function(szMaterialToCollect, aMalus){
        this._refreshContainerPanel(szMaterialToCollect, aMalus);
    };

    this._refreshContainerPanel = function(szMaterialToCollect, aMalus){
        _oItemToCollect.image = s_oSpriteLibrary.getSprite(szMaterialToCollect);
        _oTextCollect.refreshText(TEXT_HELP_PANEL_COLLECT+" "+TEXT_MATERIALS[szMaterialToCollect]);
        for(var i=0; i<3; i++){
            _aMalusMaterials[i].image = s_oSpriteLibrary.getSprite(aMalus[i]);
        }
        _oMiniHero.gotoAndPlay("walk_"+szMaterialToCollect);
    };

    this._addHelpMoveTween = function(){
        createjs.Tween.get(_oMiniHero, {loop:-1})
        .to({x:_oContainerPanel.getBounds().width/2+150}, 1000)
        .call(function(){
            this.scaleX *= -1;
            _oThis._pressKey(true);
        })
        .to({x:_oContainerPanel.getBounds().width/2-150}, 1000)
        .call(function(){
            this.scaleX *= -1;
            _oThis._pressKey(false);
        });
    };

    this._pressKey = function(bLeft){
        var fScaleReduction = 0.1;
        if(s_bMobile){
            fScaleReduction = 0.1;
        };

        if(bLeft){
            _oKeyRight.scale = _oKeyLeft.scale;  
            _oKeyLeft.scale -= fScaleReduction;
        }else{
            _oKeyLeft.scale = _oKeyRight.scale;  
            _oKeyRight.scale -= fScaleReduction;
        }
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(){
        _oFade.alpha = 0;
        _oContainerPanel.y = _iStartY;
        _oContainer.visible = true;
        _oButStart.setActive(false);
        createjs.Tween.get(_oFade).to({alpha:0.5}, 500);
		createjs.Tween.get(_oContainerPanel).wait(400)
		.to({y:CANVAS_HEIGHT/2}, 800,createjs.Ease.bounceOut)
		.call(function(){
			/*s_oMain.stopUpdateNoBlock();*/
			_oButStart.setActive(true);
		});
    };
    
    this.hide = function(){
        //s_oMain.startUpdateNoBlock();
		_oButStart.setActive(false);
        createjs.Tween.get(_oContainerPanel)
		.to({y:_iStartY}, 800,createjs.Ease.backIn)
		.call(function(){
            _oFade.alpha = 0; 
            if(_aCbCompleted[ON_EXIT_FROM_HELP]){
                _aCbCompleted[ON_EXIT_FROM_HELP].call(_aCbOwner[ON_EXIT_FROM_HELP]);
            }
            //createjs.Tween.get(_oFade).to({alpha:0}, 800);
             
        });
    };

	this.isShowing = function(){
		if(_oContainerPanel.y == CANVAS_HEIGHT/2){
			return true;
		}
		return false;
	};
    
    this._onStart = function(){
        _oThis.hide();
    };
    
    this._init(szMaterialToCollect, aMalus, bMale);
}