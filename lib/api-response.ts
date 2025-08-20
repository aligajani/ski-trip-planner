import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  status: number,
  data?: T
  message?: string
}

export function successResponse<T>(
  data: T, 
  message?: string, 
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    status,
    data,
    message,
  }, { status })
}

export function errorResponse(
  message: string, 
  status: number = 400,
  data?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    status,
    data,
    message,
  }, { status })
}
