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

function getImage( img, width, height, elevation ){

  var ctx = getContext( null, width, height );
  ctx.drawImage(img, 0, 0);

  var imgData = ctx.getImageData(0,0,width,height);
  var iData = imgData.data;

  var l = (width * height );
  var data = new Float32Array( l * 3 );
  for ( var i = 0; i < l; i++ ) {

      var i3 = i * 3;
      var i4 = i * 4;
      data[ i3 ]      = ( ( i % width ) / width  -.5 ) * width;
      data[ i3 + 1 ]  = ( iData[i4] / 0xFF * 0.299 +iData[i4+1]/0xFF * 0.587 + iData[i4+2] / 0xFF * 0.114 ) * elevation;
      data[ i3 + 2 ]  = ( ( i / width ) / height -.5 ) * height;
  }
  return data;
}

// Loading a mesh and return texture data
function parseMesh(g){ 
  var vertices = g.vertices;
  var total = vertices.length;
  var size = parseInt( Math.sqrt( total * 3 ) + .5 );
  var data = new Float32Array( size*size*3 );
  for( var i = 0; i < total; i++ ) {
      data[i * 3] = vertices[i].x;
      data[i * 3 + 1] = vertices[i].y;
      data[i * 3 + 2] = vertices[i].z;
  }
  return data;
}


export {getPoint, getSphere, getImage, parseMesh}
