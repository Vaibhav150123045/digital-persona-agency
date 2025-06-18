import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin, Phone, Mail, Star, Edit, Shield, Upload, Camera } from "lucide-react";

interface ProfileSnapshotProps {
  profile: {
    name: string;
    role: string;
    location: string;
    rating: number;
  };
}

const ProfileSnapshot = ({ profile }: ProfileSnapshotProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const mockProfileData = {
    headshot: "/placeholder.svg",
    bio: "Versatile actor with 8+ years of experience in theater, television, and film. Specializes in dramatic roles with a natural talent for character development and emotional depth.",
    phone: "+1 (555) 123-4567",
    email: "alex.rivera@email.com",
    agent: "Premier Talent Agency",
    union: "SAG-AFTRA",
    height: "5'9\"",
    weight: "165 lbs",
    eyeColor: "Brown",
    hairColor: "Dark Brown",
    skills: ["Stage Combat", "Horseback Riding", "Spanish (Fluent)", "Piano", "Rock Climbing"],
    credits: {
      film: 8,
      tv: 12,
      theater: 15,
      commercial: 25
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Snapshot
            </CardTitle>
            <Button variant="outline" size="sm" className="text-white border-white/20 bg-gray-800 hover:bg-gray-700">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Image & Basic Info */}
            <div className="space-y-4">
              <div className="relative group">
                <Avatar className="w-48 h-48 mx-auto">
                  <AvatarImage src={selectedImage || mockProfileData.headshot} />
                  <AvatarFallback className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-600 text-white text-4xl">
                    <User className="h-24 w-24" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="bg-white/20 rounded-full p-3 hover:bg-white/30 transition-colors">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-xl">{profile.name}</h3>
                <p className="text-gray-300">{profile.role}</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">{profile.rating}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full text-white border-white/20 bg-gray-800 hover:bg-gray-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Photo
              </Button>
            </div>

            {/* Contact & Professional Info */}
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Phone className="h-4 w-4" />
                    <span>{mockProfileData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span>{mockProfileData.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Professional Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Union:</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {mockProfileData.union}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Physical Stats</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Height:</span> <span className="text-white">{mockProfileData.height}</span></div>
                  <div><span className="text-gray-400">Weight:</span> <span className="text-white">{mockProfileData.weight}</span></div>
                  <div><span className="text-gray-400">Eyes:</span> <span className="text-white">{mockProfileData.eyeColor}</span></div>
                  <div><span className="text-gray-400">Hair:</span> <span className="text-white">{mockProfileData.hairColor}</span></div>
                </div>
              </div>
            </div>

            {/* Bio & Skills */}
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-3">Bio</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{mockProfileData.bio}</p>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Special Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {mockProfileData.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Credits Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{mockProfileData.credits.film}</div>
                    <div className="text-xs text-gray-400">Films</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{mockProfileData.credits.tv}</div>
                    <div className="text-xs text-gray-400">TV Shows</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{mockProfileData.credits.theater}</div>
                    <div className="text-xs text-gray-400">Theater</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{mockProfileData.credits.commercial}</div>
                    <div className="text-xs text-gray-400">Commercials</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSnapshot;
