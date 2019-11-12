class Program {
    constructor() {

    }

    createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
    
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return program;
        }
    
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);  
        return null;      
    }

    createShader(gl, type, source) {
        let shader = gl.createShader(type); // create new shader
        gl.shaderSource(shader, source); // send source to shader
        gl.compileShader(shader); // compile shader
        
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { // if shader is compiled successsfully
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        alert('Error, see console.');
        gl.deleteShader(shader);
        return null;
    }
}