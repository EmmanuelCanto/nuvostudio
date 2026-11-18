// Pastilla SVG; el tamaño del rect lo ajusta fitPills() según el ancho del texto.
export default function Pill({ x, y, r, children }) {
  return <g className="pill" data-x={x} data-y={y} data-r={r}><rect /><text>{children}</text></g>;
}
