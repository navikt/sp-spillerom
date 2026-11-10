import { NextResponse } from 'next/server'

import { beskyttetApi, type ErrorResponse } from '@/auth/beskyttetApi'
import { type HovedspørsmålArray } from '@/schemas/saksbehandlergrensesnitt'
import { saksbehandlerUi } from '@/mock-api/kodeverk/saksbehandlerui'

export async function GET(request: Request): Promise<NextResponse<HovedspørsmålArray | ErrorResponse>> {
    return await beskyttetApi<HovedspørsmålArray | ErrorResponse>(
        request,
        async (): Promise<NextResponse<HovedspørsmålArray | ErrorResponse>> => NextResponse.json(saksbehandlerUi),
    )
}
