import { type ChildProcess } from 'child_process';
import type { Formatter } from 'picocolors/types';
export declare function commands(): {
    runPersistentCommand: (cmd: string, args: string[], opts?: {
        cwd?: string;
        env?: NodeJS.ProcessEnv;
        name?: string;
        color?: Formatter;
        allowOutput?: (line: string) => boolean;
    }) => ChildProcess;
};
export declare function readPackageName(): Promise<string>;
