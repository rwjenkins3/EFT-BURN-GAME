function CReadyGoAnim(pStartPos,pEndPos,iFontSize,szColor,oParentContainer){
    var _aCbCompleted;
    var _aCbOwner;
    var _pStartPos = pStartPos;
    var _pEndPos = pEndPos;
    
    var _oFade;
    var _oText;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    this._init = function(iFontSize,szColor){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oFade.visible = false;
        _oParentContainer.addChild(_oFade);
        
        _oContainer = new createjs.Container();
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y;
        _oParentContainer.addChild(_oContainer);

        _oText = new createjs.Text(TEXT_READY,iFontSize+"px "+FONT, szColor);
        _oText.textAlign = "center";
        _oText.textBaseline = "alphabetic";
        _oContainer.addChild(_oText);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };

    this.showFade = function(){
        _oFade.visible = true;
    };

    this.hideFade = function(){
        _oFade.visible = false;
    };
    
    this.show = function(szMaterial){
        _oContainer.y = _pStartPos.y;
        _oText.text = TEXT_COLLECT+"\n"+TEXT_MATERIALS[szMaterial];

        createjs.Tween.get(_oContainer)
        .wait(1000)
        .to({y:CANVAS_HEIGHT/2}, 400,createjs.Ease.backOut)
        .wait(700)
        .to({y:_pEndPos.y}, 200,createjs.Ease.cubicOut)
        .call(function(){
            _oThis._showReady();
        });
    };
    
    this._showReady = function(){
        setTimeout(function(){playSound("ready",1,false);},500);
        
        _oContainer.y = _pStartPos.y;
        _oText.text = TEXT_READY;
        
        createjs.Tween.get(_oContainer).wait(500).to({y:CANVAS_HEIGHT/2}, 400,createjs.Ease.backOut)
        .wait(700)
        .to({y:_pEndPos.y}, 200,createjs.Ease.cubicOut)
        .call(function(){
            _oThis._showGo();
        });
    };

    this._showGo = function(){
        setTimeout(function(){playSound("go",1,false);},500);
        
        _oContainer.y = _pStartPos.y;
        _oText.text = TEXT_GO;
        
        createjs.Tween.get(_oContainer).wait(500).to({y:CANVAS_HEIGHT/2}, 400,createjs.Ease.backOut)
        .wait(700)
        .to({y:_pEndPos.y}, 200,createjs.Ease.cubicOut)
        .call(function(){
            _oThis.hideFade();
            if(_aCbCompleted[ON_END_READYGO_ANIM]){
                _aCbCompleted[ON_END_READYGO_ANIM].call(_aCbOwner[ON_END_READYGO_ANIM]);
            }
        });
    };
    
    this._init(iFontSize,szColor);
}