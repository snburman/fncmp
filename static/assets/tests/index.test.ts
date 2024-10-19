import WS from "jest-websocket-mock";
import { Socket } from "../socket";
import {
    describe,
    beforeAll,
    test,
    afterAll,
    expect,
    beforeEach,
} from "@jest/globals";
import { JSDOM } from "jsdom";
import { Dispatch, Fun } from "../fncmp_types";

describe("test websocket functions", () => {
    let dispatches: Dispatch[] = [];
    let server: WS;
    let socket: Socket;
    let dom: JSDOM;

    beforeAll(async () => {
        server = new WS("ws://localhost:1234", { jsonProtocol: true });
        server.on("connection", (socket) => {
            socket.on("message", (message) => {
                const msg: Dispatch = JSON.parse(message.toString());
                dispatches.push(msg);
            });
        });
        socket = new Socket("ws://localhost:1234");
        await server.connected;
    });

    beforeEach(() => {
        dispatches = [];
        dom = new JSDOM("<!DOCTYPE html><html><head></head><body><main><main></body></html>");
    });

    test("test ping", async () => {
        const dispatch = {
            function: Fun.PING,
            ping: {
                server: true,
                client: false,
            },
        };
        server.send(dispatch);
        setTimeout(() => {
            expect(dispatches.length).toEqual(1);
            expect(dispatches[0].ping.client).toEqual(true);
        }, 1000);
    });

    test("test render", async () => {
        dom.window.document.body.innerHTML = '<main></main>';
        const dispatch = {
            function: Fun.RENDER,
            render: {
                tag: "main",
                html: "<p>test</p>",
                inner: true,
            },
        } as Dispatch;
        server.send(dispatch);
        setTimeout(() => {
            expect(dom.window.document.querySelector("main")?.innerHTML).toEqual("<p>test</p>");
        }, 1000);
    });

    afterAll(() => {
        WS.clean();
    });
});
