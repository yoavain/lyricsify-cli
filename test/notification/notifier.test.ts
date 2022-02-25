import type { NotificationText } from "~src/notification/notifierTypes";
import { NotificationType } from "~src/notification/notifierTypes";
import type { NotifierInterface } from "~src/notification/notifier";
import { Notifier } from "~src/notification/notifier";
import type { LoggerInterface } from "~src/log/logger";
import { MockLogger } from "~test/__mocks__";
import child_process from "child_process";

const mockNotify = jest.fn();
const mockOn = jest.fn((eventName, eventCB) => {
    if (typeof eventCB === "function") {
        eventCB();
    }
});
const mockExecFile = jest.fn();
jest.mock("child_process");
// @ts-ignore
child_process.execFile.mockImplementation(mockExecFile);

jest.mock("node-notifier", () => ({
    WindowsToaster: function() {
        return {
            notify: mockNotify,
            on: mockOn
        };
    }
}));

describe("Test notifier", () => {
    it("Test notifier - quiet", () => {
        const logger: LoggerInterface = new MockLogger();

        // Notifier
        const notifier: NotifierInterface = new Notifier(logger, "", true);

        notifier.notif("Testing notifier" as NotificationText, NotificationType.LOGO);

        expect(mockNotify).not.toHaveBeenCalled();
        expect(mockOn).not.toHaveBeenCalled();
    });

    it("Test notifier - non quiet", () => {
        const logger: LoggerInterface = new MockLogger();

        // Notifier
        const notifier: NotifierInterface = new Notifier(logger, "", false);

        notifier.notif("Testing notifier" as NotificationText, NotificationType.WARNING);

        expect(mockNotify).toHaveBeenCalledTimes(1);
        expect(mockNotify.mock.calls[0][0]).toEqual({
            title: "Lyricsify Downloader",
            message: "Testing notifier",
            icon: "notif-icons\\warning.png"
        });
        expect(mockOn).toHaveBeenCalledTimes(1);
    });

    it("Test notifier - non quiet; open log", () => {
        const logger: LoggerInterface = new MockLogger();

        // Notifier
        const notifier: NotifierInterface = new Notifier(logger, "", false);

        notifier.notif("Testing notifier" as NotificationText, NotificationType.FAILED, true);

        expect(mockNotify).toHaveBeenCalledTimes(1);
        expect(mockNotify.mock.calls[0][0]).toEqual({
            actions: [
                "Log",
                "Close"
            ],
            title: "Lyricsify Downloader",
            message: "Testing notifier",
            icon: "notif-icons\\failed.png"
        });
        expect(mockOn).toHaveBeenCalledTimes(1);
        expect(mockExecFile).toHaveBeenCalledTimes(1);
        expect(mockExecFile.mock.calls[0][0]).toEqual("loggerFileLocation");
        expect(mockExecFile.mock.calls[0][1]).toEqual({ shell: "powershell" });
    });

    it("Test notifier - check all notifications", () => {
        const logger: LoggerInterface = new MockLogger();

        // Notifier
        const notifier: NotifierInterface = new Notifier(logger, "", false);

        Object.values(NotificationType).forEach((notificationType: NotificationType, index: number) => {
            notifier.notif("Testing notifier" as NotificationText, notificationType);
            expect(mockNotify.mock.calls[index][0]).toBeTruthy();
        });
    });
});
