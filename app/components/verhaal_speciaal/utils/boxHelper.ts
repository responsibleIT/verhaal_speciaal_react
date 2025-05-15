

export const calculateBoxData = (text: string, render: any) => {
  const context = render.context;
  context.font = "20px Arial";
  const textWidth = context.measureText(text).width;
  const randomRotation = Math.floor(Math.random() * 40) - 20;
  return { textWidth, randomRotation };
};

export function generateRandomCoordinates() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Define restricted area dimensions
  const restrictedWidth = 300;
  const restrictedHeight = 300;
  const restrictedXStart = (screenWidth - restrictedWidth) / 2;
  const restrictedXEnd = restrictedXStart + restrictedWidth;
  const restrictedYStart = (screenHeight - restrictedHeight) / 2;
  const restrictedYEnd = restrictedYStart + restrictedHeight;

  const bottomRestrictedHeight = 120; // Bottom area to avoid

  let x, y;

  do {
    // Generate random x and y coordinates
    x = Math.floor(Math.random() * screenWidth);
    y = Math.floor(Math.random() * screenHeight);
  } while (
    // Check if inside the center restricted area
    (x >= restrictedXStart && x <= restrictedXEnd &&
     y >= restrictedYStart && y <= restrictedYEnd) ||
    // Check if inside the bottom 120px of the screen
    (y >= screenHeight - bottomRestrictedHeight)
  );

  return { x, y };
}
