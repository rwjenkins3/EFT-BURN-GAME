function CGame(bMale){
    var _bUpdate;
    var _bKeyDown;
    var _bGameOver;
    var _bAlertStarted;
    var _bGoToChangeBin;

    var _iScore;   
    var _iTimeElapsSpawn;
    var _iTimeElaps;
    var _iChangeTime;
    var _iNumChangeCollect;
    var _iCurSpawnTime;
    var _iHeroXOnPause;

    var _fCurPercFallItem;
    var _fPercFallItemIncrease;
    var _aItems;
    var _aItemsToRemove;
    var _aPistons;
    var _szMaterialToCollect;
    var _aMalusMaterials;
    var _aMaterialsShuffled;

    var _oHero;
    var _oReadyGoAnim;
    var _oContainerBg;
    var _oContainerHero;
    var _oContainerAlert;
    var _oAlertTween;
    var _oBottomCompactor;
    var _oTopConveyor;
    var _oBottomConveyor;
    var _oTopCompactor;

    var _oInterface;
    var _oHelpPanel;
    var _oAreYouSurePanel;
   
    var _oGameOverPanel;
    //var _oDebug;
    
    this._init = function(bMale){
        setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);   
        _aItems = new Array();

        this._initBg();    
        this._initHero(bMale);
    
        _oInterface = new CInterface();
        
        _oReadyGoAnim = new CReadyGoAnim({x:CANVAS_WIDTH/2,y:-250},{x:CANVAS_WIDTH/2,y:-250},120,"#fff",s_oStage);
        _oReadyGoAnim.addEventListener(ON_END_READYGO_ANIM,this._startGame,this);
        
        this.reset();
        
        _oHelpPanel = new CHelpPanel(_szMaterialToCollect, _aMalusMaterials.slice(), bMale);
        _oHelpPanel.addEventListener(ON_EXIT_FROM_HELP,this._onExitFromHelp,this);

        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this.onConfirmExit,this);
        
        _oGameOverPanel = new CEndPanel();
        _oGameOverPanel.addEventListener(ON_BACK_MENU,this.onConfirmExit,this);
        _oGameOverPanel.addEventListener(ON_RESTART,this._restartLevel,this);

        this.refreshButtonPos();
        
        this.showHelpPanel();
    };
    
    this.unload = function(){
        _oInterface.unload();
        
        _oGameOverPanel.unload();
        
        _oHelpPanel.unload();

        s_oGame = null;
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren(); 
    };
    
    this.refreshButtonPos = function(){

        _oInterface.refreshButtonPos();
    };

    
    this.reset = function(bRestart){
        _bUpdate = false;
        _bGameOver = false;
        _bKeyDown = false;
        _bAlertStarted = false;
        _iTimeElapsSpawn = 0;
        _iTimeElaps = TIME_LEVEL;
        _iScore = 0;
        _iCurSpawnTime = START_SPAWN_ITEM_TIME;
        _fCurPercFallItem = PERC_FALL_ITEM;
        _fPercFallItemIncrease = (MAX_PERC_FALL_ITEM-PERC_FALL_ITEM)/(TIME_LEVEL/1000);
        _iChangeTime = 1;
        _iNumChangeCollect = Math.floor(TIME_LEVEL/CHANGE_DELAY)-1;
        _aItemsToRemove = new Array();
        _aMalusMaterials = new Array();
        _aMaterialsShuffled = shuffle(MATERIALS.slice());

        if(bRestart){
            this._changeMaterialToCollect();
        }else{
            this._setMaterialToCollect();
        }
        _oHero.setMaterial(_szMaterialToCollect);
        _oHero.reset();
        _oInterface.reset(_iScore);
        
        
        for(var k=0;k<_aItems.length;k++){
            _aItems[k].unload();
        }
        
        _aItems = new Array();
    };
    
    this._initBg = function(){
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg);

        _oContainerBg = new createjs.Container();
        s_oStage.addChild(_oContainerBg);

        //COMPACTOR_BOTTOM
        var aSprites = new Array();
        for(var i=0;i<=33;i++){
            aSprites.push(s_oSpriteLibrary.getSprite("compactor_bottom_"+i));
        }
        var oData = {   
                    framerate:FPS,
                    images: aSprites, 
                    // width, height & registration point of each sprite
                    frames: {width:aSprites[0].width, height:aSprites[0].height, regX:aSprites[0].width, regY:aSprites[0].height}, 
                    animations: {anim:[0,aSprites.length-1]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oBottomCompactor = createSprite(oSpriteSheet,"anim",aSprites[0].width,aSprites[0].height,aSprites[0].width,aSprites[0].height);
        _oBottomCompactor.x = CANVAS_WIDTH;
        _oBottomCompactor.y = CANVAS_HEIGHT;
        _oContainerBg.addChild(_oBottomCompactor);

        //CONVEYORS
        var aSprites = new Array();
        for(var i=0;i<=59;i++){
            aSprites.push(s_oSpriteLibrary.getSprite("conveyor_"+i));
        }
        var oData = {   
                    framerate:FPS,
                    images: aSprites, 
                    // width, height & registration point of each sprite
                    frames: {width:aSprites[0].width, height:aSprites[0].height, regX:aSprites[0].width/2, regY:0}, 
                    animations: {anim:[0,aSprites.length-1]}
        };
            
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oTopConveyor = createSprite(oSpriteSheet,"anim",aSprites[0].width/2,0,aSprites[0].width,aSprites[0].height);
        _oTopConveyor.x = CANVAS_WIDTH/2;
        _oTopConveyor.y = TOP_CONVEYOR_Y;
        _oContainerBg.addChild(_oTopConveyor);

        _oBottomConveyor = createSprite(oSpriteSheet,"anim",aSprites[0].width/2,0,aSprites[0].width,aSprites[0].height);
        _oBottomConveyor.x = CANVAS_WIDTH/2;
        _oBottomConveyor.y = BOTTOM_CONVEYOR_Y;
        _oContainerBg.addChild(_oBottomConveyor);

        //COMPACTOR_TOP
        var aSprites = new Array();
        for(var i=0;i<=33;i++){
            aSprites.push(s_oSpriteLibrary.getSprite("compactor_top_"+i));
        }
        var oData = {   
                    framerate:FPS,
                    images: aSprites, 
                    // width, height & registration point of each sprite
                    frames: {width:aSprites[0].width, height:aSprites[0].height, regX:aSprites[0].width, regY:aSprites[0].height}, 
                    animations: {anim:[22,33],animDispose:[0,21,"anim"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oTopCompactor = createSprite(oSpriteSheet,"anim",aSprites[0].width,aSprites[0].height,aSprites[0].width,aSprites[0].height);
        _oTopCompactor.x = CANVAS_WIDTH;
        _oTopCompactor.y = CANVAS_HEIGHT;
        _oContainerBg.addChild(_oTopCompactor);

        //PISTONS
        _aPistons = new Array();
        var iX = CANVAS_WIDTH/2-(PISTON_WIDTH-30)*2;
        var iY = PISTON_Y;
        for(var i=0; i<5; i++){
            var oPiston = new CPiston(iX,iY,_oContainerBg);
            _aPistons.push(oPiston);

            iX += PISTON_WIDTH-30;
        }

        //ALERT CHANGE MATERIAL TO GET
        _oContainerAlert = new createjs.Container();
        _oContainerBg.addChild(_oContainerAlert);

        _oContainerAlert.visible = false;
        _oContainerAlert.alpha = 0;

        var oSprite = s_oSpriteLibrary.getSprite("alert");
        var oAlertBitmap = createBitmap(oSprite);
        _oContainerAlert.addChild(oAlertBitmap);
          
        var iWidth = oSprite.width+120;
        var iHeight = 120;
        var iX = (iWidth-oSprite.width)/-2;
        var iY = oSprite.height+5;
        var iTxtSize = 80;
        var oTextAlert = new CTLText(_oContainerAlert, 
            iX, iY, iWidth, iHeight, 
            iTxtSize, "center", "#fff", FONT, 1,
            0, 0,
            TEXT_ALERT_CHANGE_MATERIAL,
            true, true, true,
            false 
        );

        _oContainerAlert.x = CANVAS_WIDTH/2;
        _oContainerAlert.y = CANVAS_HEIGHT/2;

        _oContainerAlert.regX = _oContainerAlert.getBounds().width/2;
        _oContainerAlert.regY = _oContainerAlert.getBounds().height/2;

        _oAlertTween = createjs.Tween.get(_oContainerAlert, {loop:-1, bounce:true})
        .to({scale:1.4}, 400, createjs.Ease.cubicOut);
    };
    
    this._initHero = function(bMale){
        
        _oContainerHero = new createjs.Container();
        s_oStage.addChild(_oContainerHero);
        s_oStage.setChildIndex(_oContainerHero,1);
        
        _oHero = new CHero(CANVAS_WIDTH/2,FLOOR_Y,bMale,_oContainerHero);
        
        /*
        _oDebug = new createjs.Shape();
        _oDebug.graphics.beginFill("red").drawRect(0, 0, 100, 100);
        _oContainerHero.addChild(_oDebug);
        */
    };
    
    this.showHelpPanel = function(){
        this.stopUpdate();
        _oHelpPanel.refresh(_szMaterialToCollect, _aMalusMaterials.slice());
        _oHelpPanel.show();
    };
    
    this._onExitFromHelp = function(){
        if(!_oInterface.isPaused()){
            this.prepareStartLevel();
        }else{

        }
    };
            
    this.prepareStartLevel = function(){
        _oInterface.disableGUIExpandible();
        _oReadyGoAnim.showFade();
        if(!_bGoToChangeBin){
            _oReadyGoAnim.show(_szMaterialToCollect);
        }
    };
    
    this._startGame = function(){
        this.startUpdate();
        _oInterface.enableGUIExpandible();
        _oInterface.collapseGUIButtons();
    };
    
    this._restartLevel = function(){
        this.reset(true);
        
        //this.prepareStartLevel();
    };
    
    this._spawnItem = function(){
        var szRandMaterial;
        
        if((Math.floor(Math.random()*100)) >= MALUS_PERC){
            szRandMaterial = _szMaterialToCollect;
        }else{
            szRandMaterial = _aMalusMaterials[(Math.floor(Math.random() * 3))];
        }
        
        var iRandItemType = Math.floor(Math.random() * NUM_ITEM_TYPES_PER_MATERIAL);
        
        var iRandFallAtX;
        var bIndicate = false;
        if((Math.floor(Math.random()*101)) < _fCurPercFallItem){
            var iPistonIndex = Math.floor(Math.random()*5);
            iRandFallAtX = _aPistons[iPistonIndex].getX();

            if(s_iNumHelpFirstGame > 0 && szRandMaterial == _szMaterialToCollect){
                bIndicate = true;
                s_iNumHelpFirstGame--;
            };

        }else{
            iRandFallAtX = -1;
        }
        
        if(_fCurPercFallItem <= MAX_PERC_FALL_ITEM){
            _fCurPercFallItem += _fPercFallItemIncrease;
        }

        var oItem = new CItem(0,TOP_CONVEYOR_Y,iRandFallAtX,szRandMaterial,iRandItemType,bIndicate,_oContainerBg);
        _oContainerBg.setChildIndex(_oTopCompactor, _oContainerBg.numChildren-1)
        oItem.addEventListener(ON_ITEM_DIE,this._onItemDie,this);
        if(iRandFallAtX > -1){
            oItem.addEventListenerWithParams(ON_ITEM_FALL,this._onItemFall,this,iPistonIndex);
        }
        _aItems.push(oItem);
    };
    
    this._onItemDie = function(oItem){
        for(var i=0;i<_aItems.length;i++){
            if(_aItems[i] === oItem){
                _aItemsToRemove.push(oItem);
                break;
            }
        }

        if(_oTopCompactor.currentAnimation == "anim" && oItem.getY() > CANVAS_HEIGHT/2 && oItem.getX() >= CANVAS_WIDTH){
            _oTopCompactor.gotoAndPlay("animDispose");
        }
    };

    this._onItemFall = function(iPistonIndex){
        _aPistons[iPistonIndex].push();
    };

    this._setMaterialToCollect = function(){
        // _szMaterialToCollect = _aMaterialsShuffled.pop();
        console.log(_szMaterialToCollect);

        _szMaterialToCollect = 'paper';
        _aMalusMaterials = new Array();
        MATERIALS.forEach(element => {
            if(element != _szMaterialToCollect){
                _aMalusMaterials.push(element);
            }
        });
    };
    
    this._changeMaterialToCollect = function(){
        this._setMaterialToCollect();

        this.showHelpPanel();
    };

    this.onKeyDown = function(evt){
        if(_bUpdate === false || _bGoToChangeBin){
            evt.preventDefault();
            return false;
        }
        
        
        if (!evt) {  
            evt = window.event; 
        }
        
        switch(evt.keyCode) {    
            case LEFT_DIR: {
                _bKeyDown = true;
                _oHero.moveLeft(true);
                evt.preventDefault();
                return false;
            };
      
            case RIGHT_DIR: {
               _bKeyDown = true;
                _oHero.moveRight(true);
                evt.preventDefault();
                return false;
            };

        }
        
        
    };

    this.onKeyUp = function(evt) { 
        if (  _bGameOver || _bGoToChangeBin){
            evt.preventDefault();
            return false;
        }
        
        if(!evt){ 
            evt = window.event; 
        } 

        _bKeyDown = false;
        switch(evt.keyCode) {  
           // left  
           case 37: {
                   _oHero.moveLeft(false);
                   evt.preventDefault();
                   return false;
               }
                              
           // right  
           case 39: {
                   _oHero.moveRight(false);
                   evt.preventDefault();
                   return false;
               }
        } 
    };
    
    this.moveLeft = function(bDown){
        if(_bUpdate === false){
            return;
        }
        
        _bKeyDown = true;
        _oHero.moveLeft(bDown);
    };

    this.moveRight = function(bDown){
        if(_bUpdate === false){
            return;
        }
        
        _bKeyDown = true;
        _oHero.moveRight(bDown);
    };
    
    this.onExit = function(){
        _oAreYouSurePanel.show(TEXT_ARE_YOU_SURE,90);
    };
    
    this.onConfirmExit = function(){
        this.unload();
        
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        
        s_oMain.gotoMenu();
    };

    this.gameOver = function(){   
        this.stopUpdate();
        this._stopAlertChangeMaterialToCollect();

        if(_iScore > s_iBestScore){
            s_iBestScore = _iScore;
            
            _oInterface.refreshBestScore();
        }
        
        _oGameOverPanel.show(_iScore);
        _oHero.setIdle();
        
        saveItem(PREFIX_LOCAL_STORAGE+"_best_score",s_iBestScore);
        saveItem(PREFIX_LOCAL_STORAGE+"_first_game",false);
    };
    
    this._refreshScore = function(iAmount){
        _iScore += iAmount;
        if(_iScore < 0){
            _iScore = 0;
        }
        _oInterface.refreshScore(_iScore);
    };

    this.playAlertTween = function(){
        if(_oContainerAlert.visible){
            _oAlertTween.gotoAndPlay();
        }
    };

    this.pauseAlertTween = function(){
        if(_oContainerAlert.visible){
            _oAlertTween.gotoAndStop();
        }
    };

    this._alertChangeMaterialToCollect = function(){
        _bAlertStarted = true;
        _oContainerAlert.visible = true;
        _oContainerAlert.alpha = 0.80;
        _oContainerAlert.scale = 1;
        this.playAlertTween();
    };

    this._stopAlertChangeMaterialToCollect = function(){
        this.pauseAlertTween();
        _oContainerAlert.alpha = 0;
        _oContainerAlert.visible = false;
        _bAlertStarted = false;
    };
    
    this._checkCollision = function(){
        var oRectHero = _oHero.getRectCollision();
        /*
        var oRectItem = _aItems[0].getRectCollision();
        _oDebug.graphics.clear();
        _oDebug.graphics.beginFill("red").drawRect(oRectItem.x, oRectItem.y, oRectItem.width, oRectItem.height);
        */
        for(var i=0;i<_aItems.length;i++){
            var oRectItem = _aItems[i].getRectCollision();
            
            if(oRectItem){
                if(oRectHero.intersects(oRectItem)){

                    var iAmount;
                    if(_aItems[i].getMaterial() != _szMaterialToCollect){
                        playSound("catch_malus",1,false);
                        _oHero.collectBad();
                        iAmount = -MALUS_POINTS;
                    }else{
                        playSound("catch_item",1,false);
                        _oHero.collectGood();
                        iAmount = ITEM_POINTS;
                    }
                    
                    _aItems[i].die();
                    
                    new CScoreText(iAmount,_aItems[i].getX(),_aItems[i].getY(),_oContainerBg);
                    this._refreshScore(iAmount);
                }
            }
       }
       
    };
    
    this.stopUpdate = function(){
        _bUpdate = false;
        
        if(!s_oInterface.isPaused()){
            return;
        }
        _oBottomCompactor.stop();
        _oTopConveyor.stop();
        _oBottomConveyor.stop();
        _oTopCompactor.stop();
        
        _aItems.forEach(element => {
            element.stopUpdate();
        });
        
    };
    
    this.startUpdate = function(){
        _bUpdate = true;
        
        _oBottomCompactor.play();
        _oTopConveyor.play();
        _oBottomConveyor.play();
        _oTopCompactor.play();

        _aItems.forEach(element => {
            element.startUpdate();
        });
        
    };

    this.update = function(){
        if(_iTimeElaps != TIME_LEVEL){
            _oHero.update();

            if(_bGoToChangeBin){
                if(_oHero.getCheckLimit() == true){
                    _oHero.setCheckLimit(false);
                }
                if(_oHero.getX() < CANVAS_WIDTH+100 && !_bHeroLeftTheGame){
                    //LEAVE THE CAVAS
                    _oHero.moveRight(true);
                }else if(!_bHeroLeftTheGame){
                    _bHeroLeftTheGame = true;
                    _oHero.moveRight(false);
                    _oHero.setMaterial(_szMaterialToCollect);
                }else if(_oHero.getX() > _iHeroXOnPause){
                    //GO BACK
                    _oHero.moveLeft(true);
                }else if(_oHero.getX() < _iHeroXOnPause){
                    _oHero.moveLeft(false);
                    _oHero.setCheckLimit(true);
                    _oHero.setIdle();
                    _bGoToChangeBin=false;
                    if(_oHelpPanel.isShowing() == false){
                        _oReadyGoAnim.show(_szMaterialToCollect);
                    }
                }
            }
        }

        for(var i=0;i<_aItems.length;i++){
            _aItems[i].update();
        }

        if(!_bUpdate){
            return;
        }
        
        _iTimeElapsSpawn += s_iTimeElaps;
        if(_iTimeElapsSpawn > _iCurSpawnTime){
            _iTimeElapsSpawn = 0;

            this._spawnItem();
        }
        
        this._checkCollision();
        
        //REMOVE ITEM IN GARBAGE LIST
        for(var j=0;j<_aItemsToRemove.length;j++){
            for(var k=0;k<_aItems.length;k++){
                if(_aItemsToRemove[j] === _aItems[k]){
                    _aItems.splice(k,1);
                    break;
                }
            }
        }
        
        _aItemsToRemove = new Array();

        //REFRESH GAME TIME
        _iTimeElaps -= s_iTimeElaps;
        _iChangeTime += s_iTimeElaps;

        if(_iChangeTime >= CHANGE_DELAY-3000 && _bAlertStarted == false && _iNumChangeCollect > 0){
            this._alertChangeMaterialToCollect();
        };

        if(_iChangeTime >= CHANGE_DELAY && _iNumChangeCollect > 0){
            _iChangeTime=0;

            _bGoToChangeBin = true;
            _oHero.moveLeft(false);
            _iHeroXOnPause = _oHero.getX();
            _bHeroLeftTheGame = false;

            this._stopAlertChangeMaterialToCollect();
            this._changeMaterialToCollect();
            _iNumChangeCollect--;
        };
        
        if(_iTimeElaps < 0){
            _iTimeElaps = 0;
            this.gameOver();
        }
        
        _oInterface.refreshTime(_iTimeElaps);
    };

    s_oGame = this;
    
    this._init(bMale);
}

var s_oGame = null;