import type { NotifierInterface } from "~src/notification/notifier";

export class MockNotifier implements NotifierInterface {
    notif = jest.fn((message: string): void => console.log(`Notification: ${message}`));
}
