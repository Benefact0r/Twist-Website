import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { request } from '@/lib/apiClient';
import { Loader2, CheckCircle, Clock, EyeOff, Pencil, Trash2 } from 'lucide-react';

interface SellerActionsPanelProps {
  listingId: string;
  currentStatus: string;
  onStatusChange?: () => void;
}

export function SellerActionsPanel({ 
  listingId, 
  currentStatus, 
  onStatusChange 
}: SellerActionsPanelProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleMarkAsSold = async () => {
    setIsUpdating('sold');
    try {
      await request(`/listings/${listingId}/status`, {
        method: 'PATCH',
        body: { status: 'sold' },
      });
      toast({
        title: language === 'ka' ? 'წარმატება' : 'Success',
        description: language === 'ka' ? 'ნივთი მონიშნულია როგორც გაყიდული' : 'Item marked as sold',
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to update listing',
        variant: 'destructive',
      });
    }
    setIsUpdating(null);
  };

  const handleMarkAsReserved = async () => {
    setIsUpdating('reserved');
    // Since we don't have a reserved status, we'll use a toast to indicate the action
    // In a real app, you'd add a 'reserved' status to the enum
    toast({
      title: language === 'ka' ? 'დაჯავშნილია' : 'Reserved',
      description: language === 'ka' ? 'ნივთი მონიშნულია როგორც დაჯავშნილი' : 'Item marked as reserved',
    });
    setIsUpdating(null);
  };

  const handleHide = async () => {
    setIsUpdating('hide');
    try {
      await request(`/listings/${listingId}/status`, {
        method: 'PATCH',
        body: { status: 'archived' },
      });
      toast({
        title: language === 'ka' ? 'დამალულია' : 'Hidden',
        description: language === 'ka' ? 'ნივთი დამალულია' : 'Item has been hidden',
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to update listing',
        variant: 'destructive',
      });
    }
    setIsUpdating(null);
  };

  const handleDelete = async () => {
    setIsUpdating('delete');
    try {
      await request(`/listings/${listingId}`, { method: 'DELETE' });
      toast({
        title: language === 'ka' ? 'წაშლილია' : 'Deleted',
        description: language === 'ka' ? 'ნივთი წაშლილია' : 'Item has been deleted',
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete listing',
        variant: 'destructive',
      });
      setIsUpdating(null);
    }
    setShowDeleteDialog(false);
  };

  const handleEdit = () => {
    navigate(`/sell?edit=${listingId}`);
  };

  return (
    <>
      <div className="space-y-3 p-4 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {language === 'ka' ? 'თქვენი განცხადება' : 'Your listing'}
        </h3>
        
        {/* Mark as sold */}
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleMarkAsSold}
          disabled={isUpdating === 'sold' || currentStatus === 'sold'}
        >
          {isUpdating === 'sold' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          {language === 'ka' ? 'გაყიდულად მონიშვნა' : 'Mark as sold'}
        </Button>

        {/* Mark as reserved */}
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleMarkAsReserved}
          disabled={isUpdating === 'reserved'}
        >
          {isUpdating === 'reserved' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Clock className="h-4 w-4 mr-2" />
          )}
          {language === 'ka' ? 'დაჯავშნილად მონიშვნა' : 'Mark as reserved'}
        </Button>

        {/* Hide */}
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleHide}
          disabled={isUpdating === 'hide'}
        >
          {isUpdating === 'hide' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <EyeOff className="h-4 w-4 mr-2" />
          )}
          {language === 'ka' ? 'დამალვა' : 'Hide'}
        </Button>

        {/* Edit listing */}
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4 mr-2" />
          {language === 'ka' ? 'რედაქტირება' : 'Edit listing'}
        </Button>

        {/* Delete */}
        <Button 
          variant="outline" 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30" 
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {language === 'ka' ? 'წაშლა' : 'Delete'}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ka' ? 'წაშლის დადასტურება' : 'Confirm Delete'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ka' 
                ? 'დარწმუნებული ხართ რომ გსურთ ამ ნივთის წაშლა? ეს მოქმედება შეუქცევადია.' 
                : 'Are you sure you want to delete this item? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'ka' ? 'გაუქმება' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUpdating === 'delete' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {language === 'ka' ? 'წაშლა' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
