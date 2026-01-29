(function(Scratch){
  'use strict';

  const objectsData = {};
  const codeLines = [];
  let cameraRotationEnabled = true;
  let cameraPositionData = {x:0, y:0, z:5};
  let backgroundColor = '#000000';
  let skyColors = {top:'#87ceeb', middle:'#ffffff', bottom:'#a0a0a0'};

  class ThreeDObjectsV2 {
    getInfo(){
      return {
        id: '3DObjectsV2',
        name: '3D Objects & Collision',
        color1: '#1e88e5',
        color2: '#0a1a33',
        blocks:[
          // --- Obyekt bloklari ---
          {opcode:'createObject', blockType: Scratch.BlockType.COMMAND, text:'3D [NAME] nomli [TYPE] yarat',
            arguments:{NAME:{type:Scratch.ArgumentType.STRING, defaultValue:'obj1'},
                       TYPE:{type:Scratch.ArgumentType.STRING, menu:'objectTypes', defaultValue:'cube'}}},
          {opcode:'setPosition', blockType: Scratch.BlockType.COMMAND, text:'[NAME] 3D obyektni x [X] y [Y] z [Z] ga sozla',
            arguments:{NAME:{type:Scratch.ArgumentType.STRING, defaultValue:'obj1'},
                       X:{type:Scratch.ArgumentType.NUMBER, defaultValue:0},
                       Y:{type:Scratch.ArgumentType.NUMBER, defaultValue:0},
                       Z:{type:Scratch.ArgumentType.NUMBER, defaultValue:0}}},
          {opcode:'setScale', blockType: Scratch.BlockType.COMMAND, text:'[NAME] 3D obyektni x [X] y [Y] z [Z] scale ga sozla',
            arguments:{NAME:{type:Scratch.ArgumentType.STRING, defaultValue:'obj1'},
                       X:{type:Scratch.ArgumentType.NUMBER, defaultValue:1},
                       Y:{type:Scratch.ArgumentType.NUMBER, defaultValue:1},
                       Z:{type:Scratch.ArgumentType.NUMBER, defaultValue:1}}},
          {opcode:'setCollisionScale', blockType: Scratch.BlockType.COMMAND, text:'[NAME] collision scale x [X] y [Y] z [Z] ga sozla',
            arguments:{NAME:{type:Scratch.ArgumentType.STRING, defaultValue:'obj1'},
                       X:{type:Scratch.ArgumentType.NUMBER, defaultValue:1},
                       Y:{type:Scratch.ArgumentType.NUMBER, defaultValue:1},
                       Z:{type:Scratch.ArgumentType.NUMBER, defaultValue:1}}},
          {opcode:'addIfCollision', blockType: Scratch.BlockType.COMMAND, text:'[A] [B] ga tegdimi?',
            arguments:{A:{type:Scratch.ArgumentType.STRING, defaultValue:'A'},
                       B:{type:Scratch.ArgumentType.STRING, defaultValue:'B'}}},
          {opcode:'addClosingBrace', blockType: Scratch.BlockType.COMMAND, text:'} Belgisini qo‘yish'},
          {opcode:'getHTML', blockType: Scratch.BlockType.REPORTER, text:'hosil bo‘lgan to‘liq HTML'},
          {opcode:'clearAll', blockType: Scratch.BlockType.COMMAND, text:'barcha kodlarni tozalash'},
          {opcode:'setCameraPosition', blockType: Scratch.BlockType.COMMAND, text:'Kamera x [X] y [Y] z [Z] ga sozlash',
            arguments:{X:{type:Scratch.ArgumentType.NUMBER, defaultValue:0},
                       Y:{type:Scratch.ArgumentType.NUMBER, defaultValue:0},
                       Z:{type:Scratch.ArgumentType.NUMBER, defaultValue:5}}},
          {opcode:'toggleCameraRotation', blockType: Scratch.BlockType.COMMAND, text:'Kamerani harakatini [STATE]',
            arguments:{STATE:{type:Scratch.ArgumentType.STRING, menu:'onOff', defaultValue:'yoq'}}},
          {opcode:'setObjectColor', blockType: Scratch.BlockType.COMMAND, text:'[NAME] obyekt rangini [COLOR] ga sozla',
            arguments:{NAME:{type:Scratch.ArgumentType.STRING, defaultValue:'obj1'},
                       COLOR:{type:Scratch.ArgumentType.COLOR, defaultValue:'#ffffff'}}},
          {opcode:'setBackgroundSky', blockType: Scratch.BlockType.COMMAND, text:'Kamera orqa fonni yuqorisini [TOP] markazini [MIDDLE] pastini [BOTTOM] ga sozla',
            arguments:{TOP:{type:Scratch.ArgumentType.COLOR, defaultValue:'#87ceeb'},
                       MIDDLE:{type:Scratch.ArgumentType.COLOR, defaultValue:'#ffffff'},
                       BOTTOM:{type:Scratch.ArgumentType.COLOR, defaultValue:'#a0a0a0'}}},
          {opcode:'waitSeconds', blockType: Scratch.BlockType.COMMAND, text:'[SECONDS] soniya kutish',
            arguments:{SECONDS:{type:Scratch.ArgumentType.NUMBER, defaultValue:1}}},
          {opcode:'setObjectRotation', blockType: Scratch.BlockType.COMMAND, text:'[NAME] obyektni darajalarini x [X] y [Y] z [Z] ga sozlash',
            arguments:{NAME:{type:Scratch.ArgumentType.STRING, defaultValue:'obj1'},
                       X:{type:Scratch.ArgumentType.NUMBER, defaultValue:0},
                       Y:{type:Scratch.ArgumentType.NUMBER, defaultValue:0},
                       Z:{type:Scratch.ArgumentType.NUMBER, defaultValue:0}}},
          {opcode:'setMainJS', blockType: Scratch.BlockType.COMMAND, text:'Asosiy js ni [CODE] ga sozlash',
            arguments:{CODE:{type:Scratch.ArgumentType.STRING, defaultValue:''}}}
        ],
        menus:{
          objectTypes:{acceptReporters:true, items:['cube','sphere','prism','plane','cylinder','cone','torus']},
          onOff:{acceptReporters:true, items:['yoq','o\'chir']}
        }
      };
    }

    createObject({NAME, TYPE}){
      objectsData[NAME] = {type:TYPE, x:0,y:0,z:0, scale:{x:1,y:1,z:1}, collisionScale:{x:1,y:1,z:1}, color:'#ffffff', rotation:{x:0,y:0,z:0}};
      codeLines.push(`const ${NAME} = new THREE.Mesh(new THREE.${this.getGeometry(TYPE)}, new THREE.MeshStandardMaterial({color:'#ffffff'}));`);
      codeLines.push(`scene.add(${NAME});`);
    }
    setPosition({NAME,X,Y,Z}){if(!objectsData[NAME]) return; objectsData[NAME].x=X; objectsData[NAME].y=Y; objectsData[NAME].z=Z; codeLines.push(`${NAME}.position.set(${X},${Y},${Z});`);}
    setScale({NAME,X,Y,Z}){if(!objectsData[NAME]) return; objectsData[NAME].scale={x:X,y:Y,z:Z}; codeLines.push(`${NAME}.scale.set(${X},${Y},${Z});`);}
    setCollisionScale({NAME,X,Y,Z}){if(!objectsData[NAME]) return; objectsData[NAME].collisionScale={x:X,y:Y,z:Z}; codeLines.push(`${NAME}.collisionScale={x:${X},y:${Y},z:${Z}};`);}
    addIfCollision({A,B}){codeLines.push(`if(Math.abs(${A}.position.x-${B}.position.x)<(${A}.collisionScale.x/2+${B}.collisionScale.x/2)&& Math.abs(${A}.position.y-${B}.position.y)<(${A}.collisionScale.y/2+${B}.collisionScale.y/2)&& Math.abs(${A}.position.z-${B}.position.z)<(${A}.collisionScale.z/2+${B}.collisionScale.z/2)){`);}
    addClosingBrace(){codeLines.push('}');}
    setCameraPosition({X,Y,Z}){cameraPositionData={x:X,y:Y,z:Z}; codeLines.push(`camera.position.set(${X},${Y},${Z});`);}
    toggleCameraRotation({STATE}){cameraRotationEnabled=(STATE==='yoq'); codeLines.push(`cameraRotationEnabled=${cameraRotationEnabled};`);}
    setObjectColor({NAME,COLOR}){if(!objectsData[NAME]) return; objectsData[NAME].color=COLOR; codeLines.push(`${NAME}.material.color.set('${COLOR}');`);}
    setBackgroundSky({TOP,MIDDLE,BOTTOM}){skyColors={top:TOP,middle:MIDDLE,bottom:BOTTOM}; codeLines.push(`updateSky('${TOP}','${MIDDLE}','${BOTTOM}');`);}
    waitSeconds({SECONDS}){codeLines.push(`await new Promise(r=>setTimeout(r, ${SECONDS*1000}));`);}
    setObjectRotation({NAME,X,Y,Z}){if(!objectsData[NAME]) return; objectsData[NAME].rotation={x:X,y:Y,z:Z}; codeLines.push(`${NAME}.rotation.set(${X}*Math.PI/180,${Y}*Math.PI/180,${Z}*Math.PI/180);`);}
    setMainJS({CODE}){codeLines.push(CODE);}

    getHTML(){
      return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>3D Scene</title>
<style>body{margin:0;overflow:hidden}</style>
</head>
<body>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script>
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,100);
camera.position.set(${cameraPositionData.x},${cameraPositionData.y},${cameraPositionData.z});
camera.rotation.order='YXZ';
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
renderer.setClearColor('${backgroundColor}');
document.body.appendChild(renderer.domElement);
scene.add(new THREE.AmbientLight(0xffffff,1));

let cameraRotationEnabled=${cameraRotationEnabled};
let pointerDown=false, lastX=0, lastY=0;

// Sky sphere
const skyGeo = new THREE.SphereGeometry(100,32,32);
const skyMat = new THREE.ShaderMaterial({
  uniforms:{
    topColor:{value:new THREE.Color('${skyColors.top}')},
    middleColor:{value:new THREE.Color('${skyColors.middle}')},
    bottomColor:{value:new THREE.Color('${skyColors.bottom}')}
  },
  vertexShader:\`varying vec3 vPosition;
    void main(){vPosition=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`uniform vec3 topColor; uniform vec3 middleColor; uniform vec3 bottomColor; varying vec3 vPosition;
    void main(){float h=(vPosition.y+50.0)/100.0; vec3 color=mix(bottomColor,middleColor,clamp(h,0.0,0.5)*2.0); color=mix(color,topColor,clamp(h-0.5,0.0,0.5)*2.0); gl_FragColor=vec4(color,1.0);}\`,
  side:THREE.BackSide
});
const sky = new THREE.Mesh(skyGeo,skyMat);
scene.add(sky);

function updateSky(top,middle,bottom){
  sky.material.uniforms.topColor.value.set(top);
  sky.material.uniforms.middleColor.value.set(middle);
  sky.material.uniforms.bottomColor.value.set(bottom);
}

// Camera control
let yaw=0, pitch=0;
function updateCamera(dx,dy){
  yaw -= dx*0.005;
  pitch -= dy*0.005;
  pitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,pitch));
  camera.rotation.set(pitch, yaw, 0);
}

function onPointerDown(e){
  pointerDown=true;
  if(e.touches){ lastX=e.touches[0].clientX; lastY=e.touches[0].clientY;}
  else{ lastX=e.clientX; lastY=e.clientY;}
}
function onPointerMove(e){
  if(!pointerDown || !cameraRotationEnabled) return;
  let x=0,y=0;
  if(e.touches){ x=e.touches[0].clientX; y=e.touches[0].clientY;}
  else{ x=e.clientX; y=e.clientY;}
  updateCamera(x-lastX, y-lastY);
  lastX=x; lastY=y;
}
function onPointerUp(){pointerDown=false;}

window.addEventListener('pointerdown',onPointerDown);
window.addEventListener('pointermove',onPointerMove);
window.addEventListener('pointerup',onPointerUp);
window.addEventListener('touchstart',onPointerDown);
window.addEventListener('touchmove',onPointerMove);
window.addEventListener('touchend',onPointerUp);

async function animate(){
  requestAnimationFrame(animate);
  sky.position.copy(camera.position); // kamera bilan sky harakati
  renderer.render(scene,camera);
}

animate();
${codeLines.join('\n')}
</script>
</body>
</html>`;
    }

    clearAll(){
      codeLines.length=0;
      for(const k in objectsData) delete objectsData[k];
      cameraRotationEnabled=true;
      cameraPositionData={x:0,y:0,z:5};
      backgroundColor='#000000';
      skyColors={top:'#87ceeb',middle:'#ffffff',bottom:'#a0a0a0'};
    }

    getGeometry(TYPE){
      switch(TYPE){
        case 'cube': return 'BoxGeometry(1,1,1)';
        case 'sphere': return 'SphereGeometry(0.5,32,32)';
        case 'prism': return 'CylinderGeometry(0.6,0.6,1,3)';
        case 'plane': return 'PlaneGeometry(1,1)';
        case 'cylinder': return 'CylinderGeometry(0.5,0.5,1,32)';
        case 'cone': return 'ConeGeometry(0.5,1,32)';
        case 'torus': return 'TorusGeometry(0.5,0.2,16,100)';
        default: return 'BoxGeometry(1,1,1)';
      }
    }
  }

  Scratch.extensions.register(new ThreeDObjectsV2());
})(Scratch);