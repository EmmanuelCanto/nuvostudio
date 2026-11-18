// Cuadrícula SVG: equivale a <g class="gl" data-grid="x,y,ancho,alto,columnas,filas">
export default function Grid({ grid }) {
  const a = grid.split(',').map(Number);
  const lines = [];
  for (let i = 0; i <= a[4]; i++) lines.push(<line key={'c' + i} x1={a[0] + a[2] * i / a[4]} y1={a[1]} x2={a[0] + a[2] * i / a[4]} y2={a[1] + a[3]} />);
  for (let i = 0; i <= a[5]; i++) lines.push(<line key={'r' + i} x1={a[0]} y1={a[1] + a[3] * i / a[5]} x2={a[0] + a[2]} y2={a[1] + a[3] * i / a[5]} />);
  return <g className="gl" data-grid={grid}>{lines}</g>;
}
