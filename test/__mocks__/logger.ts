import type { LoggerInterface } from "~src/log/logger";

export class MockLogger implements LoggerInterface {
    setLogLevel = () => null;
    info = jest.fn((message: string): void => console.log(`Logger [info]: ${message}`));
    debug = jest.fn((message: string): void => console.log(`Logger [debug]: ${message}`));
    verbose = jest.fn((message: string): void => console.log(`Logger [verbose]: ${message}`));
    warn = jest.fn((message: string): void => console.log(`Logger [warn]: ${message}`));
    error = jest.fn((message: string): void => console.log(`Logger [error]: ${message}`));
    getLogFileLocation = jest.fn((): string => "loggerFileLocation");
}
