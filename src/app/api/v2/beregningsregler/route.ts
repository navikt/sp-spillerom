import { NextResponse } from 'next/server'

import { beskyttetApi, ErrorResponse } from '@/auth/beskyttetApi'
import { BeregningsreglerArray } from '@schemas/beregningsregler'
import { beregningsregler } from '@/mock-api/kodeverk/beregningsregler'

export async function GET(request: Request): Promise<NextResponse<BeregningsreglerArray | ErrorResponse>> {
    return await beskyttetApi<BeregningsreglerArray | ErrorResponse>(
        request,
        async (): Promise<NextResponse<BeregningsreglerArray | ErrorResponse>> => NextResponse.json(beregningsregler),
    )
}
