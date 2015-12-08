/*
 *  tickingClocks - v1.0.0
 *
 *  Made by Callum Hopkins
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

	"use strict";

	var tickingClocks = "tickingClocks",
		defaults = {
			timezone: 0,
			clockSize: 100,
			showSeconds: true,
			clockBGColor: "#f5f5f5",
			clockBorderWidth: 2,
			clockBorderColor: "#444444",
			clockSecondHandColor: "#444444",
			clockMinuteHandColor: "#444444",
			clockHourHandColor: "#444444",
			clockSecondHandWidth: 0,
			clockMinuteHandWidth: 0,
			clockHourHandWidth: 0,
			clockHandLength: 6,
			clockPinColor: "#444444",
			clockScaleRatio: 2,
			clockPinSize: 0,
			showTimeStrokes: true,
			clockTimeStrokeColor: "#444444",
			clockTimeStrokeWidth: 2
		};


	function Plugin ( element, options ) {
		this.element = element;

		this.settings = $.extend( {}, defaults, options );
		if(this.settings.clockSecondHandWidth <= 0){
			this.settings.clockSecondHandWidth = this.settings.clockSize/75
		}
		if(this.settings.clockMinuteHandWidth <= 0){
			this.settings.clockMinuteHandWidth = this.settings.clockSize/50
		}
		if(this.settings.clockHourHandWidth <= 0){
			this.settings.clockHourHandWidth = this.settings.clockSize/35
		}
		if(this.settings.clockPinSize <= 0){
			this.settings.clockPinSize = this.settings.clockSize/40
		}
		if(this.settings.clockPinSize <= 0){
			this.settings.clockPinSize = this.settings.clockSize/40
		}
		this._defaults = defaults;
		this._name = tickingClocks;
		this.parts = []
		this.init();
	}

	$.extend(Plugin.prototype, {
		init: function () {
			var $that = this;
			this.setup_clock(this.settings,this);
			this.draw_clock(this.settings.timezone,this);
			setInterval( function(){
				$that.draw_clock($that.settings.timezone,$that)
			},1000);
		},

		setup_clock: function (settings,elm){
		  var canvas = Raphael(elm.element.id,settings.clockSize, settings.clockSize);
		  var clock = canvas.circle((settings.clockSize/2),(settings.clockSize/2),((settings.clockSize/2)-2));
		  clock.attr({"fill":settings.clockBGColor,"stroke":settings.clockBorderColor,"stroke-width":settings.clockBorderWidth})
		  if(settings.showTimeStrokes){
			  var hour_sign;
			  for(var i=0;i<12;i++){
			    var start_x = (settings.clockSize/2)+Math.round((((settings.clockSize/2)/2)+(settings.clockSize/5))*Math.cos(30*i*Math.PI/180));
			    var start_y = (settings.clockSize/2)+Math.round((((settings.clockSize/2)/2)+(settings.clockSize/5))*Math.sin(30*i*Math.PI/180));
			    var end_x = (settings.clockSize/2)+Math.round(((settings.clockSize/2)-(settings.clockSize/12))*Math.cos(30*i*Math.PI/180));
			    var end_y = (settings.clockSize/2)+Math.round(((settings.clockSize/2)-(settings.clockSize/12))*Math.sin(30*i*Math.PI/180));  
			    hour_sign = canvas.path("M"+start_x+" "+start_y+"L"+end_x+" "+end_y);
			    hour_sign.attr({stroke: settings.clockTimeStrokeColor, "stroke-width": settings.clockTimeStrokeWidth})
			  }
		  }
		  this.parts.hour_hand = canvas.path("M"+(settings.clockSize/2)+" "+(settings.clockSize/2)+"L"+(settings.clockSize/2)+" "+(((settings.clockSize/settings.clockHandLength)/0.3)));
		  this.parts.hour_hand.attr({stroke: settings.clockHourHandColor, "stroke-width": settings.clockHourHandWidth});
		  this.parts.minute_hand = canvas.path("M"+(settings.clockSize/2)+" "+(settings.clockSize/2)+"L"+(settings.clockSize/2)+" "+(((settings.clockSize/settings.clockHandLength)/0.6)));
		  this.parts.minute_hand.attr({stroke: settings.clockMinuteHandColor, "stroke-width": settings.clockMinuteHandWidth});
		  if(settings.showSeconds){
		  	this.parts.second_hand = canvas.path("M"+(settings.clockSize/2)+" "+((settings.clockSize/2))+"L"+(settings.clockSize/2)+" "+(settings.clockSize/settings.clockHandLength));
		  	this.parts.second_hand.attr({stroke: settings.clockSecondHandColor, "stroke-width": settings.clockSecondHandWidth}); 
		  }
		  this.parts.pin = canvas.circle((settings.clockSize/2), (settings.clockSize/2), this.settings.clockPinSize);
		  this.parts.pin.attr({"fill": settings.clockPinColor, "stroke":settings.clockPinColor} );
		},

		draw_clock: function (timezone, elm){
		  var now = new Date();
		  if (now.dst()) { timezone-- }
		  var hours = now.getUTCHours() + timezone;
		  var minutes = now.getUTCMinutes();
		  if(elm.settings.showSeconds){
		  	var seconds = now.getUTCSeconds();
		  }
		  this.parts.hour_hand.rotate(30*hours+(minutes/2.5), (elm.settings.clockSize/elm.settings.clockScaleRatio), (elm.settings.clockSize/elm.settings.clockScaleRatio));
		  this.parts.minute_hand.rotate(6*minutes, (elm.settings.clockSize/elm.settings.clockScaleRatio), (elm.settings.clockSize/elm.settings.clockScaleRatio));
		  if(elm.settings.showSeconds){
		  	this.parts.second_hand.rotate(6*seconds, (elm.settings.clockSize/elm.settings.clockScaleRatio), (elm.settings.clockSize/elm.settings.clockScaleRatio));
		  }
		}

	});

	$.fn[ tickingClocks ] = function ( options ) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + tickingClocks ) ) {
				$.data( this, "plugin_" + tickingClocks, new Plugin( this, options ) );
			}
		});
	};

})( jQuery, window, document );

Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}