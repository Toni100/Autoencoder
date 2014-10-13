/*global math */

function Neuron(inputCount, activationFunction, activationFunctionDerivative, learningRate) {
  'use strict';
  this.weights = [];
  while (this.weights.length < inputCount) {
    this.weights.push(0.01 * Math.random());
  }
  this.bias = 0.1 * Math.random();
  this.activationFunction = activationFunction;
  this.activationFunctionDerivative = activationFunctionDerivative;
  this.learningRate = learningRate;
}

Neuron.prototype.forward = function (x) {
  'use strict';
  var sum = math.dot(this.weights, x) - this.bias;
  this.lastActivation = this.activationFunction(sum);
  this.lastActivationFunctionDerivative = this.activationFunctionDerivative(sum);
  return this.lastActivation;
};

Neuron.prototype.predict = function (x) {
  'use strict';
  return this.activationFunction(math.dot(this.weights, x) - this.bias);
};

Neuron.prototype.updateWeights = function () {
  'use strict';
  var i;
  for (i = 0; i < this.weights.length; i += 1) {
    this.weights[i] -= this.learningRate * this.errorFunctionGradient[i];
  }
};

function Layer(inputCount, neuronCount, activationFunction, activationFunctionDerivative, learningRate) {
  'use strict';
  this.neurons = [];
  while (this.neurons.length < neuronCount) {
    this.neurons.push(new Neuron(inputCount, activationFunction, activationFunctionDerivative, learningRate));
  }
}

Layer.prototype.forward = function (x) {
  'use strict';
  return this.neurons.map(function (n) { return n.forward(x); });
};

Layer.prototype.predict = function (x) {
  'use strict';
  return this.neurons.map(function (n) { return n.predict(x); });
};

Layer.prototype.updateWeights = function () {
  'use strict';
  this.neurons.forEach(function (n) { n.updateWeights(); });
};

function Network(inputCount, neuronCounts, activationFunction, activationFunctionDerivative, learningRate) {
  'use strict';
  this.layers = [];
  neuronCounts.reduce(function (i, n) {
    this.layers.push(new Layer(i, n, activationFunction, activationFunctionDerivative, learningRate));
    return n;
  }.bind(this), inputCount);
}

Network.prototype.predict = function (x) {
  'use strict';
  return this.layers.reduce(function (y, l) {
    return l.predict(y);
  }, x);
};

Network.prototype.train = function (input, target) {
  'use strict';
  this.layers.reduce(function (activations, layer) {
    return layer.forward(activations);
  }, input);
  this.layers[this.layers.length - 1].neurons.forEach(function (neuron, neuronIndex) {
    neuron.error = neuron.lastActivation - target[neuronIndex];
  });
  this.layers.reduceRight(function (laterLayer, layer) {
    layer.neurons.forEach(function (neuron, neuronIndex) {
      neuron.error = laterLayer.neurons.reduce(function (sum, laterNeuron) {
        return sum + laterNeuron.error * laterNeuron.weights[neuronIndex];
      }, 0) * neuron.lastActivationFunctionDerivative;
    });
    return layer;
  });
  this.layers.reduce(function (activations, layer) {
    layer.neurons.forEach(function (neuron) {
      neuron.errorFunctionGradient = activations.map(function (a) {
        return a * neuron.error;
      });
    });
    return layer.neurons.map(function (neuron) {
      return neuron.lastActivation;
    });
  }, input);
  this.layers.forEach(function (layer) {
    layer.updateWeights();
  });
};
