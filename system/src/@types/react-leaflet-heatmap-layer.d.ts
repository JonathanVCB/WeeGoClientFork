// types/react-leaflet-heatmap-layer.d.ts

declare module "react-leaflet-heatmap-layer" {
  import { LatLngTuple } from "leaflet";

  interface HeatmapPoint {
    lat: number;
    lng: number;
    count: number;
  }

  interface HeatmapLayerProps {
    points: HeatmapPoint[];
    longitudeExtractor: (point: HeatmapPoint) => number;
    latitudeExtractor: (point: HeatmapPoint) => number;
    intensityExtractor: (point: HeatmapPoint) => number;
  }

  export default function HeatmapLayer(props: HeatmapLayerProps): JSX.Element;
}
