var MotorAction = function(args) {
    this.args = args;
    this.next = null;
    this.action = function() {return new Promise((resolve, reject) => {resolve("turning " + args.monitor);});}
}

var ClosePortAction = function(args) {
    this.args = args;
    this.next = null;
    this.action = function() {return new Promise((resolve, reject) => {resolve("port closed " + args.number);});}
}

var ActionEngine = function() {}
ActionEngine.prototype = {
    chainWith: function(next) {
        this.next = next;
        return this.next;
    },
    do: function() {
        var self = this;
        self.action().then(function(result){
            console.log(result);
            self.next && self.next.do();
        });
    },
}

MotorAction.prototype = ActionEngine.prototype;
ClosePortAction.prototype = ActionEngine.prototype;

var Jaguar = function() {
    var motorOne = new MotorAction({monitor: 0, degree: 100}),
        motorTwo = new MotorAction({monitor: 1, degree: 100}),
        motorThree = new MotorAction({monitor: 2, degree: 100}),
        closePort = new ClosePortAction({number: 80});

        motorOne.chainWith(motorTwo)
            .chainWith(motorThree)
            .chainWith(closePort);

    this.ignition = motorOne;
}

Jaguar.prototype.ignite = function() {
    this.ignition.do();
}

var jaguar = new Jaguar();
jaguar.ignite();