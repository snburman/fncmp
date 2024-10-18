import WS from "jest-websocket-mock";
import { testingExports } from ".";
const { Socket } = testingExports;


describe("Test websocket", () => {
    let server: WS;
    let client: any

    beforeAll(async () => {
        server = new WS("ws://localhost:1234");
        client = new Socket();
        await server.connected;
    });
    test("Test 1", async () => {
        new Socket();
    });

    afterAll(() => {
        WS.clean();
    });
});
