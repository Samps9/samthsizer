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
      this.highNote = 593.88; 

      // this function helps make wave form and effect selection DRYer
      this.getAttributeForAnchor = function(index){
        return $("a")[index].getAttribute("class") == "button clicked"
      }

      this.setupEventListeners = function() {
      
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

        //tuna variables
        var tuna = new Tuna(myAudioContext);
        var compressor = new tuna.Compressor({
          threshold: -100,    //-100 to 0
          makeupGain: 5,     //0 and up
          attack: 0,         //0 to 1000
          release: 30,        //0 to 3000
          ratio: 4,          //1 to 20
          knee: 15,           //0 to 40
          automakeup: true,  //true/false
          bypass: 0
        });

        var chorus = new tuna.Chorus({
          rate: 1.0,         //0.01 to 8+
          feedback: 0.1,     //0 to 1+
          delay: 0.0045,     //0 to 1
          bypass: 0          //the value 1 starts the effect as bypassed, 0 or 1
        });

        var overdrive = new tuna.Overdrive({
          outputGain: 25.0,         //0 to 1+
          drive: 0.7,              //0 to 1
          curveAmount: 1,          //0 to 1
          algorithmIndex: 2,       //0 to 5, selects one of our drive algorithms
          bypass: 0
        });

        var delay = new tuna.Delay({
          feedback: 0.47,    //0 to 1+
          delayTime: 140,    //how many milliseconds should the wet signal be delayed?
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
          baseModulationFrequency: 600,  //500 to 1500
          bypass: 0
        });

        var tremolo = new tuna.Tremolo({
          intensity: 0.63,    //0 to 1
          rate: 3.75,         //0.001 to 8
          stereoPhase: 100,    //0 to 180
          bypass: 0
        });

        var setEffects = function(effects){
          // connect osc to the first effect
          oscillator.connect(effects[0]);
          
          // connect all effects:
          for(i=0; i < effects.length - 1; i++){
            effects[i].connect(effects[i+1])
          }
          // connect the last effects to the gain, which is the last node in the chain before the destination:
          effects[effects.length - 1].connect(gain);
        }

        var effectsMap = {
          4: compressor,
          5: chorus,
          6: overdrive,
          7: delay,
          8: phaser,
          9: tremolo
        };

        selectedEffects = [];
        var idx = 4;
        while(idx <= 9){
          if(self.getAttributeForAnchor(idx)) { selectedEffects.push(effectsMap[idx]) };
          idx += 1;
        }
        if(selectedEffects[0]){
          setEffects(selectedEffects);
        } else {
          oscillator.connect(gain);
        };
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

    var mySamthsizer = new Samthsizer();
    mySamthsizer.setupEventListeners();
    

    //CLICK HANDLERS

    function handleWaveForm(element) {
      var idx = 0;
      while(idx < 4){
        $("a")[idx].setAttribute("class", "button");
        idx += 1;
      }
      element.setAttribute("class", "button clicked")
    }

    var waveForms = ["sine", "triangle", "square", "sawtooth"];
    for(i=0; i <= waveForms.length; i++){
      $("#" + waveForms[i]).click(function(event){
        handleWaveForm(event.target);
      })
    };
    
    function handleEffect(element){
      if(element.getAttribute("class") == "button"){
        element.setAttribute("class", "button clicked");
      } else {
        element.setAttribute("class", "button");
      }
    }
    var effects = ["compressor", "chorus", "overdrive", "delay", "phaser", "tremolo"];
    for(i=0; i <= effects.length; i++){
      $("#" + effects[i]).click(function(event){
        handleEffect(event.target);
      })
    };

    $("#tonematrix-mute").click(function(){
      if( mySamthsizer.getAttributeForAnchor(12) ){
        $("a")[12].setAttribute("class", "button")
        $("#tonematrix-mute").html("&#128266;")
        tm.Synth.master.gain.value = 0.5;
      } else {
        $("a")[12].setAttribute("class", "button clicked")
        $("#tonematrix-mute").html("&#128263;")
        tm.Synth.master.gain.value = 0.0;
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