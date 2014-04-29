(function( _modernizr ){ 'use strict';

    var layers          = Array.prototype.slice.call(document.querySelectorAll('.layer'), 0),
        pageContainer   = document.querySelector('.pages'),
        pages           = Array.prototype.slice.call(document.querySelectorAll('.page'), 0),
        pageCount       = pages.length;


    /**
     * Add vendor-prefixes to style declarations.
     * @param declaration
     * @returns {string}
     * @private
     */
    function _prefix( declaration ){
        return ['-webkit-', '-moz-', '-o-', '-ms-', ''].join(declaration + ';');
    }


    /**
     * Handle setting styles for the parallax layers to animate (parallax *and* page layers).
     * @param index
     */
    function layersTo( index ){
        // If 3d transforms are available...
        if( _modernizr.csstransforms3d ){
            layers.forEach(function(_node){
                var _percent = -((index * 0.2)*100)+'%';
                _node.style.cssText = _prefix('transform:translateX('+_percent+')');
            });
            // Page layer transitions
            pageContainer.style.cssText = _prefix('transform:translateX('+ -((100/pageCount)*index) +'%)');
            return;
        }

        // If we're here, fallback to pos:left
        layers.forEach(function(_node){
            _node.style.left = -((index * 0.2)*100)+'%';
        });
        // Page layer transitions
        pageContainer.style.left = -(index*100)+'%';
    }


    /**
     * Toggle the navigation open/closed.
     */
    function toggleNavigation(){
        document.querySelector('body').classList.toggle('nav-open');
    }


    /**
     * Click handler on navigation menu.
     * @note: click event register on <a> tag, so get the parent right away (first line)
     * @return void
     */
    document.getElementById('nav-list').addEventListener('click', function(_event){
        var parent = _event.target.parentNode,
            index  = [].indexOf.call(parent.parentNode.children, parent);
        toggleNavigation();
        layersTo(index);
        pages.forEach(function(_node, _loopIndex){
            if( _loopIndex !== index ){
                _node.classList.remove('active');
            }else{
                _node.classList.add('active');
            }
        });
    });


    /**
     * Trigger the navigation open
     */
    document.getElementById('nav-trigger').addEventListener('click', function(_event){
        toggleNavigation();
    });


    /**
     * Form Handler
     * @type {{goto: Function}}
     */
    $(document).on('submit', '#frmContact', function(_ev){
        _ev.preventDefault();
        var $this = $(this),
            _data = $this.serializeArray(),
            _path = document.querySelector('[name="application-tools"]').getAttribute('content');
        $this.addClass('sending');
        $.post(_path + 'contact', _data, function(resp){
            $this.addClass('sent');
        }, 'json');
    });


    window.controls = {
        goto: layersTo
    };

})( Modernizr || {} );