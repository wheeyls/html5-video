(function() {
  $.fn.offer_vid = function() {
    var progress_tracker
      , fn
      , controls
      , sprintf
      ;

    sprintf = function sprintf(text){
        var i=1, args=arguments;
        return text.replace(/%s/g, function(pattern){
            return (i < args.length) ? args[i++] : "";
        });
    };

    controls = '\
    <div class="custom-controls">\
      <div class="stop-vid">x</div>\
      <div class="vid-progress"></div>\
    </div>\
    ';


    progress_tracker = {
      vid: null,
      indicator: null,
      tmp: '<span class="max">%ss</span> of <span class="value">%ss</span>',
      prior_curr: null,
      update: function() {
        var max = Math.floor(this.vid.duration)
          , curr = Math.floor(this.vid.currentTime);

        if(curr === this.prior_curr) {return;}
        this.prior_curr = curr;

        $(this.indicator).html(sprintf(this.tmp, curr, max));
      }
    };

    fn = function(opt) {
      return this.each(function() {
        var $offer = $(this)
          , $hd = $(".hd", $offer)
          , $bd = $(".bd", $offer)
          , $stop
          , vid = $("video", $offer).get(0)
          , progress
          , trans_on
          , trans_off
          , prog = $.extend({}, progress_tracker)
          ;
        
        // render control panel
        $bd.append(controls);
        $stop = $(".stop-vid", $offer)
        progress = $(".vid-progress", $offer);

        // setup progress tracker
        prog.vid = vid;
        prog.indicator = progress;

        // show/hide display
        trans_on = function() {
          $bd.fadeIn(function() {
            vid.play();
          });
        };
        trans_off = function() {
          $bd.fadeOut(function() {
            vid.pause();
            vid.currentTime=0;
          });
        };


        // bind events
        $hd.click(function() {
          trans_on();
        });
        $stop.click(function() {
          trans_off();
        });
        $(vid).bind("ended", function() {
          $offer.addClass("done");
          trans_off();
        });
        $(vid).bind("timeupdate", function() {
          prog.update();
        });

        //shortcut past initial load
        $(progress).click(function() {
          vid.currentTime = 130;
        });
      });
    };

    return fn;
  }();

  $(document).ready(function() {
    $(".offer-vid").offer_vid();
  });
}());
