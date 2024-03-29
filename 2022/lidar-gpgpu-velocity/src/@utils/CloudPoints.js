import * as THREE from "three"

/**
 * Generate Points from a texture - Image 2D
 * @param {*} img
 * @param {*} material
 * @param {Number} ratio
 * @returns new THREE.Points
 * ****************************************************************/
const generatePointsFromTexture = (img, material, ratio) => {
  const originalColors = getColorDatasFromTexture(img, ratio)
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const L = img.width
  const H = img.height
  for (let x = 0; x < H; x++) {
    for (let y = 0; y < L; y++) {
      positions.push(y)
      positions.push(x)
      positions.push(0)
    }
  }
  const count = positions.length / 3

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  )
  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(originalColors, 4)
  )
  geometry.center()
  material.uniforms.uTextureSize.x = L
  material.uniforms.uTextureSize.y = H

  return new THREE.Points(geometry, material)
}

/**
 * GetPixel Colors From the image
 */
const getColorDatasFromTexture = (img, ratio) => {
  img.height = Math.round(img.height * ratio)
  img.width = Math.round(img.width * ratio)
  const canvas = document.createElement("canvas")
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext("2d")
  ctx.rotate(Math.PI)
  ctx.translate(-img.width, -img.height)
  ctx.drawImage(img, 0, 0, img.width, img.height)
  const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

  canvas.remove()
  return Float32Array.from(imgData.data)
}

/**
 * Generate Target Positions Attributes
 *
 *******************************************************/
const generateTargetPosition = (geometry, totalVertices) => {
  geometry.center()
  const countB = geometry.attributes.position.count
  const countA = totalVertices
  let positionB = new Float32Array(countA * 3)
  for (let i = 0; i < countB; i++) {
    positionB.set(
      [
        geometry.attributes.position.array[i * 3],
        geometry.attributes.position.array[i * 3 + 1],
        geometry.attributes.position.array[i * 3 + 2],
      ],
      i * 3
    )
  }
  if (countA > countB) {
    // generate more vertex missing to match the images pixels number
    for (let j = countB; j < countA; j++) {
      positionB.set(
        [
          Math.random() * 1000 - 500,
          Math.random() * 1000 - 500,
          Math.random() * 1000 - 500,
        ],
        j * 3
      )
    }
  }
  const newTargetPosition = new Float32Array(countA * 3)

  // Shuffle all vertices
  const count = positionB.length / 3
  let last = count - 1
  for (let r = 0; r < count; r++) {
    const index = Math.round(Math.random() * last)
    newTargetPosition.set(
      [
        positionB[index * 3],
        positionB[index * 3 + 1],
        positionB[index * 3 + 2],
      ],
      r * 3
    )
    positionB.set(
      [positionB[last * 3], positionB[last * 3 + 1], positionB[last * 3 + 2]],
      index * 3
    )
    last--
  }

  return newTargetPosition
}

// Custom Face position
// ********************************************
const generateFacePosition = (geometry, totalVertices) => {
  geometry.center()
  const countB = geometry.attributes.position.count
  const countA = totalVertices

  let positionB = new Float32Array(countA * 3)
  for (let i = 0; i < countB; i++) {
    positionB.set(
      [
        geometry.attributes.position.array[i * 3],
        geometry.attributes.position.array[i * 3 + 1],
        geometry.attributes.position.array[i * 3 + 2],
      ],
      i * 3
    )
  }
  // generate more vertex missing to match the images pixels number
  for (let j = countB, i = 0; j < countA; j++, i++) {
    if (j < countA - 2000) {
      const offset = 20
      positionB.set(
        [
          geometry.attributes.position.array[i * 3] +
            Math.random() * offset -
            Math.floor(offset / 2),
          geometry.attributes.position.array[i * 3 + 1] +
            Math.random() * offset -
            Math.floor(offset / 2),
          geometry.attributes.position.array[i * 3 + 2] +
            Math.random() * offset -
            Math.floor(offset / 2),
        ],
        j * 3
      )
    } else {
      const offset = 500
      positionB.set(
        [
          Math.random() * (offset * 2) - offset,
          Math.random() * (offset * 2) - offset,
          Math.random() * (offset * 2) - offset,
        ],
        j * 3
      )
    }
  }

  const newTargetPosition = new Float32Array(countA * 3)
  // Shuffle all vertices
  const count = positionB.length / 3
  let last = count - 1
  for (let r = 0; r < count; r++) {
    const index = Math.round(Math.random() * last)
    newTargetPosition.set(
      [
        positionB[index * 3],
        positionB[index * 3 + 1],
        positionB[index * 3 + 2],
      ],
      r * 3
    )
    positionB.set(
      [positionB[last * 3], positionB[last * 3 + 1], positionB[last * 3 + 2]],
      index * 3
    )
    last--
  }

  return newTargetPosition
}
/**
 * Generate PointsPosition from a Formula
 */
const generatePositionsFromFormula = (
  formula,
  totalVertices,
  slices = 256,
  slacks = 256,
  scale = 35
) => {
  // para, sphere, mobius3d, trefoil, nature, torus
  const geometry = new THREE.ParametricGeometry(formula, slices, slacks)

  geometry.scale(scale, scale, scale)
  return generateTargetPosition(geometry, totalVertices)
}

/**
 * Generate PointsCloud new THREE.Points from a Formula
 */
const generatePointsFromFormula = (formula, slices, stack, material, scale) => {
  const geometry = new THREE.ParametricGeometry(formula, slices, stack)
  geometry.scale(scale, scale, scale)

  return new THREE.Points(geometry, material)
}

export {
  generatePointsFromTexture,
  generateTargetPosition,
  generatePositionsFromFormula,
  generatePointsFromFormula,
  getColorDatasFromTexture,
  generateFacePosition,
}
