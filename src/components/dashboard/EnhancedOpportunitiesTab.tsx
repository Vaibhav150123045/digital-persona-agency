
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Trello } from "lucide-react";
import OpportunitiesTab from "./OpportunitiesTab";
import KanbanBoard from "./KanbanBoard";

const EnhancedOpportunitiesTab = ({ userProfile }: any) => {
  const [activeSubTab, setActiveSubTab] = useState("opportunities");

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-white/10">
            <Briefcase className="h-4 w-4 mr-2" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-white/10">
            <Trello className="h-4 w-4 mr-2" />
            Pipeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6">
          <OpportunitiesTab userProfile={userProfile}/>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <KanbanBoard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedOpportunitiesTab;
