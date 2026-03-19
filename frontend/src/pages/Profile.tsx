import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Phone, Edit, Package, Store, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { request } from '@/lib/apiClient';

type MyListing = {
  id: string;
  title: string;
  price: number;
  status: string;
  images: string[];
};

const Profile: React.FC = () => {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myItems, setMyItems] = useState<MyListing[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchMyItems = async () => {
      if (!user) return;
      setItemsLoading(true);
      try {
        const data = await request<{ items: MyListing[] }>(`/listings/seller/${user.id}/all`, { auth: false });
        setMyItems(data.items || []);
      } catch {
        setMyItems([]);
      }
      setItemsLoading(false);
    };

    if (user) {
      fetchMyItems();
    }
  }, [user]);

  const handleEnableSeller = async () => {
    const { error } = await updateProfile({ is_seller: true });
    if (error) {
      toast({
        title: 'შეცდომა',
        description: 'გამყიდველის რეჟიმის ჩართვა ვერ მოხერხდა',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'წარმატება',
        description: 'გამყიდველის რეჟიმი ჩართულია! ახლა შეგიძლიათ დაამატოთ განცხადებები.',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({
      title: 'გასვლა',
      description: 'თქვენ წარმატებით გახვედით სისტემიდან',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.username?.[0]?.toUpperCase() || 'U';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile.full_name || profile.username || 'მომხმარებელი'}
                  </h1>
                  {profile.is_seller && (
                    <Badge variant="secondary" className="w-fit mx-auto md:mx-0">
                      <Store className="h-3 w-3 mr-1" />
                      გამყიდველი
                    </Badge>
                  )}
                </div>
                
                {profile.username && (
                  <p className="text-muted-foreground mb-2">@{profile.username}</p>
                )}
                
                {profile.bio && (
                  <p className="text-foreground mb-3">{profile.bio}</p>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  )}
                  {profile.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {profile.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    რედაქტირება
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  გასვლა
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller Mode Section */}
        {!profile.is_seller ? (
          <Card className="mb-6 border-dashed border-2 border-primary/30 bg-primary/5">
            <CardContent className="p-6 text-center">
              <Store className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">გსურთ გაყიდვა?</h2>
              <p className="text-muted-foreground mb-4">
                ჩართეთ გამყიდველის რეჟიმი და დაიწყეთ თქვენი ნივთების გაყიდვა Twist-ზე
              </p>
              <Button onClick={handleEnableSeller}>
                <Store className="h-4 w-4 mr-2" />
                გამყიდველის რეჟიმის ჩართვა
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1">გამყიდველის პანელი</h2>
                  <p className="text-muted-foreground">მართეთ თქვენი განცხადებები</p>
                </div>
                <Button asChild>
                  <Link to="/sell">
                    <Package className="h-4 w-4 mr-2" />
                    ახალი განცხადება
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Listings */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">ჩემი განცხადებები</h2>
            {itemsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : myItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>ჯერ არ გაქვთ განცხადებები</p>
                {profile.is_seller && (
                  <Button asChild variant="link" className="mt-2">
                    <Link to="/sell">დაამატეთ პირველი განცხადება</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {myItems.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/listing/${item.id}`}
                    className="group"
                  >
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-2">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-sm text-primary font-semibold">₾{item.price}</p>
                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className="mt-1 text-xs">
                      {item.status === 'active' ? 'აქტიური' : item.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
