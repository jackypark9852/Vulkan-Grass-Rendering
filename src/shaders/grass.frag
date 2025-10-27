#version 450
#extension GL_ARB_separate_shader_objects : enable

#define DIR_LIGHT  vec3(1.f, 1.f, -1.f)

layout(set = 0, binding = 0) uniform CameraBufferObject {
    mat4 view;
    mat4 proj;
} camera;

layout(location = 0) in vec3 fs_pos;
layout(location = 1) in vec3 fs_nor;
layout(location = 2) in vec2 fs_uv;

layout(location = 0) out vec4 outColor;

void main() {
    // Basic lambertian shader 
    vec3 baseColor = vec3(0.1, 0.8, 0.1);
    vec3 finalColor = baseColor * max(abs(dot(normalize(fs_nor), normalize(DIR_LIGHT))), 0.7);
    outColor = vec4(finalColor, 1.0);
}
