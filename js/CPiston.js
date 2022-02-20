function CPiston(iX,iY,oParentContainer){
    var _oParentContainer = oParentContainer;
    var _oPiston;

    var _oOnAnimationEnd;

    this._init = function(iX,iY){

        var aSprites = new Array();
        for(var i=0;i<=14;i++){
            aSprites.push(s_oSpriteLibrary.getSprite("piston_"+i));
        }
        var oData = {   
                        images: aSprites, 
                        // width, height & registration point of each sprite
                        frames: {width: aSprites[0].width, height: aSprites[0].height,regX:aSprites[0].width/2,regY:aSprites[0].height/2}, 
                        animations: {stop:0, pushAnim:[1,14]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oPiston = createSprite(oSpriteSheet,"stop",aSprites[0].width/2,aSprites[0].height/2,aSprites[0].width,aSprites[0].height);
        _oParentContainer.addChild(_oPiston);
        _oPiston.x = iX;
        _oPiston.y = iY;
    };

    this.unload = function(){
        if(_oOnAnimationEnd){
            _oPiston.off("animationend", _oOnAnimationEnd);
        };

        _oParentContainer.removeChild(_oPiston);
    };

    this.push = function(){
        _oOnAnimationEnd = _oPiston.on("animationend", this.stop);
        _oPiston.gotoAndPlay("pushAnim");
    };

    this.stop = function(){
        _oPiston.off("animationend", _oOnAnimationEnd);
        _oPiston.gotoAndStop("stop");
    };

    this.getX = function(){
        return _oPiston.x;
    };

    this._init(iX,iY);
}