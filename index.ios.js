/**
 * React Native Game integrated with IBM MobileFirst Platform on Bluemix
 */
'use strict';

var React = require('react-native');
var {
  PickerIOS,
  Text,
  View,
  AppRegistry,
  StyleSheet,
  TouchableOpacity
} = React;

var tweenMixin = require('./tweenmixin');
var Win = require('NativeModules').Win;

var PickerItemIOS = PickerIOS.Item;

var labels = [
['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', '','', '?'] ,
[ 'AM', 'PM', 'Morning', 'Afternoon', 'Evening', 'Night', 'Midnight','','','?', 
'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', '', '', '?'],

]

var WHEELS = [
   { slots: 1000,  fill: []  },
   {slots: 1000, fill: []},
  ];


var SpinningWheel = React.createClass({

  getInitialState: function() {
    var tpfill = [];
    for (var i=0; i< this.props.slots/this.props.labels.length; i++) {
        tpfill.push.apply(tpfill, this.props.labels);
     }
   
   //console.log(WHEELS[0].fill.length);
    // executes once only - initialize grand jackpot
    tpfill[503] = 'Happy Hour!';

    return {
      fill: tpfill
    };
  },
 

render: function () {
  return(
        <PickerIOS  style={styles.wheel}
          selectedValue={this.props.selectedValue}
          onValueChange={() => {}}>
            { this.state.fill.map( (tname, idx) => (
              <PickerItemIOS  style={styles.item}
                key={'a_' + idx}
                value={idx}
                label={tname}
              />
              )) 
            }
        </PickerIOS>
        );
} ,


});


var Game1 = React.createClass({
 mixins: [tweenMixin],
  getInitialState: function() {
    return {
      
      Wheel1Index: 0,
      Wheel2Index: 0,
      winmessage: "",
      
    };
  }, 
  _spinTheWheels: function() {
    if (this.tweenCompleted()) {
    this.setState({winmessage: ""});
    this.setDestinations(((this.cheatCount % 15 == 10 )?  [503,503]: 
           [Math.floor(Math.random() * WHEELS[0].slots),Math.floor(Math.random() * WHEELS[1].slots)]));
    this.start();
    this.tries++;
  
    }
  },

  componentDidMount: function()  {

     
     this.setConfig({
      start: [{x:  0}, {x: 0}],
      end: [{x: 503}, {x: 503}],
      duration: [8000, 12000],
      tween: ['easeOutCubic','easeOutQuint'],
      frame: (conv) => {
      //  console.log('val is ' + Math.floor(conv[0].x));
        this.setState({Wheel1Index: Math.round(conv[0].x),Wheel2Index: Math.round(conv[1].x)})
      },
      done: () =>{
      //  this.start();
         var firstval = this.refs.wheel1.state.fill[this.state.Wheel1Index];
         var secondval = this.refs.wheel2.state.fill[this.state.Wheel2Index];
         var msg = "";
         if (firstval == secondval) {
           if (firstval == "Happy Hour!") {
            msg = "***  JACKPOT !!!  ***";

           } else {
            msg = "You won!"
           }
             // Comment next line if you need CMD-R JS reloading during development
         //    Win.notifyWin((new Date()).toISOString(), firstval, secondval, this.tries, this.cheatCount);
             this.tries = 0;
             
         }
        this.setState({winmessage: msg});

      },
     });
     this.cheatCount = 0;
     this.tries = 0;
    // this.start();
  },

  _headerTouched: function() {
    this.cheatCount++;
  },
  render: function() {

    
  return (
     <View style={styles.container} >
      <View style={styles.headcontainer}>
        <Text style={styles.head}
          onPress={() => this._headerTouched()}>
        Your Lucky Day
        </Text>
      </View>
        <SpinningWheel ref='wheel1' style={styles.wheel}
          selectedValue={this.state.Wheel1Index}
          labels={labels[0]}
          slots={WHEELS[0].slots}
          />
        <Text style={styles.winlabel}>
        { this.state.winmessage}
        </Text> 
       
        <SpinningWheel ref='wheel2' style={styles.wheel}
          selectedValue={this.state.Wheel2Index}
          labels={labels[1]}
          slots={WHEELS[1].slots}
          />
          <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this._spinTheWheels()}>
         <Text style={styles.spin}>
          SPIN
        </Text>
        </TouchableOpacity>        

      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: { 
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'stretch', 
  },
  wheel: {
  },
  headcontainer: {
    backgroundColor: 'darkblue',
  },
  spin: {
    fontSize: 32,
    fontFamily: 'Cochin',
    textAlign: 'center',
    fontStyle: 'italic',
    containerBackgroundColor: 'darkgreen',
    color: 'white',
    letterSpacing: 30,
    margin: 10,
  },
  head: {
    containerBackgroundColor: 'darkblue',
    color: 'white',
    fontSize: 33,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 30,
  },
  winlabel: {
    fontSize: 22,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Verdana',
    margin: 10,
  }
});

AppRegistry.registerComponent('Game1', () => Game1);
