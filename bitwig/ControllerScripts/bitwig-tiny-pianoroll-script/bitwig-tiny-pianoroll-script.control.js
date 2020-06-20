loadAPI(10);

load("config.js");

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


   var osc_server = osc.createAddressSpace();
   osc_server.registerDefaultMethod(function(connection, message){
      println("received message");
      println(message.getAddressPattern());
      println(message.getArguments());
   });
   osc_server.setShouldLogMessages (true);


   var osc_connect = osc.connectToUdpServer(cfg.send_host, cfg.send_host_port, osc_server);
   osc_connect.startBundle();
   osc_connect.sendMessage("/test", 33, 3939);
   osc_connect.sendMessage("/test", 333);
   osc_connect.endBundle();

   osc.createUdpServer (cfg.receive_host_port, osc_server);


   clip = host.createCursorClip(122 ,36);
   // TODO: Perform further initialization here.
   
   clip.addNoteStepObserver( function(noteStep){
      if(noteStep.state() == "NoteOn"){
         println("|");
      }
      println( "x:[" + noteStep.x() + "]y:[" + noteStep.y() + "]xduration:[" + noteStep.duration() + "]state:["+ noteStep.state()  + "]times:" + times);
      times += 1;
      osc_connect.sendMessage("/note", noteStep.x(), noteStep.y(), noteStep.duration(), noteStep.state().toString() );
   });
   clip.scrollToKey(12);
   tp = host.createTransport();
   tp.getPosition().markInterested();
   tp.getPosition().addValueObserver( function(value){
      println(value);
   });
   println("bitwig-tiny-pianoroll-script initialized!");
}


function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}