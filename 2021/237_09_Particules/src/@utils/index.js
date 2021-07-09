import * as THREE from 'three'

function getPoint(v, size) {
  //the 'discard' method, not the most efficient
  v.x = Math.random() * 2 - 1
  v.y = Math.random() * 2 - 1
  v.z = Math.random() * 2 - 1
  if (v.length() > 1) return getPoint(v, size)
  return v.normalize().multiplyScalar(size)
}

//returns a Float32Array buffer of spherical 3D points
function getSphere(count, size) {
  var len = count * 3
  var data = new Float32Array(len)
  var p = new THREE.Vector3()
  for (var i = 0; i < len; i += 3) {
    getPoint(p, size)
    data[i] = p.x
    data[i + 1] = p.y
    data[i + 2] = p.z
  }
  return data
}

// 3D volume distribution




export {getPoint, getSphere}
