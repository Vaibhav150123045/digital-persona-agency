
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, DollarSign, Trophy, Share, Copy, Mail } from "lucide-react";

const ReferralDashboard = () => {
  const referralData = {
    totalInvites: 12,
    successfulReferrals: 7,
    totalEarnings: 850,
    pendingBonus: 150,
    referralCode: "ALEX2024",
    bonusPerReferral: 50
  };

  const leaderboard = [
    { rank: 1, name: "Sarah Johnson", referrals: 23, earnings: 1150 },
    { rank: 2, name: "Mike Chen", referrals: 19, earnings: 950 },
    { rank: 3, name: "Alex Rivera", referrals: 7, earnings: 850 },
    { rank: 4, name: "Emma Davis", referrals: 15, earnings: 750 },
    { rank: 5, name: "Chris Wilson", referrals: 12, earnings: 600 }
  ];

  const recentReferrals = [
    { name: "Jessica Martinez", status: "Joined", date: "Dec 1, 2024", bonus: 50 },
    { name: "David Brown", status: "Pending", date: "Nov 28, 2024", bonus: 50 },
    { name: "Lisa Kim", status: "Joined", date: "Nov 25, 2024", bonus: 50 },
    { name: "Ryan Thompson", status: "Joined", date: "Nov 22, 2024", bonus: 50 }
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.referralCode);
  };

  const shareReferralLink = () => {
    const link = `https://spais.agency/join?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{referralData.totalInvites}</div>
            <div className="text-sm text-gray-300">Total Invites</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{referralData.successfulReferrals}</div>
            <div className="text-sm text-gray-300">Successful Referrals</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">${referralData.totalEarnings}</div>
            <div className="text-sm text-gray-300">Total Earnings</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">${referralData.pendingBonus}</div>
            <div className="text-sm text-gray-300">Pending Bonus</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Tools */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Share className="h-5 w-5 mr-2" />
              Referral Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h3 className="text-green-400 font-medium mb-2">Earn ${referralData.bonusPerReferral} per referral!</h3>
              <p className="text-white text-sm">Invite fellow actors to join SPAIS Agency and earn money for each successful signup.</p>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Your Referral Code</label>
              <div className="flex space-x-2">
                <Input
                  value={referralData.referralCode}
                  readOnly
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button onClick={copyReferralCode} variant="outline" className="text-white border-white/20">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={shareReferralLink} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Share className="h-4 w-4 mr-2" />
                Share Link
              </Button>
              <Button variant="outline" className="flex-1 text-white border-white/20">
                <Mail className="h-4 w-4 mr-2" />
                Email Invite
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Referral Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.name === "Alex Rivera" ? "bg-blue-500/20 border border-blue-500/30" : "bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      user.rank === 1 ? "bg-yellow-500 text-black" :
                      user.rank === 2 ? "bg-gray-400 text-black" :
                      user.rank === 3 ? "bg-orange-500 text-black" :
                      "bg-white/20 text-white"
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-gray-300 text-sm">{user.referrals} referrals</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">${user.earnings}</div>
                    <div className="text-gray-300 text-sm">earned</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReferrals.map((referral, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{referral.name}</div>
                    <div className="text-gray-300 text-sm">{referral.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className={
                      referral.status === "Joined"
                        ? "text-green-400 border-green-400"
                        : "text-yellow-400 border-yellow-400"
                    }
                  >
                    {referral.status}
                  </Badge>
                  <div className="text-white font-medium">${referral.bonus}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboard;
