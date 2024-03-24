import WebSocket from "ws";


export const getBinancePrice = (ticker: string) => {
    const binanceWebSocketUrl = 'wss://stream.binance.com:9443/ws/solusdt@avgPrice';

    const binanceSocket = new WebSocket(binanceWebSocketUrl);
    
    binanceSocket.onopen = () => {
        binanceSocket.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params":
            [
            `${ticker}usdt@avgPrice`,
            ],
            "id": 1
            }))
    }
    
    binanceSocket.onmessage = ({data}: any) => {
        console.log("Binance data: ", data)
    };
    
    binanceSocket.on('close', (code: number, reason: string) => {
        console.log(`WebSocket connection closed, code: ${code}, reason: ${reason}`);
    });
    
    binanceSocket.on('error', (error: Error) => {
        console.error('WebSocket error:', error.message);
    });
    
}

