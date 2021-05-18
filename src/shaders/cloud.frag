#pragma glslify: fbm3d = require('glsl-fractal-brownian-noise/3d')
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: levels = require('./levels')

uniform sampler2D uTxtCloudNoise;
uniform float uTime;

uniform float uFac1;
uniform float uFac2;
uniform float uTimeFactor1;
uniform float uTimeFactor2;
uniform float uDisplStrenght1;
uniform float uDisplStrenght2;
uniform vec3 baseColor;
uniform float alphaMaxOutput;
uniform sampler2D canvasTexture;

varying vec2 vUv;

void main() {
    vec2 newUv = vUv;

    // Sliding textures
    vec4 txtNoise1 = texture2D(uTxtCloudNoise, vec2(vUv.x + uTime * 0.0001, vUv.y - uTime * 0.00014)); // noise txt
    vec4 txtNoise2 = texture2D(uTxtCloudNoise, vec2(vUv.x - uTime * 0.00002, vUv.y + uTime * 0.000017 + 0.2)); // noise txt

    // Distort UVs with fractional brownian motion
    float noiseBig = fbm3d(vec3(vUv * uFac1, uTime * uTimeFactor1), 4)+ 1.0 * 0.5;
    newUv += noiseBig * uDisplStrenght1;

    // Distort UVs with Simplex noise
    float noiseSmall = snoise3(vec3(newUv * uFac2, uTime * uTimeFactor2));
    newUv += noiseSmall * uDisplStrenght2;

    // Use vUv as second param to get static shape
    vec4 canvas = texture2D(canvasTexture, newUv);

    // Make min/max very similar to get opaque cloud (or max < min)
    // Less gamma = thinner clouds
    // Color, min input, gamma, max output
    float alpha = levels((txtNoise1 + txtNoise2) * 0.6, 0.2, 0.5, alphaMaxOutput).r;

    gl_FragColor = canvas;
    gl_FragColor.rgb *= alpha;
}
