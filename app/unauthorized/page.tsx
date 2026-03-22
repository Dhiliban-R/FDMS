'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';

export default function UnauthorizedPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[70vh] py-12 px-4">
        <Card className="w-full max-w-md shadow-lg border-red-100">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-50">
                <ShieldAlert className="h-12 w-12 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Access Denied</CardTitle>
            <CardDescription className="text-gray-500">
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="text-gray-600">
              Please check your user role or contact support if you believe this is an error.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/login">Log in with a Different Account</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
