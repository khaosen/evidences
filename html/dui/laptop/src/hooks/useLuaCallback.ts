import { useState } from "react";

interface useLuaCallbackProps<Response> {
    name: string;
    defaultData?: Response;
    onSuccess?: (data: Response) => void;
    onError?: () => void;
}


export default function useLuaCallback<Request, Response>(props: useLuaCallbackProps<Response>) {
    const [data, setData] = useState<Response | undefined>(props.defaultData || undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const trigger = (args: Request) => {
        setLoading(true);
        setError(false);

        fetch(`https://${location.host}/triggerServerCallback`, {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                name: props.name,
                arguments: {
                    ...args
                }
            })
        })
        .then(response => response.json()).then(response => {
            setData(response);
            props.onSuccess && props.onSuccess(response);
        })
        .catch(() => {
            setError(true)
            props.onError && props.onError();
        })
        .finally(() => setLoading(false));
    }

    return { data, loading, error, trigger }
}