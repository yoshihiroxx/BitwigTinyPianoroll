var OscActions = {};



OscActions.modifyNote= function(args){
  if(args[1] !== 'SET_NOTE' && args[1] !== 'CLEAR_NOTE'){
    return;
  }
  return {
    type:args[1],
    payload:{
      x:args[2],
      y:args[3],
      velocity:args[4],
      duration:args[5],
    }
  }
}

OscActions.init = function(){

}