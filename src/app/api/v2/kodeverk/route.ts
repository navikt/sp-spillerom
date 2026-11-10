import { NextResponse } from 'next/server'

import { beskyttetApi, ErrorResponse } from '@/auth/beskyttetApi'
import { lokalUtviklingKodeverk } from '@/mock-api/kodeverk/vilkårkodeverk'
import { Kodeverk } from '@/schemas/kodeverkV2'

export async function GET(request: Request): Promise<NextResponse<Kodeverk | ErrorResponse>> {
    return await beskyttetApi<Kodeverk | ErrorResponse>(
        request,
        async (): Promise<NextResponse<Kodeverk | ErrorResponse>> => NextResponse.json(lokalUtviklingKodeverk),
    )
}
