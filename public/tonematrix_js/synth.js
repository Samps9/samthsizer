(function ()
{
  'use strict';
  var Synth = tm.Class(
  {
    WAVEFORMS: {
      SINE: 0,
      SAWTOOTH: 2
    },
    BASEOCTAVE: 5.5,
    NOTES: {
      'C': 60,
      'C#': 61,
      'D': 62,
      'D#': 63,
      'E': 64,
      'F': 65,
      'F#': 66,
      'G': 67,
      'G#': 68,
      'A': 69,
      'A#': 70,
      'B': 71
    },

    context: new AudioContext(),

    attack: 0,
    decay: 0,
    sustain: 0,
    release: 5,

    voices: {},



    constructor: function (opts)
    {
      tm.extend(this, opts);

      Synth.master = this.context.createGain();
      Synth.master.gain.value = 0.5;

      this.delay = this.context.createDelay();
      this.delay.delayTime.value = 0.007;
      this.delay.connect(Synth.master);

      Synth.master.connect(this.delay);
      Synth.master.connect(this.context.destination);
    },

    playNote: function (note)
    {
      if (!this.voices[note])
      {
        this.voices[note] = new tm.Voice(
        {
          note: this.getNote(note),
          attack: this.attack,
          decay: this.decay,
          sustain: this.sustain,
          release: this.release,
          context: this.context
        });
        this.stopNote(note);
      }
    },

    stopNote: function (note)
    {
      if (this.voices[note])
      {
        this.voices[note].stop();
        this.voices[note] = null;
      }
    },

    getNote: function (note)
    {
      if (note)
      {
        var octave = note.substring(1);
        var key = note.charAt(0);
        var transpose = octave - this.BASEOCTAVE;
        return 440 * Math.pow(2, (this.NOTES[key] + transpose * 12 - 69) / 12);
      }

      else
      {
        console.error('no note: ', note);
        return;
      }
    }
  });

  tm.Synth = Synth;

})();