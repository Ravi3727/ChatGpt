import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
    try {
        return Response.json({
            success: true,
            message: "All contests fetched successfully"
        }, { status: 200, headers: { 'Cache-Control': 'no-store' } });

    }
    catch (error: any) {
        return Response.json({
            success: false,
            message: error.message || 'Something went wrong on fetching All contests',
        }, { status: 500 })
    }
}