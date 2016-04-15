window.onload = function() {
  console.log(window.innerWidth)
  if(window.innerWidth < 1200){
    function Samthsizer() {
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
      this.highNote = 1493.88; 

      // this function helps wave form and effect selection DRYer
     this.getAttributeForAnchor = function(index){
        return $("a")[index].getAttribute("class") == "button clicked"
      }

      this.setupEventListeners = function() {

        //disables scroll on touch devices
        document.body.addEventListener("touchmove", function(event) {
          event.preventDefault();
        }, false);
        //disables selection of canvas
        this.myCanvas.addEventListener("touchstart", function(event) {
          event.preventDefault();
          self.playSound(event);
        }, false);

        this.myCanvas.addEventListener("touchend", function(event){ 
          event.preventDefault();
          self.stopSound(event);
        }, false);

      };

      this.playSound = function(event) {

        oscillator = myAudioContext.createOscillator();
        var gain = myAudioContext.createGain();
        gain.gain.value = 0.1;
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

        //tuna variables
        var tuna = new Tuna(myAudioContext);
        var compressor = new tuna.Compressor({
            threshold: -60,    //-100 to 0
            makeupGain: 1,     //0 and up
            attack: 0,         //0 to 1000
            release: 30,        //0 to 3000
            ratio: 4,          //1 to 20
            knee: 15,           //0 to 40
            automakeup: true,  //true/false
            bypass: 0
        });

        var chorus = new tuna.Chorus({
            rate: 1.0,         //0.01 to 8+
            feedback: 0.6,     //0 to 1+
            delay: 0.0045,     //0 to 1
            bypass: 0          //the value 1 starts the effect as bypassed, 0 or 1
        });

        var overdrive = new tuna.Overdrive({
            outputGain: 0.2,         //0 to 1+
            drive: 0.8,              //0 to 1
            curveAmount: 1,          //0 to 1
            algorithmIndex: 2,       //0 to 5, selects one of our drive algorithms
            bypass: 0
        });

        var delay = new tuna.Delay({
            feedback: 0.47,    //0 to 1+
            delayTime: 147,    //how many milliseconds should the wet signal be delayed?
            wetLevel: 0.47,    //0 to 1+
            dryLevel: 1,       //0 to 1+
            cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
            bypass: 0
        });
        
        var phaser = new tuna.Phaser({
            rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
            depth: 0.6,                    //0 to 1
            feedback: 0.7,                 //0 to 1+
            stereoPhase: 90,               //0 to 180
            baseModulationFrequency: 700,  //500 to 1500
            bypass: 0
        });

        var tremolo = new tuna.Tremolo({
            intensity: 0.7,    //0 to 1
            rate: 7.75,         //0.001 to 8
            stereoPhase: 0,    //0 to 180
            bypass: 0
        });
      
        // wave form selection
        if( self.getAttributeForAnchor(0) ){
          oscillator.type = "sine";
        } else if( self.getAttributeForAnchor(1) ){
          oscillator.type = "triangle";
        } else if( self.getAttributeForAnchor(2) ){
          oscillator.type = "square"
        } else if( self.getAttributeForAnchor(3) ){
          oscillator.type = "sawtooth"
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
            oscillator.connect(compressor);
            compressor.connect(chorus);
            chorus.connect(overdrive);
            overdrive.connect(delay);
            delay.connect(phaser);
            phaser.connect(tremolo);
            tremolo.connect(gain);

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose5Effects(compressor, chorus, overdrive, delay, phaser)
          
          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(compressor, chorus, overdrive, delay, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(compressor, chorus, delay, phaser, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(compressor, overdrive, delay, phaser, tremolo)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(chorus, overdrive, delay, phaser, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose4Effects(compressor, chorus, overdrive, delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(compressor, chorus, overdrive, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(compressor, chorus, overdrive, tremolo) 

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(compressor, chorus, delay, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(compressor, chorus, delay, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(compressor, overdrive, delay, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(compressor, overdrive, delay, tremolo)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(chorus, overdrive, delay, phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(chorus, overdrive, delay, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) ){
            choose3Effects(compressor, chorus, overdrive)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) ){
            choose3Effects(compressor, chorus, delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(compressor, chorus, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(compressor, chorus, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose3Effects(compressor, overdrive, delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(compressor, overdrive, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(compressor, overdrive, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(compressor, delay, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(compressor, delay, tremolo)  

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose3Effects(chorus, overdrive, delay)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(chorus, overdrive, phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(chorus, overdrive, tremolo)  

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(chorus, delay, phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(chorus, delay, tremolo)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(overdrive, delay, phaser)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(overdrive, delay, tremolo)

          } else if(self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(delay, phaser, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) ){
            choose2Effects(compressor, chorus)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) ){
            choose2Effects(compressor, overdrive)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(7) ){
            choose2Effects(compressor, delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(compressor, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(compressor, tremolo)

          } else if (self.getAttributeForAnchor(5) &&
                     self.getAttributeForAnchor(6) ){
            choose2Effects(chorus, overdrive)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) ){
            choose2Effects(chorus, delay)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(chorus, phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(chorus, tremolo)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose2Effects(overdrive, delay)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(overdrive, phaser)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(overdrive, tremolo)

          } else if(self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(delay, phaser)

          } else if(self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(delay, tremolo)

          } else if(self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(phaser, tremolo) 

          // single effect selection handlers
          } else if( self.getAttributeForAnchor(4) ) {
            oscillator.connect(compressor);
            compressor.connect(gain);

          } else if( self.getAttributeForAnchor(5) ){
            oscillator.connect(chorus);
            chorus.connect(gain);

          } else if( self.getAttributeForAnchor(6)){
            oscillator.connect(overdrive);
            overdrive.connect(gain);

          } else if ( self.getAttributeForAnchor(7) ){
            oscillator.connect(delay);
            delay.connect(gain);

          } else if ( self.getAttributeForAnchor(8) ){
            oscillator.connect(phaser);
            phaser.connect(gain);

          } else if ( self.getAttributeForAnchor(9) ){
            oscillator.connect(tremolo);
            tremolo.connect(gain);

          // initial setup
          } else {
            oscillator.connect(gain);
          }

        gain.connect(myAudioContext.destination);

        oscillator.start(0);
        
        self.changeFrequency(event);

       
        self.myCanvas.addEventListener("touchmove", function(event){
          event.preventDefault();
          self.changeFrequency(event);
        }, false);
        
        self.myCanvas.addEventListener("touchcancel", function(event){
          event.preventDefault();
          self.stopSound(event)
        }, false);
      }

      this.stopSound = function(event) {
       
        oscillator.stop(0);

        self.myCanvas.removeEventListener("mousemove", self.changeFrequency);
        self.myCanvas.removeEventListener("touchmove", function(event){
          event.preventDefault();
          self.changeFrequency(event);
        }, false);
      };

      this.getNote = function(position) {
        var noteDifference = self.lowNote - self.highNote;
        var noteOffset = (this.myCanvas.offsetWidth / noteDifference ) * (position - this.myCanvas.offsetTop)
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

    var mySamthsizer = new Samthsizer();
    mySamthsizer.setupEventListeners();
    

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
      if( mySamthsizer.getAttributeForAnchor(4) ){
        $("a")[4].setAttribute("class", "button")
      } else {
      $("a")[4].setAttribute("class", "button clicked")
      }
    })
    
    $("#chorus").click(function() {
      if( mySamthsizer.getAttributeForAnchor(5) ){
        $("a")[5].setAttribute("class", "button")
      } else {
      $("a")[5].setAttribute("class", "button clicked")
      }
    })

    $("#overdrive").click(function(){
      if( mySamthsizer.getAttributeForAnchor(6) ){
        $("a")[6].setAttribute("class", "button")
      } else {
      $("a")[6].setAttribute("class", "button clicked")
      }
    })

    $("#delay").click(function(){
      if( mySamthsizer.getAttributeForAnchor(7) ){
        $("a")[7].setAttribute("class", "button")
      } else {
      $("a")[7].setAttribute("class", "button clicked")
      }
    })

    $("#phaser").click(function(){
      if( mySamthsizer.getAttributeForAnchor(8) ){
        $("a")[8].setAttribute("class", "button")
      } else {
      $("a")[8].setAttribute("class", "button clicked")
      }
    })

    $("#tremolo").click(function(){
      if( mySamthsizer.getAttributeForAnchor(9) ){
        $("a")[9].setAttribute("class", "button")
      } else {
      $("a")[9].setAttribute("class", "button clicked")
      }
    })

    $("#swap").click(function(){
      if( $("a")[10].getAttribute("class") == "button left" ){
        $("a")[10].setAttribute("class", "button right")
        $("#theremin")[0].setAttribute("class", "theremin-right-hand")
        $("#details")[0].setAttribute("class", "details-right-hand")
        $("#controls")[0].setAttribute("class", "controls-right-hand")
        $("#wave-form-buttons")[0].setAttribute("class", "wave-form-buttons-right-hand")
        $("#effects-buttons")[0].setAttribute("class", "effects-buttons-right-hand")
        $("#frqcy")[0].setAttribute("class", "frqcy-right-hand")

      } else {
        $("a")[10].setAttribute("class", "button left")
        $("#theremin")[0].setAttribute("class", "theremin-left-hand")
        $("#details")[0].setAttribute("class", "details-left-hand")
        $("#controls")[0].setAttribute("class", "controls-left-hand")
        $("#wave-form-buttons")[0].setAttribute("class", "wave-form-buttons-left-hand")
        $("#effects-buttons")[0].setAttribute("class", "effects-buttons-left-hand")
        $("#frqcy")[0].setAttribute("class", "frqcy-left-hand")
      }
    })


    $("#theremin").bind("touchmove", function(){
        $("#theremin").focus();
        setTimeout(function() {
          $("#theremin").blur(); 
        }, 1000)
    })

  } else {

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
      this.highNote = 1493.88; 

      // this function helps wave form and effect selection DRYer
     this.getAttributeForAnchor = function(index){
        return $("a")[index].getAttribute("class") == "button clicked"
      }

      this.setupEventListeners = function() {

        this.myCanvas.addEventListener("mousedown", this.playSound);
       
        this.myCanvas.addEventListener("mouseup", this.stopSound);
        this.myCanvas.addEventListener("mouseleave", this.stopSound);
      };

      this.playSound = function(event) {

        oscillator = myAudioContext.createOscillator();
        var gain = myAudioContext.createGain();
        gain.gain.value = 0.1;
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

        //tuna variables
        var tuna = new Tuna(myAudioContext);
        var compressor = new tuna.Compressor({
            threshold: -60,    //-100 to 0
            makeupGain: 1,     //0 and up
            attack: 0,         //0 to 1000
            release: 30,        //0 to 3000
            ratio: 4,          //1 to 20
            knee: 15,           //0 to 40
            automakeup: true,  //true/false
            bypass: 0
        });

        var chorus = new tuna.Chorus({
            rate: 1.0,         //0.01 to 8+
            feedback: 0.6,     //0 to 1+
            delay: 0.0045,     //0 to 1
            bypass: 0          //the value 1 starts the effect as bypassed, 0 or 1
        });

        var overdrive = new tuna.Overdrive({
            outputGain: 0.2,         //0 to 1+
            drive: 0.8,              //0 to 1
            curveAmount: 1,          //0 to 1
            algorithmIndex: 2,       //0 to 5, selects one of our drive algorithms
            bypass: 0
        });

        var delay = new tuna.Delay({
            feedback: 0.47,    //0 to 1+
            delayTime: 147,    //how many milliseconds should the wet signal be delayed?
            wetLevel: 0.47,    //0 to 1+
            dryLevel: 1,       //0 to 1+
            cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
            bypass: 0
        });
        
        var phaser = new tuna.Phaser({
            rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
            depth: 0.6,                    //0 to 1
            feedback: 0.7,                 //0 to 1+
            stereoPhase: 90,               //0 to 180
            baseModulationFrequency: 700,  //500 to 1500
            bypass: 0
        });

        var tremolo = new tuna.Tremolo({
            intensity: 0.7,    //0 to 1
            rate: 7.75,         //0.001 to 8
            stereoPhase: 0,    //0 to 180
            bypass: 0
        });
      
        // wave form selection
        if( self.getAttributeForAnchor(0) ){
          oscillator.type = "sine";
        } else if( self.getAttributeForAnchor(1) ){
          oscillator.type = "triangle";
        } else if( self.getAttributeForAnchor(2) ){
          oscillator.type = "square"
        } else if( self.getAttributeForAnchor(3) ){
          oscillator.type = "sawtooth"
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
            oscillator.connect(compressor);
            compressor.connect(chorus);
            chorus.connect(overdrive);
            overdrive.connect(delay);
            delay.connect(phaser);
            phaser.connect(tremolo);
            tremolo.connect(gain);

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose5Effects(compressor, chorus, overdrive, delay, phaser)
          
          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(compressor, chorus, overdrive, delay, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(compressor, chorus, delay, phaser, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(compressor, overdrive, delay, phaser, tremolo)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose5Effects(chorus, overdrive, delay, phaser, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose4Effects(compressor, chorus, overdrive, delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(compressor, chorus, overdrive, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(compressor, chorus, overdrive, tremolo) 

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(compressor, chorus, delay, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(compressor, chorus, delay, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(compressor, overdrive, delay, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(compressor, overdrive, delay, tremolo)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose4Effects(chorus, overdrive, delay, phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose4Effects(chorus, overdrive, delay, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) ){
            choose3Effects(compressor, chorus, overdrive)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) ){
            choose3Effects(compressor, chorus, delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(compressor, chorus, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(compressor, chorus, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose3Effects(compressor, overdrive, delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(compressor, overdrive, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(compressor, overdrive, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(compressor, delay, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(compressor, delay, tremolo)  

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose3Effects(chorus, overdrive, delay)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(chorus, overdrive, phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(chorus, overdrive, tremolo)  

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(chorus, delay, phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(chorus, delay, tremolo)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose3Effects(overdrive, delay, phaser)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(overdrive, delay, tremolo)

          } else if(self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose3Effects(delay, phaser, tremolo)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(5) ){
            choose2Effects(compressor, chorus)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(6) ){
            choose2Effects(compressor, overdrive)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(7) ){
            choose2Effects(compressor, delay)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(compressor, phaser)

          } else if(self.getAttributeForAnchor(4) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(compressor, tremolo)

          } else if (self.getAttributeForAnchor(5) &&
                     self.getAttributeForAnchor(6) ){
            choose2Effects(chorus, overdrive)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(7) ){
            choose2Effects(chorus, delay)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(chorus, phaser)

          } else if(self.getAttributeForAnchor(5) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(chorus, tremolo)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(7) ){
            choose2Effects(overdrive, delay)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(overdrive, phaser)

          } else if(self.getAttributeForAnchor(6) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(overdrive, tremolo)

          } else if(self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(8) ){
            choose2Effects(delay, phaser)

          } else if(self.getAttributeForAnchor(7) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(delay, tremolo)

          } else if(self.getAttributeForAnchor(8) &&
                    self.getAttributeForAnchor(9) ){
            choose2Effects(phaser, tremolo) 

          // single effect selection handlers
          } else if( self.getAttributeForAnchor(4) ) {
            oscillator.connect(compressor);
            compressor.connect(gain);

          } else if( self.getAttributeForAnchor(5) ){
            oscillator.connect(chorus);
            chorus.connect(gain);

          } else if( self.getAttributeForAnchor(6)){
            oscillator.connect(overdrive);
            overdrive.connect(gain);

          } else if ( self.getAttributeForAnchor(7) ){
            oscillator.connect(delay);
            delay.connect(gain);

          } else if ( self.getAttributeForAnchor(8) ){
            oscillator.connect(phaser);
            phaser.connect(gain);

          } else if ( self.getAttributeForAnchor(9) ){
            oscillator.connect(tremolo);
            tremolo.connect(gain);

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
        var noteOffset = (this.myCanvas.offsetWidth / noteDifference ) * (position - this.myCanvas.offsetTop)
        return (this.lowNote + noteOffset) * 3;
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

    $("#theremin").bind("mousedown", function(){
        $("#theremin").focus();
    })

    $("#theremin").bind("mouseup", function(){
      $("#theremin").blur(); 
    })

  }

}