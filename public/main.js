    function SamthsizerDT() {
      var self = this
      var oscillator;
      var myAudioContext = new (window.AudioContext ||
                                window.webkitAudioContext ||
                                window.mozAudioContext ||
                                window.oAudioContext ||
                                window.msAudioContext);

      this.myCanvas = document.getElementById("theremin"); 
      this.frequencyDisplay = document.getElementById("frequency");
      this.lowNote = 561.63; 
      this.highNote = 593.88; 

      // this function helps make wave form and effect selection DRYer
     this.getAttributeForAnchor = function(index){
        return $("a")[index].getAttribute("class") == "button clicked"
      }

      this.setupEventListeners = function() {
      
        // this.myCanvas.addEventListener("mousedown", this.playSound);
        this.myCanvas.addEventListener("mousedown", function(event){
          if(event.button == 0){
            self.playSound(event);
          } else {
            event.preventDefault();
            return false;
          }
        }, false)
        this.myCanvas.addEventListener("mouseup", function(event){
          if(event.button == 0){
            self.stopSound(event);
          } else {
            event.preventDefault();
            return false;
          }
        });
        this.myCanvas.addEventListener("mouseleave", this.stopSound);
      };

      this.playSound = function(event) {
        oscillator = myAudioContext.createOscillator();
        var gain = myAudioContext.createGain();
        gain.gain.value = 0.07;

        //tuna variables
        this.tuna = new Tuna(myAudioContext);
        this.compressor = new this.tuna.Compressor({
            threshold: -100,    //-100 to 0
            makeupGain: 5,     //0 and up
            attack: 0,         //0 to 1000
            release: 30,        //0 to 3000
            ratio: 4,          //1 to 20
            knee: 15,           //0 to 40
            automakeup: true,  //true/false
            bypass: 0
        });

        this.chorus = new this.tuna.Chorus({
            rate: 1.0,         //0.01 to 8+
            feedback: 0.1,     //0 to 1+
            delay: 0.0045,     //0 to 1
            bypass: 0          //the value 1 starts the effect as bypassed, 0 or 1
        });

        this.overdrive = new this.tuna.Overdrive({
            outputGain: 25.0,         //0 to 1+
            drive: 0.7,              //0 to 1
            curveAmount: 1,          //0 to 1
            algorithmIndex: 2,       //0 to 5, selects one of our drive algorithms
            bypass: 0
        });

        this.delay = new this.tuna.Delay({
            feedback: 0.47,    //0 to 1+
            delayTime: 140,    //how many milliseconds should the wet signal be delayed?
            wetLevel: 0.47,    //0 to 1+
            dryLevel: 1,       //0 to 1+
            cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
            bypass: 0
        });
        
        this.phaser = new this.tuna.Phaser({
            rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
            depth: 0.6,                    //0 to 1
            feedback: 0.7,                 //0 to 1+
            stereoPhase: 90,               //0 to 180
            baseModulationFrequency: 600,  //500 to 1500
            bypass: 0
        });

        this.tremolo = new this.tuna.Tremolo({
            intensity: 0.63,    //0 to 1
            rate: 3.75,         //0.001 to 8
            stereoPhase: 100,    //0 to 180
            bypass: 0
        });

        var choose6Effects = function(effect1, effect2, effect3, effect4, effect5, effect6){
                oscillator.connect(effect1);
                effect1.connect(effect2);
                effect2.connect(effect3);
                effect3.connect(effect4);
                effect4.connect(effect5);
                effect5.connect(effect6);
                effect6.connect(gain);
        }
        
        var choose5Effects = function(effect1, effect2, effect3, effect4, effect5){
                oscillator.connect(effect1);
                effect1.connect(effect2);
                effect2.connect(effect3);
                effect3.connect(effect4);
                effect4.connect(effect5);
                effect5.connect(gain);
        }

        var choose4Effects = function(effect1, effect2, effect3, effect4){
                oscillator.connect(effect1)
                effect1.connect(effect2)
                effect2.connect(effect3)
                effect3.connect(effect4)
                effect4.connect(gain)
               
        }

        var choose3Effects = function(effect1, effect2, effect3){
                oscillator.connect(effect1);
                effect1.connect(effect2);
                effect2.connect(effect3);
                effect3.connect(gain);      
        }

        var choose2Effects = function(effect1, effect2){
                oscillator.connect(effect1);
                effect1.connect(effect2);
                effect2.connect(gain);      
        }


      
        // wave form selection
        if( self.getAttributeForAnchor(0) ){
          oscillator.type = "sine";
        } else if( self.getAttributeForAnchor(1) ){
          oscillator.type = "triangle";
          gain.gain.value = 0.09;
        } else if( self.getAttributeForAnchor(2) ){
          oscillator.type = "square";
          gain.gain.value = 0.04;
        } else if( self.getAttributeForAnchor(3) ){
          oscillator.type = "sawtooth";
          gain.gain.value = 0.06;
        } else {
          oscillator.type = "sine";
        };

        // effect(s) selection
          // multiple effect selection handlers
          if(self.getAttributeForAnchor(4) &&
             self.getAttributeForAnchor(5) &&
             self.getAttributeForAnchor(6) &&
             self.getAttributeForAnchor(7) &&
             self.getAttributeForAnchor(8) &&
             self.getAttributeForAnchor(9) ){
            choose6Effects(this.compressor, this.chorus, this.overdrive, this.delay, this.phaser, this.tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose5Effects(this.compressor, this.chorus, this.overdrive, this.delay, this.phaser)
          
          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(this.compressor, this.chorus, this.overdrive, this.delay, this.tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(this.compressor, this.chorus, this.delay, this.phaser, this.tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(this.compressor, this.overdrive, this.delay, this.phaser, this.tremolo)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(this.chorus, this.overdrive, this.delay, this.phaser, this.tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose4Effects(this.compressor, this.chorus, this.overdrive, this.delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(this.compressor, this.chorus, this.overdrive, this.phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(this.compressor, this.chorus, this.overdrive, this.tremolo) 

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(this.compressor, this.chorus, this.delay, this.phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(this.compressor, this.chorus, this.delay, this.tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(this.compressor, this.overdrive, this.delay, this.phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(this.compressor, this.overdrive, this.delay, this.tremolo)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(this.chorus, this.overdrive, this.delay, this.phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(this.chorus, this.overdrive, this.delay, this.tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) ){
            choose3Effects(this.compressor, this.chorus, this.overdrive)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) ){
            choose3Effects(this.compressor, this.chorus, this.delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(this.compressor, this.chorus, this.phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(this.compressor, this.chorus, this.tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose3Effects(this.compressor, this.overdrive, this.delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(this.compressor, this.overdrive, this.phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(this.compressor, this.overdrive, this.tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(this.compressor, this.delay, this.phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(this.compressor, this.delay, this.tremolo)  

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose3Effects(this.chorus, this.overdrive, this.delay)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(this.chorus, this.overdrive, this.phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(this.chorus, this.overdrive, this.tremolo)  

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(this.chorus, this.delay, this.phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(this.chorus, this.delay, this.tremolo)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(this.overdrive, this.delay, this.phaser)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(this.overdrive, this.delay, this.tremolo)

          } else if(self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(this.delay, this.phaser, this.tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) ){
            choose2Effects(this.compressor, this.chorus)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) ){
            choose2Effects(this.compressor, this.overdrive)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(7) ){
            choose2Effects(this.compressor, this.delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(this.compressor, this.phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(this.compressor, this.tremolo)

          } else if (self.getAttributeForAnchor(5) &&
                     self.getAttributeForAnchor(6) ){
            choose2Effects(this.chorus, this.overdrive)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) ){
            choose2Effects(this.chorus, this.delay)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(this.chorus, this.phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(this.chorus, this.tremolo)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose2Effects(this.overdrive, this.delay)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(this.overdrive, this.phaser)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(this.overdrive, this.tremolo)

          } else if(self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(this.delay, this.phaser)

          } else if(self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(this.delay, this.tremolo)

          } else if(self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(this.phaser, this.tremolo) 

          // single effect selection handlers
          } else if( self.getAttributeForAnchor(4) ) {
            oscillator.connect(this.compressor);
            this.compressor.connect(gain);

          } else if( self.getAttributeForAnchor(5) ){
            oscillator.connect(this.chorus);
            this.chorus.connect(gain);

          } else if( self.getAttributeForAnchor(6)){
            oscillator.connect(this.overdrive);
            this.overdrive.connect(gain);

          } else if ( self.getAttributeForAnchor(7) ){
            oscillator.connect(this.delay);
            this.delay.connect(gain);

          } else if ( self.getAttributeForAnchor(8) ){
            oscillator.connect(this.phaser);
            this.phaser.connect(gain);

          } else if ( self.getAttributeForAnchor(9) ){
            oscillator.connect(this.tremolo);
            this.tremolo.connect(gain);

          // initial setup
          } else {
            oscillator.connect(gain);
          }
        
          gain.connect(myAudioContext.destination);

          oscillator.start(0);
          
          self.changeFrequency(event);

          self.myCanvas.addEventListener("mousemove", self.changeFrequency);

          self.myCanvas.addEventListener("mouseleave", self.stopSound);
         
      }

      this.stopSound = function(event) {
       
        oscillator.stop(0);

        self.myCanvas.removeEventListener("mousemove", self.changeFrequency);
       
        self.myCanvas.removeEventListener("mouseleave", self.stopSound);
      };

      this.getNote = function(position) {
        var noteDifference = self.lowNote - self.highNote;
        var noteOffset = (this.myCanvas.offsetWidth / noteDifference ) - (position - this.myCanvas.offsetWidth)
        return (this.lowNote + noteOffset) * 2;
      };

      this.showFrequency = function(position) {
        var noteValue = this.getNote(position);
        oscillator.frequency.value = noteValue;
        self.frequencyDisplay.innerHTML = Math.floor(noteValue) + "Hz";
      };

      this.changeFrequency = function(event) {
        if (event.type == "mousedown" || event.type == "mousemove") {  
            self.showFrequency(event.y);
        } else if (event.type == "touchstart" || event.type == "touchmove") {
          var touch = event.touches[0];
          self.showFrequency(touch.pageY);
        }
        
      };

    };
  
  window.onload = function() {
    console.log(window.innerWidth)

    var mySamthsizerDT = new SamthsizerDT();
    mySamthsizerDT.setupEventListeners();
    

    //CLICK HANDLERS
    $("#sine").click(function(){
      $("a")[0].setAttribute("class", "button clicked")
      $("a")[1].setAttribute("class", "button")
      $("a")[2].setAttribute("class", "button")
      $("a")[3].setAttribute("class", "button")
      })

    $("#triangle").click(function(){
      $("a")[0].setAttribute("class", "button")
      $("a")[1].setAttribute("class", "button clicked")
      $("a")[2].setAttribute("class", "button")
      $("a")[3].setAttribute("class", "button")
    })

    $("#square").click(function(){
      $("a")[0].setAttribute("class", "button")
      $("a")[1].setAttribute("class", "button")
      $("a")[2].setAttribute("class", "button clicked")
      $("a")[3].setAttribute("class", "button")
    })

    $("#sawtooth").click(function(){
      $("a")[0].setAttribute("class", "button")
      $("a")[1].setAttribute("class", "button")
      $("a")[2].setAttribute("class", "button")
      $("a")[3].setAttribute("class", "button clicked")
    })

    $("#compressor").click(function(){
      if( mySamthsizerDT.getAttributeForAnchor(4) ){
        $("a")[4].setAttribute("class", "button")
      } else {
      $("a")[4].setAttribute("class", "button clicked")
      }
    })
    
    $("#chorus").click(function() {
      if( mySamthsizerDT.getAttributeForAnchor(5) ){
        $("a")[5].setAttribute("class", "button")
      } else {
      $("a")[5].setAttribute("class", "button clicked")
      }
    })

    $("#overdrive").click(function(){
      if( mySamthsizerDT.getAttributeForAnchor(6) ){
        $("a")[6].setAttribute("class", "button")
      } else {
      $("a")[6].setAttribute("class", "button clicked")
      }
    })

    $("#delay").click(function(){
      if( mySamthsizerDT.getAttributeForAnchor(7) ){
        $("a")[7].setAttribute("class", "button")
      } else {
      $("a")[7].setAttribute("class", "button clicked")
      }
    })

    $("#phaser").click(function(){
      if( mySamthsizerDT.getAttributeForAnchor(8) ){
        $("a")[8].setAttribute("class", "button")
      } else {
      $("a")[8].setAttribute("class", "button clicked")
      }
    })

    $("#tremolo").click(function(){
      if( mySamthsizerDT.getAttributeForAnchor(9) ){
        $("a")[9].setAttribute("class", "button")
      } else {
      $("a")[9].setAttribute("class", "button clicked")
      }
    })

    $("#tonematrix-mute").click(function(){
      if( mySamthsizerDT.getAttributeForAnchor(11) ){
        $("a")[11].setAttribute("class", "button")
        $("#tonematrix-mute").html("&#128266;")
        tm.Synth.master.gain.value = 0.7;
      } else {
        $("a")[11].setAttribute("class", "button clicked")
        $("#tonematrix-mute").html("&#128263;")
        tm.Synth.master.gain.value = 0.0;
      }
      
    })

    $("#theremin").bind("mousedown", function(event){
      if(event.button == 0){
        $("#theremin").focus();
      }
    })

    $("#theremin").bind("mouseup mouseleave", function(event){
      if(event.button == 0){
        $("#theremin").blur();
      } 
    })

    $("#help").click(function(){
      $("#modal-outer").show();
    })

    $("#modal-outer").click(function(){
      $("#modal-outer").hide();
    })

    // effects sliders

    $(".slider").draggable({
      axis: "x",
      containment: "parent",
      stop: function(){
        $(".slider").css("cursor", "-webkit-grab")
        $(".track").css("cursor", "-webkit-grab")
      }
    })


    $(".slider").on("drag mousedown", function(){
        $(".slider").css("cursor", "-webkit-grabbing")
        $(".track").css("cursor", "-webkit-grabbing")
    });

    $(".slider").on("mouseup", function(){
        $(".slider").css("cursor", "-webkit-grab")
        $(".track").css("cursor", "-webkit-grab")
      });

    $("#comp-thresh-slider").on("drag", function(event){
        var value = event.pageX - (document.getElementById("here-only-for-measurements").offsetWidth) - 10
        if(value >= 0){
          value = 0;
        } else if(value <= -100){
          value = -100
        }
        $("#thresh-value").html(value)
        console.log(value)
      })

    $("#comp-ratio-slider").on("drag", function(event){
      var value = (event.pageX / 10 ) - 21
      if(value <= 1){
        value = 1
      } else if(value >= 20){
        value = 20
      }
      $("#ratio-value").html(value)
      console.log(value)
    })

    $("#chorus-rate-slider").on("drag", function(event){
      var value = (event.pageX/10) -21
      if(value <= 0){
        value = 0
      } else if(value >= 10){
        value = 10
      }
      $("#rate-value").html(value)
      console.log(value)
    })

    $("#chorus-feedback-slider").on("drag", function(event){
      var value = (event.pageX/300) - 0.05555
      if(value <= 0.6){
        value = 0.6
      } else if(value >= 0.99){
        value = 0.99
      }
      $("#chorus-feedback-value").html(value)
      console.log(value)
    })

    $("#scuzz-slider").on("drag", function(event){
      var value = (event.pageX/350)  
      if(value <= 0.62){
        value = 0
      } else if (value >= 0.86){
        value = 0.9
      }

      $("#scuzz-value").html(value)
      console.log(value)
    })

    $("#time-slider").on("drag", function(event){
      var value = event.pageX * 0.666

      if(value <= 140){
        value = 140
      } else if(value >= 200){
        value = 200
      }

      $("#time-value").html(value)
      console.log(value)
    })

    $("#mod-freq-slider").on("drag", function(event){
      var value = event.pageX * 3.3333

      if(value <= 730){
        value = 600
      } else if(value >= 1000){
        value = 1000
      }

      $("#mod-freq-value").html(value)
      console.log(value)
    })

    $("#trem-rate-slider").on("drag", function(event){
      var value = event.pageX * 0.01616161  

      if(value <= 3.7){
        value = 3
      } else if(value > 5 ){
        value = 6
      }

      $("#trem-rate-value").html(value)
      console.log(value)
    })

}