var WysiwygEditor = Ember.TextArea.extend({
    attr:'content',
    didInsertElement: function(){

        var model = this.get('model'),
        attr = this.get('attr');
        var loadCSS = function(url, callback){
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = url;
                link.id = 'theme-style';

                document.getElementsByTagName('head')[0].appendChild(link);
        };          
        var initEditor = this.$().sceditor({
                    plugins: "none",
                    style: "/javascripts/vendor/sceditor/jquery.sceditor.default.min.css",
                    width: "100%",
                    height:"400px",
                    resizeMaxWidth:"100%",
                    resizeMinWidth:"100%",
                    resizeMinHeight: "400px",
                    emoticonsEnabled:false,
                    toolbar: "bold,italic,underline|left,center,right,justify,ltr,rtl|size,color,removeformat|bulletlist,orderedlist,table,code|image,link,unlink,youtube|source",
                    resizeEnabled:true,
        });
        var instance = this.$().sceditor('instance');
        instance.keyUp(function(e){
            model.set(attr, instance.val());
        });
        var theme = "/javascripts/vendor/sceditor//themes/default.min.css";
        loadCSS(theme, initEditor);
    }
});

// Ember.Handlebars.helper('wysiwyg', WysiwygEditor);


module.exports =  WysiwygEditor;
