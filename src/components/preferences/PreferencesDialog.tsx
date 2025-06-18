
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { castingService } from "@/services/castingService";
import type { UserSubmissionPreferences } from "@/types/casting";
import PreferencesForm from "./PreferencesForm";

interface PreferencesDialogProps {
  trigger?: React.ReactNode;
}

const PreferencesDialog = ({ trigger }: PreferencesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserSubmissionPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadPreferences();
    }
  }, [open]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const data = await castingService.getUserPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load your preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedPreferences: Partial<UserSubmissionPreferences>) => {
    setSaving(true);
    try {
      const saved = await castingService.updateUserPreferences(updatedPreferences);
      setPreferences(saved);
      toast({
        title: "Preferences Saved",
        description: "Your submission preferences have been updated successfully"
      });
      setOpen(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Preferences</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading preferences...</span>
          </div>
        ) : (
          <PreferencesForm
            preferences={preferences}
            onSave={handleSave}
            saving={saving}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesDialog;
