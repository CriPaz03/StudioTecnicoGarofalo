const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;

/** Only mount the cells surrounding the viewport; coordinates have no edges.
 * @param {{x:number,y:number,width:number,height:number}} view
 * @param {number} count
 */
export function galleryCells(view, count) {
  if (count < 1) return [];
  const scale = view.width < 600 ? 0.62 : 1;
  const stepX = 490 * scale;
  const stepY = 370 * scale;
  const cells = [];
  const firstColumn = Math.floor(view.x / stepX) - 1;
  const firstRow = Math.floor(view.y / stepY) - 1;
  for (let row = firstRow; row <= Math.ceil((view.y + view.height) / stepY); row++) {
    for (let column = firstColumn; column <= Math.ceil((view.x + view.width) / stepX); column++) {
      const index = modulo(column + row * 7, count);
      const portrait = index % 5 === 2;
      const width = (portrait ? 270 : 420 + (index % 3) * 10) * scale;
      const height = (portrait ? 325 : 265 + (index % 3) * 18) * scale;
      cells.push({
        key: `${column}:${row}`, index, width, height,
        left: column * stepX - view.x + (stepX - width) / 2,
        top: row * stepY - view.y + (stepY - height) / 2 + modulo(column, 2) * 12 * scale,
      });
    }
  }
  return cells;
}
