// Parametric Surfaces

const ParametricEquations = {
  mobius3d: function (u, t, target) {
    // volumetric mobius strip
    u *= Math.PI
    t *= 2 * Math.PI
    u = u * 2
    const phi = u / 2
    const major = 2.5,
      a = 0.9,
      b = 1.25
    let x, y, z
    x = a * Math.cos(t) * Math.cos(phi) - b * Math.sin(t) * Math.sin(phi)
    z = a * Math.cos(t) * Math.sin(phi) + b * Math.sin(t) * Math.cos(phi)

    y = (major + x) * Math.sin(u)
    x = (major + x) * Math.cos(u)

    target.set(x, y, z)
  },
  para: function (a, b, target) {
    var x = -2 + 2 * a
    var y = -2 + 2 * b
    var z = (Math.sin(a * Math.PI) + Math.sin(b * Math.PI)) * -2.5

    target.set(x, y, z)
  },
  sphere: function (u, v, target) {
    u *= Math.PI
    v *= 2 * Math.PI
    const size = 2

    var x = size * Math.sin(u) * Math.cos(v)
    var y = size * Math.sin(u) * Math.sin(v)
    var z = size * Math.cos(u)

    target.set(x, y, z)
  },
  golden: function (u, v, target) {
    u *= Math.PI * 2
    v *= 2 * Math.PI

    const size = 2
    var phi = u / 2
    var major = 2.25,
      a = 0.125,
      b = 0.65

    var x = a * Math.cos(v) * Math.cos(phi) - b * Math.sin(v) * Math.sin(phi)
    var y = size * Math.sin(u) * Math.sin(v)
    var z = size * Math.cos(u)

    target.set(x, y, z)
  },
  // https://geometricloci.tumblr.com/post/107909398127/parametric-curves
  nature: function (u, v, target) {
    u *= Math.PI * 2
    v *= 2 * Math.PI

    const size = 3
    var phi = u / 2
    var major = 2.25,
      a = 0.125,
      b = 0.65

    var x =
      2 *
      Math.sin(9.52 * u) *
      Math.round(Math.sqrt(Math.cos(Math.cos(4.7 * u))))
    var y = 2 * Math.pow(Math.cos(9.52 * u), 4) * Math.sin(Math.sin(4.7 * v))

    var z = size * Math.cos(u)

    target.set(x, y, z)
  },
  trefoil: function (u, t, target) {
    u *= Math.PI * 2
    t *= 2 * Math.PI
    u = u * 2

    let x, y, z

    x = Math.sin(t) + 2 * Math.sin(2 * t)
    y = Math.cos(t) - 2 * Math.cos(2 * t)
    z = -Math.sin(3 * t)

    target.set(x, y, z)
  },
  torusKnot: function (u, t, target) {
    t *= 2 * Math.PI

    let x, y, z

    x = (2 + Math.cos(3 * t)) * Math.cos(2 * t)
    y = (2 + Math.cos(3 * t)) * Math.sin(2 * t)
    z = Math.sin(3 * t)

    target.set(x, y, z)
  },
  eightKnot: function (u, t, target) {
    u *= Math.PI
    t *= 2 * Math.PI
    u = u * 2

    let major = 2.25
    let x, y, z

    x = (2 + Math.cos(2 * t)) * Math.cos(3 * t)
    y = (2 + Math.cos(2)) * Math.sin(3 * t)
    z = Math.sin(u)

    target.set(x, y, z)
  },
  torus: function (u, t, target) {
    u *= Math.PI
    t *= 2 * Math.PI
    u = u * 2

    let major = 2.25
    let x, y, z
    const R = 2
    const r = 1

    x = Math.cos(t) * (R + r * Math.cos(u))
    y = Math.sin(t) * (R + r * Math.cos(u))
    z = r * Math.sin(u)

    target.set(x, y, z)
  },
  cloche: function (u, t, target) {
    u *= Math.PI
    t *= 2 * Math.PI
    u = u * 2

    let major = 2.25
    let x, y, z
    const R = 2
    const r = 1

    x = t * Math.cos(u)
    y = t * Math.sin(u)
    z = t + Math.sin(3 * t) / 3 - 4

    target.set(x, y, z)
  },
  nautilus: function (u, t, target) {
    u *= Math.PI
    t *= 2 * Math.PI
    u = u * 2

    let x, y, z
    x = u * Math.cos(u*2) * (Math.cos (t) + 1.0)
    y = u * Math.sin(u*2) * (Math.cos (t) + 1.0)
    z = u * Math.sin(t)

    target.set(x, y, z)
  },
  steiner: function (u, t, target) {
    u *= Math.PI
    t *= 2 * Math.PI
    u = u * 2

    let x, y, z
    x = Math.sin (2.0 * u) * Math.pow (Math.cos (t), 2.0)
    y = Math.sin (u) * Math.sin (2.0 * t)
    z = Math.cos (u) * Math.sin (2.0 * t)

    target.set(x, y, z)
  },
}

export default ParametricEquations
