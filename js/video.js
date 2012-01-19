(function() {
  $.fn.offer_vid = function() {
    var prog
      , run
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


    prog = {
      vid: null,
      indicator: null,
      tmp: '<span class="max">%s</span> of <span class="value">%s</span>',
      prior_curr: null,
      update: function() {
        var max = Math.floor(this.vid.duration)
          , curr = Math.floor(this.vid.currentTime);

        if(curr === this.prior_curr) {return;}
        this.prior_curr = curr;

        $(this.indicator).html(sprintf(this.tmp, curr, max));
      }
    };

    run = function(opt) {
      var $offer = this        
        , $hd = $(".hd", $offer)
        , $bd = $(".bd", $offer)
        , $stop
        , vid = $("video", $offer).get(0)
        , progress
        , trans_on
        , trans_off
        ;
      
      // add string to be turned into control panel
      $bd.append(controls);
      $stop = $(".stop-vid", $offer)
      progress = $(".vid-progress", $offer);

      prog.vid = vid;
      prog.indicator = progress;

      trans_on = function() {
        $hd.fadeOut();
        $bd.fadeIn(function() {
          vid.play();
        });
      };
      trans_off = function() {
        $bd.fadeOut(function() {
          vid.pause();
          vid.currentTime=0;
        });
        $hd.fadeIn();
      };


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

      $(progress).click(function() {
        vid.currentTime = 130;
      });

      return this;
    };

    return run;
  }();

  $(document).ready(function() {
    $(".offer-vid").offer_vid();
  });
}());
