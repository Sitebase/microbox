(function( $ ){
	var f = function() {},
	default_settings = {
		transitionDuration: null,
		onClosed : f,
		onOpened : f,
		onClose : f,
		onOpen : f
	},
	settings, self, border, border, loader, content, use_css3, load_tmr,
	methods = {
	  _init : function( options ) {

			// append microbox to DOM
			var b_class = ($.browser.msie) ? " ie" + jQuery.browser.version.slice(0,1) : "";
			$("body").append('<div id="mbox" class="mbox_overlay' + b_class + '"><div class="mbox_loader"></div><div id="light" class="mbox_border mbox_transparent mbox_round5"><div class="mbox_content">qsdfqsfqsdf</div></div></div>');

			// cache elements
			self = $("#mbox");
			border = self.find(".mbox_border");
			loader = self.find(".mbox_loader");
			content = self.find(".mbox_content");

			// hide microbox
			self.css({left: -9000, opacity: 0});
			border.css('opacity', 0);
			loader.css('opacity', 0);

			// merge user settings and defaults
			settings = $.extend(default_settings, options);

			// binds
			methods._applyBindings();

			// Get transition duration if needed
			if(settings.transitionDuration === null) {
				settings.transitionDuration = methods._getCssTransitionTime();
			}
			
			// check if there is CSS3 transition support
			use_css3 = methods._cssTransitionSupported();

			return this;

		},
		redraw :	function () {

			// get height
			var height = border.outerHeight();

			// center vertical
			border.css('margin-top', -Math.floor(height/2));

			// set width
			border.css('width', settings.width);

		},
		close : function () {
			settings.onClose();
			if(use_css3) {
				self.css("opacity", 0);
				border.css("opacity", 0);
				setTimeout(methods._onClosed, settings.transitionDuration);
			} else {
				self.animate({opacity: 0}, settings.transitionDuration, methods._onClosed);
			}
		},
		_onClosed : function () {
			self.css({left: -9000});
			border.css("opacity", 0).removeClass('mbox_hover');;
			methods._destruct();
			settings.onClosed();
		},
		open : function (contentProvider) {

			// Show overlay loader
			self.show().css("opacity", 0);
			methods._onOpen();
			if(use_css3) {
				self.css("opacity", 1);
				setTimeout(settings.onOpened, settings.transitionDuration);
			} else {
				self.animate({opacity: 1},settings.transitionDuration, settings.onOpened);
			}

			if(contentProvider == undefined) {
				methods.show();
			} else {
				methods.showLoader();
				var result = contentProvider.call(this, methods.show);
			}
		},
		_onOpen : function () {
			self.css("left", 0);
			settings.onOpen();
		},
		show : function (content) {
			if(content != undefined) methods.setContent(content);
			methods.hideLoader();
			methods.redraw();
			if(use_css3) {
				border.css("opacity", 1);
				setTimeout(settings.onOpened, settings.transitionDuration);
			} else {
				border.animate({opacity: 1},settings.transitionDuration, settings.onOpened);
			}
		},

		/**
		 * Show loading effect
		 */
		showLoader : function () {
			loader.animate({opacity: 1});
			var top = 0;
			clearInterval(load_tmr);
			load_tmr = setInterval(function() {
				if(top > 440) top = 0;
				loader.css('backgroundPosition', '0 -' + top + 'px');
				top += 40;
			}, 80);
		},

		/**
		 * Hide loading effect
		 */
		hideLoader : function () {
			clearInterval(load_tmr);
			loader.animate({opacity: 0});
		},

		/**
		 * Add content to microbox
		 */
		setContent : function (html) {
			content.html(html);
		},

		/**
		 * Check if CSS3 transitions are supported
		 */
		_cssTransitionSupported : function () {
			var div = document.createElement('div')
			cssTransitionsSupported = ('WebkitTransition' in div.style) || ('MozTransition' in div.style) || ('OTransition' in div.style) || ('MsTransition' in div.style) || ('KhtmlTransition' in div.style);
			delete div;
			return cssTransitionsSupported;
		},
	  _getCssTransitionTime : function () {
			duration = self.css('-moz-transition-duration') || 
							self.css('-webkit-transition-duration') || 
							self.css('-o-transition-duration') || 
							self.css('transition-duration');
			return Math.floor(parseFloat(duration) * 1000) + 100;
		},
	  _applyBindings : function () {
			// Add overlay click close action
			$(".mbox_icon_cross").click(methods.close);
			
			// esc key close
			$(document).keydown(function(e) { if(e.keyCode==27) methods.close() })

			// bind redraw on resize
			$(window).resize(methods.redraw);

			// add hover class to mbox_border
			border.mouseover(function() {
				 $(this).addClass('mbox_hover');
			}).mouseout(function(){
				$(this).removeClass('mbox_hover');
			});

			// Overlay click close
			self.click(function(e) {
				
				// Prevent close if mouse is in dialog
				if(border.hasClass('mbox_hover')) {
					return;
				}
				methods.close()
			});

		},  
	  _destruct : function () {
			self.find(".mbox_content").html("");
		}	

  };

	$.microbox = function( options ) {

		// init microbox
		microbox = methods._init.apply( this, [options] );
		
		// add public methods
		microbox.open = methods.open;
		microbox.close = methods.close;
		microbox.redraw = methods.redraw;
		microbox.setContent = methods.setContent;

		// return microbox
		return microbox;

  };

})( jQuery );

