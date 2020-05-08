
var Config = {};

Config.receive_host = "127.0.0.1";
Config.receive_host_port = "1234";
Config.send_host = "127.0.0.1";
Config.send_host_port = "1235";

Config.init = function(){
    var prefs = host.getPreferences();

    Config.receiveHostSetting = prefs.getStringSetting ('Host', 'Receive from', 15, this.receive_host);
    Config.receiveHostSetting.addValueObserver (function (value)
    {
        Config.receive_host = value;
    });

    Config.receiveHostPortSetting = prefs.getStringSetting ('Host Port', 'Receive from', 6, this.receive_host_port);
    Config.receiveHostPortSetting.addValueObserver (function (value)
    {
        Config.receive_host_port = value;
    });

    Config.sendHostSetting = prefs.getStringSetting ('Host', 'Send to', 15, this.send_host);
    Config.sendHostSetting.addValueObserver (function (value)
    {
        Config.send_host = value;
    });

    Config.sendHostPortSetting = prefs.getStringSetting ('Host Port', 'Send to', 6, this.send_host_port);
    Config.sendHostPortSetting.addValueObserver (function (value)
    {
        Config.send_host_port = value;
    });
    
}