(function (Scratch) {
  'use strict';

  const objectsData = {};
  let rotationEnabled = true;
  let cameraMode = 'obyekt';
  let cameraPosition = { x: 0, y: 0, z: 5 };
  let globalLights = [];
  let flatShadingMode = false;
  let edgesEnabled = false;
  let edgesColor = '#000000';
  let skyTextureBase64 = null;  // Yangi: osmon texturasi

  class ThreeDObjects {
    getInfo() {
      return {
        id: '3Dobjects',
        name: '3D Objects',
        color1: '#111111',
        color2: '#000000',
        blocks: [
          { opcode: 'createObject', blockType: Scratch.BlockType.COMMAND, text: '3D [NAME] nomli [TYPE] yarat',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
                         TYPE: { type: Scratch.ArgumentType.STRING, menu: 'objectTypes', defaultValue: 'cube' } } },

          { opcode: 'setPosition', blockType: Scratch.BlockType.COMMAND, text: '[NAME] 3D obyektni x [X] y [Y] z [Z] ga sozla',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
                         X: { type: Scratch.ArgumentType.STRING, defaultValue: '0' },
                         Y: { type: Scratch.ArgumentType.STRING, defaultValue: '0' },
                         Z: { type: Scratch.ArgumentType.STRING, defaultValue: '0' } } },

          { opcode: 'setScale', blockType: Scratch.BlockType.COMMAND, text: '[NAME] obyektni x [X] y [Y] z [Z] scale ga sozla',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
                         X: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
                         Y: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
                         Z: { type: Scratch.ArgumentType.STRING, defaultValue: '1' } } },

          { opcode: 'setRotation', blockType: Scratch.BlockType.COMMAND, text: '[NAME] obyektni x [RX] y [RY] z [RZ] daraja aylantir',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
                         RX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                         RY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                         RZ: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },

          { opcode: 'setTexture', blockType: Scratch.BlockType.COMMAND, text: '[NAME] obyekt textura sini [BASE64] rasmga sozla',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
                         BASE64: { type: Scratch.ArgumentType.STRING, defaultValue: '' } } },

          { opcode: 'setColor', blockType: Scratch.BlockType.COMMAND, text: '[NAME] obyekt rangini [COLOR] ga sozla',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
                         COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ffffff' } } },

          { opcode: 'setOpacity', blockType: Scratch.BlockType.COMMAND, text: '[NAME] obyekt shaffofligini [ALPHA] ga sozla',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
                         ALPHA: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } } },

          { opcode: 'setSpin', blockType: Scratch.BlockType.COMMAND, text: '[NAME] obyekt aylanish tezligini x [VX] y [VY] ga sozla',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
                         VX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.01 },
                         VY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.01 } } },

          { opcode: 'setSkyTexture', blockType: Scratch.BlockType.COMMAND, text: 'Osmon texturasini [BASE64] rasmga sozla',
            arguments: { BASE64: { type: Scratch.ArgumentType.STRING, defaultValue: '' } } },

          { opcode: 'toggleRotation', blockType: Scratch.BlockType.COMMAND, text: 'aylantirishni [STATE]',
            arguments: { STATE: { type: Scratch.ArgumentType.STRING, menu: 'onOff', defaultValue: 'yoqish' } } },

          { opcode: 'setCameraMode', blockType: Scratch.BlockType.COMMAND, text: 'Kamera harakati [MODE] bo\'lsin',
            arguments: { MODE: { type: Scratch.ArgumentType.STRING, menu: 'cameraModes', defaultValue: 'obyekt' } } },

          { opcode: 'setCameraPosition', blockType: Scratch.BlockType.COMMAND, text: 'Kamerani x [X] y [Y] z [Z] ga joylashtir',
            arguments: { X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                         Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                         Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 } } },

          { opcode: 'setOrbit', blockType: Scratch.BlockType.COMMAND, text: '[NAME] obyektni orbit radius [R] bilan aylantir',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' },
                         R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 } } },

          { opcode: 'setFaceMode', blockType: Scratch.BlockType.COMMAND, text: '3D face ni [MODE] qil',
            arguments: { MODE: { type: Scratch.ArgumentType.STRING, menu: 'faceModes', defaultValue: 'har_xil' } } },

          { opcode: 'setEdgesMode', blockType: Scratch.BlockType.COMMAND, text: 'Edges rejimni [STATE]',
            arguments: { STATE: { type: Scratch.ArgumentType.STRING, menu: 'onOff', defaultValue: 'o\'chir' } } },

          { opcode: 'setEdgesColor', blockType: Scratch.BlockType.COMMAND, text: 'Edges rangini [COLOR] ga sozla',
            arguments: { COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#000000' } } },

          { opcode: 'getHTML', blockType: Scratch.BlockType.REPORTER, text: 'hosil bo‘lgan faylni HTML qilib ayt' },

          { opcode: 'getIframeHTML', blockType: Scratch.BlockType.REPORTER, text: 'iframe uchun HTML qilib ayt, orqa fon [BG]',
            arguments: { BG: { type: Scratch.ArgumentType.STRING, menu: 'bgModes', defaultValue: 'bor' } } },

          { opcode: 'clearAll', blockType: Scratch.BlockType.COMMAND, text: 'barcha obyektlarni o‘chir' },

          { opcode: 'listNames', blockType: Scratch.BlockType.REPORTER, text: 'barcha mavjud obyekt nomlar' },

          { opcode: 'removeObject', blockType: Scratch.BlockType.COMMAND, text: '[NAME] obyektni o‘chir',
            arguments: { NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'obj1' } } }
        ],
        menus: {
          objectTypes: { acceptReporters: true, items: ['cube', 'sphere', 'prism', 'plane', 'billboard', 'cylinder', 'cone', 'torus', 'octahedron', 'dodecahedron'] },
          onOff: { acceptReporters: true, items: ['yoq', 'o\'chir'] },
          cameraModes: { acceptReporters: true, items: ['obyekt', 'ozi'] },
          faceModes: { acceptReporters: true, items: ['har_xil', 'bir_xil'] },
          bgModes: { acceptReporters: true, items: ['bor', 'yo\'q'] }
        }
      };
    }

    createObject({ NAME, TYPE }) {
      objectsData[NAME] = {
        type: TYPE, x: 0, y: 0, z: 0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        texture: null, color: '#ffffff', opacity: 1,
        spinX: 0, spinY: 0, orbit: null,
        rotX: 0, rotY: 0, rotZ: 0,
        isBillboard: TYPE === 'billboard'
      };
    }

    setRotation({ NAME, RX, RY, RZ }) {
      if (!objectsData[NAME] || objectsData[NAME].isBillboard) return;
      objectsData[NAME].rotX = Number(RX) * Math.PI / 180;
      objectsData[NAME].rotY = Number(RY) * Math.PI / 180;
      objectsData[NAME].rotZ = -Number(RZ) * Math.PI / 180;
    }

    toggleRotation({ STATE }) { rotationEnabled = (STATE === 'yoq'); }
    setCameraMode({ MODE }) { cameraMode = MODE; }
    setCameraPosition({ X, Y, Z }) { cameraPosition = { x: Number(X), y: Number(Y), z: Number(Z) }; }
    setOrbit({ NAME, R }) { if (!objectsData[NAME]) return; objectsData[NAME].orbit = Number(R); }
    listNames() { return Object.keys(objectsData).join(', '); }

    setEdgesMode({ STATE }) { edgesEnabled = (STATE === 'yoq'); }
    setEdgesColor({ COLOR }) { edgesColor = COLOR; }

    setPosition({ NAME, X, Y, Z }) { if (!objectsData[NAME]) return; objectsData[NAME].x = Number(X); objectsData[NAME].y = Number(Y); objectsData[NAME].z = Number(Z); }
    setScale({ NAME, X, Y, Z }) { if (!objectsData[NAME]) return; objectsData[NAME].scaleX = Number(X); objectsData[NAME].scaleY = Number(Y); objectsData[NAME].scaleZ = Number(Z); }
    setTexture({ NAME, BASE64 }) { if (!objectsData[NAME]) return; objectsData[NAME].texture = BASE64; }
    setColor({ NAME, COLOR }) { if (!objectsData[NAME]) return; objectsData[NAME].color = COLOR; }
    setOpacity({ NAME, ALPHA }) { if (!objectsData[NAME]) return; objectsData[NAME].opacity = Number(ALPHA); }
    setSpin({ NAME, VX, VY }) { if (!objectsData[NAME]) return; objectsData[NAME].spinX = Number(VX); objectsData[NAME].spinY = Number(VY); }
    setFaceMode({ MODE }) { flatShadingMode = (MODE === 'bir_xil'); }

    setSkyTexture({ BASE64 }) {
      skyTextureBase64 = BASE64 || null;
    }

    clearAll() {
      for (const k in objectsData) delete objectsData[k];
      globalLights = [];
      rotationEnabled = true;
      cameraMode = 'obyekt';
      cameraPosition = { x: 0, y: 0, z: 5 };
      flatShadingMode = false;
      edgesEnabled = false;
      edgesColor = '#000000';
      skyTextureBase64 = null;
    }

    removeObject({ NAME }) { delete objectsData[NAME]; }

    getHTML() { return this._generateHTML(false); }
    getIframeHTML({ BG }) { return this._generateHTML(BG === 'yo\'q'); }

    _generateHTML(transparent = false) {
      const bgStyle = transparent ? 'background:transparent;' : 'background:black;';

      const head = `<head><meta charset="UTF-8"><title>3D Objects</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;touch-action:none;${bgStyle}}</style></head>`;

      const bodyStart = `<body><script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script><script>
const scene = new THREE.Scene();

if (${!transparent} && "${skyTextureBase64 || ''}") {
  const loader = new THREE.TextureLoader();
  const texture = loader.load("${skyTextureBase64 || ''}");
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
} else {
  scene.background = ${transparent ? 'null' : 'new THREE.Color(0x000000)'};
}
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(${cameraPosition.x}, ${cameraPosition.y}, ${cameraPosition.z});
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: ${transparent} });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000, ${transparent ? 0 : 1});
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

const sceneObjectsGroup = new THREE.Group();
scene.add(sceneObjectsGroup);
const sceneObjects = [];
const billboards = [];
let isDragging = false, lastX = 0, lastY = 0;
const rotationEnabled = ${rotationEnabled};
const cameraMode = '${cameraMode}';
`;

      let meshCode = '';
      for (const name in objectsData) {
        const o = objectsData[name];
        let geo;
        if (o.type === 'cube') geo = 'new THREE.BoxGeometry(1,1,1)';
        else if (o.type === 'sphere') geo = 'new THREE.SphereGeometry(0.5, 32, 32)';
        else if (o.type === 'prism') geo = 'new THREE.CylinderGeometry(0.6, 0.6, 1, 3)';
        else if (o.type === 'plane' || o.type === 'billboard') geo = 'new THREE.PlaneGeometry(1, 1)';
        else if (o.type === 'cylinder') geo = 'new THREE.CylinderGeometry(0.5, 0.5, 1, 32)';
        else if (o.type === 'cone') geo = 'new THREE.ConeGeometry(0.5, 1, 32)';
        else if (o.type === 'torus') geo = 'new THREE.TorusGeometry(0.5, 0.2, 16, 100)';
        else if (o.type === 'octahedron') geo = 'new THREE.OctahedronGeometry(0.5, 0)';
        else if (o.type === 'dodecahedron') geo = 'new THREE.DodecahedronGeometry(0.5, 0)';
        else geo = 'new THREE.BoxGeometry(1,1,1)';

        let mat;
        if (flatShadingMode) {
          mat = `new THREE.MeshBasicMaterial({ color: "${o.color}", transparent: true, opacity: ${o.opacity}, side: THREE.DoubleSide })`;
          if (o.texture) mat = `new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("${o.texture}"), transparent: true, opacity: ${o.opacity}, side: THREE.DoubleSide })`;
        } else {
          const side = (o.type === 'plane' || o.type === 'billboard') ? 'THREE.DoubleSide' : 'THREE.FrontSide';
          mat = `new THREE.MeshStandardMaterial({ color: "${o.color}", transparent: true, opacity: ${o.opacity}, depthWrite: true, side: ${side} })`;
          if (o.texture) mat = `new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load("${o.texture}"), transparent: true, opacity: ${o.opacity}, depthWrite: true, side: ${side} })`;
        }

        meshCode += `const obj_${name} = new THREE.Mesh(${geo}, ${mat});
obj_${name}.position.set(${o.x}, ${o.y}, ${o.z});
obj_${name}.scale.set(${o.scaleX}, ${o.scaleY}, ${o.scaleZ});
obj_${name}.rotation.reorder('YXZ');
obj_${name}.rotation.set(${o.rotX || 0}, ${o.rotY || 0}, ${o.rotZ || 0});
obj_${name}.spinX = ${o.spinX || 0};
obj_${name}.spinY = ${o.spinY || 0};
obj_${name}.orbit = ${o.orbit};
sceneObjects.push(obj_${name});
sceneObjectsGroup.add(obj_${name});\n`;

        if (edgesEnabled && !['sphere', 'billboard'].includes(o.type)) {
          meshCode += `const edges_${name} = new THREE.LineSegments(new THREE.EdgesGeometry(obj_${name}.geometry), new THREE.LineBasicMaterial({ color: "${edgesColor}" }));
edges_${name}.position.copy(obj_${name}.position);
edges_${name}.scale.copy(obj_${name}.scale);
edges_${name}.rotation.copy(obj_${name}.rotation);
sceneObjectsGroup.add(edges_${name});\n`;
        }

        if (o.type === 'billboard') {
          meshCode += `billboards.push(obj_${name});\n`;
        }
      }

      const bodyEnd = `
renderer.domElement.addEventListener('pointerdown', e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
window.addEventListener('pointerup', () => isDragging = false);
window.addEventListener('pointermove', e => {
  if (!isDragging || !rotationEnabled) return;
  const dx = e.clientX - lastX; const dy = e.clientY - lastY;
  const vy = dx * 0.002; const vx = dy * 0.002;
  if (cameraMode === 'obyekt') { sceneObjectsGroup.rotation.y += vy; sceneObjectsGroup.rotation.x += vx; }
  else { camera.position.x += -vy; camera.position.y += vx; }
  lastX = e.clientX; lastY = e.clientY;
});
function animate() {
  requestAnimationFrame(animate);
  sceneObjects.forEach(o => {
    if (!isDragging && rotationEnabled) {
      o.rotation.y += o.spinY;
      o.rotation.x += o.spinX;
    }
    if (o.orbit !== null) {
      const t = Date.now() * 0.001;
      o.position.x = o.orbit * Math.cos(t);
      o.position.z = o.orbit * Math.sin(t);
    }
  });
  billboards.forEach(b => b.lookAt(camera.position));
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}
animate();
</script></body>`;

      return `<!DOCTYPE html>${head}${bodyStart}${meshCode}${bodyEnd}`;
    }
  }

  Scratch.extensions.register(new ThreeDObjects());
})(Scratch);