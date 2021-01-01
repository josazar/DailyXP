import hxd.Math;

class Main extends hxd.App {
	var bmp:h2d.Bitmap;
	var customGraphics:h2d.Graphics;
	var line:h2d.Graphics;
	var lines:Array<h2d.Graphics>;
	var blur:h2d.filter.Blur;
	var displacement:h2d.filter.Displacement;
	var group:h2d.Graphics;

	override function init() {
		// Create a custom graphics object by passing a 2d scene reference.
		blur = new h2d.filter.Blur();
		blur.radius = 0;
		group = new h2d.Graphics(s2d);
		var nb = 250;
		lines = new Array();

		for (i in 0...nb) {
			line = new h2d.Graphics(s2d);
			line.beginFill(0xFFFFFF);
			line.drawRect(75 + 100 * i / 500, 0, 220 + Math.random() * i / 5, 1);
			line.x = s2d.width / 2;
			line.y = s2d.height / 2;
			line.rotation = i;
			line.endFill();
			lines.push(line);
			group.addChild(line);
		}
		group.filter = blur;
	}

	// on each frame
	override function update(dt:Float) {
		var i = 0;
		blur.radius = (s2d.mouseX / s2d.width) * 40;
		for (line in lines) {
			line.rotation += 0.005 * i / 500;
			line.alpha = Math.cos(i * 50) * 0.5 + 0.5;
			i++;
		}
	}

	static function main() {
		new Main();
	}
}
