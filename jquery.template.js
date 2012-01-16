(function ($) {
    $.widget("ui.template",{
        options: {
            replaceDom: true, //will replace the this.element with the template base div.
            nodesDirectAttach: true,
            template: "<div></div>" //The base template,
        },
        nodes: {},
        bound: {}, //Nodes bound to options.
        events: {},
            //notes:
            // - data-node will create a reference to the 'data-node' tagged element in the this object
            //  the base node is always attached to domNode (I know, I'm copying dojo here)
            // - data-bind will connect the tagged element with a option. If the option is updated the
            //  elements content (via .text()) will be replaced. It does not allow inserting of HTML
            // - data-events - is used to list a set of events and the callbacks that should be attached to them
            //  Callbacks CANNOT have arguments. Callbacks MUST exist in the widget. Not anywhere else.
        _buildTemplate:function () {
            console.info("build template");
            var self = this;
            var el = $(this.options.template); //First convert the template string to real dom nodes
            //extract all the attributed nodes
            el.children("[data-node]").each(function(i,e) {
                e = $(e);
                if(self.nodesDirectAttach) {
                    self[e.attr("data-node")] = e;
                }

                self.nodes[e.attr("data-node")] = e;
            });

            el.children("[data-bind]").each(function (i,e) { //Need to find a could way to 'watch' these elements. or rather
                //watch the options that need to attach to them.
                e = $(e);
                self.bound[e.attr("data-bind")] = e;
            });

            el.children("[data-event]").each(function (i,e) {
                e = $(e);
                var eventString = e.attr("data-events");
                var events = split(",",eventString);
                for(var x in events){
                    var ev = split(":",events[x]);
                    self._setupEventCallback(e,ev[0],ev[1]);
                }
            });

            this.domNode = el;
            if(this.options.replaceDom) {
                var master = $(this.element);
                var id = master.attr("id");
                var classes = master.attr("class");
                $(this.element).replaceWith(this.domNode);
                this.domNode.attr("id",id);
                this.domNode.attr("class",this.domNode.attr("class")+" "+classes);
                this.oldEl = this.element;
                this.element = this.domNode;
            } else {
                $(this.element).append(this.domNode);
            }


        },
        _setupEventCallback: function (element,event,callback) {
            //Callback is not directly added as we want to maintain the correct scope
            //This is done by calling the callback inside an IIFE against the 'self' object.
            var self = this;
            $.bind(element,event,function (e) {
                self[callback](e);
            });
        },
        _postCreate: function () {
            console.info("post create");
        },
        _setOption: function (key,value) {
            if(this.bound[key]) {
                this.bound[key].text(value);
            }
        },
        _create: function () {
            console.info("Create running");
            this._buildTemplate();
            this._postCreate();
        }
    });
})(jQuery);
