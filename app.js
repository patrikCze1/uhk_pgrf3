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
    // texture
    //
    let image = new Image();
    image = loadTexture(gl, image, './texture/david.png');

    //
    // attributes
    //
    const positionLocation = gl.getAttribLocation(program, 'inPosition');
    const textureLocation = gl.getUniformLocation(program, 'tex');
    const resolution = gl.getUniformLocation(program, "uMatrix");
    const programMode = gl.getUniformLocation(program, "mode");
    const rangeLocation = gl.getUniformLocation(program, "range");

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
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
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
    const picture = document.getElementById('picture');   
    const range = document.getElementById('range');
    const dropdown = document.getElementById('mode');
    let src = picture.value;
    let mode = parseInt(dropdown.value);
    let r = range.value;
    range.disabled = true;

    range.onchange = () => {
        r = parseInt(range.value);
        console.log(r);
    }

    picture.onchange = () => {
        src = picture.value;
        loadTexture(gl, image, src);
    }

    dropdown.onchange = () => {
        mode = parseInt(dropdown.value);

        if (mode == 2 || mode == 9) {
            range.disabled = false;
        } else {
            range.disabled = true;
        }
    }
    
    window.onresize = (e) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    let imgWidth = 1;
    let imgHeight = 1;

    //
    // draw scene
    //  
    requestAnimationFrame(draw);

    function draw() {
        function resize(image) {
            canvas.width = image.width;
            canvas.height = image.height;
        }
        resize(image);

        // current size of screen
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        // clear canvas
        gl.clearColor(0.95, 0.95, 0.95, 1.0); // rgba
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // which program gl should use
        gl.useProgram(program);

        // bind attribute/buffer
        gl.bindVertexArray(va);

        // texture
        gl.uniform1i(textureLocation, 0); //texture
        //mode
        gl.uniform1i(programMode, mode);
        // range 
        gl.uniform1i(rangeLocation, r);

        //resolution
        gl.uniformMatrix3fv(resolution, false, [
            imgHeight, 0, 0,
            0, -imgWidth, 0,
            0, 0, 1,
          ]);

        
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(draw);
    }    
}

function loadTexture(gl, image, url) {
    const texture = gl.createTexture();
    
    image.src = url;
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        var mipLevel = 0;               // the largest mip
        var internalFormat = gl.RGBA;   // format we want in the texture
        var srcFormat = gl.RGBA;        // format of data we are supplying
        var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
        gl.texImage2D(gl.TEXTURE_2D,
                        mipLevel,
                        internalFormat,
                        srcFormat,
                        srcType,
                        image);
    }
  
    return image;
  }

start();