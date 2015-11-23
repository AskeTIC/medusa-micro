"use strict";

var Cylon = require("cylon");

// 1 robot con varios microprocesadores
Cylon.robot({

    name: 'medusa1',

    // These are the events that will be registered in the API
    events: ['turned_on', 'turned_off'],

    // These are the commands that will be availble in the API
    // Commands method needs to return an object with the aliases
    // to the robot methods.
    commands: function() {
        return {
            turn_on: this.turnOn,
            turn_off: this.turnOff,
            toggle: this.toggle
        };
    },


    // Change the port to the correct port for your Arduino.
    connections: {
        arduino_A: { adaptor: 'firmata', port: '/dev/ttyACM0' },
        arduino_B: { adaptor: 'firmata', port: '/dev/ttyACM1' }
    },

    //Dispositivos a usar en los microprocesadores
    //TODO: Saber si en conjunto o por cada micro por que los pines estarán duplicados o más.
    devices: {
        led: { driver: 'led', pin: 13 },
        button: { driver: 'button', pin: 2 },
        asensor: { driver: 'analog-sensor', pin: 0 }
    },

    //En bucle de mi programa.
    work: function(my) {
        my.button.on('push', function() {
            my.led.toggle()
        });

        every((1).second(), function() {
            console.log("Sensor emitiendo...");
        });
    },

    //Funciones manejadoras de eventos (callbacks)
    turnOn: function() {
        this.led.turnOn();
        //Como es un objeto de socket.io pudo hacer un emit
        this.emit('turned_on', { data: 'pass some data to the listener'});
    },

    turnOff: function() {
        this.led.turnOff();
        this.emit('turned_off', { data: 'pass some data to the listener'});
    },

    toggle: function() {
        this.led.toggle();
        if (this.led.isOn()) {
          this.emit('turned_on', { data: 'pass some data to the listener'});
        } else {
          this.emit('turned_off', { data: 'pass some data to the listener'});
        }
    }

});

//API socket.io
Cylon.api('socketio', {
    host: '0.0.0.0',
    port: '3030'
});

//Incio de los robots
Cylon.start();
