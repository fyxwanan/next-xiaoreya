export async function GET(request: Request) {
    const headers = new Headers();
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId");
    if (!requestId) {
        return new Response(
            JSON.stringify({
                code: 500,
                message: "requestId is required！"
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
    headers.set("x-xiaoreya-tag", "xiaoreya");

    return new Response(
        JSON.stringify({
            code: 200,
            status: "success",
            data: [
                {
                    id: 1,
                    name: "小红"
                },
                {
                    id: 2,
                    name: "小黄"
                }
            ],
        }),
        {
            status: 200,
            headers: headers,
        }
    )
}


export async function POST(request: Request) {
    const headers = new Headers();
    try {
        const body = await request.json();
        if (!body) {
            return new Response(
                JSON.stringify({
                    code: 500,
                    message: "body is null"
                }),
                {
                    status: 500,
                    headers: {
                        "Content-type": "application/json"
                    }
                }
            )
        }
    } catch (e) {
        return new Response(
            JSON.stringify({
                code: 500,
                message: "Invalid request or JSON parsing failed"
            }),
            {
                status: 500,
                headers: {
                    "Content-type": "application/json"
                }
            }
        )
    }

    return new Response(
        JSON.stringify({
            code: 200,
            status: "success",
            data: [
                {
                    id: 3,
                    name: "小蓝"
                },
                {
                    id: 4,
                    name: "小绿"
                }
            ],
        }),
        {
            status: 200,
            headers: headers,
        }
    )
}