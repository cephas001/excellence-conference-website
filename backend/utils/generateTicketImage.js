/**
 * Generates a scalable ticket image by extending the base image downwards
 * and appending a white container with rounded bottom corners for the name.
 */

const Jimp = require("jimp");

const generateTicketImage = async (baseImagePath, applicantName) => {
  const baseImage = await Jimp.read(baseImagePath);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  const text = (applicantName || "Worker").toUpperCase();

  const imgWidth = baseImage.bitmap.width;
  const imgHeight = baseImage.bitmap.height;

  // The height of the new white container at the bottom
  const containerHeight = 100;

  // Create a new completely transparent canvas that is taller than the base image
  // 0x00000000 = Black with 0 Alpha (Transparent)
  const canvas = new Jimp(imgWidth, imgHeight + containerHeight, 0x00000000);

  // Paste the original ticket image at the very top (0, 0)
  canvas.composite(baseImage, 0, 0);

  // Create the white container block for the name
  const whiteTag = await new Promise((resolve, reject) => {
    new Jimp(imgWidth, containerHeight, 0xffffffff, (err, img) => {
      if (err) return reject(err);

      const r = 20; // Corner radius (larger looks better on full-width tags)
      const w = imgWidth;
      const h = containerHeight;

      // Scan pixels to round ONLY the bottom-left and bottom-right corners
      img.scan(0, 0, w, h, function (x, y, idx) {
        let cx, cy;
        let isCorner = false;

        if (x < r && y >= h - r) {
          cx = r;
          cy = h - r - 1;
          isCorner = true; // Bottom-left
        } else if (x >= w - r && y >= h - r) {
          cx = w - r - 1;
          cy = h - r - 1;
          isCorner = true; // Bottom-right
        }

        if (isCorner) {
          const distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
          if (distance > r) {
            this.bitmap.data[idx + 3] = 0; // Turn pixel transparent
          }
        }
      });

      resolve(img);
    });
  });

  // Automatically center the text horizontally and vertically inside the white tag
  whiteTag.print(
    font,
    0,
    0,
    {
      text: text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    imgWidth,
    containerHeight,
  );

  // Paste the generated white tag seamlessly at the bottom of the original image
  canvas.composite(whiteTag, 0, imgHeight);

  // Return the raw Base64 string
  const ticketBuffer = await canvas.getBufferAsync(Jimp.MIME_PNG);
  return ticketBuffer.toString("base64");
};

module.exports = generateTicketImage;
