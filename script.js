// ===============================
// TERRAIN GENERATOR
// ===============================


// SCENE

const scene =
new THREE.Scene();


scene.background =
new THREE.Color(
0x87ceeb
);


scene.fog =
new THREE.Fog(
0x87ceeb,
150,
700
);




// CAMERA

const camera =
new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
2000
);


camera.position.set(
0,
60,
100
);




// RENDERER

const renderer =
new THREE.WebGLRenderer({
antialias:true
});


renderer.shadowMap.enabled=true;


renderer.shadowMap.type =
THREE.PCFSoftShadowMap;


renderer.setSize(
window.innerWidth,
window.innerHeight
);


document.body.appendChild(
renderer.domElement
);





// ===============================
// LIGHTING
// ===============================


const sun =
new THREE.DirectionalLight(
0xffffff,
2
);


sun.position.set(
150,
200,
100
);


sun.castShadow=true;


sun.shadow.mapSize.width=2048;

sun.shadow.mapSize.height=2048;


scene.add(sun);



scene.add(
new THREE.HemisphereLight(
0xffffff,
0x445544,
0.7
)
);





// ===============================
// TEXTURE LOADING
// ===============================


const loader =
new THREE.TextureLoader();



function loadTexture(file){


let tex =
loader.load(
"textures/"+file
);


tex.wrapS =
THREE.RepeatWrapping;


tex.wrapT =
THREE.RepeatWrapping;


tex.repeat.set(
15,
15
);


return tex;

}




const colorMap =
loadTexture(
"Grass005_1K-PNG_Color.png"
);


colorMap.encoding =
THREE.sRGBEncoding;



const normalMap =
loadTexture(
"Grass005_1K-PNG_NormalGL.png"
);



const roughnessMap =
loadTexture(
"Grass005_1K-PNG_Roughness.png"
);



const aoMap =
loadTexture(
"Grass005_1K-PNG_AmbientOcclusion.png"
);



const displacementMap =
loadTexture(
"Grass005_1K-PNG_Displacement.png"
);





// ===============================
// TERRAIN GENERATION
// ===============================


const TERRAIN_SIZE=600;



const geometry =
new THREE.PlaneGeometry(
TERRAIN_SIZE,
TERRAIN_SIZE,
256,
256
);



geometry.rotateX(
-Math.PI/2
);



// FIX AO MAP

geometry.setAttribute(
"uv2",
new THREE.BufferAttribute(
geometry.attributes.uv.array,
2
)
);




// CREATE NATURAL TERRAIN


const vertices =
geometry.attributes.position;



for(
let i=0;
i<vertices.count;
i++
){


let x =
vertices.getX(i);


let z =
vertices.getZ(i);



let height =

Math.sin(x*0.025)*5

+

Math.cos(z*0.03)*5

+

Math.sin((x+z)*0.015)*10;



vertices.setY(
i,
height
);

}



geometry.computeVertexNormals();





// MATERIAL


const material =
new THREE.MeshStandardMaterial({

map:colorMap,

normalMap:normalMap,

roughnessMap:roughnessMap,

aoMap:aoMap,

displacementMap:displacementMap,

displacementScale:2,

roughness:1

});





const terrain =
new THREE.Mesh(
geometry,
material
);



terrain.receiveShadow=true;


scene.add(terrain);






// ===============================
// PLAYER CAMERA
// ===============================


let keys={};


document.addEventListener(
"keydown",
e=>{
keys[e.key.toLowerCase()]=true;
}
);


document.addEventListener(
"keyup",
e=>{
keys[e.key.toLowerCase()]=false;
}
);




let yaw=0;

let pitch=0;




document.body.onclick=()=>{

document.body.requestPointerLock();

};




document.addEventListener(
"mousemove",
e=>{


if(document.pointerLockElement){


yaw -=
e.movementX*0.002;


pitch -=
e.movementY*0.002;



pitch=Math.max(
-1.5,
Math.min(
1.5,
pitch
)
);


}

});







function update(){



let move =
new THREE.Vector3();



if(keys["w"])
move.z-=1;


if(keys["s"])
move.z+=1;


if(keys["a"])
move.x-=1;


if(keys["d"])
move.x+=1;



move.normalize();



move.applyAxisAngle(
new THREE.Vector3(0,1,0),
yaw
);



camera.position.add(
move.multiplyScalar(1)
);





if(keys[" "])
camera.position.y+=1;



if(keys["shift"])
camera.position.y-=1;




camera.rotation.order="YXZ";


camera.rotation.y=yaw;


camera.rotation.x=pitch;


}






// ===============================
// LOOP
// ===============================


function animate(){


requestAnimationFrame(
animate
);


update();


renderer.render(
scene,
camera
);


}


animate();





window.addEventListener(
"resize",
()=>{


camera.aspect =
window.innerWidth/window.innerHeight;


camera.updateProjectionMatrix();


renderer.setSize(
window.innerWidth,
window.innerHeight
);


}
);
