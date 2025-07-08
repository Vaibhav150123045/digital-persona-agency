import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, MessageCircle, FileText, Search, BookOpen, Gift, Settings } from "lucide-react";
import EnhancedOpportunitiesTab from "./EnhancedOpportunitiesTab";
import FeatureLockedCard from "./FeatureLockedCard";
import ChatInterface from "./ChatInterface";
import AgentConfigurationPanel from "./AgentConfigurationPanel";
import EnhancedAIAgentPanel from "./EnhancedAIAgentPanel";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isFeatureLocked: boolean;
  isChatLocked: boolean;
  onShowLockedFeature: () => void;
  displayProfile: any;
  recentActivity: any[];
  upcomingAuditions: any[];
  userRole: string;
  isPremiumUser: boolean;
}

const DashboardTabs = ({ 
  activeTab, 
  onTabChange, 
  isFeatureLocked, 
  isChatLocked,
  onShowLockedFeature, 
  displayProfile, 
  recentActivity, 
  upcomingAuditions,
  userRole,
  isPremiumUser
}: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="bg-white/5 border-white/10 flex-wrap h-auto p-1">
        <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
          <Users className="h-4 w-4 mr-2" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="opportunities" className="data-[state=active]:bg-white/10">
          <Briefcase className="h-4 w-4 mr-2" />
          Opportunities
        </TabsTrigger>
        <TabsTrigger value="chat" className="data-[state=active]:bg-white/10">
          <MessageCircle className="h-4 w-4 mr-2" />
          AI Chat
        </TabsTrigger>
        <TabsTrigger value="agent" className="data-[state=active]:bg-white/10">
          <Settings className="h-4 w-4 mr-2" />
          AI Agent
        </TabsTrigger>
        <TabsTrigger value="assets" className="data-[state=active]:bg-white/10">
          <FileText className="h-4 w-4 mr-2" />
          Assets
        </TabsTrigger>
        <TabsTrigger value="search" className="data-[state=active]:bg-white/10">
          <Search className="h-4 w-4 mr-2" />
          Job Search
        </TabsTrigger>
        <TabsTrigger value="courses" className="data-[state=active]:bg-white/10">
          <BookOpen className="h-4 w-4 mr-2" />
          Courses
        </TabsTrigger>
        <TabsTrigger value="referrals" className="data-[state=active]:bg-white/10">
          <Gift className="h-4 w-4 mr-2" />
          Referrals
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
            <ul className="space-y-3">
              {recentActivity.map((activity, index) => (
                <li key={index} className="bg-white/5 border-white/10 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-semibold">{activity.title}</div>
                    <div className="text-white/70 text-sm">{activity.time}</div>
                  </div>
                  <div className="text-white/70 mt-1">Status: {activity.status}</div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Upcoming Auditions</h2>
            <ul className="space-y-3">
              {upcomingAuditions.map((audition, index) => (
                <li key={index} className="bg-white/5 border-white/10 rounded-md p-4">
                  <div className="text-white font-semibold">{audition.title}</div>
                  <div className="text-white/70 text-sm">Role: {audition.role}</div>
                  <div className="text-white/70 text-sm">Date: {audition.date}</div>
                  <div className="text-white/70 text-sm">Type: {audition.type}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="opportunities" className="space-y-6">
        {isFeatureLocked ? (
          <FeatureLockedCard onUnlock={onShowLockedFeature} />
        ) : (
          <EnhancedOpportunitiesTab userProfile={displayProfile}/>
        )}
      </TabsContent>

      <TabsContent value="chat" className="space-y-6">
        {isChatLocked ? (
          <FeatureLockedCard onUnlock={onShowLockedFeature} />
        ) : (
          <ChatInterface userProfile={displayProfile} />
        )}
      </TabsContent>

      <TabsContent value="agent" className="space-y-6">
        {isFeatureLocked ? (
          <FeatureLockedCard onUnlock={onShowLockedFeature} />
        ) : (
          <div className="space-y-8">
            <EnhancedAIAgentPanel />
            <AgentConfigurationPanel />
          </div>
        )}
      </TabsContent>

      <TabsContent value="assets" className="space-y-6">
        {isFeatureLocked ? (
          <FeatureLockedCard onUnlock={onShowLockedFeature} />
        ) : (
          <div>Assets Content</div>
        )}
      </TabsContent>

      <TabsContent value="search" className="space-y-6">
        {isFeatureLocked ? (
          <FeatureLockedCard onUnlock={onShowLockedFeature} />
        ) : (
          <div>Job Search Content</div>
        )}
      </TabsContent>

      <TabsContent value="courses" className="space-y-6">
        {isFeatureLocked ? (
          <FeatureLockedCard onUnlock={onShowLockedFeature} />
        ) : (
          <div>Courses Content</div>
        )}
      </TabsContent>

      <TabsContent value="referrals" className="space-y-6">
        {isFeatureLocked ? (
          <FeatureLockedCard onUnlock={onShowLockedFeature} />
        ) : (
          <div>Referrals Content</div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
