function start() {
    // get canvas
    const canvas = document.getElementById('canvas');
    // full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext('webgl2');

    if (!gl) {
        alert('No support.');
        return;
    }

    const texture = loadTexture(gl, './texture/texture.jpg');

    const pr = new Program();

    //
    // create shaders
    //
    const vs = document.getElementById('vertexShader').textContent;
    const fs = document.getElementById('fragmentShader').textContent;
    const vertexShader = pr.createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = pr.createShader(gl, gl.FRAGMENT_SHADER, fs);

    //
    // create webgl program
    //
    const program = pr.createProgram(gl, vertexShader, fragmentShader);

    //
    // attributes
    //
    const positionLocation = gl.getAttribLocation(program, 'inPosition');
    var textureLocation = gl.getUniformLocation(program, "tex");

    //
    // Create a vertex array object
    //
    const va = gl.createVertexArray();

    // we are working with
    gl.bindVertexArray(va);
    
    //
    // define object
    //
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);

    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is float
    var normalize = false; // don't normalize 
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    //
    // variables
    //
    let move = [0, 0, -1];
    let speed = 1;

    //
    // draw scene
    //  
    requestAnimationFrame(draw);

    //
    // key handler
    //
    window.onkeyup = (e) => {
        if (e.keyCode == 32) { // space
            move[1] -= 0.3;
        }
        if (e.keyCode == 68) { // d
            //translation[1] += 5;
            move[0] -= 0.2;
            console.log(move);
        }
        if (e.keyCode == 65) { // a
            move[0] += 0.2;
            console.log(move);
        }
        if (e.keyCode == 87) { // w
            move[2] += 0.2;
            console.log(move);
        }        
        if (e.keyCode == 83) { // s
            move[2] -= 0.2;
            console.log(move);
        }
        if (e.keyCode == 88) { // x
            move[1] += 0.3;
            console.log(move);
        }
        draw();
    }

    //
    // camera
    //
    

    function draw() {
        // current size of screen
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        // clear canvas
        gl.clearColor(1.0, 1.0, 1.0, 1.0); // rgba
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // z-buffer
        gl.enable(gl.DEPTH_TEST);

        //gl.enable(gl.CULL_FACE);

        // which program gl should use
        gl.useProgram(program);

        // bind attribute/buffer
        gl.bindVertexArray(va);

        // textura
        gl.uniform1i(textureLocation, texture);

        
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        console.log('speed: ');
        requestAnimationFrame(draw);
    }    
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
  
    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 1, 1]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);
  
    const image = new Image();
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    srcFormat, srcType, image);
  
      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
         // Yes, it's a power of 2. Generate mips.
         gl.generateMipmap(gl.TEXTURE_2D);
      } else {
         // No, it's not a power of 2. Turn off mips and set
         // wrapping to clamp to edge
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;
  
    return tex;
  }
  function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

start();

