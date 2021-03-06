import type { NodeNotifier } from "node-notifier";
import notifier from "node-notifier";
import * as path from "path";
import { execFile } from "child_process";
import type { LoggerInterface } from "~src/log/logger";
import { PROGRAM_TITLE } from "~src/commonConsts";
import type { NotificationText } from "~src/notification/notifierTypes";
import { getNotificationIcon, NotificationType } from "~src/notification/notifierTypes";

const WindowsToaster = notifier.WindowsToaster;

declare type NodeNotifier = any;
declare type Notification = any;

const ICONS_PATH = "notif-icons";


export interface NotifierInterface {
    notif: (message: NotificationText, notificationIcon: NotificationType, openLog?: boolean) => void;
}

export class Notifier implements NotifierInterface {
    private readonly logger: LoggerInterface;
    private readonly notifier: NodeNotifier;

    constructor(logger: LoggerInterface, snoreToastPath: string, quiet: boolean) {
        this.logger = logger;
        if (!quiet) {
            this.logger.debug(`snoreToastPath: ${snoreToastPath}`);
            // @ts-ignore
            this.notifier = new WindowsToaster({ withFallback: false, customPath: snoreToastPath });
        }
        else {
            this.logger.debug("Quiet Mode. Not initializing notifier");
        }
    }

    public notif = (message: string, notificationType: NotificationType, openLog?: boolean) => {
        const icon: string = getNotificationIcon(notificationType);
        this.logger.verbose(`Looking for icon in: ${path.join(ICONS_PATH, icon)}`);
        this.logNotification(message, notificationType);
        if (this.notifier) {
            const notification: Notification = {
                title: PROGRAM_TITLE,
                message,
                icon: path.join(ICONS_PATH, icon)
            };
            if (openLog) {
                notification.actions = ["Log", "Close"];
            }
            this.notifier.notify(notification);
            this.notifier.on("log", () => {
                const file = this.logger.getLogFileLocation();
                execFile(file, { shell: "powershell" });
            });
        }
        else {
            this.logger.info(`Quiet Mode. Skipping notification message: ${message}`);
        }
    };

    private logNotification = (message: string, notificationType: NotificationType) => {
        switch (notificationType) {
            case NotificationType.LOGO:
            case NotificationType.DOWNLOAD:
                this.logger.info(message);
                break;
            case NotificationType.WARNING:
            case NotificationType.NOT_FOUND:
                this.logger.warn(message);
                break;
            case NotificationType.FAILED:
                this.logger.error(message);
        }
    };
}
