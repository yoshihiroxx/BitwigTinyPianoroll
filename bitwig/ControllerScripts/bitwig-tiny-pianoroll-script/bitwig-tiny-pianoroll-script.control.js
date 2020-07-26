loadAPI(10);

load("config.js");
load("oscActions.js");


// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true);

host.defineController("yoshihiro", "bitwig-tiny-pianoroll-script", "0.1", "a45e3423-91bf-4ac7-badc-2c3ce74a090e", "yoshihiro");

var clip;
var tp;
var times = 0;

var osc, cfg;


function init() {
   osc = host.getOscModule();
   
   cfg = Config;
   cfg.init();

   clip = host.createCursorClip(122 ,127);
   // TODO: Perform further initialization here.


   var osc_server = osc.createAddressSpace();
   osc_server.registerDefaultMethod(function(connection, message){
      println("received message");
      println(message.getAddressPattern());
      println(message.getArguments());
      var args = message.getArguments();
      switch(message.getAddressPattern()){
         case '/v1/bitwig/cursorclip/notes':
            println("!!!!");
            var parsed = JSON.parse(args[0]);
            println(parsed.type);
            if(args[0] == 'get'){
               println("get");
            }else if(parsed.type == 'set'){ 
               // var action = OscActions.modifyNote(parsed);
               // println(action);
               var payload = parsed.payload
               print(payload);
               if(parsed.meta.actionType === 'SET_NOTE'){
                  println('add note');
                  clip.setStep(payload.channel, payload.startBeat*4, payload.noteNumber, payload.velocity, payload.lengthInBeats);
               }else if (parsed.meta.actionType === 'CLEAR_NOTE'){
                  println('clear note ');
                  clip.clearStep(0, payload.startBeat*4, payload.noteNumber);
               }
               println("set");
            }
            break;
         default:
            println('no match');
            break;
      }
   });
   osc_server.setShouldLogMessages (true);


   var osc_connect = osc.connectToUdpServer(cfg.send_host, cfg.send_host_port, osc_server);
   osc_connect.startBundle();
   osc_connect.sendMessage("/test", 33, 3939);
   osc_connect.sendMessage("/test", 333);
   osc_connect.endBundle();

   osc.createUdpServer (cfg.receive_host_port, osc_server);

   
   clip.addNoteStepObserver( function(noteStep){
      if(noteStep.state() == "NoteOn" || noteStep.state() == "Empty"){
         var actionType = noteStep.state() == "NoteOn"? "SET_NOTE":"CLEAR_NOTE";
         const oscArgs = {
           type:'set',
           payload:{
             noteNumber:noteStep.y(),
             startBeat: noteStep.x() / 4.0,
             lengthInBeats:noteStep.duration(),
             velocity:noteStep.velocity(),
             channel: noteStep.channel()
           },
           meta:{actionType},
           error:false
         }
         osc_connect.sendMessage("/v1/tinypianoroll/oscclip/notes", JSON.stringify(oscArgs));

         println( "[[" + noteStep.state() + "]]x:[" + noteStep.x() + "]y:[" + noteStep.y() + "] duration:[" + noteStep.duration() + "]times:[" + times);
      }
      times += 1;
   });
   clip.scrollToKey(0);
   // tp = host.createTransport();
   // tp.getPosition().markInterested();
   // tp.getPosition().addValueObserver( function(value){
   //    println(value);
   // });
   println("bitwig-tiny-pianoroll-script initialized!");


}


function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}