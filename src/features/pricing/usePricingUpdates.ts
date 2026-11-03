import { useEffect, useRef, useState } from "react";

type PricingUpdteMessage = {
    message_type: "price_update";
    request_id: string;
    par_rate: string;
};

type SetPricingSubscriptionMessage = {
    message_type: "subscription_set";
    request_ids: string[];
};

type PricingConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "closed"
  | "error";

const RECONNECT_DELAY_MS = 2_000;

export const usePricingUpdates = (
    requestIds: string[],
) => {
    const websocketRef = useRef<WebSocket | null>(null);
    const latestRequestIdsRef = useRef<string[]>(requestIds)

    const [connectionState, setConnectionState] = useState<PricingConnectionState>("connecting");
    const [prices, setPrices] = useState<Record<string, PricingUpdteMessage>>({});

    // requestIdsが変わったら、同じwebsocket上で購読対象だけ変更
    useEffect(() => {
        latestRequestIdsRef.current = requestIds;

        const websocket = websocketRef.current;

        if (websocket?.readyState !== WebSocket.OPEN) {
            return;
        }

        const message: SetPricingSubscriptionMessage = {
            message_type: "subscription_set",
            request_ids: requestIds,
        };

        websocket.send(JSON.stringify(message));
    }, [requestIds])

    // WebSocket connection自体はcomponentの生存中一本
    useEffect(() => {
        let disposed = false;
        let reconnectTimer: number | null = null;
        const websocket = new WebSocket(import.meta.env.VITE_PRICING_WS_URL);

        const connect = () => {
            if (disposed) {
                return;
            }

            websocketRef.current = websocket;

            websocket.onopen = () => {
                if (disposed) {
                    websocket?.close();
                    return;
                }

                setConnectionState("connected");
                // 再接続の際も、現在表示中のRFQをあらためてsubscribeする
                sendSubscriptions(websocket, latestRequestIdsRef.current);
            }

            websocket.onmessage = (event) => {
                if (disposed) {
                    return;
                }

                const message = JSON.parse(
                    event.data
                ) as PricingUpdteMessage;

                if (message.message_type !== "price_update") {
                    return;
                }

                setPrices((current) => ({
                    ...current,
                    [message.request_id]: message
                }));
            }

            websocket.onerror = () => {
                if (disposed) {
                    return
                }
                setConnectionState("error");
            };

            websocket.onclose = () => {
                // componentのunmountによるcloseなら
                // 再接続しない
                if (websocketRef.current === websocket) {
                    websocketRef.current = null;
                }

                if (disposed) return;

                setConnectionState("reconnecting");
                reconnectTimer = window.setTimeout(
                    () => {
                        connect();
                    },
                    RECONNECT_DELAY_MS,
                );
            };
        };

        setConnectionState("connecting");
        connect();

        return () => {
            // ページ遷移など
            // 意図的な切断では再接続しない
            disposed = true;

            if (reconnectTimer !== null) {
                window.clearTimeout(reconnectTimer);
            }

            websocket?.close();

            if (websocketRef.current === websocket) {
                websocketRef.current = null;
            }
        }
    }, []);

    return {
        prices,
        connectionState,
    };
};


const sendSubscriptions = (
    websocket: WebSocket,
    requestIds: string[],
) => {
    const message: SetPricingSubscriptionMessage = {
        message_type: "subscription_set",
        request_ids: requestIds,
    };

    websocket.send(JSON.stringify(message));
}