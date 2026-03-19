import { AdminLayout } from '@/components/admin/AdminLayout';
import { AlertTriangle } from 'lucide-react';

type Props = {
  title: string;
  description?: string;
};

export default function AdminMigrationNotice({ title, description }: Props) {
  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-3">{title}</h1>
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Admin backend migration in progress</p>
            <p className="text-sm text-muted-foreground mt-1">
              {description ||
                'This admin section was dependent on Supabase. It is temporarily disabled while being rewired to the new backend APIs.'}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
