
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, Upload, Camera, FileText, Video, Download, Trash2, Tag } from "lucide-react";

const AssetLibrary = () => {
  const [assets] = useState({
    headshots: [
      { id: 1, name: "Professional Headshot 1", type: "image", genre: "Drama", date: "2024-11-15", size: "2.3 MB" },
      { id: 2, name: "Commercial Headshot", type: "image", genre: "Commercial", date: "2024-11-10", size: "1.8 MB" },
      { id: 3, name: "Character Shot", type: "image", genre: "Character", date: "2024-11-05", size: "2.1 MB" }
    ],
    resumes: [
      { id: 4, name: "Acting Resume 2024", type: "pdf", genre: "General", date: "2024-11-20", size: "156 KB" },
      { id: 5, name: "Theater Resume", type: "pdf", genre: "Theater", date: "2024-10-15", size: "142 KB" }
    ],
    reels: [
      { id: 6, name: "Drama Reel 2024", type: "video", genre: "Drama", date: "2024-11-25", size: "45.2 MB" },
      { id: 7, name: "Comedy Reel", type: "video", genre: "Comedy", date: "2024-11-18", size: "38.7 MB" },
      { id: 8, name: "Commercial Reel", type: "video", genre: "Commercial", date: "2024-11-12", size: "32.1 MB" }
    ],
    trailers: [
      { id: 9, name: "Film Trailer - The Distance", type: "video", genre: "Drama", date: "2024-10-28", size: "67.3 MB" },
      { id: 10, name: "Short Film Trailer", type: "video", genre: "Thriller", date: "2024-10-20", size: "23.8 MB" }
    ]
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image": return <Camera className="h-5 w-5 text-blue-400" />;
      case "pdf": return <FileText className="h-5 w-5 text-red-400" />;
      case "video": return <Video className="h-5 w-5 text-purple-400" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case "Drama": return "text-red-400 border-red-400";
      case "Comedy": return "text-yellow-400 border-yellow-400";
      case "Commercial": return "text-green-400 border-green-400";
      case "Theater": return "text-purple-400 border-purple-400";
      case "Character": return "text-orange-400 border-orange-400";
      case "Thriller": return "text-gray-400 border-gray-400";
      default: return "text-blue-400 border-blue-400";
    }
  };

  const renderAssetGrid = (assetList: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assetList.map((asset) => (
        <Card key={asset.id} className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getFileIcon(asset.type)}
                <div>
                  <h4 className="text-white font-medium text-sm">{asset.name}</h4>
                  <p className="text-gray-400 text-xs">{asset.size} • {asset.date}</p>
                </div>
              </div>
              <Badge variant="outline" className={getGenreColor(asset.genre)}>
                {asset.genre}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 text-gray-900 bg-white/90 border-white/50 hover:bg-white hover:text-gray-900">
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="text-red-400 border-red-400 bg-red-400/10 hover:bg-red-400/20">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <FolderOpen className="h-5 w-5 mr-2" />
            Asset Library
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-white border-white/20">
              <Tag className="h-4 w-4 mr-2" />
              Auto-Tag
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Assets
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="headshots" className="space-y-6">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="headshots" className="data-[state=active]:bg-white/10">
              Headshots ({assets.headshots.length})
            </TabsTrigger>
            <TabsTrigger value="resumes" className="data-[state=active]:bg-white/10">
              Resumes ({assets.resumes.length})
            </TabsTrigger>
            <TabsTrigger value="reels" className="data-[state=active]:bg-white/10">
              Reels ({assets.reels.length})
            </TabsTrigger>
            <TabsTrigger value="trailers" className="data-[state=active]:bg-white/10">
              Trailers ({assets.trailers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="headshots">
            {renderAssetGrid(assets.headshots)}
          </TabsContent>

          <TabsContent value="resumes">
            {renderAssetGrid(assets.resumes)}
          </TabsContent>

          <TabsContent value="reels">
            {renderAssetGrid(assets.reels)}
          </TabsContent>

          <TabsContent value="trailers">
            {renderAssetGrid(assets.trailers)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssetLibrary;
