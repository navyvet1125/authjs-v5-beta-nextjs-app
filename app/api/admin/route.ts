import { NextResponse } from "next/server";

import { currentUserRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
export async function GET() {
    const role = await currentUserRole();
    if (role === UserRole.ADMIN) {
        return new NextResponse("Admin User Allowed", {status: 200});
    }
    return new NextResponse("FORBIDDEN", {status: 403});

}