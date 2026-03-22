'use client';


import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart } from '@/components/ui/chart';
import { StatsCard } from '@/components/ui/stats-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { DonationStatus, Donation } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { getDonationsByDonorId, getDonorStats } from '@/lib/donation-service';
import { Package, Clock, CheckCircle, AlertTriangle, Plus, User, Map, History } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DonorDashboardPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    expired: 0
  });
  const [trendData, setTrendData] = useState<{name: string, value: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorData = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        const [userDonations, userStats] = await Promise.all([
          getDonationsByDonorId(user.uid),
          getDonorStats(user.uid)
        ]);

        setDonations(userDonations.slice(0, 5)); // Show only recent 5

        setStats({
          total: userStats.total,
          active: userStats.active,
          completed: userStats.completed,
          expired: userStats.expired
        });

        const mappedTrend = userStats.donationTrend.map(item => ({
          name: item.date,
          value: item.count
        }));
        setTrendData(mappedTrend);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching donor data:', error);
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
          Welcome, {user?.displayName || 'Donor'}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          {user?.organizationName || 'Donor'} Dashboard - Manage your food donations and impact
        </p>
      </div>
        {/* Quick Actions Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300" asChild>
            <Link href="/donor/donations/new">
              <Plus className="h-4 w-4" />
              Create Donation
            </Link>
          </Button>
          <Button variant="outline" className="gap-2 shadow-md hover:shadow-lg transition-all duration-300" asChild>
            <Link href="/donor/donations/active">
              <Package className="h-4 w-4" />
              View Donations
            </Link>
          </Button>
          <Button variant="outline" className="gap-2 shadow-md hover:shadow-lg transition-all duration-300" asChild>
            <Link href="/donor/map">
              <Map className="h-4 w-4" />
              Map View
            </Link>
          </Button>
          <Button variant="outline" className="gap-2 shadow-md hover:shadow-lg transition-all duration-300" asChild>
            <Link href="/donor/profile">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </Button>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden">
            <StatsCard
              title="Total Donations"
              value={stats.total.toString()}
              description="All time donations"
              icon={<Package className="h-6 w-6 text-primary" />}
              className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300"
            />
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10"></div>
          </div>
          <div className="relative overflow-hidden">
            <StatsCard
              title="Active Donations"
              value={stats.active.toString()}
              description="Currently available"
              icon={<Clock className="h-6 w-6 text-blue-500" />}
              className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300"
            />
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -translate-y-10 translate-x-10"></div>
          </div>
          <div className="relative overflow-hidden">
            <StatsCard
              title="Completed"
              value={stats.completed.toString()}
              description="Successfully delivered"
              icon={<CheckCircle className="h-6 w-6 text-green-500" />}
              className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300"
            />
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-10 translate-x-10"></div>
          </div>
          <div className="relative overflow-hidden">
            <StatsCard
              title="Expired"
              value={stats.expired.toString()}
              description="Past expiry date"
              icon={<AlertTriangle className="h-6 w-6 text-orange-500" />}
              className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300"
            />
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -translate-y-10 translate-x-10"></div>
          </div>
        </div>

        {/* Donation Activity Chart */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Your Donation Activity
            </CardTitle>
            <CardDescription>Monthly donation trends and impact overview</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={trendData}
              xField="name"
              yField="value"
              height={250}
              colors={['hsl(var(--chart-1))']}
            />
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Your Recent Donations
            </CardTitle>
            <CardDescription>Track and manage your recent donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <Card key={donation.id} className="hover:shadow-md transition-all duration-300 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{donation.title}</h3>
                            <StatusBadge status={donation.status} />
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{donation.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {donation.quantity} {donation.quantityUnit}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                Expires {donation.expiryDate.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {donation.reservedBy ? 'Reserved' : 'Available'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 lg:flex-col lg:w-32">
                          <Button size="sm" variant="outline" className="flex-1 lg:w-full" asChild>
                            <Link href={`/donor/donations/edit/${donation.id}`}>Edit</Link>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 lg:w-full text-red-600 border-red-200 hover:bg-red-50">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">You haven't made any donations yet.</p>
                  <Button className="mt-4" asChild>
                    <Link href="/donor/donations/new">Create Your First Donation</Link>
                  </Button>
                </div>
              )}
            </div>
            {donations.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" className="gap-2 shadow-md" asChild>
                  <Link href="/donor/donations/active">
                    <Package className="h-4 w-4" />
                    View All Donations
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Quick Links */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Create New Donation
              </CardTitle>
              <CardDescription>List available food items for donation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add details about available food items, expiry dates, and pickup instructions.
              </p>
              <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md" asChild>
                <Link href="/donor/donations/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Donation
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-blue-600" />
                View Map
              </CardTitle>
              <CardDescription>See donation locations and recipients</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View a map of your donations and nearby recipient organizations.
              </p>
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 shadow-md" asChild>
                <Link href="/donor/map">
                  <Map className="h-4 w-4 mr-2" />
                  Open Map View
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-green-600" />
                Donation History
              </CardTitle>
              <CardDescription>Review your past donations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access details and reports on all your previous donations.
              </p>
              <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 shadow-md" asChild>
                <Link href="/donor/donations/history">
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
