import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = auth(function GET(req) {
    try {
        if (!req.auth) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const user = req.auth.user as { role: UserRole };
        if (!user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const { role } = user;

        switch (role) {
            case UserRole.ADMIN:
                return NextResponse.json({ message: "OK" }, { status: 200 });
            case UserRole.USER:
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            default:
                return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }
    } catch (error) {
        console.error("Error in admin route: ", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
});
// TODO: Add POST, PUT, DELETE, etc. routes as needed
// TODO: Add role-based access control as needed
// TODO: Add Logging as needed