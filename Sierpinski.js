// JavaScript source code

"use strict";

var canvas;
var gl;
var points = [];
var numTimesToSubdivide = 0;

function square(x, y, size) {
    points.push(
        x, y,
        x + size, y,
        x + size, y + size,

        x, y,
        x + size, y + size,
        x, y + size
    );
}

function divideSquare(x, y, size, count) {

    if (count === 0) {
        square(x, y, size);
    }
    else {

        var newSize = size / 3;

        --count;


        divideSquare(x, y + newSize * 2, newSize, count);
        divideSquare(x + newSize, y + newSize * 2, newSize, count);
        divideSquare(x + newSize * 2, y + newSize * 2, newSize, count);


        divideSquare(x, y + newSize, newSize, count);
        divideSquare(x + newSize * 2, y + newSize, newSize, count);


        divideSquare(x, y, newSize, count);
        divideSquare(x + newSize, y, newSize, count);
        divideSquare(x + newSize * 2, y, newSize, count);
    }
}

function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var vertexShaderSource = `
    attribute vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var fragmentShaderSource = `
    precision mediump float;
    
    uniform vec4 s_color;

    void main() {
        gl_FragColor = s_color;
    }
`;

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(fragmentShader);

    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.useProgram(program);

    var colorLocation = gl.getUniformLocation(program, "s_color");

    gl.uniform4f(colorLocation, 1.0, 0.0, 0.0, 1.0);

    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    document.getElementById("slider").onchange = function (event) {

        numTimesToSubdivide = parseInt(event.target.value);

        points = [];

        divideSquare(-1, -1, 2, numTimesToSubdivide);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
    };

    document.getElementById("colorPicker").onchange = function (event) {

        var color = event.target.value;

        var r = parseInt(color.substring(1, 3), 16) / 255;
        var g = parseInt(color.substring(3, 5), 16) / 255;
        var b = parseInt(color.substring(5, 7), 16) / 255;

        gl.uniform4f(colorLocation, r, g, b, 1.0);

        gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
    };

    gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
}


window.onload = init;
