function CItem(iX,iY,iFallAtX,szMaterial,iItemType,bIndicate,oParentContainer){
    var _bUpdate;
    var _bFalling;
    var _bIndicate;
    var _szMaterial;
    var _iItemType;
    var _iYMove;
    var _iDirRotation;
    var _iArrivalY;
    var _iFallAtX;
    var _iCurStartY;
    var _iWidth;
    var _iHeight;


    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _oRectCollision;

    var _oHand;

    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    this._init = function(iX,iY,iFallAtX,szMaterial,iItemType,bIndicate){
        _bIndicate = bIndicate;
        _bFalling = false;
        _szMaterial = szMaterial;
        _iItemType = iItemType;
        _iFallAtX = iFallAtX;

        _iYMove = 0;
        _iDirRotation = Math.random()>0.5?1:-1;
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        if(_iFallAtX > 0){
            _oRectCollision = new createjs.Rectangle(0,0,100,100);
            _iFallAtX += (Math.floor(Math.random()*50)) * (Math.floor(Math.random()*2) == 1?-1:1);
        }
        
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        var oSprite = s_oSpriteLibrary.getSprite(_szMaterial+"_"+_iItemType);
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;
        var oItem = createBitmap(oSprite);
        _oContainer.addChild(oItem);

        _iArrivalY = BOTTOM_CONVEYOR_Y+30-_iHeight/2;        

        _oContainer.x = iX-_iWidth;
        _oContainer.y = iY+30;
        _oContainer.regY = _iHeight;
        _oContainer.regX = _iWidth/2;

        _oHand = {x:0};
        if(_bIndicate){
            var oSprite = s_oSpriteLibrary.getSprite("hand_indicate");
            _oHand = createBitmap(oSprite);
            _oParentContainer.addChild(_oHand);
            _oHand.x = _oContainer.x;
            _oHand.y = _oContainer.y+50;
            _oHand.regX = 36;

            createjs.Tween.get(_oHand, {loop:-1,bounce:true})
            .to({y:_oContainer.y}, 300, createjs.Ease.cubicOut);
        }

        _bUpdate = true;
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };

    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oContainer);
        createjs.Tween.removeTweens(_oContainer);
        createjs.Tween.removeTweens(_oHand);
    };
    
    this.die = function(){
        this.unload();
        
        if(_aCbCompleted[ON_ITEM_DIE]){
            _aCbCompleted[ON_ITEM_DIE].call(_aCbOwner[ON_ITEM_DIE],this);
        }
    };
    
    this._fall = function(){
        _bFalling = true;

        _oContainer.regY = _oContainer.regY/2;
        _oContainer.y -= _oContainer.regY;

        if(_aCbCompleted[ON_ITEM_FALL]){
            _aCbCompleted[ON_ITEM_FALL].call(_aCbOwner[ON_ITEM_FALL],_aParams);
        }
    };

    this.getRectCollision = function(){
        return _oRectCollision;
    };
    
    this.getMaterial = function(){
        return _szMaterial;
    };

    this.getItemType = function(){
        return _iItemType;
    };
    
    this.getX = function(){
        return _oContainer.x;
    };
    
    this.getY = function(){
        return _oContainer.y;
    };

    this.isFalling = function(){
        return _bFalling;
    };
    
    this._updateRectCollision = function(){
        _oRectCollision.setValues(_oContainer.x-_iWidth/2,_oContainer.y-_iHeight*70/100/2,_iWidth,_iHeight*70/100);
    };

    this.stopUpdate = function(){
        _bUpdate = false;
    };

    this.startUpdate = function(){
        _bUpdate = true;
    };

    this.update = function(){
        if(_bUpdate){
            if(_iFallAtX > -1){
                this._updateRectCollision();
            }
            if(_bFalling){
                
            _iYMove += ITEM_FALLING_SPEED;
            _oContainer.y += _iYMove;

            if(_oContainer.rotation < 30 && _oContainer.rotation > -30){
                _oContainer.rotation += 0.5*_iDirRotation;
            }
            if(_oContainer.y > _iArrivalY){
                _oContainer.y = _iArrivalY;
                _bFalling = false;
                createjs.Tween.get(_oContainer)
                .to({rotation: (_iWidth>_iHeight?0:90*_iDirRotation), y:(_iWidth<_iHeight?BOTTOM_CONVEYOR_Y+30-_iWidth/2:_iArrivalY)},
                (_szMaterial==MATERIALS[0]?400:(_szMaterial==MATERIALS[3])?600:100),
                (_szMaterial==MATERIALS[0] || _szMaterial==MATERIALS[3]?createjs.Ease.bounceOut:createjs.Ease.linear));
            }
                  
            }else{
                _oContainer.x += CONVEYOR_SPEED;
                _oHand.x += CONVEYOR_SPEED;
                if(_oContainer.x >= _iFallAtX && _oContainer.y < _iArrivalY && _iFallAtX > 0){
                    this._fall();
                    if(_bIndicate){
                        _bIndicate = false;
                        _oHand.visible=false;
                        createjs.Tween.removeTweens(_oHand);
                    }
                }
                if(_oContainer.x > CANVAS_WIDTH+_iWidth){
                    this.die();
                }
            }
        }
    };
    
    this._init(iX,iY,iFallAtX,szMaterial,iItemType,bIndicate);
}