# Vulkan Grass Rendering

## Project Introduction

> University of Pennsylvania — CIS5650: GPU Programming & Architecture  
> Jacky Park  
> Tested on: Windows 11 · i7-14700K @ 3.40 GHz · 64 GB RAM · RTX 5090 (32 GB VRAM)

A real-time Vulkan renderer that uses tessellation shaders to generate and draw dense grass geometry.

<p align="center">
  <img src="img/vulkan-grass.gif" alt="Vulkan grass demo" />
</p>

# The Pipeline: From Bezier Curves to Grass Blades ]

In this renderer, each blade of grass begins as a quadratic Bézier curve (degree 2) generated on the CPU.   

We define three control points **v0, v1, v2** that shape the blade’s bend and silhouette. For each blade, we also randomize **height, width, orientation, and stiffness** to create natural variation.

<p align="center">
  <img src="image.png" alt="Blade generation diagram" />
</p>

Once those attributes are generated, most of the heavy lifting moves to the GPU:
- A **compute shader** handles simulation (wind, gravity, recovery) and culls blades that shouldn’t be drawn.
- A **tessellation shader** takes the curve description and expands it into actual renderable geometry in real time.
- A **fragment shader** shades the final grass using simple Lambertian lighting.
  
```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#e8f4f8', 'primaryTextColor':'#000', 'primaryBorderColor':'#2c5f7c', 'lineColor':'#2c5f7c', 'secondaryColor':'#d4e8f0', 'tertiaryColor':'#fff', 'fontSize':'16px'}, 'flowchart': {'nodeSpacing': 80, 'rankSpacing': 100}}}%%
flowchart LR
    %% ---------- CPU STAGE ----------
    subgraph CPU_Stage["CPU Stage"]
        A["<div style='text-align: left; min-width: 250px; white-space: normal; word-wrap: break-word;'>Randomize per-blade <br/>attributes:<br/>• height<br/>• width<br/>• orientation<br/>• stiffness</div>"]
        B["<div style='text-align: left; min-width: 250px; white-space: normal; word-wrap: break-word;'>Generate quadratic Bézier <br/>curve<br/>(control points v0, v1, v2)</div>"]
        A --> B
    end
    %% ---------- GPU STAGE ----------
    subgraph GPU_Stage["GPU Stage"]
        C["<div style='text-align: left; min-width: 250px; white-space: normal; word-wrap: break-word;'>Compute Shader<br/>• wind / gravity sim<br/>• stiffness & recovery<br/>• culling &nbsp;&nbsp;&nbsp;</div>"]
        D["<div style='text-align: left; min-width: 250px; white-space: normal; word-wrap: break-word;'>Tessellation Shader<br/>• curve → blade mesh<br/>• generate triangles&nbsp;&nbsp;&nbsp;</div>"]
        E["<div style='text-align: left; min-width: 250px; white-space: normal; word-wrap: break-word;'>Fragment Shader<br/>• Lambertian shading<br/>• final color</div>"]
        C --> D --> E
    end
    CPU_Stage --> GPU_Stage
```
