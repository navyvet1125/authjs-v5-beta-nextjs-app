"use client";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
//  import { useCurrentRole } from "@/hooks/use-current-role";
import { RoleGate } from "@/components/auth/roleGate";
import { FormSuccess } from "@/components/formSuccess";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { admin } from "@/actions/admin";

const AdminClientWrapper = () => {
  // const role = useCurrentRole();
  const onServerActionClick = () => {
    admin()
    .then((res) => {
      if (res.Success) {
        toast.success(res.Success);
      } else if (res.Error) {
        toast.error(res.Error);
      }
    })
    .catch((err) => {
      toast.error(err);
    });
  };

  const onApiRouteClick = () => {
    // axios.get("/api/admin?hello=world", {withCredentials: true, headers: {"Content-Type": "application/json"}})
    fetch("/api/admin?hello=world", {method: "GET", headers: {"Content-Type": "application/json"}})
    .then((res) => {
      if (res.status === 200) {
        toast.success("Admin User Allowed");
      } else if (res.status === 403) {
        toast.error("FORBIDDEN");
      }
    })
    .catch((err) => {
      toast.error(err.response.data);
    });
  };

  return (
    <Card className="min-w-[412px] w-[600px]" >
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          🔑Admin
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="Welcome Admin! You have access to the Admin Dashboard" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only API Route
          </p>
          <Button variant="default" size="sm" onClick={onApiRouteClick}>
            Click to Test
          </Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only Server Action
          </p>
          <Button variant="default" size="sm" onClick={onServerActionClick}>
            Click to Test
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}

export default AdminClientWrapper
