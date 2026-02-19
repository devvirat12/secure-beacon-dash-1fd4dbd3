import { MapPin, ArrowRight, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GeoVelocityVizProps {
  previousCity: string;
  currentCity: string;
  timeDiffMinutes: number;
}

// Simulated distances between Indian cities (km)
const cityDistances: Record<string, Record<string, number>> = {
  "delhi": { "mumbai": 1400, "bangalore": 2150, "chennai": 2180, "kolkata": 1500, "hyderabad": 1550, "pune": 1450, "ahmedabad": 950, "jaipur": 280, "lucknow": 550, "kochi": 2650, "imphal": 2450, "gangtok": 1600, "gurgaon": 30, "noida": 25, "goa": 1850 },
  "mumbai": { "delhi": 1400, "bangalore": 980, "chennai": 1330, "kolkata": 2050, "hyderabad": 710, "pune": 150, "ahmedabad": 530, "jaipur": 1150, "lucknow": 1350, "kochi": 1350, "imphal": 3150, "goa": 590 },
  "bangalore": { "delhi": 2150, "mumbai": 980, "chennai": 350, "kolkata": 1870, "hyderabad": 570, "pune": 840, "kochi": 530, "mysore": 150, "coimbatore": 360, "mangalore": 350 },
  "chennai": { "delhi": 2180, "mumbai": 1330, "bangalore": 350, "kolkata": 1660, "hyderabad": 630, "madurai": 460, "coimbatore": 500, "pondicherry": 150, "kochi": 700 },
  "kolkata": { "delhi": 1500, "mumbai": 2050, "bangalore": 1870, "chennai": 1660, "hyderabad": 1490, "patna": 600, "ranchi": 400, "howrah": 10, "siliguri": 600 },
};

function getDistance(city1: string, city2: string): number {
  const c1 = city1.toLowerCase();
  const c2 = city2.toLowerCase();
  return cityDistances[c1]?.[c2] || cityDistances[c2]?.[c1] || 800;
}

const GeoVelocityViz = ({ previousCity, currentCity, timeDiffMinutes }: GeoVelocityVizProps) => {
  const distance = getDistance(previousCity, currentCity);
  const requiredSpeed = timeDiffMinutes > 0 ? Math.round(distance / (timeDiffMinutes / 60)) : Infinity;

  return (
    <div className="rounded-lg bg-danger/5 border border-danger/20 p-3 space-y-2">
      <div className="flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-danger" />
        <span className="text-[11px] font-semibold text-danger">Impossible Travel Detected</span>
      </div>
      <div className="flex items-center justify-center gap-2 py-2">
        <div className="flex flex-col items-center gap-1">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-[10px] font-medium text-foreground">{previousCity}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <ArrowRight className="h-3.5 w-3.5 text-danger" />
          <span className="text-[9px] text-muted-foreground">~{distance} km</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <MapPin className="h-4 w-4 text-danger" />
          <span className="text-[10px] font-medium text-foreground">{currentCity}</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">Time Difference</span>
        <Badge variant="outline" className="text-[9px] bg-danger/10 text-danger border-danger/30">
          {timeDiffMinutes} min
        </Badge>
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">Required Speed</span>
        <Badge variant="outline" className="text-[9px] bg-danger/10 text-danger border-danger/30">
          {requiredSpeed.toLocaleString()} km/h
        </Badge>
      </div>
    </div>
  );
};

export default GeoVelocityViz;
