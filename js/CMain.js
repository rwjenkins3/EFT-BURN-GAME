function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oChooseCharacterMenu;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage, true);
        s_oStage.preventSelection = false;
		
        s_bMobile = isMobile();
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
        
    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);


        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'catch_item',loop:false,volume:1, ingamename: 'catch_item'});
        s_aSoundsInfo.push({path: './sounds/',filename:'catch_malus',loop:false,volume:1, ingamename: 'catch_malus'});
        s_aSoundsInfo.push({path: './sounds/',filename:'time_over',loop:false,volume:1, ingamename: 'time_over'});
        s_aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'ready',loop:false,volume:1, ingamename: 'ready'});
        s_aSoundsInfo.push({path: './sounds/',filename:'go',loop:false,volume:1, ingamename: 'go'});
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});       
        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
 
    };
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
        
        
    };


    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        //-----CHARACTER-----
        var szCharacter = "female";
        for(var cont=0;cont<2;cont++){
            for(var j=0;j<4;j++){
                for(var i=0;i<=28;i++){
                    s_oSpriteLibrary.addSprite(szCharacter+"_"+MATERIALS[j]+"_"+i,"./sprites/character_"+szCharacter+"/"+MATERIALS[j]+"/"+szCharacter+"_"+MATERIALS[j]+"_"+i+".png");
                }
            }
            szCharacter = "male";
        }
        //----------------------
        //-----COMPACTOR--------
        for(var i=0;i<=33;i++){
            s_oSpriteLibrary.addSprite("compactor_bottom_"+i,"./sprites/compactor_bottom/compactor_bottom_"+i+".png");
            s_oSpriteLibrary.addSprite("compactor_top_"+i,"./sprites/compactor_top/compactor_top_0_"+i+".png");
        }
        //----------------------
        //-----CONVEYOR---------
        for(var i=0;i<=59;i++){
            s_oSpriteLibrary.addSprite("conveyor_"+i,"./sprites/conveyor/conveyor_"+i+".jpg");
        }
        //----------------------
        //-----PISTON-----------
        for(var i=0;i<=14;i++){
            s_oSpriteLibrary.addSprite("piston_"+i,"./sprites/piston/piston_"+i+".png");
        }
        //----------------------
        //-----ITEMS---------
        for(var i=0; i<4; i++){
            for(var j=0; j<=4; j++){
                s_oSpriteLibrary.addSprite(MATERIALS[i]+"_"+j,"./sprites/items/"+MATERIALS[i]+"_"+j+".png");
            }
        }
        //----------------------
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");

        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");  
        s_oSpriteLibrary.addSprite("but_female","./sprites/but_female.png");
        s_oSpriteLibrary.addSprite("but_male","./sprites/but_male.png");
        s_oSpriteLibrary.addSprite("but_help","./sprites/but_help.png");
        s_oSpriteLibrary.addSprite("but_home","./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_left","./sprites/but_left.png");
        s_oSpriteLibrary.addSprite("but_right","./sprites/but_right.png");
        s_oSpriteLibrary.addSprite("but_next","./sprites/but_next.png");
        s_oSpriteLibrary.addSprite("but_no","./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_yes","./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_settings","./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("but_start","./sprites/but_start.png");

        s_oSpriteLibrary.addSprite("best_score_panel","./sprites/best_score_panel.png");
        s_oSpriteLibrary.addSprite("hand_indicate","./sprites/hand_indicate.png");
        
        s_oSpriteLibrary.addSprite("glass","./sprites/glass.png");
        s_oSpriteLibrary.addSprite("paper","./sprites/paper.png");
        s_oSpriteLibrary.addSprite("plastic","./sprites/plastic.png");
        s_oSpriteLibrary.addSprite("organic","./sprites/organic.png");
        s_oSpriteLibrary.addSprite("collect","./sprites/collect.png");
        s_oSpriteLibrary.addSprite("avoid","./sprites/avoid.png");

        s_oSpriteLibrary.addSprite("alert","./sprites/alert.png");
        s_oSpriteLibrary.addSprite("keyboard_left","./sprites/keyboard_left.png");
        s_oSpriteLibrary.addSprite("keyboard_right","./sprites/keyboard_right.png");
        s_oSpriteLibrary.addSprite("logo_menu","./sprites/logo_menu.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("msg_box_big","./sprites/msg_box_big.png");
        s_oSpriteLibrary.addSprite("progress_bar","./sprites/progress_bar.png");
        s_oSpriteLibrary.addSprite("time_panel","./sprites/time_panel.png");
        s_oSpriteLibrary.addSprite("score_panel","./sprites/score_panel.png");
        s_oSpriteLibrary.addSprite("swipe","./sprites/swipe.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        //console.log("PERC: "+iPerc);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._onRemovePreloader = function(){
        try{
            saveItem("ls_available","ok");
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }

        _oPreloader.unload();

        s_oSoundTrack = playSound("soundtrack", 1,true);

        if(getItem(PREFIX_LOCAL_STORAGE+"_first_game") == "false"){
            s_iNumHelpFirstGame = 0;
        }
        this.gotoMenu();
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };

    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoChooseCharacterMenu = function(){
        _oChooseCharacterMenu = new CChooseCharacterMenu();
        _iState = STATE_CHOOSE_CHARACTER_MENU;
    };
    
    this.gotoGame = function(bMale){
        _oGame = new CGame(bMale);   						
        _iState = STATE_GAME;
    };

    this.stopUpdateNoBlock = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
    };

    this.startUpdateNoBlock = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false; 
    };

    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }
        
    };
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }

        
        if(_iState === STATE_GAME){
            _oGame.update();
        }

        s_oStage.update(event);
       
    };
    
    s_oMain = this;
    
    _oData = oData;
    
    
    HERO_ACCELERATION = oData.hero_acceleration;
    HERO_FRICTION = oData.hero_friction;
    MAX_HERO_SPEED = oData.max_hero_speed;
    MALUS_PERC = oData.malus_percentage;
    TIME_LEVEL = oData.time_level;
    ITEM_POINTS = oData.item_point;
    MALUS_POINTS = oData.malus_point;
    ENABLE_FULLSCREEN = oData.fullscreen;
    CHANGE_DELAY = TIME_LEVEL/4;
    s_bAudioActive = oData.audio_enable_on_startup;


    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
var s_oCanvas;
var s_bFullscreen = false;
var s_aSounds;
var s_bStorageAvailable = true;
var s_iBestScore = 0;
var s_iNumHelpFirstGame = 1;
var s_aSoundsInfo;