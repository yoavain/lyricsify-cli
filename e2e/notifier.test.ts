import type { NotifierInterface, NotificationText } from "~src/notifier";
import { NotificationType, Notifier } from "~src/notifier";
import type { LoggerInterface } from "~src/logger";
import { MockLogger } from "~test/__mocks__";

describe("Test notifier", () => {
    it("Should show notification", () => {
        const logger: LoggerInterface = new MockLogger();

        const notifier: NotifierInterface = new Notifier(logger, null, false);
        notifier.notif("Success" as NotificationText, NotificationType.DOWNLOAD);
    });
    it("Should not show notification, in quiet mode", () => {
        const logger: LoggerInterface = new MockLogger();

        const notifier: NotifierInterface = new Notifier(logger, null, true);
        notifier.notif("Success" as NotificationText, NotificationType.DOWNLOAD);
    });
});