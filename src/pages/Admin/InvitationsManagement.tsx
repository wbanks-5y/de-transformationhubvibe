import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, X, RefreshCw } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import BackButton from "@/components/ui/back-button";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

interface PendingInvitation {
  id: string;
  email: string;
  invited_at: string;
  status: string;
}

const InvitationsManagement = () => {
  const { organizationClient, currentOrganization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [forceFallback, setForceFallback] = useState(false);
  const [checkEmailId, setCheckEmailId] = useState("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [emailStatus, setEmailStatus] = useState<any>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Safety check for organization context
  if (!organizationClient || !currentOrganization) {
    return (
      <div className="container px-4 py-6 mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Error: Organization context not available</p>
        </div>
      </div>
    );
  }
  
  const fetchPendingInvitations = async () => {
    try {
      setLoadingInvitations(true);
      console.log('Fetching pending invitations via edge function...');
      
      const { data, error } = await organizationClient.functions.invoke('invite-user', {
        method: 'GET'
      });
      
      if (error) {
        console.error('Error fetching invitations:', error);
        toast.error("Failed to fetch pending invitations");
        return;
      }

      console.log('Pending invitations response:', data);
      setPendingInvitations(data.invitations || []);
    } catch (error: any) {
      console.error('Error fetching pending invitations:', error);
      toast.error("Failed to fetch pending invitations");
    } finally {
      setLoadingInvitations(false);
    }
  };

  const resendInvitation = async (email: string) => {
    try {
      setLoading(true);
      console.log('Resending invitation to:', email);
      
      const { data, error } = await organizationClient.functions.invoke('invite-user', {
        body: { email, organizationSlug: currentOrganization.slug, forceFallback }
      });
      
      if (error) {
        console.error('Error resending invitation:', error);
        
        // Handle rate limit specifically
        if (error.message?.includes('rate limit') || error.message?.includes('429')) {
          toast.error("Too many invitation attempts. Please wait a few minutes before trying again.");
          return;
        }
        
        throw new Error(error.message || 'Failed to resend invitation');
      }

      if (data?.error) {
        console.error('Error from invite function:', data.error);
        
        // Handle rate limit from function response
        if (data.code === 'RATE_LIMIT_EXCEEDED') {
          toast.error("Too many invitation attempts. Please wait a few minutes before trying again.");
          return;
        }
        
        throw new Error(data.error);
      }
      
      // Show success with debug info if available
      let successMessage = `Invitation resent to ${email}. Click refresh to update the list.`;
      if (data?.resendEmailId || data?.correlationId) {
        console.log(`[Debug] Resend Email ID: ${data?.resendEmailId || 'N/A'}, Correlation ID: ${data?.correlationId || 'N/A'}, Send Path: ${data?.sendPath || 'N/A'}`);
        successMessage += ` [ID: ${data?.resendEmailId || data?.correlationId || 'N/A'}] (${data?.sendPath || 'primary'})`;
      }
      
      toast.success(successMessage, {
        duration: 5000,
      });
    } catch (error: any) {
      console.error('Resend invitation error:', error);
      toast.error(error.message || "Failed to resend invitation");
    } finally {
      setLoading(false);
    }
  };

  const cancelInvitation = async (email: string) => {
    try {
      setLoading(true);
      console.log('Canceling invitation for:', email);
      
      const { data, error } = await organizationClient.functions.invoke('invite-user', {
        method: 'DELETE',
        body: { email }
      });
      
      if (error) {
        console.error('Error canceling invitation:', error);
        throw new Error(error.message || 'Failed to cancel invitation');
      }

      if (data?.error) {
        console.error('Error from invite function:', data.error);
        throw new Error(data.error);
      }
      
      toast.success(`Invitation cancelled for ${email}. Click refresh to update the list.`);
    } catch (error: any) {
      console.error('Cancel invitation error:', error);
      toast.error(error.message || "Failed to cancel invitation");
    } finally {
      setLoading(false);
    }
  };

  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      console.log('Sending invitation to:', values.email);
      
      const { data, error } = await organizationClient.functions.invoke('invite-user', {
        body: { email: values.email, organizationSlug: currentOrganization.slug, forceFallback }
      });
      
      if (error) {
        console.error('Error invoking invite function:', error);
        
        // Handle rate limit specifically
        if (error.message?.includes('rate limit') || error.message?.includes('429')) {
          toast.error("Too many invitation attempts. Please wait a few minutes before trying again.");
          return;
        }
        
        throw new Error(error.message || 'Failed to send invitation');
      }

      if (data?.error) {
        console.error('Error from invite function:', data.error);
        
        // Handle rate limit from function response
        if (data.code === 'RATE_LIMIT_EXCEEDED') {
          toast.error("Too many invitation attempts. Please wait a few minutes before trying again.");
          return;
        }
        
        throw new Error(data.error);
      }
      
      console.log('Invitation response:', data);
      form.reset();
      
      // Show success with debug info if available
      let successMessage = `Invitation sent to ${values.email}. Click refresh to see it in the list.`;
      if (data?.resendEmailId || data?.correlationId) {
        console.log(`[Debug] Resend Email ID: ${data?.resendEmailId || 'N/A'}, Correlation ID: ${data?.correlationId || 'N/A'}, Send Path: ${data?.sendPath || 'N/A'}`);
        successMessage += ` [ID: ${data?.resendEmailId || data?.correlationId || 'N/A'}] (${data?.sendPath || 'primary'})`;
      }
      
      toast.success(successMessage, {
        duration: 5000,
      });
    } catch (error: any) {
      console.error('Invitation error:', error);
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  }

  const checkDeliveryStatus = async () => {
    if (!checkEmailId.trim()) {
      toast.error("Please enter an email ID");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await organizationClient.functions.invoke('resend-email-status', {
        body: { emailId: checkEmailId }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        setEmailStatus({ error: data.error, details: data.details });
      } else {
        setEmailStatus(data.email);
        toast.success(`Email status: ${data.email?.last_event || 'unknown'}`);
      }
    } catch (error) {
      console.error('Error checking status:', error);
      toast.error("Failed to check email status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-6 mx-auto space-y-6">
      <BackButton />
      
      <div>
        <h2 className="text-2xl font-bold">User Invitations</h2>
        <p className="text-muted-foreground">Invite new users to your organization</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send Invitation</CardTitle>
            <CardDescription>
              Invite a new user by email. They'll receive instructions to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="forceFallback" 
                    checked={forceFallback}
                    onCheckedChange={(checked) => setForceFallback(checked === true)}
                  />
                  <Label htmlFor="forceFallback" className="text-sm cursor-pointer">
                    Use test sender (onboarding@resend.dev)
                  </Label>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Invitation"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Delivery Debug</CardTitle>
            <CardDescription>Check the delivery status of a sent invitation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Resend email ID"
                value={checkEmailId}
                onChange={(e) => setCheckEmailId(e.target.value)}
              />
              <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <DialogTrigger asChild>
                  <Button onClick={checkDeliveryStatus} disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    Check
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Email Delivery Status</DialogTitle>
                    <DialogDescription>
                      Resend API response for email ID: {checkEmailId}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {emailStatus ? (
                      <>
                        {emailStatus.error ? (
                          <div className="text-destructive">
                            <p className="font-semibold">Error:</p>
                            <p>{emailStatus.error}</p>
                            {emailStatus.details && (
                              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                                {JSON.stringify(emailStatus.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="font-semibold text-sm">Status:</p>
                                <p className="text-sm">{emailStatus.last_event || 'No events yet'}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">To:</p>
                                <p className="text-sm">{emailStatus.to?.join(', ') || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">From:</p>
                                <p className="text-sm">{emailStatus.from || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Created:</p>
                                <p className="text-sm">{emailStatus.created_at ? new Date(emailStatus.created_at).toLocaleString() : 'N/A'}</p>
                              </div>
                            </div>
                            <details className="mt-4">
                              <summary className="cursor-pointer font-semibold text-sm">Full Response</summary>
                              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-60">
                                {JSON.stringify(emailStatus, null, 2)}
                              </pre>
                            </details>
                          </>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground text-sm">Enter an email ID and click Check</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  Track and manage your pending user invitations
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPendingInvitations}
                disabled={loadingInvitations}
              >
                <RefreshCw className={`h-4 w-4 ${loadingInvitations ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingInvitations ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : pendingInvitations.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending invitations loaded</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Click the refresh button above to load pending invitations
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{invitation.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Invited on {new Date(invitation.invited_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resendInvitation(invitation.email)}
                        disabled={loading}
                      >
                        Resend
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelInvitation(invitation.email)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvitationsManagement;
