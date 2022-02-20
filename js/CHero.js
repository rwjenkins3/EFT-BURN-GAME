function CHero(iX,iY,bMale,oParentContainer){
    var _bLeft = false;
    var _bRight = false;
    var _bCheckLimit = true;
    var _iXMove;
    var _iCurAcceleration;
    var _iCurMaxSpeed;
    var _pStartPos;
    var _oRectCollision;
    var _szCurMaterial;

    var _oHero;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY,bMale){
        _pStartPos = {x:iX,y:iY};
        
        _iXMove = 0;
        _iCurAcceleration = HERO_ACCELERATION;
        _iCurMaxSpeed = MAX_HERO_SPEED;
        _oRectCollision = new createjs.Rectangle(0,0,100,100);
        _szCurMaterial = MATERIALS[0];

        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        var szCharacter = bMale?"male":"female";
        var aSprites = new Array();
        for(var i=0;i<4;i++){
            for(var j=0;j<=28;j++){
                aSprites.push(s_oSpriteLibrary.getSprite(szCharacter+"_"+MATERIALS[i]+"_"+j));
            }
        }
        var oData = {   
                        images: aSprites, 
                        // width, height & registration point of each sprite
                        frames: {width: aSprites[0].width, height: aSprites[0].height,regX:aSprites[0].width/2,regY:aSprites[0].height/2}, 
                        animations: {   idle_glass:0,catch_good_glass:[1,5,"idle_glass"],
                                        walk_glass:[6,24],catch_bad_glass:[25,28,"idle_glass"],

                                        idle_organic:0+(29*1),catch_good_organic:[1+(29*1),5+(29*1),"idle_organic"],
                                        walk_organic:[6+(29*1),24+(29*1)],catch_bad_organic:[25+(29*1),28+(29*1),"idle_organic"],

                                        idle_paper:0+(29*2),catch_good_paper:[1+(29*2),5+(29*2),"idle_paper"],
                                        walk_paper:[6+(29*2),24+(29*2)],catch_bad_paper:[25+(29*2),28+(29*2),"idle_paper"],

                                        idle_plastic:0+(29*3),catch_good_plastic:[1+(29*3),5+(29*3),"idle_plastic"],
                                        walk_plastic:[6+(29*3),24+(29*3)],catch_bad_plastic:[25+(29*3),28+(29*3),"idle_plastic"]
                                    }
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oHero = createSprite(oSpriteSheet,"idle_"+_szCurMaterial,aSprites[0].width/2,aSprites[0].height/2,aSprites[0].width,aSprites[0].height);
        _oContainer.addChild(_oHero);
    };
    
    this.reset = function(){
        _iXMove = 0;
        _bLeft = false;
        _bRight = false;
        _oHero.gotoAndStop("idle_"+_szCurMaterial);
        
        _oHero.framerate = 30;
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y;
    };
    
    this.setIdle = function(){
        _oHero.gotoAndStop("idle_"+_szCurMaterial);
    };
    
    this.collectGood = function(){
        if(_oHero.currentAnimation === "idle_"+_szCurMaterial){
            _oHero.framerate = 15;
            _oHero.gotoAndPlay("catch_good_"+_szCurMaterial);
        } 
    };
    
    this.collectBad = function(){
        if(_oHero.currentAnimation === "idle_"+_szCurMaterial){
            _oHero.framerate = 15;
            _oHero.gotoAndPlay("catch_bad_"+_szCurMaterial);
        } 
    };
    
    this.moveLeft = function(bLeft){
        _bLeft = bLeft;
        if(!_bLeft){
            _oHero.gotoAndStop("idle_"+_szCurMaterial);
            _oContainer.scaleX = 1;
        }else if(_oHero.currentAnimation !== "walk_"+_szCurMaterial){
            _oHero.framerate = 30;
            _oHero.gotoAndPlay("walk_"+_szCurMaterial);
            _oContainer.scaleX = -1;
        }
    };

    this.moveRight = function(bRight){
        _bRight = bRight;
        if(!_bRight){
            _oHero.gotoAndStop("idle_"+_szCurMaterial);
            _oContainer.scaleX = 1;
        }else if(_oHero.currentAnimation !== "walk_"+_szCurMaterial){
            _oHero.framerate = 30;
            _oHero.gotoAndPlay("walk_"+_szCurMaterial);
            _oContainer.scaleX = 1;
        }
    };
    
    this.getRectCollision = function(){
        return _oRectCollision;
    };

    this.getX = function(){
        return _oContainer.x;
    };

    this.getCheckLimit = function(){
        return _bCheckLimit;
    };

    this.setCheckLimit = function(bCheckLimit){
        _bCheckLimit = bCheckLimit;
    };

    this.setMaterial = function(szMaterial){
        _szCurMaterial = szMaterial;
        _oHero.gotoAndStop("idle_"+_szCurMaterial);
    };
    
    this._updateRectCollision = function(){
        if(_oHero.currentAnimation === "walk_"+_szCurMaterial){
            if(_oContainer.scaleX === 1){
                _oRectCollision.setValues(_oContainer.x+15,_oContainer.y-10,110,40);
            }else{
                _oRectCollision.setValues(_oContainer.x-125,_oContainer.y-10,110,40);
            }
            
        }else{
            _oRectCollision.setValues(_oContainer.x-55,_oContainer.y-0,110,40);
        }
    };
    
    this.update = function(){
        if(_bLeft){
            _iXMove -= _iCurAcceleration;
        }
        if(_bRight){
            _iXMove += _iCurAcceleration;
        }
        
        _oContainer.x += _iXMove;
        
        _iXMove *= HERO_FRICTION;
        
        if (_iXMove > _iCurMaxSpeed) {
                _iXMove = _iCurMaxSpeed;
        }
        
        if (_iXMove < -_iCurMaxSpeed) {
                _iXMove = -_iCurMaxSpeed;
        }

        if ( Math.abs(_iXMove) < 0.1 ) {
                _iXMove = 0;
        }
		
        if((_oContainer.x  + _iXMove) > HERO_LIMIT_RIGHT && _bCheckLimit == true){  
                _oContainer.x = HERO_LIMIT_RIGHT  - _iXMove;
        }
            
        if((_oContainer.x -  _iXMove)< HERO_LIMIT_LEFT && _bCheckLimit == true){
            _oContainer.x = HERO_LIMIT_LEFT +_iXMove;
        }
        
        this._updateRectCollision();
    };
    
    this._init(iX,iY,bMale);
}