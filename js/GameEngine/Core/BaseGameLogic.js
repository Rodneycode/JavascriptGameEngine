
var GameState = {
    Invalid: -1,
    Initializing : 0,
    LoadingGameEnvironment: 1,
    Running:  2,
    MainMenu: 3,
    WaintingForPlayers:4,
    WaintingForPlayersToLoadEnvironment:5,
    SpawningPlayerActors:6
};


var BaseGameLogic = function(){
    this.actorsMap = {};
    this.gameViewList = [];
    this.actorFactory = null;
    this.gameState   = GameState.Initializing;
    this.lastViewId  = 0;
    this.processMgr = null;
    this.proxy = false;
    
    this.expectedPlayers = 0;
    this.expectedRemotePlayers = 0;
    this.expectedAI = 0;
    this.humanPlayersAttached = 0;
    this.AIPlayersAttached = 0;
    this.humanGamesLoaded = 0;
};

BaseGameLogic.prototype.Init = function(){
    this.actorFactory = new ActorFactory();
    this.actorFactory.RegisterComponentFactory();
    
    this.processMgr = new ProcessManager();
    
};

/**
 * That means we are joining an game already running
 * We are the remote player ?
 */
BaseGameLogic.prototype.SetProxy = function(){
    this.proxy = true;
    
    //TODO create websocket
    //https://www.html5rocks.com/en/tutorials/websockets/basics/
    //var connection = new WebSocket('ws://localhost/game');
    
};
BaseGameLogic.prototype.OnActorMoveDelegate = function(actorId, vec2){
    //this method should listen for an event fired from InputManager
    
};

BaseGameLogic.prototype.LoadGame = function(levelName, callback){
    var req = new Request();
    req.ReadFile(levelName, function(rootNode){
        
        // load all initial actors
        
        
        //for each view we should call LoadGame too
        
        // trigger the Environment Loaded Game event 
        // - only then can player actors and AI be spawned!
        if(this.proxy){
            
        }
        
        if(callback){
            callback();
        }
    });
};

BaseGameLogic.prototype.AddView = function(view, actorId){
    view.Attach(++this.lastViewId, actorId);
    this.gameViewList.push(view);
};

BaseGameLogic.prototype.RemoveView = function(view){
    //TODO  need unit test, maybe consider using array.indexOf + array.slice
    for(var i=0; i < this.gameViewList.length; i++){
        if(this.gameViewList[i].Type === view.Type){
            this.gameViewList[i] = null;
        }
    }
    return false;    
};

BaseGameLogic.prototype.CreateActor = function(actorResource, overridesXML/*optional*/, initialTransform/*optional*/, serverActorId/*optional*/){
    var overrides = overridesXML || null;
    var transform = initialTransform || null;
    var serverId  = serverActorId || null;
    
    //create the actor provided and fire an event
    var actor = this.actorFactory.CreateActor(actorResource);
    
};

BaseGameLogic.prototype.GetActor = function(actorId){
    if(this.actorsMap[actorId]){
        return this.actorsMap[actorId];
    }
    return null;
};

BaseGameLogic.prototype.AttachProcess = function(process){
    this.processMgr.Attach(process);
    
};

BaseGameLogic.prototype.Update = function(fDeltaTime){
    switch(this.gameState){
        case GameState.Initializing:
            this.ChangeState(GameState.MainMenu);
            break;
        case GameState.MainMenu:
            
            break;
        case GameState.WaintingForPlayers:
            
            //this.gameViewList pop menu view from the list 
            
            this.expectedPlayers = g_GameApp.gameOptions.expectedPlayers -1;
            if(g_GameApp.gameOptions.gameHost != ""){
                this.SetProxy();
                this.expectedAI=0;
                this.expectedRemotePlayers =0;
                
                //attempt attach as client, if fails then redirect to MainMenu game state
                
            }
            else if(this.expectedPlayers > 0){
                //so, we will need prepare the environment to support remote players
                //we need to initialize the sockets
                
                
            }
            
            if(g_GameApp.gameOptions.level != ""){
                this.ChangeState(GameState.LoadingGameEnvironment);
            }
            break;
        case GameState.Running:
            this.processMgr.Update(fDeltaTime);
            
            break;
        case GameState.WaintingForPlayersToLoadEnvironment:
            if(this.expectedPlayers + this.expectedRemotePlayers <= this.humanGamesLoaded){
                this.ChangeState(GameState.SpawningPlayerActors);
            }
            break;
        case GameState.SpawningPlayerActors:
            this.ChangeState(GameState.Running);
            break;
        default:
            console.log("invalid game state: ", this.gameState);
    }
    
    for(var i=0; i < this.gameViewList.length; i++){
        this.gameViewList[i].Update(fDeltaTime);
    }
    
    for(var actorIDKey in this.actorsMap){
        this.actorsMap[actorIDKey].Update(fDeltaTime);
    }
};

BaseGameLogic.prototype.ChangeState = function(newGameState){
    
    switch(newGameState){
        case GameState.LoadingGameEnvironment:
            var status = g_GameApp.LoadGame();
            
            if(status){
                this.ChangeState(GameState.WaintingForPlayersToLoadEnvironment);
            }
            else{
                console.log("g_GameApp.LoadGame Failed to Load");
            }
            break;
        case GameState.WaintingForPlayersToLoadEnvironment:
            
            
            break;
    }
    
};

