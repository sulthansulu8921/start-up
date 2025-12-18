import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DeveloperCardProps {
  name: string;
  skills: string[];
  experience: string;
  image: string;
  hourlyRate?: number;
}

export const DeveloperCard = ({ name, skills, experience, image, hourlyRate }: DeveloperCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 group">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{experience}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
        {hourlyRate && (
          <p className="text-sm font-semibold text-primary">
            ${hourlyRate}/hr
          </p>
        )}
      </CardContent>
    </Card>
  );
};