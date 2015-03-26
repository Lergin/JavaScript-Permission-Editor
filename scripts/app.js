Polymer('permission-edit',{
    loadPermissions: function() {
        this.groups = [];
        for(group in this.jsnew.groups){
            console.log(group)
            var index = this.groups.push(this.jsnew.groups[group]);
            this.groups[index-1].name = group;
       
            this.groups[index-1].permissions_new = {};
            
            for(var i = 0; i < this.groups[index-1].permissions.length; i++){
                
                var split = this.groups[index-1].permissions[i].split(".");
                var pluginrow = split[0];
                var plugin = pluginrow.replace(/-/, '');
                var permission = {};
                permission.name = split.slice(1).join('.');
                var pluginid = 0;
                
                var k = 0;
                for(var j = 0; j < this.permissions.length; j++){
                    if(this.permissions[j].plugin !== plugin) {
                        k++;
                    }else{
                        pluginid = j;
                        break;
                    }
                }
                
                if(!this.groups[index-1].permissions_new[plugin]){
                    this.groups[index-1].permissions_new[plugin] = {};
                    
                    
                    if(k > this.permissions.length){
                        pluginid = k;
                        this.permissions[pluginid] = {};
                        this.permissions[pluginid].plugin = plugin;
                        this.permissions[pluginid].permissions = [];
                    }
                }
                
                this.groups[index-1].permissions_new[plugin][permission] = ((pluginrow.charAt(0) == '-')?false:true);
                
                k = 0;
                for(var j = 0; j < this.permissions[pluginid].permissions.length; j++){
                    if(this.permissions[pluginid].permissions[j].name !== permission.name){
                        k++;
                    }
                }

                if(k >= this.permissions[pluginid].permissions.length && permission.name !== '*' && permission.name !== '' && permission.name !== undefined){
                    this.permissions[pluginid].permissions.push(permission);
                }
            }
            
            this.groups[index-1].permissions = this.groups[index-1].permissions_new;
            delete this.groups[index-1].permissions_new;
        }
        
        this.ready();
    },
    
    toggle: function(e) {
        this.permissions[e.path[1].childNodes[2].innerText].toggle = !this.permissions[e.path[1].childNodes[2].innerText].toggle;
    },
    
    alltrue: function(data) {
        console.log(data);
        for(var i = 0; i < data.length; i++){
            console.log(data[i]);
        }  
    },
    
    checkboxchanged: function(e) {
        plugin = e.target.templateInstance.model.__proto__.plugin.plugin;
        pluginindex = e.target.templateInstance.model.__proto__.index;
        permission = e.target.templateInstance.model.__proto__.permission;
        group = e.target.templateInstance.model.group;
        
        if(!group.permissions[plugin]) group.permissions[plugin] = {};  
        
        group.permissions[plugin][permission.name] = !group.permissions[plugin][permission.name];
        
        var truepermissions = 0;
        
        var permissionlist = this.permissions[pluginindex].permissions;
        
        for(var i = 0; i < permissionlist.length; i++){
            if(group.permissions[plugin].hasOwnProperty(permissionlist[i].name)){
                if(group.permissions[plugin][permissionlist[i].name] == true && !group.permissions[plugin]['*']){
                    truepermissions++;
                }
            }else{
                group.permissions[plugin][permissionlist[i].name] == false;
            }
        }
        
        if(truepermissions >= permissionlist.length){
            group.permissions[plugin]['*'] = true;
        }else{
            group.permissions[plugin]['*'] = false;
        }
    },
    
    allcheckboxchanged: function(e) {
        var plugin = e.target.templateInstance.model.__proto__.plugin.plugin;
        pluginindex = e.target.templateInstance.model.__proto__.index;
        var group = e.target.templateInstance.model.group;
        
        if(!group.permissions[plugin]) group.permissions[plugin] = {};
        
        var newState = !group.permissions[plugin]['*'];
        group.permissions[plugin]['*'] = newState
        
        var permissionlist = this.permissions[pluginindex].permissions;
        
        for(var i = 0; i < permissionlist.length; i++){
            group.permissions[plugin][permissionlist[i].name] = newState;
        }
    },
    
    ready: function(){   
        for(var group in this.groups){
            var i = 0;
            for(var plugin in this.groups[group].permissions){
                if(this.groups[group].permissions[plugin]['*']){
                    stateall = this.groups[group].permissions[plugin]['*'];
                    
                    var permissionlist = [];
                    
                    for(var j = 0; j < this.permissions.length; j++){
                        if(this.permissions[j].plugin == plugin){
                            permissionlist = this.permissions[j].permissions;
                            break;
                        }
                    }

                    for(var j = 0; j < permissionlist.length; j++){  
                        if(typeof this.groups[group].permissions[plugin][permissionlist[j].name] == 'undefined'){
                            this.groups[group].permissions[plugin][permissionlist[j].name] = stateall;
                        }else{
                            this.groups[group].permissions[plugin]['*'] = false;
                        }
                    }
                }
                i++;
            }
        }
    },
    
    save: function(){
        this.js = {};
        this.js.groups = {};
        var groups = JSON.parse(JSON.stringify(this.groups));
        for(var j = 0; j < groups.length; j++){
            var group = groups[j];
            
            this.js.groups[group.name] = groups[j];
            
            this.js.groups[group.name].permissions_new = [];
            
            for(plugin in this.js.groups[group.name].permissions){
                for(permission in this.js.groups[group.name].permissions[plugin]){
                    this.js.groups[group.name].permissions_new.push((this.js.groups[group.name].permissions[plugin][permission]?'':'-') + plugin + "." + permission);
                }
            }
            
            this.js.groups[group.name].permissions = this.js.groups[group.name].permissions_new;
            delete this.js.groups[group.name].permissions_new;
            delete this.js.groups[group.name].name;
        }
    },

    permissions: [
        {
            plugin: "lagg",
            toggle: false,
            permissions:[
                {
                    name: 'clear',
                    description: 'behebt laggs'
                },
                {
                    name: 'check',
                    description: 'behebt laggs'
                },
                {
                    name: 'reload',
                    description: 'reloads the plugin'
                },
                {
                    name: 'killmobs',
                    description: 'behebt laggs'
                },
                {
                    name: 'area',
                    description: 'behebt laggs'
                },
                {
                    name: 'unloadchunks',
                    description: 'behebt laggs'
                },
                {
                    name: 'chunk',
                    description: 'behebt laggs'
                },
                {
                    name: 'tpchunk',
                    description: 'behebt laggs'
                },
                {
                    name: 'admin',
                    description: 'behebt laggs'
                },
                {
                    name: 'gc',
                    description: 'behebt laggs'
                },
                {
                    name: 'tps',
                    description: 'behebt laggs'
                },
                {
                    name: 'halt',
                    description: 'behebt laggs'
                },
                {
                    name: 'help',
                    description: 'behebt laggs'
                }
            ]
        },
        {
            plugin: "modifyworld",
            toggle: false,
            permissions:[
                {
                    name: 'chat',
                    description: 'erlaupt das chaten'
                },
                {
                    name: 'spam',
                    description: 'erlaupt das spammen'
                }
            ]
        }
    ],
    
    'groups': [
        { 
            'name': 'Admin', 
            'permissions': {
                'essentials': {
                    '*': true,
                    'help': false
                }
            }
        },
        {
            'name': 'Spieler',
            'permissions': {
                'essentials': {
                    '*': true,
                    'help': false,
                    'home': true,
                    'sethome': true,
                    'back': false
                },
                'chestlock': {
                    '*': true
                },
                'modifyworld': {
                    '*': true
                }
            }
        },
        { 
            'name': 'Gast',
            'permissions': {
                'essentials': {
                    '*': true
                },
                'modifyworld': {
                    'chat': true
                }
            }
        }
    ],
    openimportfkt: function() {
        this.openimport = !this.openimport;
    },
    openexportfkt: function() {
        this.openexport = !this.openexport;
    }
});
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-60277501-2']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
